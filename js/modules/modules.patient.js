/**
 * @Desc：
 * @Usage:
 * @Notify：obj.type类型--1.制约手术，2.亲友管理
 * @Depend：
 *
 * Created by qiangkailiang & wangjingrong on 2017/2/28
 */

modules.patient = function (obj) {
    var container = {
        init: function (obj) {
        		this.setBrowseCount();
            	this.getPatientsList();
                this.deletePatient();
        },
        config: {
            listBox: $(".patient-list"),
        },
        template: {
            patientItem: function (data) {
                return '<section class="patient-list-item" data-patientId="' + data.patientId + '" data-sex="' + data.patientSex + '" data-age="' + data.patientAge + '">' +
                    '<figcaption>' + data.patientName + '</figcaption>' +
                    '</section>';
            }
        },
        XHRList: {
            addPatient: "/mcall/customer/patient/relation/v1/create/",
            deletePatient:"/mcall/customer/patient/relation/v1/update/",
            parientList: "/mcall/customer/patient/relation/v1/getMapList/",
            createCase:"http://m.tocure.cn/mcall/customer/patient/case/v1/create/",
            saveOperation: "http://m.tocure.cn/mcall/customer/patient/case/option/v1/create/"//直约手术保存曾就诊信息
        },
        //    获取患者列表...
        getPatientsList: function () {
            var that = this;
            var param = {
                uuid: "1482212008324",
                isValid: "1",
                firstResult: "1",
                maxResult: "9999"
            }
            $.ajax({
                url: that.XHRList.parientList,
                type: 'POST',
                dataType: "json",
                timeout: 10000,
                data: {
                    paramJson:$.toJSON(param)
                },
                beforeSend: function () {
                    common.loading.show();
                }
            })
                .done(function (data) {
                    var dataList = data.responseObject.responseData.dataList;
                    //obj.type==2:亲友管理
                    if(obj && obj.type == 2){
                        var noFriHtml="";
                        if(dataList.length>0){
                            $('#ev-add-patient').show();
                            $('.add-patient-content-title').hide();
                            that.selectPatient();
                            $(dataList).each(function (index, element) {
                                that.config.listBox.prepend(that.template.patientItem(element));
                            })
                            $('.patient-list-item').eq(0).trigger("click");
                        }else{
                            noFriHtml = '<section class="noFriendText">'+
                                '<p>您还没有任何记录</p>'+
                                '<p>添加关心的人，在线咨询预约，唯医为您开启全新的就医体验</p>'+
                                '</section>'+
                                '<section class="noFriendHref">'+
                                '<a href="">去咨询 &gt;</a>'+
                                '<a href="">直约手术 &gt;</a>'+
                                '</section>'
                            $("body").html(noFriHtml);
                        }
                    }else{// 第一次访问--未添加过用户--弹窗后提示添加用户
                        if (dataList.length === 0 && parseInt(localStorage.getItem("browseCount")) === 1) {
                            $(".patient-list-item-plus").hide();
                            that.addPatient(0);
                            common.alertBox({
                                content: "嗨，我是小唯，请随我完善几个小问题以了解您的病情，回答的越仔细越有助于我们帮您更快康复哟",
                                ensure: "好的",
                                ensureCallback: function () {
                                    that.noPatientTips();
                                }
                            });
                            // 第N次访问--未添加过用户--提示添加用户
                        } else if (dataList.length === 0 && parseInt(localStorage.getItem("browseCount")) !== 1) {
                            that.noPatientTips();
                            that.addPatient(0);
                            //    第N次访问——添加过用户——获取用户列表
                        } else {
                            that.selectPatient();
                            $(dataList).each(function (index, element) {
                                that.config.listBox.prepend(that.template.patientItem(element));
                            })
                        }
                    }
                    common.loading.hide();
                })
                .fail(function () {

                });
        },
        //    记录用户访问次数---是否首次访问
        setBrowseCount: function () {
            var count = 0;
            if (!localStorage.getItem("browseCount")) {
                localStorage.setItem("browseCount", 1);
            } else {
                count = parseInt(localStorage.getItem("browseCount"));
                localStorage.setItem("browseCount", count + 1);
            }
        },
        //    无患者时提示
        noPatientTips: function () {

            common.topTips.show({
                class: "no-patient-tips",
                content: "您还未添加任何问诊人，请先添加"
            });
            setTimeout(function () {
                common.topTips.hide();
            }, 3000);
            $(".patient-list-item-plus").hide();
        },
        //    添加用户
        addPatient: function (hasPatient) {
            if (parseInt(hasPatient) === 1) {
                $("#ev-add-patient,#ev-add-patient-btn").show();
            } else {
                $("#ev-add-patient,#ev-no-patient-save").show();
            }
            this.formValidate();
            this.submitPatientMessage()
        },
        //    直约手术$(".patient-list-item")点击事件
        directOperaBtn:function(){
            var that = this;
            $('.patient-list').on('click', '.patient-list-item', function () {
                $(this).addClass("on").siblings().removeClass("on");
                if ($(this).hasClass("patient-list-item-plus")) {
                    that.addPatient(1);
                    $('#disease-info-next').hide();
                    $('.disease-info').hide();
                } else {

                    $("#ev-add-patient,#ev-add-patient-btn,#ev-no-patient-save").hide();
                    $('#disease-info-next').show();
                    $('.disease-info').show();
                }
            })
        },
        //    亲友管理$(".patient-list-item")点击事件
        friManage:function(){
            var that = this;


            $('.patient-list').on('click', '.patient-list-item', function () {
                $(this).addClass("on").siblings().removeClass("on");

                var friName = $(this).children("figcaption").text(),
                    friAge = $(this).attr("data-age"),
                    friSex = $(this).attr("data-sex"),
                    friRel = $(this).attr("data-rel");
                $("#ev-patient-name").val(friName).attr("data-validate","true");//亲友姓名
                $("#ev-patient-age").val(friAge).attr("data-validate","true");//亲友年龄
                if(friSex==1 || !friSex){//亲友性别
                    $(".add-patient-sex-selector").eq(0).addClass("on").siblings().removeClass("on")
                }else{
                    $(".add-patient-sex-selector").eq(1).addClass("on").siblings().removeClass("on")
                }
                switch (friRel){//亲友关系
                    case 1:
                        $("#ev-relationship").val("父亲").attr("data-validate","true");
                        break;
                    case 2:
                        $("#ev-relationship").val("母亲").attr("data-validate","true");
                        break;
                    default:
                        $("#ev-relationship").val("").attr("data-validate","false");
                        break;
                }
                that.addPatient();
                if ($(this).hasClass("patient-list-item-plus")) {
                    $(".add-patient-content-title").show();
                    $("#ev-patient-name").removeAttr("readonly","readonly");
                    $("#ev-add-patient-btn").show().siblings("#ev-delete-patient-btn").hide();
                } else {
                    $(".add-patient-content-title").hide();
                    $("#ev-patient-name").attr("readonly","readonly");
                    $("#ev-delete-patient-btn").show().siblings("#ev-add-patient-btn").hide();
                }
            })
        },
        //    预约咨询$(".patient-list-item")点击事件
        ordeRefer:function(){
            var that=this;
            $(".patient-list").on("click", ".patient-list-item", function () {
                $(this).addClass("on").siblings().removeClass("on");
                if ($(this).hasClass("patient-list-item-plus")) {
                    that.addPatient(1);
                } else {
                    $("#ev-add-patient,#ev-add-patient-btn").hide();
                    common.btnBox({
                        direction: "horizontal",
                        btn: [{
                            className: "btn-hollow",
                            content: "新问诊",
                            href: "select_parts.html?age=" + $(this).attr("data-age") + "&sex=" + $(this).attr("data-sex")+"&patientId="+$(this).attr("data-patientid")
                        }, {
                            className: "btn-hollow",
                            content: "复诊",
                            href: "//m.tocure.cn/pages/myServices/symptom_lists.html"
                        }]
                    })
                }

            })
        },
        //    选择用户
        selectPatient: function () {
            var that = this;

            //添加判断obj.type的类型，执行哪套流程。1--直约手术  预约咨询待定
            switch (obj.type){
                case 1:
                    that.directOperaBtn();//患者列表事件
                    that.operationNext();//下一步点击
                    that.operationSearch();//搜寻事件等
                    modules.upLoadFiles();//上传资料
                    that.inlineConsult();//在线咨询的点击事件
                    break;
                case 2:
                    that.friManage();
                    break;
                default:

                    that.ordeRefer();
            }
        },
        //    删除亲友
        deletePatient:function(){
            var that = this;
            $(".add-patient-submit").on('click','.delete',function(){
                common.confirmBox({
                    title:"确定要删除吗？",
                    content:"相关问诊及预约记录仍会保留哦",
                    cancel:"确认",
                    ensure:"取消",
                    cancelCallback:function(){
                        var patientMession = $(".patient-list .on");
                        var param = {
                            //uuid:"1482212008324",
                            //patientName:patientMession.children("figcaption").text(),
                            //patientAge:patientMession.attr("data-age"),
                            //patientSex:patientMession.attr("data-sex"),
                            isValid:0,
                            patientId:patientMession.attr("data-patientId")
                        }
                        $.ajax({
                            url: that.XHRList.deletePatient,
                            timeout:5000,
                            data:{
                                paramJson: $.toJSON(param)
                            },
                            dataType:"json",
                            success:function(){
                                common.popup({
                                    text:"删除成功"
                                });
                                patientMession.remove();
                                $(".patient-list .patient-list-item-plus").trigger("click");
                            },
                            error:function(){}
                        })
                    },
                    ensureCallback:function(){

                    }
                });
            })
        },
        //    表单验证
        formValidate: function () {
            var eleList = ["", "", ""];
            if($('.validateTrue').length>0){
                $('.validateTrue').each(function(i){
                    eleList[i] = $(this).attr("data-validate");
                })
                submitValidate();
            }
            $(".add-patient-sex-selector").on("click", function () {
                $(this).addClass("on").siblings().removeClass("on");
            });

            $("#ev-patient-name").on("keyup", function () {
                $(this).validate({
                    errorEle:function(msg){
                        common.popup({
                            text:msg
                        })
                    },
                    rules: [{
                        rule: "isNoEmpty",
                        msg: "请填写真实姓名"
                    }, {
                        rule: "maxLength:20",
                        msg: "请填写真实姓名"
                    }]
                });
                eleList[0] = $(this).attr("data-validate");
                submitValidate()
            });

            $("#ev-patient-age").on("keyup", function () {
                $(this).validate({
                    errorEle: function(msg){
                        common.popup({
                            text:msg
                        })
                    },
                    rules: [{
                        rule: "isNoEmpty",
                        msg: "请填写真实年龄"
                    }, {
                        rule: "maxNumber:150",
                        msg: "请填写真实年龄"
                    }, {
                        rule: "minNumber:0",
                        msg: "请填写真实年龄"
                    }]
                });
                eleList[1] = $(this).attr("data-validate");
                submitValidate()
            });


            $("#ev-relationship").on("change", function () {
                if (parseInt($(this).val()) !== 0) {
                    $(this).attr("data-validate", true);
                } else {
                    $(this).attr("data-validate", false);
                }
                eleList[2] = $(this).attr("data-validate");
                submitValidate()
            });

            function submitValidate() {
                var result;
                $(eleList).each(function (index, element) {
                    if (element === "true") {
                        result = "true";
                    } else {
                        result = "false";
                        return false;
                    }
                });

                result === "true" ? $(".add-patient-submit").removeClass('off') : $(".add-patient-submit").addClass('off')

            }
        },
        //    提交患者信息
        submitPatientMessage: function () {
        	var that = this;
            $(".cancel").off("click").on("click", function () {
                $("#ev-add-patient,#ev-add-patient-btn").hide();
                $('.patient-list-item-plus').removeClass("on");
                $("#ev-add-patient-btn").addClass("off");

                $("#ev-patient-name").val("");
                $("#ev-patient-age").val("");
                $("#ev-relationship").val(0);
                $(".add-patient-sex-selector[data-sex='1']").addClass("on").siblings().removeClass("on");
            });
            $(".save").off("click").on("click", function () {
            	var param = {
                    customerId: "",
                    patientName: $("#ev-patient-name").val(),
                    patientAge: $("#ev-patient-age").val(),
                    patientSex: $("#ev-patient-sex .on").attr("data-sex")
                };
                if ($(this).parent().hasClass("off")) {
                    return false;
                } else {
                    $.ajax({
                        url: that.XHRList.addPatient,
                        type: 'POST',
                        dataType: "json",
                        timeout: 10000,
                        data: {paramJson: $.toJSON(param)},
                        beforeSend: function () {
                             common.loading.show();
                        }
                    })
                        .done(function (data) {
                            common.loading.hide();
                            //var dataList = data.responseData.dataList;
                            //$(".patient-list").append(that.template.patientItem(dataList));
                            $("patient-list-item-plus").show();
                            $("#ev-add-patient-btn").hide();
                            $("#ev-add-patient").hide();
                            $("#ev-no-patient-save").hide();
                            //添加保存后把新增患者信息添加到患者列表
                        	that.config.listBox.prepend(that.template.patientItem(param));
                        })
                        .fail(function () {

                        });
                }

            });

        },

        //直约手术中在线咨询的点击事件
        inlineConsult:function () {
            $("#go-consult").on("click",function () {
                alert("111");
                var current = $(".patient-list .patient-list-item.on");
                window.location.href = "http://m.tocure.cn/pages/patientConsult/select_parts.html?age=" + current.attr("data-age") + "&sex=" + current.attr("data-sex")+"&patientId="+current.attr("data-patientid");
            })
        },

        //    直约手术中提交按钮的事件,提交时先创建一个病例，再保存用户曾就诊信息
        operationNext: function () {
            var that = this;
            $('#disease-info-next').on('click' ,'.next', function () {
                //加一个表单验证，判断用户是否填写了资料，填写则直接下一步，否则，提示用户
                //获取用户上传的资料
                if ($('.disease-info-item .disease-info-item-right.selected').length == 3) {
                    that.saveCase();//直接保存
                } else {
                    common.confirmBox({
                        title:"完善的就诊信息会得到更精准的帮助哦",
                        content:"",
                        cancel:"暂不填写",
                        ensure:"去填写",
                        cancelCallback:function(){
                            that.saveCase();//用户确定暂不填写，然后保存
                            window.location.href = "http://m.tocure.cn/pages/patientConsult/select_parts.html?age=" + current.attr("data-age") + "&sex=" + current.attr("data-sex")+"&patientId="+current.attr("data-patientid");
                        },
                        ensureCallback:function(){

                        }
                    });
                }

            })
        },
        //直约手术中的下一步的保存函数
        saveCase : function () {
            var that = this;
            var data = {};//创建病例用的参数
            var parameter ={};//创建曾就诊信息的参数
            data.patientId = $('.patient-list-item.on').data('patientid');
            data.visitSiteId = "";
            data.caseType = "2";
            data.customerId = "";
            var dataParams = {paramJson:$.toJSON(data)};
            $.ajax({
                url: that.XHRList.createCase,
                type: 'POST',
                dataType: "json",
                data: dataParams,
                success: function (rep) {
                    if (rep && rep.responsePk) {
                        parameter.treatment_hospital_id = $(".disease-info-item .hospital");
                        parameter.treatment_hospital = $(".disease-info-item .hospital");
                        parameter.illness_history_id = $(".disease-info-item .disease");
                        parameter.illness_history = $(".disease-info-item .disease");
                        parameter.caseAttIdList = $(".disease-info-item .datum");
                        parameter.caseId = rep.responsePk;
                    }
                    var params = {paramJson:$.toJSON(parameter)};
                    $.ajax({
                        url: that.XHRList.saveOperation,
                        type: 'POST',
                        dataType: "json",
                        data: params,
                        success: function (data) {

                        },
                        fail :function (data) {

                        }
                    });
                },
                fail :function (data) {

                }
            });
        },
        //直约手术中的搜索的事件
        operationSearch: function () {
            //搜寻医院
            $('.disease-info-item-right.hospital').on('click',function () {

                $(".sticky-wrapper").hide();
                $("#disease-info-next").hide();
                modules.searchList({
                    targetEle: $(".disease-info-item-right.hospital"),
                    type: "hospital",
                    backCallback:function () {
                        $(".disease-info-item-right.hospital").addClass('selected');
                        $(".sticky-wrapper").show();
                        $("#disease-info-next").show();
                        alert('成功了');
                    }
                })
            });
            //搜寻疾病
            $(".disease-info-item-right.disease").on('click',function () {

                $(".sticky-wrapper").hide();
                $("#disease-info-next").hide();
                modules.searchList({
                    targetEle: $(".disease-info-item-right.hospital"),
                    type: "disease",
                    backCallback:function () {
                        $(".disease-info-item-right.disease").addClass('selected');
                        $(".sticky-wrapper").show();
                        $("#disease-info-next").show();
                        alert('成功了');
                    }
                })
            });
            //上传资料

        }
    }
    container.init(obj);
}
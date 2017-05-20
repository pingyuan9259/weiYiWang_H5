/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by lichenyang on 2017/03/01
 */
$(function () {
    var controller = {
        init: function() {
            var that = this;
            that.listRouter();//页面路由控制
            that.getAnswerList();//前几道题的页面
            that.getHistoryDom();//获取既往史DOM
            that.selectChange();//最后一题
            that.getAnswersCache();
            that.symptomQuery();
            that.inputCountLimit();
            that.inputVerify();//最后一题的input验证
            that.cardTypeLoad();//最后一题的获取证件类型和社保类型的列表
            that.locationSelect();//最后一题的患者所在地、社保所在地的选择时间
        },
        config: {
            caseId: "",
            visitSiteId: "1",
            patientId: common.getpara().patientId,
            optionList: [],
            questionLenght:''
        },
        template: {
            symptomQuery: function (data) {
                return '<section class="symptom-detail-desc">' +
                    '<figure>' +
                    (function (iData) {
                        var result = "";
                        $(iData).each(function (index, element) {
                            result += '<img src="' + element.optionAttUrl + '" alt="">';
                        });
                        return result;

                    }(data.optionAttList)) +

                    '</figure>' +
                    '<figcaption>' + data.optionDesc + '</figcaption>' +
                    '</section>';
            },
            answersList: function (index, total, data) {
                var that = this;

                return '<section class="symptom-desc-inner" data-sort="consult' + (parseInt(index) + 1) + '" data-id="' + data.questionId + '">' +
                    '<section class="symptom-desc-form">' +
                    '<header class="symptom-desc-title">' +
                    '<p><span class="num"><em>' + (parseInt(index) + 1) + '</em>/' + total + '</span>' + data.questionDesc + (parseInt(data.questionType) === 1 ? '</p>' : '<span class="tips">(可多选)</span></p>') + (parseInt(data.isAttachment) === 1 ? '<i class="icon-pain-detail"></i>' : "") +
                    '</header>' +
                    '<section class="util-selector ' + (parseInt(data.questionType) === 1 ? " sSelector" : "mSelector") + '">' +
                    (function (sData) {
                        var result = "";
                        $(sData).each(function (index, element) {
                            result += that.answerItem(element, data.questionType);
                        });
                        return result;
                    }(data.optionList1)) +
                    '</section>' +
                    '</section>' +
                    '</section>';
            },
            answerItem: function (data, type) {
                var result = "", that = this;
                switch (parseInt(type)) {
                    case 1:
                        result = '<section class="symptom-desc-item single-choices" data-role="selector" data-id="' + data.optionId + '">' +
                            '<p><i class=" icon-select"></i><span>' + data.optionDesc + (parseInt(data.isAttachment) === 1 ? '<i class="icon-pain-detail"></i>' : '') + '</span></p>' +
                            (function (qData) {
                                var result = "";
                                $(qData).each(function (index, element) {
                                    result += that.childItem(element)
                                });

                                return $.isEmptyObject(qData) ? "" : result;
                            }(data.questionList2)) +
                            '</section>';
                        break;
                    case 2:
                        result = '<section class="symptom-desc-item multiple-choices" data-role="selector" data-id="' + data.optionId + '">' +
                            '<p><i class=" icon-select"></i><span>' + data.optionDesc + '<i class="icon-arrow"></i></span></p>' +
                            (function (qData) {
                                var result = "";
                                $(qData).each(function (index, element) {
                                    result += that.childItem(element)
                                });
                                return $.isEmptyObject(qData) ? "" : result;
                            }(data.questionList2)) +
                            '</section>';
                        break;
                }
                return result;
            },
            childItem: function (data) {
                var that = this;
                return '<section class="symptom-desc-form symptom-desc-second-form" data-role="selector">' +
                    '<header class="symptom-desc-title">' +
                    '<h4>' + data.questionDesc + '</h4>' +
                    '</header>' +
                    '<section class="util-selector ' + (parseInt(data.questionType) === 1 ? " sSelector" : "mSelector") + '">' +
                    (function (sData) {
                        var result = "";
                        $(sData).each(function (index, element) {
                            result += that.answerItem(element, data.questionType);
                        });
                        return result;
                    }(data.optionList2)) +
                    '</section>' +
                    '</section>';
            },
            //底部控制器的模板
            routerController: function (data) {
                return '<footer class="au-controller" data-sort="' + data.router + '">' +
                    '<a href="' + data.prevRouter + '" class="btn-hollow ' + data.prevClass + '">' + data.prevText + '</a>' +
                    '<a href="' + data.nextRouter + '" class="btn-primary ' + data.nextClass + '">' + data.nextText + '</a>' +
                    '</footer>';
            },
            //既往史的模板开始

            //既往史标签
            historyTagHtml:function (data) {
                var tempHtml = '';
                tempHtml = '<span class="symptom-desc-item symptom-desc-item-tag" data-role="selector" data-historyId="'+ data.historyId+'">'+ data.historyName+ '</span>';
                return tempHtml;
            },
            //既往史的模板结束
            cardTypeHtml: function (sv) {
                var _html = '';
                $.each(sv, function (i, val) {
                    _html += '<option value="'+val.certificateName+'" data-typeid="'+val.certificateId+'">'+val.certificateName+'</option>';
                });
                return _html;
            }
        },
        XHRList: {
            query: "http://rap.taobao.org/mockjsdata/14424/getMapList",
            createMedicalRecord: "/mcall/customer/patient/case/v1/create/",
            submitMedicalRecord: "/mcall/customer/patient/case/option/v1/create/",
            symptomDetail: "/mcall/comm/data/symptom/option/v1/getMapById/",
            getTagMapList:"http://m.tocure.cn/mcall/cms/case/history/v1/getMapList/", //既往史标签查询
            getPatientMapList:"http://m.tocure.cn/mcall/customer/patient/case/history/v1/getMapList/",  //获取患者既往史
            savePatientHistory:"http://m.tocure.cn/mcall/customer/patient/case/history/v1/create/", //保存患者既往史
            cardType:'http://m.tocure.cn/mcall/comm/data/social/security/v1/getTotalMapList/', //证件类型
            baseInfo:'http://m.tocure.cn/mcall/customer/patient/baseinfo/v1/getMapList/',      //个人信息
            submit: 'http://m.tocure.cn/mcall/customer/patient/baseinfo/v1/create/'            //保存患者信息
        },
        //页面问题的控制器
        listRouter: function () {
            var that = this;
            Q.reg('consult1', function () {
                console.log('第一题...');
            });
            Q.reg('consult2', function () {
                console.log('第二题')
            });
            Q.reg('consult3', function () {
                console.log('第三题')
            });
            Q.reg('consult4', function () {
                console.log('第四题')
            });
            Q.reg('consult5', function () {
                console.log('第五题')
            });
            Q.reg('consult6', function () {
                console.log('第六题')
            });
            Q.reg('consult7', function () {
                console.log('第七题')
            });

            Q.init({
                index: 'consult1'/* 首页地址 */,
                pop: function (L) {
                    $(".symptom-desc-inner").removeClass('active');
                    $(".au-controller").removeClass("active");
                    $(".au-controller[data-sort='" + L + "']").addClass('active');
                    $(".symptom-desc-inner[data-sort='" + L + "']").addClass('active');
                }
            });

            $(".au-controller").on("click",".next",function () {
                var ele = $(this);
                return that.nextBtnValidate(ele);
            });
            $(".au-controller").on("click",".prev", function () {
                // that.backToLastRouter();
                return that.backToLastRouter();
            });
            
            //设置问题总数，存到config里面备用
            that.config.questionSum = $('.au-infoBox>.symptom-desc-inner').length;
        },

        //铺前几道题的页面
        getAnswerList: function () {
            var that = this;

            $.ajax({
                url: this.XHRList.query,
                type: 'POST',
                dataType: "json",
                data: {
                    paramJson: $.toJSON({
                        partId: "1488513378853",//common.getpara().partId,
                        isValid: "1",
                        sortType: ""
                    })
                },
                timeout: 10000,
                beforeSend: function () {
                    common.loading.show()
                }
            })
                .done(function (data) {
                    common.loading.hide();
                    if (data.responseObject.responseData) {
                        var dataList = data.responseObject.responseData.dataList;
                        if (dataList && dataList.length !== 0) {
                            var total = parseInt(dataList.length)+2;
                            that.config.questionLenght = dataList.length;
                            $(dataList).each(function (index, element) {
                                $(".au-infoBox .cureHistory").before(that.template.answersList(index, total, element));
                                that.config.optionList.push({
                                    partId: common.getpara().partId,
                                    questionId: element.questionId,
                                    optionIdList: "",
                                    mainOptionId: ""
                                });
                                var data = {
                                    router: "consult" + (index + 1),
                                    prevRouter: (index === 0) ? "//m.tocure.cn/pages/imScene/im_main_scene.html" : "#!consult" + index,
                                    nextRouter: "#!consult" + (index + 2),
                                    prevClass: "prev",
                                    nextClass: (index === total - 1) ? "sure" : "next",
                                    prevText: (index === 0) ? "返回" : "上一步",
                                    nextText: "下一步"
                                };
                                $(".au-main .cureHisControl").before(that.template.routerController(data));
                            });
                            var historyTitle = "<em>"+ (parseInt(dataList.length)+1) +"</em>/" +(parseInt(dataList.length)+2);//既往史的标题数目
                            $(".cureHistory .symptom-desc-title .num").html(historyTitle);
                            $(".au-infoBox .cureHistory").attr('data-sort',"consult"+ (parseInt(dataList.length)+1) );//设置既往史内容的路由
                            $(".au-main .cureHisControl").attr('data-sort',"consult"+ (parseInt(dataList.length)+1) );//设置既往史控制器的路由
                            $(".au-main .cureHisControl .prev").attr("href","#!consult" + dataList.length);//设置既往史控制器的路由里的上一步
                            var infoTitle = "<em>"+ (parseInt(dataList.length)+2) +"</em>/" +(parseInt(dataList.length)+2);//最后一题基本信息的标题数目
                            $(".patientInfo .symptom-desc-title .num").html(infoTitle);
                            $(".au-infoBox .patientInfo").attr('data-sort',"consult"+ (parseInt(dataList.length)+2) );//最后一题基本信息内容的路由设置
                            $(".au-main .infoControl").attr('data-sort',"consult"+ (parseInt(dataList.length)+2) );//最后一题基本信息的控制器的路由设置
                            $(".au-main .infoControl .prev").attr("href","#!consult" + (parseInt(dataList.length)+1));//最后一题基本信息的控制器的路由里的上一步
                            $(".au-controller").eq(0).addClass("active");
                            $(".symptom-desc-inner").eq(0).addClass("active");
                            that.getButtonUnfinish($("html").attr("view"))
                        }
                    }
                })
                .fail(function () {
                    common.loading.hide()
                });
        },

        //监测题目的选中情况并响应到按钮的置灰情况...
        getButtonUnfinish: function (router) {
            $(".symptom-desc-inner").removeClass('active');
            $(".au-controller").removeClass("active");
            $(".au-controller[data-sort='" + router + "']").addClass('active');
            $(".symptom-desc-inner[data-sort='" + router + "']").addClass('active');
            if ($(".symptom-desc-inner[data-sort='" + router + "']").find(".util-selector").eq(0).find(">.selected").size() === 0) {
                $(".symptom-desc-controller[data-sort='" + router + "']").find(".next,.sure").addClass("unfinish");
            } else {
                $(".symptom-desc-controller[data-sort='" + router + "']").find(".next,.sure").removeClass("unfinish");
            }
        },

        //铺既往史的页面
        getHistoryDom:function () {
            var that = this;
            $.ajax({
                url: that.XHRList.getTagMapList,
                type: 'GET',
                dataType: "json",
                // data: params,
                timeout: 10000,
                success: function (rep) {
                    if (rep && rep.responseObject.responseData.dataList) {
                        var data =rep.responseObject.responseData.dataList;
                        // console.log(data);
                        $(data).each(function (index,element) {
                            var tagHtml = that.template.historyTagHtml(element);
                            $('.au-cureHisItem[data-historyType='+element.historyType +'] .au-cureHisItemBottom').prepend(tagHtml);

                        })
                    };
                    that.historyTagClick();//既往史标签的点击事件
                    that.getHistoryInfo();//获取患者的既往史信息并在页面展示
                },
            })
        },
        //既往史的点击事件控制文本输入框显示隐藏
        historyTagClick: function () {
        	$('.symptom-desc-item-tag').on("click" , function (e) {
			    if ($(this).hasClass('selected') && !$(this).siblings().hasClass('selected')) {
			    	$(this).parent().siblings('.au-cureHisItemInfo').hide();
			    } else {
			    	$(this).parent().siblings('.au-cureHisItemInfo').show();
			    }
			});
        },

        //获取患者的既往史信息
        getHistoryInfo : function () {
            var that = this;
            $.ajax({
                url: that.XHRList.getPatientMapList,
                type: 'GET',
                dataType: "json",
                // data: params,
                timeout: 10000,
                success: function (rep) {
                    if (rep && rep.responseObject.responseData.dataList) {
                        var data =rep.responseObject.responseData.dataList;
                        console.log(data);
                        $.each(data,function (index,element) {
                            console.log(element);
                            var container = $(".au-cureHisItem[data-historyType='"+ element.caseHistoryType +"']");
                            var caseHistoryIdList = element.caseHistoryIdList.split(",");//标签id串
                            var caseHistoryDesc = element.caseHistoryDesc;//每个既往史下面的描述
                            //赋值六种病史下面的描述
                            if (element.caseHistoryIdList !== '') {
                                container.find('.au-cureHisItemInfo textarea').val(caseHistoryDesc);
                                container.find('.au-cureHisItemInfo').show();
                            }
                            $.each(caseHistoryIdList,function (index,element) {
                                container.find('.symptom-desc-item-tag[data-historyId='+ element +']').addClass('selected');
                            });
                        });
                    }
                },
            })
        },

        //既往史的保存
        saveHistoryInfo: function () {
            //定义需要需要传的参数
            var that = this,
                data = {};
                data.caseId = '1441561678652',
                data.patientId = "1441561678652",
                data.operatorId = '',//操作人
                data.operatorType = "0",
                data.caseHistoryList = []; //保存既往史的数组

            $('.au-cureHisItem').each(function (index,element) {
                var obj = {};
                obj.caseHistoryType = $(element).data('historytype');
                obj.caseHistoryDesc = $.trim($(element).find(".au-cureHisItemInfo textarea").val());
                obj.caseHistoryIdList = [];
                obj.caseHistoryName = [];
                $($(element).find('.au-cureHisItemBottom .selected')).each(function (ind ,ele) {
                    obj.caseHistoryName.push($(ele).text());
                    obj.caseHistoryIdList.push($(ele).data('historyid'));
                });
                obj.caseHistoryIdList = obj.caseHistoryIdList.join(",");
                obj.caseHistoryName = obj.caseHistoryName.join(",");
                data.caseHistoryList.push(obj);
            });
            data.caseHistoryList = JSON.stringify(data.caseHistoryList);
            console.log(data);
            var params = {paramJson:$.toJSON(data)};
            console.log(params);
            $.ajax({
                url: that.XHRList.savePatientHistory,
                type: 'GET',
                dataType: "json",
                data: params,
                success: function (data) {
                    
                },
                fail :function (data) {

                }
            })
        },

        //获取最后一题的社保证件类型列表
        cardTypeLoad:function(){
            var _t = this;
            var _data={
                //patientId:"1441561678652",	     //string	是	患者id
                //isValid:"1",	    //string	是	是否有效1-有效0-无效
                firstResult:"10",	//string	是	分页参数
                maxResult:"9999"	//string	是	分页参数
            };
            _t.callAjax({
                path: _t.XHRList.cardType,
                data:_data,
                callBack:function(data){
                    //处理返回数据
                    if(data&&data.responseObject&&data.responseObject.responseData){
                        var _dataList=data.responseObject.responseData.dataList[0],
                            _social=_dataList.social,
                            _role=_dataList.role;
                        $('.au-perfectInfoItem').find('.cardTypeBox select').append(_t.template.cardTypeHtml(_role));    //证件类型
                        $('.au-perfectInfoItem').find('.protectTypeBox select').append(_t.template.cardTypeHtml(_social));  //社保类型
                        _t.baseInformation();
                    }
                }
            })
        },

        //获取个人信息
        baseInformation:function(){
            var _t = this;
            var _data={
                patientId:"1481079058935",	     //string	是	患者id
                //isValid:"1",	    //string	是	是否有效1-有效0-无效
                //firstResult:"10",	//string	是	分页参数
                //maxResult:"9999"	//string	是	分页参数
            };
            _t.callAjax({
                path: _t.XHRList.baseInfo,
                data:_data,
                callBack:function(data){
                    //处理返回数据
                    if(data&&data.responseObject&&data.responseObject.responseData){
                        var _dataList=data.responseObject.responseData.dataList[0],
                            patientName=_dataList.patientName,   //患者名称
                            patientId=_dataList.patientId,       //患者ID
                            certificateId=_dataList.certificateId,       //证件类型ID
                            certificateCode=_dataList.certificateCode,   //证件号码
                            mobile=_dataList.mobile,           //手机号码
                            province=_dataList.province,       //所在地省
                            provinceId=_dataList.provinceId,   //所在地省ID
                            city=_dataList.city,               //所在地市
                            cityId=_dataList.cityId,           //所在地市ID
                            district=_dataList.district,       //所在地区/县
                            districtId=_dataList.districtId,   //所在地区/县ID
                            socialId=_dataList.socialId,       //社保类型ID
                            socialProvince=_dataList.socialProvince,       //社保省
                            socialProvinceId=_dataList.socialProvinceId,   //社保省ID
                            socialCity=_dataList.socialCity,               //社保市
                            socialCityId=_dataList.socialCityId,           //社保市ID
                            socialDistrict=_dataList.socialDistrict,       //社保区/县
                            socialDistrictId=_dataList.socialDistrictId,   //社保区/县ID
                            certificateText='',
                            socialText='';
                        //姓名
                        if(patientId != ""){
                            $('.au-perfectInfoList').find('.au-perfectInfoItem[data-type=1]').addClass('active').find('input').val(patientName).attr("data-patientId",patientId);
                        }
                        //证件类型
                        if(certificateId != ""){
                            var _text=$('.au-perfectInfoItem[data-type=2]').find('option[data-typeid='+certificateId+']').val();
                            $('.au-perfectInfoItem[data-type=2]').find('.show').text(_text).addClass('selected');
                            $('.au-perfectInfoList').find('.au-perfectInfoItem[data-type=2]').addClass('active').attr("data-typeid",certificateId);
                        }
                        //证件号码
                        if(certificateCode != ""){
                            $('.au-perfectInfoList').find('.au-perfectInfoItem[data-type=3]').addClass('active').find('input').val(certificateCode);
                        }
                        //联系电话
                        if(mobile != ""){
                            $('.au-perfectInfoList').find('.au-perfectInfoItem[data-type=4]').addClass('active').find('input').val(mobile);
                        }
                        //患者所在地
                        if(provinceId != ""){
                            $('.au-perfectInfoList').find('.au-perfectInfoItem[data-type=5]').addClass('active').find('input').val(province+city+district).attr({
                                "data-provinceId":provinceId,"data-cityId":cityId,"data-districtId":districtId,
                                "data-province":province,"data-city":city,"data-district":district
                            });
                        }
                        //社保类型
                        if(socialId !== ""){
                            var _socialText=$('.au-perfectInfoItem[data-type=6]').find('option[data-typeid='+socialId+']').val();
                            $('.au-perfectInfoItem[data-type=6]').find('.show').text(_socialText).addClass('selected');
                            $('.he-perfectInfo').find('.au-perfectInfoItem[data-type=6]').addClass('active').attr("data-typeid",socialId);
                        }
                        //社保所在地
                        if(socialProvinceId != ""){
                            $('.au-perfectInfoList').find('.au-perfectInfoItem[data-type=7]').addClass('active').find('input').val(socialProvince+socialCity + socialDistrict).attr({
                                "data-socialProvinceId":socialProvinceId,"data-socialCityId":socialCityId,"data-socialDistrictId":socialDistrictId,
                                "data-socialProvince":socialProvince,"data-socialCity":socialCity,"data-socialDistrict":socialDistrict
                            });
                        }
                        _t.quesThreeCheck();
                        _t.savePatientInfo();
                    }
                }
            })
        },

        //判断最后一题页面的必填项是否填写
        quesThreeCheck:function(){
            var that=this,
                _requireActNum=$(".au-perfectInfoItem.active[data-required=1]"),  //必选已填总数
                _requireNum=$(".au-perfectInfoItem[data-required=1]");            //必选总数
            if(_requireActNum&&_requireNum&&_requireActNum.length==_requireNum.length){
                $('.au-controller').find('.sure').removeClass("disabled");
            }else{
                $('.au-controller').find('.sure').addClass("disabled");
            }
        },

        //最后一题中select的事件及验证
        selectChange: function () {
            var that =this;
            $('.au-perfectInfoItemRight.hasSelect select').on('change',function () {
                var selectVal = $(this).val(),
                    _optionEle=$(this).find('option:selected').data('typeid'),
                    _elType=$(this).data('check');
                $(this).siblings('.show').text(selectVal).addClass('selected');
                $(this).closest('.au-perfectInfoItem').addClass('active');
                switch (_elType){
                    case 1:
                        $('.au-perfectInfoItem[data-type=3]').removeClass('active').find('input').val("");
                        switch (_optionEle){
                            case 1:
                                $(this).closest('.au-perfectInfoItem').attr("data-typeid","1");
                                break;
                            case 2:
                                $(this).closest('.au-perfectInfoItem').attr("data-typeid","2");
                                break;
                            case 3:

                                $(this).closest('.au-perfectInfoItem').attr("data-typeid","5");
                                break;
                        }
                        break;
                    case 2:
                        $('.au-perfectInfoItem[data-type=7]').removeClass('active').find('input').val("");
                        switch (_optionEle){
                            case 1:
                                $(this).closest('.au-perfectInfoItem').attr("data-typeid","1");
                                break;
                            case 2:
                                $(this).closest('.au-perfectInfoItem').attr("data-typeid","2");
                                break;
                            case 3:
                                $(this).closest('.au-perfectInfoItem').attr("data-typeid","3");
                                break;
                            case 4:
                                $(this).closest('.au-perfectInfoItem').attr("data-typeid","4");
                                break;
                            case 5:
                                $(this).closest('.au-perfectInfoItem').attr("data-typeid","5");
                                break;
                        }
                        break;
                }
                that.quesThreeCheck();
            });
        },
        //最后一题的input的验证
        inputVerify : function () {
            var that = this;
            $('.au-perfectInfoList').find('input').blur(function(){
                var _quesType=$(this).closest('.au-perfectInfoItem').data('type'),
                    _cureName=$(this).val(),
                    _text='';
                //表单验证
                switch (_quesType){
                    case 1://姓名
                        if(_cureName.length>0){
                            $(this).closest('.au-perfectInfoItem').addClass('active');
                        }else{
                            $(this).closest('.au-perfectInfoItem').removeClass('active');
                        }
                        break;
                    case 2://证件类型，在select验证
                        break;
                    case 3:
                        _text="证件号不能为空";
                        var _cardType=$(this).closest('.au-perfectInfoItem').prev().attr('data-typeid');
                        switch (_cardType){
                            case "1":
                                $(this).validate({
                                    errorEle: function(msg){
                                        common.popup({
                                            text:msg
                                        })
                                    },
                                    rules: [{
                                        rule: "identityCard",
                                        msg: "身份证号码输入有误"
                                    }]
                                });
                                if($(this).attr('data-validate')=="true"){
                                    $(this).closest('.au-perfectInfoItem').addClass('active');
                                }else{
                                    $(this).closest('.au-perfectInfoItem').removeClass('active');
                                }
                                break;
                            case "2":
                                //军官证验证
                                if(_cureName.length>0){
                                    $(this).closest('.au-perfectInfoItem').addClass('active');
                                }else{
                                    $(this).closest('.au-perfectInfoItem').removeClass('active');
                                }
                                break;
                            case "3":
                                //护照验证
                                if(_cureName.length>0){
                                    $(this).closest('.au-perfectInfoItem').addClass('active');
                                }else{
                                    $(this).closest('.au-perfectInfoItem').removeClass('active');
                                }
                                break;
                        }
                        break;
                    case 4://手机号
                        if(_cureName.length>0){
                            $(this).validate({
                                errorEle: function(msg){
                                    common.popup({
                                        text:msg
                                    })
                                },
                                rules: [{
                                    rule: "isMobile",
                                    msg: "手机号码输入有误"
                                }]
                            });
                            if($(this).attr('data-validate')=="true"){
                                $(this).closest('.au-perfectInfoItem').addClass('active');
                            }else {
                                $(this).closest('.au-perfectInfoItem').removeClass('active');
                            }
                        }else{
                            $(this).closest('.au-perfectInfoItem').removeClass('active');
                        }
                        break;
                    case 5://患者所在地区
                        if(_cureName.length>0){
                            $(this).closest('.au-perfectInfoItem').addClass('active');
                            //if($(this).attr('data-validate')=="true"){
                            //    $(this).closest('.au-perfectInfoItem').addClass('active');
                            //}else {
                            //    $(this).closest('.au-perfectInfoItem').removeClass('active');
                            //}
                        }else{
                            $(this).closest('.au-perfectInfoItem').removeClass('active');
                        }
                        break;
                }
                that.quesThreeCheck();
            });
        },

        //最后一题的患者所在地、社保所在地的选择时间
        locationSelect:function () {
            //患者所在地
            Q.reg('city', function () {
                modules.searchList({
                    targetEle: $("#ev-go-to-select-city"),
                    type: "city",
                    level:"2",
                    finalLevel:"4",
                    noResultCallback:function () {

                    },
                    backCallback:function(){
                        var _province=$("#ev-go-to-select-city").attr("data-province"),
                            _city=$("#ev-go-to-select-city").attr("data-city"),
                            _district=$("#ev-go-to-select-city").attr("data-district");
                        $("#ev-go-to-select-city").val(_province+_city+_district).closest('.au-perfectInfoItem').addClass('active');
                    }
                })
            });
            //社保所在地
            Q.reg('perfectCity', function () {
                modules.searchList({
                    targetEle: $("#ev-go-to-select-perfect"),
                    type: "city",
                    level:"2",
                    finalLevel:"4",
                    noResultCallback:function () {

                    },
                    backCallback:function(){
                        var _province=$("#ev-go-to-select-perfect").attr("data-province"),
                            _city=$("#ev-go-to-select-perfect").attr("data-city"),
                            _district=$("#ev-go-to-select-perfect").attr("data-district");
                        $("#ev-go-to-select-perfect").val(_province+_city+_district).closest('.au-perfectInfoItem').addClass('active');
                    }
                })
            });



            //患者所在地
            $("#ev-go-to-select-city").on("click", function () {
                Q.go('city', function (a) {});
            });
            //社保所在地
            $("#ev-go-to-select-perfect").on("click", function () {
                Q.go('perfectCity', function (a) {});
            })
        },

        //最后一题的保存按钮
        savePatientInfo : function () {
            var that=this;
            $('#saveInfoBtn').on('click',function () {
                var _requireActNum=$(".au-perfectInfoItem.active[data-required=1]"),  //必选已填总数
                    _requireNum=$(".au-perfectInfoItem[data-required=1]");            //必选总数
                alert("我要保存提交了");
                if(_requireActNum&&_requireNum&&_requireActNum.length==_requireNum.length){
                    var _data={
                        patientName:$('.au-perfectInfoItem[data-type=1]').find('input').val(),                  //患者名称
                        patientId:$('.au-perfectInfoItem[data-type=1]').find('input').attr("data-patientId"),   //患者ID
                        certificateId:$('.au-perfectInfoItem[data-type=2]').attr("data-typeid"),                //证件类型ID
                        certificateCode:$('.au-perfectInfoItem[data-type=3]').find('input').val(),              //证件号码
                        mobile:$('.au-perfectInfoItem[data-type=4]').find('input').val(),                       //手机号码
                        province:$('.au-perfectInfoItem[data-type=5]').find('input').attr("data-province"),       //所在地省
                        provinceId:$('.au-perfectInfoItem[data-type=5]').find('input').attr("data-provinceId"),   //所在地省ID
                        city:$('.au-perfectInfoItem[data-type=5]').find('input').attr("data-city"),               //所在地市
                        cityId:$('.au-perfectInfoItem[data-type=5]').find('input').attr("data-cityId"),           //所在地市ID
                        district:$('.au-perfectInfoItem[data-type=5]').find('input').attr("data-district"),       //所在地区/县
                        districtId:$('.au-perfectInfoItem[data-type=5]').find('input').attr("data-districtId"),   //所在地区/县ID
                        socialId:$('.au-perfectInfoItem[data-type=6]').attr("data-typeid"),                       //社保类型ID
                        socialProvince:$('.au-perfectInfoItem[data-type=7]').find('input').attr("data-socialProvince"),       //社保省
                        socialProvinceId:$('.au-perfectInfoItem[data-type=7]').find('input').attr("data-socialProvinceId"),   //社保省ID
                        socialCity:$('.au-perfectInfoItem[data-type=7]').find('input').attr("data-socialCity"),               //社保市
                        socialCityId:$('.au-perfectInfoItem[data-type=7]').find('input').attr("data-socialCityId"),           //社保市ID
                        socialDistrict:$('.au-perfectInfoItem[data-type=7]').find('input').attr("data-socialDistrict"),       //社保区/县
                        socialDistrictId:$('.au-perfectInfoItem[data-type=7]').find('input').attr("data-socialDistrictId")    //社保区/县ID
                    };
                    console.log(that.XHRList.submit);
                    that.callAjax({
                        data:_data,
                        path:that.XHRList.submit,
                        callBack:function(data){
                            window.location.href = "http://m.tocure.cn/pages/imScene/im_main_scene.html";
                        }
                    })
                }
            })
        },

        //显示症状详情
        symptomQuery: function () {
            var that = this;
            $(".icon-pain-detail").on("click", function (e) {
                e.stopPropagation();
                var ele = $(this).parents("[data-role='selector']").find(".symptom-detail-desc");
                if (ele.is(":visible")) {
                    ele.hide();
                } else {
                    ele.show();
                }

                that.queryMessage();
            })
        },
        //获取症状详情
        queryMessage: function () {
            var that = this;
            $.ajax({
                url: that.XHRList.query,
                type: 'POST',
                dataType: "json",
                timeout: 10000,
                beforeSend: function () {
                    common.loading.show()
                }
            })
                .done(function (data) {
                    common.loading.hide()
                })
                .fail(function () {
                    common.loading.hide()
                });
        }
        ,
        //前往下一步的验证...
        nextBtnValidate: function (ele) {
            var that = this,
                router = $("html").attr("view"),
                
                //截取router最后一位，判断是第几题
                routerNumber = router.substr(-1,1);
            //判断是否是既往史，既往史单独添加了类名，可以查找，既往史的下一步需要提示用户
            if ($(ele).parent().hasClass('cureHisControl')) {
                var textArray = $('.au-cureHisItemBottom').find('.selected').parent().siblings('.au-cureHisItemInfo').children();
                if (0 === textArray.length) {
                    // that.saveHistoryInfo();//保存既往史信息
                    location.hash = '#!consult'+ (parseInt(that.config.questionLenght)+2);
                    return
                } else {
                    var isEmpty = 1;
                    $.each(textArray,function (index,element) {
                        console.log(element);
                        var textVal = $(element).val();
                        if ($.trim(textVal) == '') {
                            console.log('111');
                            console.log($(ele).parent().next().find('.prev'));
                            console.log(location.hash);
                            common.popup({
                                text:'请完善信息'
                            })
                            $(element).focus();
                            isEmpty = 0
                            return false;
                        } else {

                        }
                    });
                    if (isEmpty) {
                        that.saveHistoryInfo();//保存既往史信息
                        location.hash = '#!consult'+ (parseInt(that.config.questionLenght)+2);
                    }
                }
                // console.log($('.au-cureHisItemBottom').find('.selected').parent().siblings('.au-cureHisItemInfo').children());
            }
                
            //加一层判断，只有第1-5题需要提示判断，第六题为可选,第七题为表单
            if (routerNumber < that.config.questionSum - 1 && routerNumber > 0) {
	            //第一级没有选中任何答案...
	            if ($(".symptom-desc-inner[data-sort='" + router + "']").find(".util-selector>.selected").size() === 0) {
	                common.alertBox({
	                    content: "您还有未完成的症状描述",
	                    ensure: "确定",
	                    ensureCallback: function () {
	
	                    }
	                });
	                return false;
	                //    第一级有选中答案，第二级没有任何选中...
	            } else if ($(".selected .util-selector").size() !== 0) {
	                if ($(".selected").find(".util-selector>.selected").size() === 0) {
	                    common.alertBox({
	                        content: "您还有未完成的症状描述",
	                        ensure: "确定",
	                        ensureCallback: function () {
	
	                        }
	                    });
	                    return false;
	                } else {
	                    that.saveSelectAnswers(router);
	                    return that.firstAnswerQuestion();
	
	                }
	                //    已通过选中逻辑，下一步后保存...
	            } else {
	                that.saveSelectAnswers(router);
	                return that.firstAnswerQuestion();
	
	            }
            } else{
            	that.saveSelectAnswers(router);
            }
        },


        //第一题中，存在主从症状的询问...
        firstAnswerQuestion: function () {
            var that=this;
            if ($("html").attr("view") === "consult1") {
                var btnList=[];
                $(".symptom-desc-inner[data-sort='consult1'] .selected").each(function (index, element) {
                   if ($(element).parents(".symptom-desc-second-form").size()===0){
                       btnList.push({
                           className:"btn-hollow main-symptom",
                           id:$(element).attr("data-id"),
                           content:$(element).find(">p>span").text(),
                           href:"javascript:void(0)"
                       })
                   }
                });
                
                //判断第一题如果只有一个则不询问哪个为主症状
                if (btnList.length > 1) {
	                common.btnBox({
	                    title: "哪种不适最明显？",
	                    direction: "horizontal",
	                    btn: btnList
	                });
	                $(".main-symptom").on("click",function () {
	                    that.config.answers.main=$(this).attr("id");
	                    $(".btnBox-tips").remove();
	                    Q.go('consult2');
	                });
		            return false;
                }
            }

        },
        //保存本页选择的答案...
        saveSelectAnswers: function (router) {
        	var router = router,
        		that = this,
        		routerNumber = router.substr(-1,1);
            var container = $(".symptom-desc-inner[data-sort='" + router + "']");    	
        	//判断是那道题保存方式不一样
        	if (routerNumber == that.config.questionSum - 1) {
        		//最后第二道题病例史的保存
        		container.find(".au-cureHisItem").each(function (index, element) {
	        		var caseS = [], detail = '';
	                var type = $(element).data('type');
	                $(element).find(".util-selector>.selected").each(function (ind, ele) {
		                caseS.push($(ele).data("id"));
	                });
	                var type = $(element).data('type');
	                detail = $(element).find(".au-cureHisItemInfo textarea").val();
	                
	                that.config.answers[router.substr(-1, 1)][type] = {
	                	caseS : caseS.join(','),
	                	detail : detail
	                }
	                
	            });
        	} else if (routerNumber == that.config.questionSum){
        		//最后一道题信息的保存
        		
        	} else {
	        	//前几道题的保存方式
	            var firstS = [], secondS = [];
	
	            //第一级...
	            container.find(".util-selector>.selected").each(function (index, element) {
	                if ($(element).parents(".selected").size() === 0) {
	                    firstS.push($(element).attr("data-id"));
	                }
	            });
	            //第二级...
	            $(".selected").find(".util-selector>.selected").each(function (index, element) {
	                secondS.push($(element).attr("data-id"));
	            });
	            this.config.answers[router.substr(-1, 1)] = {
	                first: firstS.join(","),
	                second: secondS.join(",")
	            };
        	}
        	
            localStorage.setItem("answers", JSON.stringify(this.config.answers))
        },
        //假若返回上一步，当前页的答案清空，上一页保留...
        backToLastRouter: function () {
            var router = $("html").attr("view"),
                container = $(".symptom-desc-inner[data-sort='" + router + "']");
            container.find(".symptom-desc-item").each(function (index, element) {
                $(element).removeClass("selected");
            });
            this.config.answers[router.substr(-1, 1)] = {};
        },
        //根据缓存调取用户退出前作答的数据...
        getAnswersCache: function () {
        	var that = this;
            //新入用户，可能无作答记录...
            if (localStorage.getItem("answers")) {
                this.config.answers = JSON.parse(localStorage.getItem("answers"));
                for (var i in this.config.answers) {
                    $(this.config.answers[i]).each(function (index, element) {
                    var container = $(".symptom-desc-inner[data-sort='consult" + i + "']");
                    	if (i == that.config.questionSum - 1) {
                    		//最后第二道题病例史的展示
//                  		console.log(element);
                    		for ( var j in element) {
//                  			console.log(j)
//                  			console.log(element[j]);
	                    		var secContainer = container.find('.au-cureHisItem[data-type='+ j +']');
	                    		
	                    		$(element[j]).each(function(ind,ele) {
	                    			console.log(ele.caseS);
		                    		var caseS = ele.caseS.split(',');
		                    		var detail = ele.detail;
		                    		$.each(caseS,function (k,el) {
			                    		secContainer.find(".util-selector>.symptom-desc-item[data-id='" + el + "']").addClass("selected");
		                    		})
	                    		});
                    		}
                    		
                    	} else if (i == that.config.questionSum) {
                    		//最后一道题信息的展示
                    		
                    		
                    	} else {
                    		
                    		//前几道题的显示
	                        if (element.first) {
	                            var first = element.first.split(",");
	                            var second = element.second.split(",");
	
	                            $(first).each(function (index, element) {
	                                container.find(".util-selector>.symptom-desc-item[data-id='" + element + "']").addClass("selected");
	                            });
	
	                            $(second).each(function (index, element) {
	                                container.find(".util-selector>.symptom-desc-item[data-id='" + element + "']").addClass("selected");
	                            });
	                        }
                    	}
                    	
                    	
                    })
                }
            }
        },

        allAnswerSubmit: function () {
            $.ajax({
                url: that.XHRList.submit,
                type: 'POST',
                dataType: "json",
                data: this.config.answers,
                timeout: 10000,
                beforeSend: function () {
                    common.loading.show()
                }
            })
                .done(function (data) {
                    common.loading.hide()
                })
                .fail(function () {
                    common.loading.hide()
                });
        },
        //    输入字数限制
        inputCountLimit: function () {
            $(".au-cureHisItemInfo textarea").on("keydown", function () {
                if ($(this).val().length > 500) {
                    $(this).val($(this).val().substring(0, 500));
                }
            })
        },
        //公用Ajax数据请求
        callAjax: function (dv) {
            common.loading.show();
            var t = this,
                params = {paramJson: $.toJSON(dv.data)};
            $.ajax({
                url: dv.path,
                type: "POST",
                data: params,
                //time : 5000,
                success: function (data) {
                    common.loading.hide();
                    dv.callBack(data);
                },
                error: function () {
                    common.loading.hide();
                }
            });
        }
    };

    controller.init();


})
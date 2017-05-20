/**
 * @name:
 * @desc:
 * @example:
 * @depend: modules.symptomList()，modules.searchList(),modules.searchInput()
 * @date: 2017/3/6
 * @author: wangjingrong
 */
$(function(){
    var reviceSymptom = {
        config:{

        },
        path:{
            getInquiryPage:'',//问诊单
            returnVisitSubmit:'',//提交复诊
            getDesList:'',//选择列表
            getTagMapList:"http://m.tocure.cn/mcall/cms/case/history/v1/getMapList/", //既往史标签查询
            cardType:'http://m.tocure.cn/mcall/comm/data/social/security/v1/getTotalMapList/', //证件类型
            baseInfo:'http://m.tocure.cn/mcall/customer/patient/baseinfo/v1/getMapList/',      //个人信息
            getPatientMapList:"http://m.tocure.cn/mcall/customer/patient/case/history/v1/getMapList/"  //获取患者既往史
        },
        template: {
            //既往史的模板开始
            historyTagHtml:function (data) {
                var tempHtml = '';
                tempHtml = '<span class="symptom-desc-item symptom-desc-item-tag" data-role="selector" data-historyId="'+ data.historyId+'">'+ data.historyName+ '</span>';
                return tempHtml;
            },
            //社保
            cardTypeHtml: function (sv) {
                var _html = '';
                $.each(sv, function (i, val) {
                    _html += '<option value="'+val.certificateName+'" data-typeid="'+val.certificateId+'">'+val.certificateName+'</option>';
                });
                return _html;
            }
        },
        init:function(){
            var t = this;
            //t.addHtml();
            t.btnClick();
            t.route();
            t.getHistoryDom();
            t.cardTypeLoad();
            t.inputVerify();
            t.selectSymptom();
        },
        addHtml:function(){
            var t = this;
            $.ajax({
                url: t.path.getInquiryPage,
                type:"POST",
                timeout:5000,
                data:{
                    docId: comm.getparaNew().docId,
                    patientId: comm.getparaNew().patientId
                },
                dataType:"json",
                success:function(data){
                    var totalSymptomHtml="",//症状单
                        baseInform="",//基本信息
                        mainSymptomHtml="",//主要症状
                        accoSymptomHtml="",//伴随症状
                        HPChtml="",//现状史
                        PMHhtml="",//既往史
                        detailInformation="";//详细信息
                    if(data&&data.responseData&&data.responseData.dataList){
                        var items = data.responseData.dataList;
                        baseInform = '<section class="tc-baseInfo">'+
                            '<ul class="tc-baseInfoList">'+
                            '<li class="tc-baseInfoItem">'+
                            '<div class="tc-baseInfoItemLeft">'+
                            '<img src="'+items.aaa+'" alt="患者头像">'+
                            '<span class="tc-personIcon"></span>'+
                            '</div>'+
                            '<div class="tc-baseInfoItemRight">'+
                            '<span class="tc-baseInfoName">'+items.aaa+'<i>&nbsp;'+items.aaa+'</i></span>'+
                            '</div>'+
                            '</li>'+
                            '<li class="tc-baseInfoItem">'+
                            '<div class="tc-baseInfoItemLeft tc-caseAreaLeft">'+
                            '<span>问诊日期</span>'+
                            '</div>'+
                            '<div class=" tc-caseAreaRight">'+
                            '<span>'+items.aaa+'</span>'+
                            '</div></li>'+
                            '<li class="tc-baseInfoItem">'+
                            '<div class="tc-baseInfoItemLeft tc-caseTimeLeft">'+
                            '<span>主诉</span>'+
                            '</div>'+
                            '<div class="tc-caseTimeRight">'+
                            '<span>'+items.aaa+'</span>'+
                            '</div>'+
                            '</li>'+
                            '</ul>'+
                            '</section>'
                        mainSymptomHtml = '<section id="ev-mainSymptom" class="tc-caseDescribe tc-module">'+
                            '<section class="tc-caseDescribeTitle title">'+
                            '<h3>症状描述</h3>'+
                            '</section>'+
                            '<ul class="tc-caseDescribeList">'+
                            '<li class="tc-caseDescribeItem tc-noClick">'+
                            '<span class="tc-caseDescribeItemLeft">主要不适部位</span><span class="tc-caseDescribeItemRight tc-noRevice" id="ev-parts">'+items.aaa+'</span>'+
                            '</li>'+
                            '<li class="tc-caseDescribeItem" data-type="1">'+
                            '<span class="tc-caseDescribeItemLeft">主要症状</span><span class="tc-caseDescribeItemRight">'+items.aaa+'</span>'+
                            '</li>'+
                            '<li class="tc-caseDescribeItem" data-type="2">'+
                            '<span class="tc-caseDescribeItemLeft">影响生活和工作程度</span><span class="tc-caseDescribeItemRight">'+items.aaa+'</span></li>'+
                            '<li class="tc-caseDescribeItem" data-type="3">'+
                            '<span class="tc-caseDescribeItemLeft">持续时间</span><span class="tc-caseDescribeItemRight">'+items.aaa+'</span>'+
                            '</li>'+
                            '</ul>'+
                            '</section>'
                        accoSymptomHtml = '<section id="ev-mainSymptom" class="tc-caseDescribe tc-module">'+
                            '<section class="tc-caseDescribeTitle title">'+
                            '<h3>症状描述</h3>'+
                            '</section>'+
                            '<ul class="tc-caseDescribeList">'+
                            '<li class="tc-caseDescribeItem tc-noClick">'+
                            '<span class="tc-caseDescribeItemLeft">主要不适部位</span><span class="tc-caseDescribeItemRight tc-noRevice" id="ev-parts">'+items.aaa+'</span>'+
                            '</li>'+
                            '<li class="tc-caseDescribeItem" data-type="1">'+
                            '<span class="tc-caseDescribeItemLeft">主要症状</span><span class="tc-caseDescribeItemRight">'+items.aaa+'</span>'+
                            '</li>'+
                            '<li class="tc-caseDescribeItem" data-type="2">'+
                            '<span class="tc-caseDescribeItemLeft">影响生活和工作程度</span><span class="tc-caseDescribeItemRight">'+items.aaa+'</span></li>'+
                            '<li class="tc-caseDescribeItem" data-type="3">'+
                            '<span class="tc-caseDescribeItemLeft">持续时间</span><span class="tc-caseDescribeItemRight">'+items.aaa+'</span>'+
                            '</li>'+
                            '</ul>'+
                            '</section>'
                        HPChtml = '<section id="ev-nowHistory" class="tc-caseDescribe tc-module">'+
                            '<section class="tc-caseDescribeTitle title">'+
                            '<h3>现状史</h3>'+
                            '</section>'+
                            '<ul class="tc-caseDescribeList">'+
                            '<li class="tc-caseDescribeItem">'+
                            '<span class="tc-caseDescribeItemLeft">曾就诊医院</span><span class="tc-caseDescribeItemRight">'+items.aaa+'</span>'+
                            '</li>'+
                            '<li class="tc-caseDescribeItem">'+
                            '<span class="tc-caseDescribeItemLeft">确诊疾病名称</span><span class="tc-caseDescribeItemRight">'+items.aaa+'</span>'+
                            '</li>'+
                            '<li class="tc-caseDescribeItem ev-datumUpload">'+
                            '<span class="tc-caseDescribeItemLeft">检查资料</span><span class="tc-caseDescribeItemRight">'+items.aaa+'</span>'+
                            '</li>'+
                            '</ul>'+
                            '</section>'
                        PMHhtml = '<section id="ev-pastHistory" class="tc-caseDescribe tc-module" data-module="4">'+
                            '<section class="tc-caseDescribeTitle title">'+
                            '<h3>既往史</h3>'+
                            '</section>'+
                            '<ul class="tc-caseDescribeList">'+
                            '<li class="tc-caseDescribeItem">'+
                            '<span class="tc-caseDescribeItemLeft">疾病史</span><span class="tc-caseDescribeItemRight">'+items.aaa+'</span>'+
                            '</li>'+
                            '<li class="tc-caseDescribeItem">'+
                            '<span class="tc-caseDescribeItemLeft">外伤史</span><span class="tc-caseDescribeItemRight">'+items.aaa+'</span>'+
                            '</li>'+
                            '</ul>'+
                            '</section>'
                        detailInformation = '<section id="ev-baseInform" class="tc-caseDescribe tc-module" data-module="5">'+
                            '<section class="tc-caseDescribeTitle title">'+
                            '<h3>基本信息</h3>'+
                            '</section>'+
                            '<ul class="tc-caseDescribeList">'+
                            '<li class="tc-caseDescribeItem ev-getAdd">'+
                            '<span class="tc-caseDescribeItemLeft">患者算在地</span><span class="tc-caseDescribeItemRight">'+items.aaa+'</span>'+
                            '</li>'+
                            '<li class="tc-caseDescribeItem">'+
                            '<span class="tc-caseDescribeItemLeft">手机号码</span><span class="tc-caseDescribeItemRight">'+items.aaa+'</span>'+
                            '</li>'+
                            '<li class="tc-caseDescribeItem ev-getSocialInsurance">'+
                            '<span class="tc-caseDescribeItemLeft">社保类型</span><span class="tc-caseDescribeItemRight">'+items.aaa+'</span></li>'+
                            '<li class="tc-caseDescribeItem ev-getAdd">'+
                            '<span class="tc-caseDescribeItemLeft">社保所在地</span><span class="tc-caseDescribeItemRight">'+items.aaa+'</span>'+
                            '</li>'+
                            '</ul>'+
                            '</section>'+
                            '<section id="ev-comment" class="tc-caseDescribe tc-module tc-comment">'+
                            '<section class="tc-caseDescribeTitle title">'+
                            '<h3>备注</h3>'+
                            '</section>'+
                            '<ul class="tc-caseDescribeList tc-caseOtherBox">'+
                            '<textarea class="tc-caseDesOther" name="" id="" cols="30" rows="10">'+items.aaa+'</textarea>'+
                            '</ul>'+
                            '</section>'+
                            '<section class="submit_symptom_box"><button class="submit_symptom">提交复诊</button></section>'
                        totalSymptomHtml = baseInform + mainSymptomHtml + accoSymptomHtml + HPChtml + PMHhtml + detailInformation
                    }
                    $(".tc-caseContentBox").html(totalSymptomHtml)
                },
                error:function(){
                    alert("网络错误")
                }
            })
        },
        route:function(){
            Q.reg('index', function () {
                $(".symptom-list").show().siblings().not(".symptom-desc-controller").hide().siblings(".symptom-desc-controller").removeClass("active").end().find(".symptom-desc-inner").hide();
                $(".au-main").find(".symptom-desc-form").hide();
                $(".tc-caseDescribeItem").removeClass("ev-symptom-change");
            });
            Q.reg('symptomChange', function () {
                //$(".tc-caseDescribeItem").on("click",function(){
                //    var bodyParts = $("#ev-parts").text(),
                //        caseType = $(this).data("type");
                //    var param = {
                //        bodyParts:bodyParts,
                //        caseType:caseType
                //    }
                //    $.ajax({
                //        url: t.path.getDesList,
                //        type:"POST",
                //        timeout:5000,
                //        dataType:"json",
                //        data: {paramJson: $.toJson(param)},
                //        success:function(){
                //            var choiceList = "";
                //            if(data){
                //                choiceList = '<section id="ev-choiceList" class="symptom-desc-inner active" data-sort="consult1"><section class="symptom-desc-form"><header class="symptom-desc-title"><p>您选择的部位有何不适？<span class="tips">(可多选)</span></p></header><section class="util-selector mSelector" ><section class="symptom-desc-item multiple-choices" data-role="selector" data-id="1"><p><i class=" icon-select"></i><span>疼痛<i></i></span></p></section><section class="symptom-desc-item multiple-choices" data-role="selector" data-id="2"><p><i class=" icon-select"></i><span>肿胀</span></p></section><section class="symptom-desc-item multiple-choices" data-role="selector" data-id="3"><p><i class=" icon-select"></i><span>肿胀</span></p></section><section class="symptom-desc-item multiple-choices" data-role="selector" data-id="4"><p><i class=" icon-select"></i><span>肿胀</span></p></section><section class="symptom-desc-item multiple-choices" data-role="selector" data-id="5"><p><i class=" icon-select"></i><span>肿胀</span></p></section><section class="symptom-desc-item multiple-choices" data-role="selector" data-id="6"><p><i class=" icon-select"></i><span>疼痛</span></p></section></section></section></section>'
                //            }
                //        }
                //    })
                //})
                $(".symptom-list").hide().siblings(".sticky-wrapper").show().siblings(".symptom-desc-controller").addClass("active").end().find(".symptom-desc-inner").show();
            });
            Q.reg('hospital', function () {
                $(".symptom-list").hide();
                modules.searchList({
                    targetEle: $("#ev-choose-hospital"),
                    type: "hospital"
                })
            });
            Q.reg('disease', function () {
                $(".symptom-list").hide();
                modules.searchList({
                    targetEle: $("#ev-choose-disease"),
                    type: "disease"
                })
            });
            Q.reg('PMHChange', function () {
                $(".symptom-list").hide().siblings(".au-main").show().find(".au-cureHistory").show().end().siblings(".symptom-desc-controller").addClass("active");
            });
            Q.reg('baseInformChange', function () {
                $(".symptom-list").hide().siblings(".au-main").show().find(".au-baseInform").show().end().siblings(".symptom-desc-controller").addClass("active");
            });
            Q.reg('homecity', function () {
                $(".au-main").hide().siblings(".symptom-desc-controller").removeClass("active");
                modules.searchList({
                    targetEle: $("#ev-choose-homeadd"),
                    type: "city",
                    level:2,
                    finalLevel:4,
                    back:"baseInformChange"
                })
            });
            Q.reg('socialcity', function () {
                $(".au-main").hide().siblings(".symptom-desc-controller").removeClass("active");
                modules.searchList({
                    targetEle: $("#ev-choose-socialadd"),
                    type: "city",
                    level:2,
                    finalLevel:4,
                    back:"baseInformChange"
                })
            });
            Q.reg('sureIndex', function () {
                var symptomText = "",_s,pastHis = "",baseInformText = "";
                //症状替换
                if($(".sticky-wrapper").is(":visible")){
                    for(var i=0;i<$(".sticky-wrapper .selected").length;i++){
                        if($(".sticky-wrapper .selected").eq(i+1).length>0){
                            _s = "-"
                        }else{
                            _s = ""
                        }
                        symptomText += $(".sticky-wrapper .selected").eq(i).children("p").find("span").text() + _s
                    }
                    $(".ev-symptom-change").find(".tc-caseDescribeItemRight").text(symptomText);
                    $(".tc-caseDescribeItem").removeClass("ev-symptom-change")
                }
                //既往史替换
                if($(".au-cureHistory").is(":visible")){
                    for(var j=0;j<$(".au-cureHisItem").length;j++){
                        var m = $(".au-cureHisItem").eq(j).find(".selected"),
                            n = " ",
                            o = "";
                        if(m.length>0){
                            for(var k=0;k<m.length;k++){
                                o += m.eq(k).text() + n
                            }
                            pastHis += '<li class="tc-caseDescribeItem">'+
                                '<span class="tc-caseDescribeItemLeft">'+$(".au-cureHisItem").eq(j).children(".au-cureHisItemTop").text()+'</span><span class="tc-caseDescribeItemRight">'+o+'</span>'+
                                '</li>'
                        }
                    }
                    if(pastHis){
                        $("#ev-pastHistory").find(".tc-caseDescribeList").html(pastHis);
                    }else{
                        $("#ev-pastHistory").remove();
                    }
                }
                //个人信息替换
                if($(".au-baseInform").is(":visible")){
                    for(var l=0;l<$(".ev-isHasInform").length;l++){
                        var lItems = $(".ev-isHasInform").eq(l);
                        if(lItems){
                            baseInformText += '<li class="tc-caseDescribeItem">'+
                                '<span class="tc-caseDescribeItemLeft">'+lItems.parents(".au-perfectInfoItemRight").siblings(".au-perfectInfoItemLeft").text()+'</span><span class="tc-caseDescribeItemRight">'+(lItems.get(0).tagName=="INPUT"?lItems.val():lItems.text())+'</span>'+
                                '</li>'
                        }
                    }
                    $("#ev-baseInform").find(".tc-caseDescribeList").html(baseInformText);
                }


                $(".symptom-list").show().siblings().not(".symptom-desc-controller").hide().siblings(".symptom-desc-controller").removeClass("active").end().find(".symptom-desc-inner").hide();
                $(".au-main").find(".symptom-desc-form").hide();
            });
            Q.init({
                index: 'index'
            });
        },


        //症状更改
        selectSymptom: function () {
            $(".util-selector").on("click", '[data-role="selector"]', function (e) {
                var selector = $(this).parent();
                e.stopPropagation();
                if (selector.hasClass('sSelector')) {
                    $(this).addClass('selected').siblings().removeClass('selected');
                } else if (selector.hasClass('mSelector')) {
                    $(this).toggleClass("selected");
                }
                if ($(".sticky-wrapper").find(".selected").length === 0) {
                    $(".symptom-desc-controller").find(".btn-primary").addClass("disabled");
                } else {
                    $(".symptom-desc-controller").find(".btn-primary").removeClass("disabled");
                }
            });
        },


        //既往史更改
        //铺既往史的页面
        getHistoryDom:function () {
            var t = this;
            var param = {
                patientId:"",
                isValid:1,
                firstResult:1,
                maxResult:9999
            }
            $.ajax({
                url: t.path.getTagMapList,
                type: 'GET',
                dataType: "json",
                // data: {paramJson:$.toJSON(param)},
                timeout: 10000,
                success: function (rep) {
                    if (rep && rep.responseObject.responseData.dataList) {
                        var data =rep.responseObject.responseData.dataList;
                        $(data).each(function (index,element) {
                            var tagHtml = t.template.historyTagHtml(element);
                            $('.au-cureHisItem[data-historyType='+element.historyType +'] .au-cureHisItemBottom').prepend(tagHtml);
                        })
                    };
                    t.historyTagClick();//既往史标签的点击事件
                    t.getHistoryInfo();//获取患者的既往史信息并在页面展示
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
            var t = this;
            var param = {
                patientId:"",
                caseId:"",
                sortType:2,
                isValid:1,
                firstResult:1,
                maxResult:9999
            }
            $.ajax({
                url: t.path.getPatientMapList,
                type: 'GET',
                dataType: "json",
                // data: {paramJson:$.toJSON(param)},
                timeout: 10000,
                success: function (rep) {
                    if (rep && rep.responseObject.responseData.dataList) {
                        var data =rep.responseObject.responseData.dataList;
                        $.each(data,function (index,element) {
                            var container = $(".au-cureHisItem[data-historyType='"+ element.caseHistoryType +"']");
                            var caseHistoryIdList = element.caseHistoryIdList.split(",");//标签id串
                            var caseHistoryDesc = element.caseHistoryDesc;//每个既往史下面的描述
                            //赋值六种病史下面的描述
                            if (caseHistoryDesc && caseHistoryDesc !== '') {
                                container.find('.au-cureHisItemInfo textarea').val(caseHistoryDesc);
                                container.find('.au-cureHisItemInfo').show();
                            }
                            $.each(caseHistoryIdList,function (index,element) {
                                container.find('.symptom-desc-item-tag[data-historyId='+ element +']').addClass('selected');
                            });

                        });
                    };
                },
            })
        },


        //个人信息更改
        //获取社保证件类型列表
        cardTypeLoad:function(){
            var t = this;
            var param={};
            $.ajax({
                url: t.path.cardType,
                type:"GET",
                //data:{paramJson: $.toJSON(param)},
                timeout:5000,
                success:function(data){
                    if(data&&data.responseObject&&data.responseObject.responseData){
                        var _dataList=data.responseObject.responseData.dataList[0],
                            _social=_dataList.social;
                        $('.au-perfectInfoItem').find('.protectTypeBox select').append(t.template.cardTypeHtml(_social));  //社保类型
                        t.baseInformation();
                    }
                }
            })
        },
        //获取个人信息
        baseInformation:function(){
            var t = this;
            var param={
                patientId:"1481079058935",	     //string	是	患者id
            };
            $.ajax({
                url: t.path.baseInfo,
                type:"GET",
                data:{paramJson: $.toJSON(param)},
                timeout:5000,
                success:function(data){
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
                        if(patientId !== ""){
                            $('.au-perfectInfoList').find('.au-perfectInfoItem[data-type=1]').addClass('active').find('input').val(patientName).attr("data-patientId",patientId).addClass("fontGray");
                        }
                        //证件类型
                        if(certificateId !== ""){
                            $('.au-perfectInfoList').find('.au-perfectInfoItem[data-type=2]').addClass('active').find('input').val(certificateId).attr("data-certificateId",certificateId).addClass("fontGray");
                        }
                        //证件号码
                        if(certificateCode !== ""){
                            $('.au-perfectInfoList').find('.au-perfectInfoItem[data-type=3]').addClass('active').find('input').val(certificateCode).addClass("fontGray");
                        }
                        //联系电话
                        if(mobile !== ""){
                            $('.au-perfectInfoList').find('.au-perfectInfoItem[data-type=4]').addClass('active').find('input').val(mobile);
                        }
                        //患者所在地
                        if(provinceId !== ""){
                            $('.au-perfectInfoList').find('.au-perfectInfoItem[data-type=5]').addClass('active').find('span').text(province+city+district).attr({
                                "data-provinceId":provinceId,"data-cityId":cityId,"data-districtId":districtId,
                                "data-province":province,"data-city":city,"data-district":district
                            });
                        }
                        //社保类型
                        if(socialId !== ""){
                            switch (socialId){
                                case 1:
                                    socialText="城镇职工";
                                    break;
                                case 2:
                                    socialText="城镇居民";
                                    break;
                                case 3:
                                    socialText="新农合";
                                    break;
                                case 4:
                                    socialText="商业保险";
                                    break;
                                case 5:
                                    socialText="无";
                                    break;
                            }
                            $('.au-perfectInfoList').find('.au-perfectInfoItem[data-type=6]').addClass('active').attr("data-typeId",socialId).find('.au-protectType').text(socialText).addClass('selected');
                        }
                        //社保所在地
                        if(socialProvinceId !== ""){
                            $('.au-perfectInfoList').find('.au-perfectInfoItem[data-type=7]').addClass('active').find('span').text(socialProvince+socialCity + socialDistrict).attr({
                                "data-socialProvinceId":socialProvinceId,"data-socialCityId":socialCityId,"data-socialDistrictId":socialDistrictId,
                                "data-socialProvince":socialProvince,"data-socialCity":socialCity,"data-socialDistrict":socialDistrict
                            });
                        }
                    }
                }
            })
            t.selectChange();
        },
        //判断必填项是否填写
        quesThreeCheck:function(){
            var t=this,
                _requireActNum=$(".au-perfectInfoItem.active[data-required=1]"),  //必选已填总数
                _requireNum=$(".au-perfectInfoItem[data-required=1]");            //必选总数
            if(_requireActNum&&_requireNum&&_requireActNum.length==_requireNum.length){
                $('.symptom-desc-controller').find('.btn-primary').removeClass("disabled");
            }else{
                $('.symptom-desc-controller').find('.btn-primary').addClass("disabled");
            }
        },
        //个人信息中select的事件及验证
        selectChange: function () {
            var t =this;
            $('.au-perfectInfoItemRight.hasSelect select').on('change',function () {
                var selectVal = $(this).val(),
                    _optionEle=$(this).find('option:selected').data('typeid'),
                    _elType=$(this).data('check');
                $(this).siblings('.show').text(selectVal).addClass('selected');
                $(this).closest('.au-perfectInfoItem').addClass('active');
                //switch (_elType){
                //    case 1:
                //        $('.au-perfectInfoItem[data-type=3]').removeClass('active').find('input').val("");
                //        switch (_optionEle){
                //            case 1:
                //                $(this).closest('.au-perfectInfoItem').attr("data-typeid","1");
                //                break;
                //            case 2:
                //                $(this).closest('.au-perfectInfoItem').attr("data-typeid","2");
                //                break;
                //            case 3:
                //
                //                $(this).closest('.au-perfectInfoItem').attr("data-typeid","5");
                //                break;
                //        }
                //        break;
                //    case 2:
                //        $('.au-perfectInfoItem[data-type=7]').removeClass('active').find('input').val("");
                //        switch (_optionEle){
                //            case 1:
                //                $(this).closest('.au-perfectInfoItem').attr("data-typeid","1");
                //                break;
                //            case 2:
                //                $(this).closest('.au-perfectInfoItem').attr("data-typeid","2");
                //                break;
                //            case 3:
                //                $(this).closest('.au-perfectInfoItem').attr("data-typeid","3");
                //                break;
                //            case 4:
                //                $(this).closest('.au-perfectInfoItem').attr("data-typeid","4");
                //                break;
                //            case 5:
                //                $(this).closest('.au-perfectInfoItem').attr("data-typeid","5");
                //                break;
                //        }
                //        break;
                //}
                t.quesThreeCheck();
            });
        },
        //个人信息的input的验证
        inputVerify : function () {
            var t = this;
            $('.au-perfectInfoList').find('input').blur(function(){
                var _cureName=$(this).val()
                //表单验证
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
                t.quesThreeCheck();
            });
        },



        //点击路由
        btnClick:function(){
            var t = this;
            //主要症状和伴随症状点击弹层
            $("#ev-mainSymptom,#ev-accoSymptom").on("click",".tc-caseDescribeItem[data-type]",function(){
                $(this).addClass("ev-symptom-change");
                Q.go('symptomChange');
            })
            //点击选择医院
            $("#ev-choose-hospital").on("click", function () {
                Q.go('hospital');
            });
            //点击选择疾病
            $("#ev-choose-disease").on("click", function () {
                Q.go('disease')
            })
            //既往史点击调取方法
            $("#ev-pastHistory").on("click",".tc-caseDescribeItem",function(){
                Q.go('PMHChange')
            })
            //点击更改基本信息
            $("#ev-baseInform").on("click",".tc-caseDescribeItem",function(){
                Q.go('baseInformChange')
            })
            //点击患者所在地
            $("#ev-choose-homeadd").on("click", function () {
                Q.go('homecity');
            });
            //点击社保所在地
            $("#ev-choose-socialadd").on("click", function () {
                Q.go('socialcity');
            });
            //点击取消选择列表
            $(".btn-hollow").on("click",function(){
                Q.go('index');

            })
            //点击确定替换问诊单
            $(".btn-primary").on("click",function(){
                if($(this).hasClass("disabled")){

                }else{
                    Q.go('sureIndex');
                }
            })
            //点击提交复诊单
            $(".submit_symptom").on("click",function(){
                var t = this;
                var param = {
                    patientId:"",
                    caseType:1,
                    customerId:"",
                    visitSiteId:"",
                    optionList:[
                        {
                            partId:"",
                            questionId:"",
                            optionIdList:"",
                            mainOptionId:""
                        }
                    ],
                    patientName:"",
                    provinceId:"",
                    province:"",
                    cityId:"",
                    city:"",
                    districtId:"",
                    district:"",
                    socialProvinceId:"",
                    socialProvince:"",
                    socialCityId:"",
                    socialCity:"",
                    socialDistrictId:"",
                    socialDistrict:"",
                    socialId:"",
                    oldCaseAttIdList:"",
                    caseAttIdList:""
                }
                $.ajax({
                    url: t.path.returnVisitSubmit,
                    type:"POST",
                    timeout:5000,
                    dataType:"json",
                    data:{paramJson: $.toJSON(param)},
                    success:function(){

                    }
                })
            })
        }
    }
    reviceSymptom.init();
})


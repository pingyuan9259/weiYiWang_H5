/**
 * 功能描述：健康信息模块
 * 使用方法:
 * 注意事件：
 * 引入来源：
 *     作用：
 *
 * Created by JuKun on 2017/3/2.
 */
$(function () {
    var container = {
        op: {},
        path: {
            upData:'http://m.tocure.cn/mcall/customer/patient/case/v1/update/',   //保存曾就诊信息
            history: 'http://m.tocure.cn/mcall/cms/case/history/v1/getMapList/',  //既往史标签
            historyPatient: 'http://m.tocure.cn/mcall/customer/patient/case/history/v1/getMapList/',  //患者既往史
            PatientSubmit: 'http://m.tocure.cn/mcall/customer/patient/case/history/v1/create/',       //保存患者既往史
            cardType:'http://m.tocure.cn/mcall/comm/data/social/security/v1/getTotalMapList/',        //证件类型
            baseInfo:'http://m.tocure.cn/mcall/customer/patient/baseinfo/v1/getMapList/',             //个人信息
            submit: 'http://m.tocure.cn/mcall/customer/patient/baseinfo/v1/create/'                   //保存患者信息
        },
        init: function () {
            var _t = this;
            _t.localSave();
            _t.firstLoad();
            _t.cardTypeLoad();
            _t.selectClick();
        },
        //--start:逻辑部分
        //本地缓存处理
        localSave:function(){
            var caseId="1564546656";
            var _t=this,
                _localDataHospital=JSON.parse(localStorage.getItem("hospitalInfo"+caseId)),
                _localDataDisease=JSON.parse(localStorage.getItem("diseaseInfo"+caseId));
              if(_localDataHospital != null){
                  $("#ev-go-to-select-hospital").attr({
                      "data-name":_localDataHospital.hospital,
                      "data-id":_localDataHospital.hospitalId
                  }).text(_localDataHospital.hospital).addClass('selected').parent().addClass('selected');
                  $("#ev-go-to-select-hospital").closest('.he-cureAsk').find('.unusable').hide().siblings('.usable').show();
              }
              if(_localDataDisease != null){
                  $("#ev-go-to-select-disease").attr({
                      "data-name":_localDataDisease.disease,
                      "data-id":_localDataDisease.diseaseId
                  }).text(_localDataDisease.disease).addClass('selected').parent().addClass('selected');
                  $("#ev-go-to-select-disease").closest('.he-cureAsk').find('.unusable').hide().siblings('.usable').show();

              }
        },
        //既往史数据
        firstLoad: function () {
            var _t = this;
            var _data={
                patientId:"1441561678652",	//string	是	患者id
                isValid:"",	    //string	是	是否有效1-有效0-无效
                firstResult:"",	//string	是	分页参数
                maxResult:""	//string	是	分页参数
            };
            _t.callAjax({
                path: _t.path.history,
                data:_data,
                callBack:function(data){
                    //处理返回数据
                    if(data&&data.responseObject&&data.responseObject.responseData){
                        var _dataList=data.responseObject.responseData.dataList;
                        $.each(_dataList,function(i,val){
                            var _hv=_t.template.firstHtml(val);
                            $('.he-cureHisItem[data-historytype='+val.historyType+']').find('.he-cureHisItemBottom').prepend(_hv);
                        });
                        //$('.he-cureHistory').append(_hv);
                        _t.historyPatient();
                    }
                }
            })
        },
        //患者既往史数据
        historyPatient:function(){
            var _t = this;
            var _data={
                //patientId:"1441561678652",	//string	是	患者id
                //caseId:"1441561678652",                  //string	是	病例id
                //sortType:"2",	            //string	是	排序2-时间倒序
                //isValid:"1",	            //string	是	是否有效1-有效0-无效
                firstResult:"10",	            //string	是	分页参数
                maxResult:"9990"	            //string	是	分页参数
            };
            _t.callAjax({
                path: _t.path.historyPatient,
                data:_data,
                callBack:function(data){
                    //处理返回数据
                    if(data&&data.responseObject&&data.responseObject.responseData){
                        var reData=data.responseObject.responseData.dataList;
                        $.each(reData,function (index,element) {
                            var container = $(".he-cureHisItem[data-historyType='"+ element.caseHistoryType +"']");
                            var caseHistoryIdList = element.caseHistoryIdList.split(",");//标签id串
                            var caseHistoryDesc = element.caseHistoryDesc;//每个既往史下面的描述
                            //赋值六种病史下面的描述
                            if (element.caseHistoryIdList !== '') {
                                container.find('.he-cureHisItemInfo textarea').val(caseHistoryDesc);
                                container.find('.he-cureHisItemInfo').show();
                            }
                            $.each(caseHistoryIdList,function (index,element) {
                                container.find('span[data-historyId='+ element +']').addClass('active');
                            });
                        });
                    }
                }
            })
        },
        //既往史的保存
        saveHistoryInfo: function (Obj) {
            //定义需要需要传的参数
            var _t = this,
                data = {};
            data.caseId = '1441561678652',
                data.patientId = "1441561678652",
                data.operatorId = '',//操作人
                data.operatorType = "0",
                data.caseHistoryList = []; //保存既往史的数组
            $('.he-cureHisItem').each(function (index,element) {
                var obj = {};
                obj.caseHistoryType = $(element).data('historytype');
                obj.caseHistoryDesc = $.trim($(element).find(".he-cureHisItemInfo textarea").val());
                obj.caseHistoryIdList = [];
                obj.caseHistoryName = [];
                $($(element).find('.he-cureHisItemBottom .active')).each(function (ind ,ele) {
                    obj.caseHistoryName.push($(ele).text());
                    obj.caseHistoryIdList.push($(ele).data('historyid'));
                });
                obj.caseHistoryIdList = obj.caseHistoryIdList.join(",");
                obj.caseHistoryName = obj.caseHistoryName.join(",");
                data.caseHistoryList.push(obj);
            });
            data.caseHistoryList = JSON.stringify(data.caseHistoryList);
            _t.callAjax({
                data:data,
                path:_t.path.PatientSubmit,
                callBack:function(data){
                    console.log(data);
                }
            });
        },
        //社保类型
        cardTypeLoad:function(){
            var _t = this;
            var _data={
                //patientId:"1441561678652",	     //string	是	患者id
                //isValid:"1",	    //string	是	是否有效1-有效0-无效
                firstResult:"10",	//string	是	分页参数
                maxResult:"9999"	//string	是	分页参数
            };
            _t.callAjax({
                path: _t.path.cardType,
                data:_data,
                callBack:function(data){
                    //处理返回数据
                    if(data&&data.responseObject&&data.responseObject.responseData){
                        var _dataList=data.responseObject.responseData.dataList[0],
                            _social=_dataList.social,
                            _role=_dataList.role;
                       $('.he-perfectInfo').find('.he-cardTypeBox select').append(_t.template.cardTypeHtml(_role));    //证件类型
                       $('.he-perfectInfo').find('.he-protectTypeBox select').append(_t.template.cardTypeHtml(_social));  //社保类型
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
                path: _t.path.baseInfo,
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
                        if(patientId !== ""){
                            $('.he-perfectInfo').find('.he-perfectInfoItem[data-type=1]').addClass('active').find('input').val(patientName).attr("data-patientId",patientId);
                        }
                        //证件类型
                        if(certificateId !== ""){
                            var _text=$('.he-perfectInfoItem[data-type=2]').find('option[data-typeid='+certificateId+']').val();
                            $('.he-perfectInfoItem[data-type=2]').find('.he-cardType').text(_text).addClass('selected');
                            $('.he-perfectInfo').find('.he-perfectInfoItem[data-type=2]').addClass('active').attr("data-typeid",certificateId);
                        }
                        //证件号码
                        if(certificateCode !== ""){
                            $('.he-perfectInfo').find('.he-perfectInfoItem[data-type=3]').addClass('active').find('input').val(certificateCode);
                        }
                        //联系电话
                        if(mobile !== ""){
                            $('.he-perfectInfo').find('.he-perfectInfoItem[data-type=4]').addClass('active').find('input').val(mobile);
                        }
                        //患者所在地
                        if(provinceId !== ""){
                            $('.he-perfectInfo').find('.he-perfectInfoItem[data-type=5]').addClass('active').find('input').val(province+city+district).attr({
                                "data-provinceId":provinceId,"data-cityId":cityId,"data-districtId":districtId,
                                "data-province":province,"data-city":city,"data-district":district
                            });
                        }
                        //社保类型
                        if(socialId !== ""){
                            var _socialText=$('.he-perfectInfoItem[data-type=6]').find('option[data-typeid='+socialId+']').val();
                            $('.he-perfectInfoItem[data-type=6]').find('.he-protectType').text(_socialText).addClass('selected');
                            $('.he-perfectInfo').find('.he-perfectInfoItem[data-type=6]').addClass('active').attr("data-typeid",socialId);
                        }
                        //社保所在地
                        if(socialProvinceId !== ""){
                            $('.he-perfectInfo').find('.he-perfectInfoItem[data-type=7]').addClass('active').find('input').val(socialProvince+socialCity+socialDistrict).attr({
                                "data-socialProvinceId":socialProvinceId,"data-socialCityId":socialCityId,"data-socialDistrictId":socialDistrictId,
                                "data-socialProvince":socialProvince,"data-socialCity":socialCity,"data-socialDistrict":socialDistrict
                            });
                        }
                        _t.dealPageClick();
                    }
                }
            })
        },
        //处理页面点击事件
        dealPageClick: function () {
            var _t = this;
            //判断下一步是否可点
            _t.quesThreeCheck();
            //下一步按钮点击事件
            $('.he-questionListBox').find('.downBtn').on("click", function () {
                var _questType = $(this).closest('.he-questionListItem').data('type');
                switch (_questType) {
                    case 1:
                        _t.quesOneClick($(this));
                        break;
                    case 2:
                        _t.quesTwoClick($(this));
                        break;
                    case 3:
                        _t.quesThreeClick($(this));
                        break;
                }
            });
            //上一步按钮点击事件
            $('.he-questionListBox').find('.upBtn').on("click", function () {
                var _questType = $(this).closest('.he-questionListItem').data('type');
                $(this).closest('.he-questionListItem').hide().prev().show();
            });
            //处理单选点击事件
            $('.he-cureAsk').find('.he-cureAskCheckViewBtn').on("click", function () {
                $(this).find('.he-cureAskCheckBtn').addClass('tc-selected');
                $(this).siblings().find('.he-cureAskCheckBtn').removeClass('tc-selected');
                if ($(this).hasClass('he-cureAskConfirmNo')) {
                    //没看过
                    $(this).parent().siblings('.he-cureAskList').hide();
                    $(this).closest('.he-cureAsk').find('.usable').show().siblings('.unusable').hide();
                    $(this).closest('.he-cureAsk').find('.he-cureAskQuestion').addClass('notView');
                } else {
                    //看过
                    $(this).parent().siblings('.he-cureAskList').show();
                    if($(this).parent().siblings('.he-cureAskList').children('.he-cureAskItem.selected').length==0){
                        $(this).closest('.he-cureAsk').find('.usable').hide().siblings('.unusable').show();
                    }
                    $(this).closest('.he-cureAsk').find('.he-cureAskQuestion').removeClass('notView');
                }
            });
            //标签云题型处理页面内选择事件
            $('.he-cureHistory').find('.he-cureHisItemBottom span').on("click", function () {
                $(this).toggleClass('active');
                var _element = $(this).parent().find('.active');
                if (_element.length > 0) {
                    $(this).parent().siblings('.he-cureHisItemInfo').show();
                } else {
                    $(this).parent().siblings('.he-cureHisItemInfo').hide();
                }
            });
            //输入框事件
            common.textChange({
                "$tex": $('.he-cureHistory').find('.he-cureHisItemInfo textarea'),
                "$num": $('.al-scorePagePopBox').find('.al-NumPrompt'),
                "noTop": 1,
                "numTip": 10
            });
            //select选择框事件
            $('.he-perfectInfo').find('.he-perfectInfoItem').find('select').on("change",function(){
                var selectVal=$(this).val(),
                    _optionEle=$(this).find('option:selected').attr('data-typeid'),
                    _elType=$(this).data('check');
                $(this).siblings().text(selectVal).addClass('selected');
                $(this).closest('.he-perfectInfoItem').addClass('active');
                switch (_elType){
                    case 1:
                        $('.he-perfectInfoItem[data-type=3]').removeClass('active').find('input').val("");
                        switch (_optionEle){
                            case "1":
                                $(this).closest('.he-perfectInfoItem').attr("data-typeid","1");
                                break;
                            case "2":
                                $(this).closest('.he-perfectInfoItem').attr("data-typeid","2");
                                break;
                            case "5":
                                $(this).closest('.he-perfectInfoItem').attr("data-typeid","5");
                                break;
                        }
                        break;
                    case 2:
                        $('.he-perfectInfoItem[data-type=7]').removeClass('active').find('input').val("");
                        switch (_optionEle){
                            case "1":
                                $(this).closest('.he-perfectInfoItem').attr("data-typeid","1");
                                break;
                            case "2":
                                $(this).closest('.he-perfectInfoItem').attr("data-typeid","2");
                                break;
                            case "3":
                                $(this).closest('.he-perfectInfoItem').attr("data-typeid","3");
                                break;
                            case "4":
                                $(this).closest('.he-perfectInfoItem').attr("data-typeid","4");
                                break;
                            case "5":
                                $(this).closest('.he-perfectInfoItem').attr("data-typeid","5");
                                break;
                        }
                        break;
                }
                _t.quesThreeCheck();
            });
            //第三题input实时监听事件
            $('.he-perfectInfo').find('input').on("keyup",function(){
               if ($(this).val().length==0){
                   $('.he-perfectInfo').find('.next').attr("disabled","disabled").addClass('disabled');
               }else{
                   //$('.he-perfectInfo').find('.next').removeAttr("disabled").removeClass('disabled');
               }
            });
            //第三题input失去焦点事件
            $('.he-perfectInfo').find('input').blur(function(){
                var _quesType=$(this).closest('.he-perfectInfoItem').data('type'),
                    _cureName=$(this).val(),
                    _text='';
                //表单验证
                switch (_quesType){
                    case 1://姓名
                        if(_cureName.length>0){
                            $(this).validate({
                                errorEle: function(msg){
                                    common.popup({
                                        text:msg
                                    })
                                },
                                rules: [{
                                    rule: "normalString",
                                    msg: "请输入有效的姓名"
                                }]
                            });
                            $(this).closest('.he-perfectInfoItem').addClass('active');
                        }else{
                            $(this).closest('.he-perfectInfoItem').removeClass('active');
                        }
                        break;
                    case 2://证件类型
                        break;
                    case 3:
                        _text="证件号不能为空";
                        var _cardType=$(this).closest('.he-perfectInfoItem').prev().attr('data-typeid');
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
                                    $(this).closest('.he-perfectInfoItem').addClass('active');
                                }else{
                                    $(this).closest('.he-perfectInfoItem').removeClass('active');
                                }
                                break;
                            case "2":
                                //军官证验证
                                if(_cureName.length>0){
                                    $(this).closest('.he-perfectInfoItem').addClass('active');
                                }else{
                                    $(this).closest('.he-perfectInfoItem').removeClass('active');
                                }
                                break;
                            case "3":
                                //护照验证
                                if(_cureName.length>0){
                                        $(this).closest('.he-perfectInfoItem').addClass('active');
                                }else{
                                    $(this).closest('.he-perfectInfoItem').removeClass('active');
                                }
                                break;
                        }
                        break;
                    case 4: //手机号
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
                                $(this).closest('.he-perfectInfoItem').addClass('active');
                            }else {
                                $(this).closest('.he-perfectInfoItem').removeClass('active');
                            }
                        }else{
                            $(this).closest('.he-perfectInfoItem').removeClass('active');
                        }
                        break;
                    case 5: //患者所在地区
                        if(_cureName.length>0){
                            $(this).closest('.he-perfectInfoItem').addClass('active');
                            //if($(this).attr('data-validate')=="true"){
                            //    $(this).closest('.he-perfectInfoItem').addClass('active');
                            //}else {
                            //    $(this).closest('.he-perfectInfoItem').removeClass('active');
                            //}
                        }else{
                            $(this).closest('.he-perfectInfoItem').removeClass('active');
                        }
                        break;
                }
                _t.quesThreeCheck();
            });
        },
        //第一题check提交数据
        quesOneClick: function (one) {
            var _t=this,
                _element = one.parent().siblings('.he-cureAskQuestion'),
                _elementData = one.parent().siblings('.he-cureAskList'),
                _quesIndex = one.closest('.he-questionListItem').index() + 1;   //当前题索引;
            if (_element.hasClass('notView')) {
                //not check and next question show
                if (_quesIndex < 3) {
                    one.closest('.he-questionListItem').hide().next().show();
                }
            } else {
                //check mandatory
                if ($('.he-cureAskItem.tc-hospital').hasClass('selected')) {
                    if ($('.he-cureAskItem.tc-illnessName').hasClass('selected')) {
                        //mandatory must complete. show next question and submit data
                        if (_quesIndex < 3) {
                            var _data={
                                caseId:'',	              // string	是	病例id
                                caseAttIdList:'',         //	string	是	附件id串
                                treatment_hospital_id:_elementData.find('#ev-go-to-select-hospital').attr("data-id"),   //	string	是	曾治疗医院id
                                treatment_hospital:_elementData.find('#ev-go-to-select-hospital').attr("data-name"),    //	string	是	曾治疗医院
                                illness_history_id:_elementData.find('#ev-go-to-select-disease').attr("data-id"),	    // string	是	曾确诊疾病id
                                illness_history	:_elementData.find('#ev-go-to-select-disease').attr("data-name")        //	string  是	曾确诊疾病
                            };
                            _t.callAjax({
                                data:_data,
                                path:_t.path.upData,
                                callBack:function(){
                                    one.closest('.he-questionListItem').hide().next().show();
                                }
                            }); //save data
                        }
                    } else {
                        common.popup({
                            text: "疾病名称不能为空！"
                        })
                    }
                } else {
                    common.popup({
                        text: "医院名称不能为空！"
                    })
                }
            }
        },
        //第二题check提交数据
        quesTwoClick: function (two) {
            var _t=this,
                _quesIndex = two.closest('.he-questionListItem').index() + 1,   //当前题索引;
                otherQues = two.closest('.he-questionListItem').find('.he-cureOther.active');
            console.log("2");
            //显示下一题
            if (_quesIndex < 3) {
                var textArray = $('.he-cureHisItemBottom').find('.active').parent().siblings('.he-cureHisItemInfo').children();
                console.log(textArray);
                if (0 === textArray.length) {
                    // that.saveHistoryInfo();//保存既往史信息
                    _t.saveHistoryInfo();
                    two.closest('.he-questionListItem').hide().next().show();
                } else {
                    var isEmpty = 1;
                    $.each(textArray,function (index,element) {
                        console.log(element);
                        var textVal = $(element).val();
                        if ($.trim(textVal) == '') {
                            common.popup({
                                text:'请完善信息'
                            });
                            $(element).focus();
                            isEmpty = 0;
                            return false;
                        } else {

                        }
                    });
                    if (isEmpty) {
                        _t.saveHistoryInfo();//保存既往史信息
                        two.closest('.he-questionListItem').hide().next().show();
                    }
                }
            } else {
                console.log("提交");
            }
        },
        //第三题check提交数据
        quesThreeClick: function (three) {
            var _t=this;
            var _quesIndex = three.closest('.he-questionListItem').index() + 1;   //当前题索引;
            console.log("3");
            var _data={
                patientName:$('.he-perfectInfoItem[data-type=1]').find('input').val(),                  //患者名称
                patientId:$('.he-perfectInfoItem[data-type=1]').find('input').attr("data-patientId"),   //患者ID
                certificateId:$('.he-perfectInfoItem[data-type=2]').attr("data-typeid"),                //证件类型ID
                certificateCode:$('.he-perfectInfoItem[data-type=3]').find('input').val(),              //证件号码
                mobile:$('.he-perfectInfoItem[data-type=4]').find('input').val(),                       //手机号码
                province:$('.he-perfectInfoItem[data-type=5]').find('input').attr("data-province"),       //所在地省
                provinceId:$('.he-perfectInfoItem[data-type=5]').find('input').attr("data-provinceId"),   //所在地省ID
                city:$('.he-perfectInfoItem[data-type=5]').find('input').attr("data-city"),               //所在地市
                cityId:$('.he-perfectInfoItem[data-type=5]').find('input').attr("data-cityId"),           //所在地市ID
                district:$('.he-perfectInfoItem[data-type=5]').find('input').attr("data-district"),       //所在地区/县
                districtId:$('.he-perfectInfoItem[data-type=5]').find('input').attr("data-districtId"),   //所在地区/县ID
                socialId:$('.he-perfectInfoItem[data-type=6]').attr("data-typeid"),                       //社保类型ID
                socialProvince:$('.he-perfectInfoItem[data-type=7]').find('input').attr("data-socialProvince"),       //社保省
                socialProvinceId:$('.he-perfectInfoItem[data-type=7]').find('input').attr("data-socialProvinceId"),   //社保省ID
                socialCity:$('.he-perfectInfoItem[data-type=7]').find('input').attr("data-socialCity"),               //社保市
                socialCityId:$('.he-perfectInfoItem[data-type=7]').find('input').attr("data-socialCityId"),           //社保市ID
                socialDistrict:$('.he-perfectInfoItem[data-type=7]').find('input').attr("data-socialDistrict"),       //社保区/县
                socialDistrictId:$('.he-perfectInfoItem[data-type=7]').find('input').attr("data-socialDistrictId")    //社保区/县ID
            };
            //显示下一题
            if (_quesIndex < 3) {
                three.closest('.he-questionListItem').hide().next().show();
            } else {
                _t.callAjax({
                    data:_data,
                    path:_t.path.submit,
                    callBack:function(data){
                        window.location.href='/pages/imScene/im_main_scene.html'
                    }
                })
            }
        },
        //第三题提交check必填数量
        quesThreeCheck:function(){
            var _t=this,
                _requireActNum=$('.he-perfectInfo').find(".he-perfectInfoItem.active[data-required=1]"),  //必选已填总数
                _requireNum=$('.he-perfectInfo').find(".he-perfectInfoItem[data-required=1]");            //必选总数
            if(_requireActNum&&_requireNum&&_requireActNum.length==_requireNum.length){
                $('.he-perfectInfo').find('.next').removeAttr("disabled").removeClass('disabled');
            }else{
                $('.he-perfectInfo').find('.next').attr("disabled","disabled").addClass('disabled');
            }
        },
        selectClick:function(){
            var caseId="1564546656";
            Q.reg('index', function () {
                console.log("进入主页...");
            });
            //选择就诊医院
            Q.reg('hospital', function () {
                modules.searchList({
                    targetEle: $("#ev-go-to-select-hospital"),
                    type: "hospital",
                    level:"2",
                    finalLevel:"4",
                    noResultCallback:function () {

                    },
                    backCallback:function(){
                        $("#ev-go-to-select-hospital").addClass('selected').parent().addClass('selected');
                        $("#ev-go-to-select-hospital").closest('.he-cureAsk').find('.unusable').hide().siblings('.usable').show();
                        var _data={
                            hospital:$("#ev-go-to-select-hospital").attr("data-name"),
                            hospitalId:$("#ev-go-to-select-hospital").attr("data-id")
                        };
                        localStorage.setItem("hospitalInfo"+caseId, JSON.stringify(_data));
                        $(".he-cureAsk").find()
                    }
                })
            });
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
                        $("#ev-go-to-select-city").val(_province+_city+_district).closest('.he-perfectInfoItem').addClass('active');
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
                        $("#ev-go-to-select-perfect").val(_province+_city+_district).closest('.he-perfectInfoItem').addClass('active');
                    }
                })
            });
            //确诊疾病选择
            Q.reg('disease', function () {
                modules.searchList({
                    targetEle: $("#ev-go-to-select-disease"),
                    type: "disease",
                    noResultCallback:function () {

                    },
                    backCallback:function(){
                        $("#ev-go-to-select-disease").parent().addClass('selected');
                        $("#ev-go-to-select-disease").closest('.he-cureAsk').find('.unusable').hide().siblings('.usable').show();
                        var _data={
                            disease:$("#ev-go-to-select-disease").attr("data-name"),
                            diseaseId:$("#ev-go-to-select-disease").attr("data-id")
                        };
                        localStorage.setItem("diseaseInfo"+caseId, JSON.stringify(_data));
                    }
                })
            });
            Q.go('index');
            Q.init({
                index: 'index'/* 首页地址 */,
            });
            //医院
            $("#ev-go-to-select-hospital").on("click", function () {
                Q.go('hospital', function (a) {});
            });
            //疾病
            $("#ev-go-to-select-disease").on("click", function () {
                Q.go('disease', function () {})
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
        //Dome部分
        template:{
            firstHtml: function (hv) {
                var _t = this,
                    _listHtml = '';
                _listHtml +='<span data-historyId="'+hv.historyId+'">'+hv.historyName+'</span>';
                return _listHtml;
            },
            cardTypeHtml: function (sv) {
                var _t = this,
                    _html = '';
                $.each(sv, function (i, val) {
                    _html += '<option value="'+val.certificateName+'" data-typeid="'+val.certificateId+'">'+val.certificateName+'</option>';
                });
                return _html;
            }
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
    container.init();
});

modules.upLoadFiles();
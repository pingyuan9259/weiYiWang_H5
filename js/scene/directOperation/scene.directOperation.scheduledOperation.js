/**
 * @name:
 * @desc:
 * @example:
 * @depend:
 * @date: 2017/03/01
 * @author: lichenyang
 */
$(function() {
	var controller = {

		config: {

		},
		path: {
            saveOperation:'http://m.tocure.cn/mcall/customer/patient/reservation/v1/create/'
		},
		init: function() {
            var that = this;
            that.routeControl();
            that.pageClick();
		},
        //页面路由控制
        routeControl : function () {
            Q.reg('index', function () {
                console.log("进入主页...");
            });
            Q.go('index');
            //初始化路由
            Q.init({
                index: 'index'/* 首页地址 */,
            });
            Q.reg('city', function () {
                modules.searchList({
                    targetEle: $(".operationArea .show"),
                    type: "city",
                    level:"2",
                    finalLevel:"4",
                    backCallback:function () {
                        $(".operationArea .show").addClass('selected')
                        alert('成功了');
                    }
                })
            });
            //跳到选择疾病的路由该干的事
            Q.reg('illness', function () {
                modules.searchList({
                    targetEle: $(".operationName .show"),
                    type: "illness"
                })
            });
        },

        //页面点击函数
        pageClick: function() {
            var t =this;
            //询问是否看过医生添加点击事件
			$(".sc-infoAskConfirm").on("click",".sc-infoAskConfirmList",function() {
                //判断用户是否点击是，则弹出搜寻医生的步骤
                if ($(this).hasClass('sc-infoAskConfirmYes')){
                    alert("弹出搜寻医生的步骤！！");
                    $('.sc-selectDoctor').show();
                } else {
                    $('.sc-selectDoctor').hide();
                }
                //切换选中
                if($(this).hasClass('on')) {
                    return false;
                } else {
                    $(this).addClass('on');
                    $(this).siblings().removeClass('on');
				}
			});

            //选择手术名称的点击事件
            $('.sc-infoItem .operationName').on('click',function () {
                alert("我要选择手术！！");
                //调到选择手术的路由
                Q.go('illness', function () {

                });
            });

            // 期望手术时间select点击值付给span,并给span设置data-id
            $('.sc-infoItemRight.hasSelect select').on('change',function () {
                var selectVal = $(this).val();
                $(this).siblings('.show').text(selectVal).addClass('selected');
                $(this).siblings('.show').attr('data-id',$(this).find(':selected').data('id'));
                console.log($(this).find(':selected').data('id'));
                //判断提交按钮是否可以点击函数
                t.buttonClick();
            });

            //给选择医生里点击修改添加按钮
            $('.sc-selectDoctor .modify').on('click',function () {
                alert("弹出搜寻医生的步骤！！");
            });

            //选择期望手术地区的点击
            $('.sc-infoItem .operationArea').on('click',function () {
                alert("我要选择手术地区！！");
                Q.go('city', function () {

                });
            });

            //提交按钮的事件，表单验证给提交按钮添加disabled属性
            $('#infoBtn').on('click',function () {
                t.saveOperationInfo();
            })
		},

	    //添加判断按钮是否可以点击的函数
        buttonClick : function () {
            var requiredArray = $('.sc-infoItem[data-required="1"]').find('.sc-infoItemRight .show');
            var flag = 1;
            $.each(requiredArray,function (index,element) {
                if (!$(element).hasClass('selected')) {
                    flag = 0;
                }
            });
            if (flag) {
                $('#infoBtn').removeAttr('disabled');
            }
        },

        //保存页面信息
        saveOperationInfo : function () {
            alert('我要提交！！');
            var that = this;
            var data = {};
            data.patientId = '';
            data.caseId = '';
            data.operationId = $("[data-type='operationName'] .show").text();
            data.operationName = $("[data-type='operationName'] .show").data('id');
            data.expectedTime = $("[data-type='expectedTime'] .show").data('id');
            data.provinceId = $("[data-type='area'] .show").data("provinceid");
            data.province = $("[data-type='area'] .show").data("province");
            data.cityId = $("[data-type='area'] .show").data("cityid");
            data.city = $("[data-type='area'] .show").data("city");
            data.districtId = $("[data-type='area'] .show").data("districtid");
            data.district = $("[data-type='area'] .show").data("district");
            if ($(".sc-infoAskConfirm .sc-infoAskConfirmList.on").hasClass('sc-infoAskConfirmYes')) {
                data.doctorId = $("[data-type='doctor'] .show").data("doctorid");
            }
            var params = {paramJson:$.toJSON(data)};
            $.ajax({
                url: that.path.saveOperation,
                type: 'POST',
                dataType: "json",
                data: params,
                success: function (data) {
                    window.location.href = "http://m.tocure.cn/pages/imScene/im_main_scene.html";
                },
                fail :function (data) {

                }
            })
        }


	};

	controller.init();

});
/**
 * @name:
 * @desc:
 * @example:
 * @depend:
 * @date: 2017/3/2
 * @author: wangjingrong
 */
$(function(){
    var orderHisList = {
        config:{
            userId:localStorage.getItem("userId"),
            historyType:2//1.预约历史，2.咨询历史
        },
        path:{
            cancelOrder:'',//取消咨询
            getHisList:''//咨询历史接口
        },
        init:function(){
            var t = this;
            t.addHtml();
            t.btnClick();
        },
        addHtml:function(){
            var t = this;
            $.ajax({
                url: t.path.getHisList,
                type:"POST",
                timeout:5000,
                async:true,
                data:{
                    uesrId: t.config.userId,
                    historyType: t.config.historyType
                },
                dataType:"json",
                success:function(data){
                    var orderHtml="";
                    if(data&&data.responseData&&data.responseData.dataList){
                        var items = data.responseData.dataList;
                        for(var i=0;i<items.length;i++){
                            var dataItems = items[i],
                                customerStatue = dataItems.customerStatuesNum,//问诊人状态
                                buttonBox = '',//按钮状态
                                docHeadImg = dataItems.docLogoUrl?dataItems.docLogoUrl:'/image/img00/myServices/doctor_portrait.png';//医师头像
                            if(dataItems.docType==1){
                                switch (customerStatue){
                                    case 0:
                                        buttonBox = '<button class="btn-green" id="ev_btn_cancel">取消</button>';
                                        break;
                                    case 1:
                                        buttonBox = '';
                                        break;
                                    case 2:
                                        buttonBox = '<button class="btn-green">上传片子</button>';
                                        break;
                                    case 3:
                                        buttonBox = '<button class="btn-green">初诊建议</button>';
                                        break;
                                }
                            }else if(dataItems.docType==2){
                                switch (customerStatue){
                                    case 0:
                                        buttonBox = '<button class="btn-gray">取消</button><button class="btn-green">去支付</button>';
                                        break;
                                    case 1:
                                        buttonBox = '<button class="btn-gray">取消</button>';
                                        break;
                                    case 2:
                                        buttonBox = '<button class="btn-green">评价反馈</button>';
                                        break;
                                    case 3:
                                        buttonBox = '<button class="btn-green">评价反馈</button>';
                                        break;
                                }
                            }
                            orderHtml += '<section class="orderHistoryItem" data-cusId="'+dataItems.customerId+'">'+
                                    '<div class="orderHisItemTop">'+
                                    '<div class="doctorInfo left">'+
                                    '<img src="'+docHeadImg+'" alt="医师头像">'+
                                    '<span class="">'+dataItems.author+'</span>'+
                                    '<span class="">'+dataItems.author+'</span>'+
                                    '<span class="">'+dataItems.medicalTitleShow+'</span>'+
                                    '</div>'+
                                    '<div class="doctorState right '+(customerStatue==1||customerStatue==5?"font-gray":"")+'">'+dataItems.customerStatues+'</div>'+
                                    '</div>'+
                                    '<div class="orderHistoryItemCenter">'+
                                    '<p class="">问诊人：<span>'+dataItems.author+'</span></p>'+
                                    '<p class="">问诊主诉：<span>'+dataItems.author+'</span></p>'+
                                    '</div>'+
                                    '<div class="orderHistoryItemBottom">'+
                                    '<div class="orderHisItemBottomLeft left">'+
                                    '<span>'+dataItems.lastTime+'</span>'+
                                    '<span>免费咨询</span>'+
                                    '</div>'+
                                    '<div class="orderHisItemBottomRight right">'+
                                    buttonBox+
                                    '</div>'+
                                    '</div>'+
                                    '</section>'
                            bookingHtml += ''
                        }
                    }else{
                        orderHtml = '<section class="noFriendText">'+
                            '<p>您还没有任何记录</p>'+
                            '<p>添加关心的人，在线咨询预约，唯医为您开启全新的就医体验</p>'+
                            '</section>'+
                            '<section class="noFriendHref">'+
                            '<a href="">去咨询 &gt;</a>'+
                            '<a href="">直约手术 &gt;</a>'+
                            '</section>'
                    }
                    $(".orderList").html(orderHtml)
                },
                error:function(){
                    alert("网络错误")
                }
            })
        },
        btnClick:function(){
            var t = this;
            $("#ev_btn_cancel").on('click',function(event){
                common.confirmBox({
                    title:"您确认要取消此次问诊吗？",
                    cancel:"确认",
                    ensure:"取消",
                    cancelCallback:function(){
                        var customerId = $(this).parents(".orderHistoryItem").attr("data-cusId");
                        $.ajax({
                            url: t.config.cancelOrder,
                            type:"PUT",
                            timeout:5000,
                            data:{
                                customerId:customerId
                            },
                            dataType:"json",
                            success:function(){
                                $(this).parents(".orderHistoryItem").find(".doctorState").text("已取消").addClass("");
                            },
                            error:function(){}
                        })
                    },
                    ensureCallback:function(){

                    }
                })
                event.stopPropagation();
            })
            $(".orderHistoryItem").on("click",function(){
                //调取历史沟通记录
            })
        }
    }
    orderHisList.init();
})
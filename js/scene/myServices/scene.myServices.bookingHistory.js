/**
 * @name:
 * @desc:
 * @example:
 * @depend:
 * @date: 2017/3/2
 * @author: wangjingrong
 */
$(function(){
    var bookingHisList = {
        config:{
            userId:localStorage.getItem("userId"),
            historyType:1//1.预约历史,2.咨询历史
        },
        path:{
            cancelOrder:'',//取消预约
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
                    var bookingHtml="";
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
                            bookingHtml += '<section class="orderHistoryItem" data-docId="'+dataItems.doctorId+'" data-patientId="'+dataItems.patientId+'">'+
                                '<div class="bookingHisItemTop">'+
                                '<div class="doctorInfo left">'+
                                '<img class="" src="'+docHeadImg+'" alt="门诊预约">'+
                                '<span>'+dataItems.bookingType+'</span>'+
                                '</div>'+
                                '<div class="doctorState right '+(customerStatue==1||customerStatue==5?"font-gray":"")+'">'+dataItems.customerStatues+'</div>'+
                                '</div>'+
                                '<div class="bookingHistoryItemCenter">'+
                                '<p>'+dataItems.bookingType+'</p>'+
                                '<p><span>'+dataItems.bookingType+'</span><span>'+dataItems.bookingType+'</span></p>'+
                                '</div>'+
                                '<div class="bookingHistoryItemBottom">'+
                                '<div class="orderHisItemBottomLeft left">'+
                                '<p><span>就诊人：</span><span>'+dataItems.bookingType+'</span></p>'+
                                '<p><span>'+dataItems.bookingType+'</span></p>'+
                                '</div>'+
                                '<div class="orderHisItemBottomRight right">'+
                                '<button class="btn-gray">取消</button>'+
                                '<button class="btn-green">待支付</button>'+
                                '</div>'+
                                '</div>'+
                                '</section>'
                        }
                    }else{
                        bookingHtml = '<section class="noFriendText">'+
                            '<p>您还没有任何记录</p>'+
                            '<p>添加关心的人，在线咨询预约，唯医为您开启全新的就医体验</p>'+
                            '</section>'+
                            '<section class="noFriendHref">'+
                            '<a href="">去咨询 &gt;</a>'+
                            '<a href="">直约手术 &gt;</a>'+
                            '</section>'
                    }
                    $(".orderList").html(bookingHtml)
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
                    title:"您确认要取消此次预约吗？",
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
                var docId = $(this).attr('data-docId'),patientId = $(this).attr('data-patientId');
                window.location.href = "/design-html/myServices/order_details.html?docId="+docId+"&patientId="+patientId
            })
        }
    }
    bookingHisList.init();
})

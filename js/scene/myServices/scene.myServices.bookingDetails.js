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

        },
        path:{
            getDetailsList:''//预约单详情
        },
        init:function(){
            var t = this;
            t.addHtml();
            t.btnClick();
        },
        addHtml:function(){
            var t = this;
            $.ajax({
                url: t.path.getDetailsList,
                type:"POST",
                timeout:5000,
                async:true,
                data:{
                    docId: comm.getparaNew().docId,
                    patientId: comm.getparaNew().patientId
                },
                dataType:"json",
                success:function(data){
                    var detailsHtml="";
                    if(data&&data.responseData&&data.responseData.dataList){
                        var items = data.responseData.dataList;
                        for(var i=0;i<items.length;i++){
                            var dataItems = items[i],
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
                            detailsHtml += '<section class="orderDetailsUp">'+
                                '<h3>预约单状态：<span>'+dataItems.atatus+'</span></h3>'+
                                '<figure>'+
                                '<figcaption class="left"><img src="'+docHeadImg+'" alt="医师头像"></figcaption>'+
                                '<section class="doctorInforBox left">'+
                                '<h4>'+dataItems.atatus+'</h4>'+
                                '<div>'+dataItems.atatus+'</div>'+
                                '<p>'+dataItems.atatus+'</p>'+
                                '</section>'+
                                '</figure>'+
                                '</section>'+
                                '<section class="orderDetailsDown">'+
                                '<p><span>门诊类型</span><span>'+dataItems.atatus+'</span></p>'+
                                '<p><span>挂号费用</span><span>'+dataItems.atatus+'</span></p>'+
                                '<p><span>就诊时间</span><span>'+dataItems.atatus+'</span></p>'+
                                '<p><span>就诊地点</span><span>'+dataItems.atatus+'</span></p>'+
                                '<p><span>就诊人</span><span>'+dataItems.atatus+'</span></p>'+
                                '<p><span>联系电话</span><span>'+dataItems.atatus+'</span></p>'+
                                '<div><button>取消预约</button><button class="bg-green">诊前咨询</button></div>'+
                                '</section>'
                        }
                    }else{

                    }
                    $(".orderList").html(detailsHtml)
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
                //诊前咨询跳转
            })
        }
    }
    bookingHisList.init();
})

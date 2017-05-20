/**
 * @Desc：查看上传图片列表
 * @Usage:  modules.upPicReview({
 *               content:$('.main-inner'),   //要隐藏掉的容器
 *               picElem:$('.ev-picUpView') //查看图片列表的元素
 *               });
 * @Notify：
 * @Depend：
 *
 * Created by JuKun on 2017/3/9.
 */
modules.upPicReview = function(Obj){
    var container = {
        op:{

        },
        path:{
            picUrl:''
        },
        init:function(){
            var _t=this;
            Obj.picElem.on("click",function(){
                if($('.ev-picUpReview').length>0){
                    $('.ev-picUpReview').show();
                    Obj.content.hide();
                }else{
                    _t.pageOnLoad();
                }
            });
        },
        template:function(tv){
            var _t=this,
                _picListHtml='',
                _picHtml='';
            $.each(tv,function(i,val){
                _picListHtml+='<li class="tc-upLoadItemList"><img src="/image/img00/patientConsult/uploadfilepic.png" alt=""></li>';
            });
            _picHtml+='<section class="tc-upLoadBox ev-picUpReview">'+
                '<section class="tc-upLoadList">'+
                '    <figure class="tc-upLoadTitle">'+
                '        <span class="tc-upLoadTitleName">X光片</span>'+
                '    </figure>'+
                '    <ul class="tc-upLoadItemBox">'+
                '        '+
                '    </ul>'+
                '</section>'+
                '</section>';
            return _picHtml;
        },
        pageOnLoad:function(){
           var _t=this;
            _t.picAjax({
                data:'',
                callBack:function(data){
                    if(data && data.responseObject && data.responseObject.responseData){
                        var _html=_t.template(data.responseObject.responseData);
                        $('body').append(_html);
                        Obj.content.hide();
                    }
                }
            })
        },
        picAjax:function(pv){
            var _t=this,
                params={paramJson: $.toJSON(pv.data)};
            common.loading.show();
            $.ajax({
                url:_t.path.picUrl,
                data:params,
                type:"POST",
                dataType:"json",
                success:function(data){
                    common.loading.hide();
                    pv.callBack(data);
                    console.log(data);
                },
                error:function(){
                    common.loading.hide();
                }
            })
        }
    };
    container.init(Obj);
};


modules.upPicReview({
    content:$('.main-inner'),   //要隐藏掉的容器
    picElem:$('.ev-picUpView')  //查看图片列表的元素
});
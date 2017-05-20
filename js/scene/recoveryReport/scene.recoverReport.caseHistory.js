/**
 * @Desc：问诊单浏览
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by JuKun on 2017/3/9.
 */
$(function(){
   var container={
       op:{

       },
       path:{

       },
       init:function(){
           var _t=this;
           _t.firstLoad();
       },
       firstLoad:function(){
           var _t=this;
       },
       //通用Ajax
       picAjax:function(pv){
           var _t=this,
               params={paramJson: $.toJSON(pv.data)};
           common.loading.show();
           $.ajax({
               url:_t.path,
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
    container.init();
});
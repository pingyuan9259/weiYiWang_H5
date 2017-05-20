/**
 * 功能描述：康复报告模块
 * 使用方法:
 * 注意事件：
 * 引入来源：
 *     作用：
 *
 * Created by JuKun on 2017/2/28.
 */
$(function(){
   var recover={
       op:{
          fileName:[]
       },
       path:{

       },
       init:function(){
           var t=this;
           t.perInfo();
           //t.fileUpload();
           modules.upLoadFiles();//加载上传方法
           t.initialize();
       },
       //Dome结构模块
       personalHtml:function(){
           return '<li class="tc-baseInfoItem">'+
               '<div class="tc-baseInfoItemLeft"><img src="/image/img00/patientConsult/person_icon.png" alt="">'+
               '<span class="tc-personIcon"></span></div><div class="tc-baseInfoItemRight"><span class="tc-baseInfoName">李铁根</span>'+
               '<span class="tc-baseInfoDate">2017年1月23日</span><a href="" class="tc-goCase">问诊病例</a></div></li>'+
               '<li class="tc-baseInfoItem"><div class="tc-baseInfoItemLeft"><span>初步诊断</span></div><div class="tc-baseInfoItemRight">'+
               '<span>双喜类风湿性关节炎</span></div></li><li class="tc-baseInfoItem"><div class="tc-baseInfoItemLeft"><span>初诊医生</span>'+
               '</div><div class="tc-baseInfoItemRight"><span>刘浩</span></div></li>'+
               '<li class="tc-baseInfoItem"><div class="tc-baseInfoItemLeft"><span>主诉</span></div>'+
               '<div class="tc-baseInfoItemRight tc-recommendUserMain"><span>初诊医生初诊医生初诊医生初诊医生初诊医生初诊医生</span></div></li>';
       },
       doctorHtml:function(){
           var t=this,
               _listItemHtml='',
               _html='';
           _listItemHtml+='<li class="tc-recommendDoctorItem">'+
               '<div class="tc-recommendReason">推荐理由: <span>该领域全国最权威</span> </div>'+
               '<div class="tc-recommendDoctor-l">'+
               '<a href=""><img src="/image/img00/recoveryReport/recommendDocPhoto.png" alt=""></a>'+
               '</div>'+
               '<div class="tc-recommendDoctor-r">'+
               '<div class="tc-recommendDoctorInfo">'+
               '<span class="tc-recommendDoctorName">张国强</span>'+
               '<span class="tc-recommendDoctorPost">副主任医师</span>'+
               '<span class="tc-recommendDoctorHospital">北京301解放军总医院</span>'+
               '<!--<span class="tc-recommendDoctorOther">权威</span>-->'+
               '</div>'+
               '<p class="tc-recommendDoctorGood">擅长：脊柱、关节、脊柱外科，包括脊柱侧弯。</p>'+
               '<div class="tc-recommendDoctorOtherBox">'+
               '<div class="tc-recommendMoney"><span class="tc-recommendMoneyNum"><i>￥</i>200 </span><span class="tc-recommendText"><i>/</i>起</span>3365人问诊</div>'+
               '<div class="tc-recommend"><p class="tc-recommendConsultNow">立刻咨询<span>仅剩<i>2</i>个名额</span></p></div>'+
               '</div>'+
               '</div>'+
               '</li>';
           _html+= '<section class="tc-recommendDoctor tc-module">'+
               '<section class="tc-recommendDoctorTitle title">'+
               '<h3>推荐医生</h3>'+
               '</section>'+
               '<section class="tc-recommendDoctorBox">'+
               '<p class="tc-boxTitle">根据您的病情为您推荐最擅长该领域的医生</p>'+
               '<ul class="tc-recommendDoctorList">'+_listItemHtml+'</ul>'+
               '<div class="tc-recommendLoadMoreBtn"><img src="/image/img00/recoveryReport/suggestion_unfold@2x.png" alt=""></div>'+
               '<div class="tc-recommendLoadMoreBtn tc-lookBySelf"><span>自己找医生 <i></i> </span></div>'+
               '</section>'+
               '</section>';
           return _html;
       },
       checkHtml:function(sv){
           var t=this,
               _listItemHtml='',
               _html='';
           $.each(sv,function(w,val){
               _listItemHtml+='<li class="tc-suggestCheckingItem">双膝X光片<span class="tc-suggestCheckingOver">（已完成）</span></li>';
           });
           _html+='<section class="tc-suggestChecking tc-module">'+
               '<section class="tc-suggestCheckingTitle title">'+
               '<h3>建议检查/检验<span class="tc-suggestCheckingUpBtn tc-recommendRightComm">上传<i></i></span></h3>'+
               '</section>'+
               '<section class="tc-suggestCheckingBox">'+
               '<p class="tc-boxTitle">为了更清晰更准确的了解您的情况，建议您做以下检查项目，并在检查完成后上传检查结果；</p>'+
               '<ul class="tc-suggestCheckingList">'+_listItemHtml+'</ul>'+
               '<div class="tc-recommendLoadMoreBtn"><img src="/image/img00/recoveryReport/suggestion_unfold@2x.png" alt=""></div>'+
               '</section>';
           return _html;
       },
       knowledgeHtml:function(tkv){
           var t=this,
               _listItemHtml='',
               _html='';
           $.each(tkv,function(i,val){
               _listItemHtml+='<section class="tc-teachingKnowledgeList">'+
                   '<figure class="tc-tc-teachingKnowledgePic">'+
                   '<a href=""></a>'+
                   '<img src="/image/img00/recoveryReport/recommendKnowledge.png" alt="">'+
                   '</figure>'+
                   '<article class="tc-tc-teachingKnowledgeText">'+
                   '<p class="tc-teachingKnowledgeTitle">关节手术——让脱位的髋关节不再脱位</p>'+
                   '<p class="tc-teachingKnowledgeTime"><span>发表于</span><span>2016.11.21</span></p>'+
                   '</article>'+
                   '</section>';
           });
           _html+='<section class="tc-teachingKnowledge tc-module">'+
               '<section class="tc-teachingKnowledge title">'+
               '<h3>患教知识</h3>'+
               '</section>'+
               '<section class="tc-teachingKnowledgeBox">'+_listItemHtml+'</section>'+
               '<div class="tc-recommendLoadMoreBtn"><img src="/image/img00/recoveryReport/suggestion_unfold@2x.png" alt=""></div>'+
               '</section>';
           return _html;
       },
       SuggessHtml:function(){
           var t=this,
               _listItemHtml='',
               _html='';
           $.each(vl,function(i,val){
               _listItemHtml+='<li class="tc-medicineSuggestedItem">'+
                   '<div class="tc-medicineSuggested-l">'+
                   '<img src="/image/img00/recoveryReport/recommendDrug.png" alt="">'+
                   '</div>'+
                   '<div class="tc-medicineSuggested-r">'+
                   '<p class="tc-medicineName">维C银翘片</p>'+
                   '<p class="tc-drugInfo">'+
                   '<span class="tc-medicineMade">哈药六厂</span>'+
                   '<span class="tc-medicineNum">50mg*2片/盒</span>'+
                   '</p>'+
                   '<div class="tc-drugBuy">'+
                   '<span class="tc-drugPrice"><i>￥</i>66元</span><span class="tc-drugNumCal"><i>/</i>盒</span>'+
                   '<span class="tc-drugBuyBtn">加入清单</span>'+
                   '</div>'+
                   '</div>'+
                   '</li>';
           });
           _html+='<section class="tc-medicineSuggested tc-module">'+
               '<section class="tc-medicineSuggestedTitle title">'+
               '<h3>用药建议 <span class="tc-suggestCheckingUpBtn tc-recommendRightComm">购药清单<i></i></span></h3>'+
               '</section>'+
               '<section class="tc-medicineSuggestedBox">'+
               '<ul class="tc-medicineSuggestedList">'+_listItemHtml+'</ul>'+
               '<div class="tc-recommendLoadMoreBtn"><img src="/image/img00/recoveryReport/suggestion_unfold@2x.png" alt=""></div>'+
               '</section>'+
               '</section>';
           return _html;
       },
       adviceHtml:function(){
           var t=this,
               _listItemHtml='',
               _html='';
           $.each(2,function(i,val){
               _listItemHtml+='<li class="tc-disposalAdviceItem">'+
                   '<div class="tc-disposalAdvice-l">门诊清创</div>'+
                   '<div class="tc-disposalAdvice-r">详细介绍</div>'+
                   '</li>';
           });
           _html+='<section class="tc-disposalAdvice tc-module">'+
               '<section class="tc-disposalAdviceTitle title">'+
               '<h3>处置建议</h3>'+
               '</section>'+
               '<section class="tc-disposalAdviceBox">'+
               '<p class="tc-boxTitle">根据您当前情况，建议您进行如下处置，祝您早日康复</p>'+
               '<ul class="tc-disposalAdviceList">'+_listItemHtml+'</ul>'+
               '<div class="tc-recommendLoadMoreBtn"><img src="/image/img00/recoveryReport/suggestion_unfold@2x.png" alt=""></div>'+
               '</section>'+
               '</section>';
           return _html;
       },
       surgeryHtml:function(){
           var t=this,
               _listItemHtml='',
               _html='';
           $.each(vl,function(i,val){
               _listItemHtml+='<li class="tc-surgeryItem">'+
                   '<div class="tc-surgery-l">双膝X光片</div>'+
                   '<div class="tc-surgery-r">上传结果</div></li>';
           });
           _html+='<section class="tc-surgery tc-module">'+
               '<section class="tc-surgeryTitle title">'+
               '<h3>手术建议</h3>'+
               '</section>'+
               '<section class="tc-surgeryBox">'+
               '<p class="tc-boxTitle">为了更清晰更准确的了解您的情况，建议您做以下检查项目，并在检查完成后上传检查结果；</p>'+
               '<ul class="tc-surgeryList">'+_listItemHtml+'</ul>'+
               '</section>'+
               '</section>';
           return _html;
       },
       warmPromptHtml:function(){
           return '<p class="tc-tc-warmPromptText"><span>温馨提示：</span>由于不能面诊，医生无法全面了解病情，初诊建议仅供参考，如有需要您可预约医生进行面诊。</p>'
       },

       //逻辑部分
       perInfo:function(){
         var t=this,
             data='',
             _html='';
         //t.rcoAjax({
         //    path: t.path,
         //    data:'',
         //    callBack:function(data){
         //
         //    }
         //})
       },

       //初始化事件
       initialize:function(){
           $('.tc-baseInfo').find('.tc-goCase').on("click",function(){
              window.location.href='/pages/caseHistory/case_history.html'
           });
       },
       //公用Ajax数据请求
       rcoAjax:function(dv){
           var t=this,
               params={paramJson: $.toJSON(dv.data)};
           $.ajax({
               url : dv.path,
               type : "POST",
               data :  params,
               //time : 5000,
               success : function(data){
                   //comm.LightBox.hideloading();
                   dv.callBack(data);
               },
               error : function(){
                   // comm.LightBox.hideloading();
               }
           });
       }
   };
    recover.init();
});
/**
 * 功能描述：文件上传
 * 使用方法: modules.upLoadFiles(obj);
 *           需在上传元素绑定: ".ev-upLoadBtn" 类名
 *           可视块容器(body下主容器)绑定:  ".ev-fileUpHide" 类名
 * 注意事件：
 * 引入来源：
 *     作用：
 *
 * Created by JuKun on 2017/3/1.
 */
modules.upLoadFiles = function (obj) {
    var container = {
        op: {
            files1:[],
            files2:[],
            files3:[],
            files4:[],
            files5:[],
            files6:[],
            files7:[],
        },
        path: {
            sourceType: "/mcall/comm/data/treatment/v1/getMapList/",     //上传文件类型
            upFile: "/mcall/customer/patient/case/attachment/v1/create/"     //上传图片
        },
        init: function () {
            var _t = this;
            $('.ev-upLoadBtn').on("click", function () {
                $(this).closest('.ev-fileUpHide').hide();
                //判断上传模块是否存在
                if ($('.main-inner.tc-upLoadFile').length > 0) {
                    $('.main-inner.tc-upLoadFile').show();
                } else {
                    _t.perInfo();
                }
            });
        },
        //上传文件Dome
        template:{
            fileUploadHtml: function (k) {
                var t = this,
                    _listHtml = '',
                    _html = '';
                $.each(k, function (i, val) {
                    _listHtml += '<form class="tc-upFormBox" action=""><figure class="tc-upLoadTitle ev-upLoadList"><span class="tc-upLoadTitleName" data-treatmentId="'+val.treatmentId+'">' + val.treatmentName + '</span>' +
                        '<span class="tc-upLoadRightIcon"></span></figure><ul class="tc-upLoadItemBox"><input class="tc-upLoadInput" type="file"></ul></form>';
                });
                _html += '<section class="main-inner tc-upLoadFile">' +
                    '<header class="main-header fileUpload">' +
                    '<figure class="main-header-item ev-upLoadClose">' +
                    '<a href="javascript:;">' +
                    '<img src="/image/arrow_back.png" alt="">' +
                    '</a>' +
                    '</figure>' +
                    '<figure class="main-header-item doctor-name">' +
                    '<h3>上传资料</h3>' +
                    '</figure>' +
                    '<figure class="main-header-item">' +
                    '</figure>' +
                    '</header>' +
                    '<section class="tc-upLoadBox">' + _listHtml + '</section>' +
                    '</section>';
                return _html;
            },
            localReviewHtml:function(lRhv){
                return '<li class="tc-upLoadItemList ev-imgList ev-localReview" data-id="" data-name=""><img src="' + lRhv + '" alt=""><span class="tc-upLoadCover"></span>' +
                '<span class="tc-upLoading"></span><span class="tc-upLoadDel"></span><span class="tc-upLoadAfreshText">等待上传</span></li>';
            },
            picListHtml:function(lv){
                    var _t=this,
                        _picListHtml='';
                    //$.each(l,function(i,val){
                        _picListHtml+='<li class="tc-upLoadItemList ev-imgList" data-type="' + lv.imageType + '">' +
                            '<img src="' + lv.url + '" alt=""><span class="tc-upLoadCover"></span>' +
                            '<span class="tc-upLoading"></span><span class="tc-upLoadDel"></span><span class="tc-upLoadAfreshText">等待上传</span></li>';
                    //});
                    return _picListHtml;
            }
        },

        //逻辑部分
        perInfo: function () {
            var _t = this,
                data = '',
                _html = '';
            var _data = {
                treatmentType: 4
            };
            _t.rcoAjax({
                path: _t.path.sourceType,  //上传文件类型
                data: _data,
                callBack: function (data) {
                    console.log(data);
                    if (data.responseObject && data.responseObject.responseData) {
                        var _dataList = data.responseObject.responseData; //上传资料数据
                        _t.fileUpload(_dataList);

                    }
                }
            })
        },
        fileUpload: function (ev) {
            var _t = this,
                _dataList = ev.dataList,
                _userYes=true;
            //上传图片模块加载
            $('body').append(_t.template.fileUploadHtml(_dataList));
            //退出模块
            $('.ev-upLoadClose').on("click", function () {
                $(this).closest('.tc-upLoadFile').hide().siblings('.ev-fileUpHide').show();
            });
            //触发隐藏file
            $('.ev-upLoadList').on("click", function () {
                var _input=$(this);
                if(_userYes){
                    _t.pop({
                        accessBack:function(_val){
                            if(_val){
                                _userYes = false;
                                $(_input).siblings().find('.tc-upLoadInput').trigger("click");
                            }
                        }
                    });
                }else{
                    $(_input).siblings().find('.tc-upLoadInput').trigger("click");
                }
            });
            //上传
            czyx.uploadReplace('.tc-upLoadInput', {
                url:_t.path.upFile,                //文件处理的URL,
                data: {
                    paramJson: $.toJSON({
                        caseId: "123",
                        caseCategoryId: 1,
                        imageType: 1
                    })
                },
                uploadReplaceCss: {
                    //设置上传按钮图片
                    background: 'url("/image/img00/patientConsult/upload photo_default@2x.png") center no-repeat',
                    backgroundSize: '100%',
                    width: "2.02667rem",             //上传按钮的宽度
                    height: "2.02667rem",              //上传按钮的高度
                    float: 'left',
                    //top: '1.875em',
                    //marginBottom: '1.875em'
                },
                uploadInputCss: {
                    width: "100%",             //上传按钮的宽度
                    height: "100%"             //上传按钮的高度
                },
                uploadBefore: function () {
                    console.log(this,"111");
                    if (!/\.((JPEG)|(jpeg)(jpg)|(JPG)|(gif)|(GIF)|(png)|(PNG))$/i.test(this.value)) {
                        common.popup({text: '只允许上传.jpg .gif .png类型的图片文件'});
                        return false;
                    }else {
                        _t.localReview(this);
                    }
                },
                uploadEnd: function (serverJson) {  //上传完毕后调用
                    console.log(this,"222");
                    try {
                        //serverJson = $.parseJSON($(serverJson).html());
                        serverJson = JSON.parse(serverJson);
                        if (serverJson.responseObject.responseStatus) {
                            common.popup({text: '上传成功'});
                            _t.upLoadSuccess({
                                data:serverJson,
                                element:$(this)
                            });
                        } else {
                            common.popup({text: '上传失败'});
                            _t.upLoadError({
                                data:serverJson,
                                element:$(this)
                            });
                            return;
                        }
                    } catch (e) {
                        common.popup({text: '上传失败1111'});
                        _t.upLoadError({
                            data:serverJson,
                            element:$(this)
                        });
                        return;
                    }
                }
            });
        },
        //本地预览加载
        localReview:function(lRv){
            var _t=this;
            debugger;
            var fileList = lRv.files,
                previewSrc = '',
                _htmlList = '',
                imgPreviewBox = $(lRv.closest('.tc-upFormBox')).find('.tc-upLoadItemBox'),  //图片容器
                imgList = $(lRv.closest('.tc-upFormBox')).find('.tc-upLoadItemBox').children('.ev-imgList').length;  //已上传图片数量

            var _element=$(lRv).closest('.tc-upLoadItemBox').siblings('.ev-upLoadList').children('.tc-upLoadTitleName'),
                imgType=_element.attr("data-treatmentid");
            switch (parseInt(imgType)){
                case 1:
                    _t.op.files1.push(fileList);
                    break;
                case 2:
                    _t.op.files2.push(fileList);
                    break;
                case 3:
                    _t.op.files3.push(fileList);
                    break;
                case 4:
                    _t.op.files4.push(fileList);
                    break;
                case 5:
                    _t.op.files5.push(fileList);
                    break;
                case 6:
                    _t.op.files6.push(fileList);
                    break;
                case 7:
                    _t.op.files7.push(fileList);
                    break;

            }
            //if(_t.op.files){
            //    _t.op.files.push(fileList);
            //}else{
            //    _t.op.files=[];
            //    _t.op.files.push(fileList);
            //}


                if (fileList.length + imgList <= 9) {
                    $.each(fileList, function (i, val) {
                            previewSrc = window.navigator.userAgent.indexOf("Safari") >= 1 ? window.webkitURL.createObjectURL(val) : window.URL.createObjectURL(val);
                            _htmlList +=_t.template.localReviewHtml(previewSrc);
                    });
                    imgPreviewBox.find('.tc-upLoadInput').parent().before(_htmlList);
                    $(lRv.closest('.tc-upFormBox')).find('.tc-upLoadItemBox').show();
                    //控制上传按钮显示
                    if (fileList.length + imgList == 9) {
                        imgPreviewBox.find('.tc-upLoadInput').parent().hide();
                    } else {
                        imgPreviewBox.find('.tc-upLoadInput').parent().show();
                    }
                    _t.fileDel();
                } else {

                    common.popup({
                        text: "最多可上传9张"
                    });
                }
        },
        pop:function(Pv){
            var _t=this;
            if (_t.getConnectType() == 1) {
                    Pv.accessBack(true);
                } else {
                common.confirmBox({
                    title: "当前WIFI未连接",
                    content: '确定要使用手机流量上传吗？',
                    cancel: '取消',
                    ensure: '确定',
                    cancelCallback: function () {
                        Pv.accessBack(false);
                    },
                    ensureCallback: function () {
                        Pv.accessBack(true);
                    }
                })
            }
        },
        //上传成功处理
        upLoadSuccess:function(sv){
            debugger;
            var _t=this,
                responsePk=sv.data.responseObject.responsePk,
                url=sv.data.responseObject.responseMessage.logoUrl,
                imageType=sv.data.responseObject.responseMessage.logoType;
                //path=sv.data.responseMessage.path;
            var _successEle=sv.element.closest('.tc-upLoadItemBox').find('.ev-localReview');
            $.each(_successEle,function(i,val){
                $(val).find('img').attr("src",url);
                $(val).find('.tc-upLoadCover').hide();      //遮罩
                $(val).find('.tc-upLoading').hide();        //等待效果..
                $(val).find('.tc-upLoadAfreshText').hide(); //文本
                $(val).find('.tc-upLoadDel').show();        //删除按钮
                $(val).find('.ev-fileUpRefresh').hide();    //重传按钮
                $(val).attr({
                    "data-responsePk":responsePk,
                    "data-imageType":imageType
                })
            });
            //控制上传图片按钮显示
            if($(this).parent().siblings('.tc-upLoadItemList').length>0){
                $(this).parent().show();
            }else{
                $(this).parent().hide();
            }
        },
        //上传失败处理
        upLoadError:function(eRv){
            var _t=this;
                //responsePk=eRv.data.responsePk,
                //url=eRv.data.responseMessage.url,
                //imageType=eRv.data.responseMessage.imageType,
                //path=eRv.data.responseMessage.path;

            var _successEle=eRv.element.closest('.tc-upLoadItemBox').find('.ev-localReview');
            $.each(_successEle,function(i,val){
                //$(val).find('img').src(url);
                $(val).find('.tc-upLoadCover').addClass('upFailed');      //遮罩
                $(val).find('.tc-upLoading').addClass('tc-upLoadAfresh').removeClass('tc-upLoading');        //等待效果..
                $(val).find('.tc-upLoadAfreshText').text("重新上传"); //文本
                $(val).append('<span class="ev-fileUpRefresh"></span>');      //set refresh Btn
                //$(val).find('.tc-upLoadDel').show();        //删除按钮
                //$(val).attr({
                //    "data-responsePk":responsePk,
                //    "data-imageType":imageType
                //})
                $(val).find('.ev-fileUpRefresh').on("click",function(){
                    console.log("正在重新上传。。。。");

                    _t.upLoadPic({
                        element:$(this)
                    })
                })
            });

        },

        //点击项目加载图片方法
        fileUpControl: function (fv) {
            var t = this;
            var a = $(fv).closest('.tc-upFormBox').find('.tc-upLoadInput');
            a.trigger("click");
            a.on("change", function () {
                console.log(a)
                var fileList = a[0].files,
                    previewSrc = '',
                    _htmlList = '',
                    _html = '',
                    imgPreviewBox = $(fv).closest('.tc-upFormBox').find('.tc-upLoadItemBox'),  //图片容器
                    imgList = $(fv).closest('.tc-upFormBox').find('.tc-upLoadItemBox').children('.ev-imgList').length;  //已上传图片数量
                if (t.op.fileName != undefined && t.op.fileName.length > 0) {

                } else {
                    t.op.fileName = [];
                }
                var hasFile = t.op.fileName.indexOf(fileList[0].name);
                if (hasFile == -1) {
                    t.op.fileName.push(fileList[0].name);
                    if (fileList.length + imgList <= 9) {
                        $.each(fileList, function (i, val) {
                            if (!val.name.match(/.jpg|.gif|.png|.bmp/i)) {
                                return alert("您上传的图片格式不正确，请重新选择！");
                            } else {
                                previewSrc = window.navigator.userAgent.indexOf("Safari") >= 1 ? window.webkitURL.createObjectURL(val) : window.URL.createObjectURL(val);
                                _htmlList += '<li class="tc-upLoadItemList ev-imgList" data-id="' + i + '" data-name="' + val.name + '"><img src="' + previewSrc + '" alt=""><span class="tc-upLoadCover"></span>' +
                                    '<span class="tc-upLoading"></span><span class="tc-upLoadDel"></span><span class="tc-upLoadAfreshText">等待上传</span></li>';
                            }
                        });
                        if (imgPreviewBox.length > 0) {
                            imgPreviewBox.find('.tc-upLoadAdd').before(_htmlList);
                        } else {
                            _htmlList += '<li class="tc-upLoadItemList tc-upLoadAdd"><a href="javascript:;"><span class="tc-upLoadAddMore"></span></a></li>';
                            _html = '<ul class="tc-upLoadItemBox">' + _htmlList + '</ul>';
                            $(fv).closest('.tc-upFormBox').append(_html);
                        }
                        if (fileList.length + imgList == 9) {
                            imgPreviewBox.find('.tc-upLoadAdd').hide();
                        } else {
                            imgPreviewBox.find('.tc-upLoadAdd').show();
                        }
                        if (t.getConnectType() == 1) {
                            t.upLoadPic(fileList);
                        } else {
                            common.confirmBox({
                                title: "当前WIFI未连接",
                                content: '确定要使用手机流量上传吗？',
                                cancel: '取消',
                                ensure: '确定',
                                cancelCallback: function () {
                                    t.upLoadPic(fileList);
                                },
                                ensureCallback: function () {
                                    t.upLoadPic(fileList);
                                }
                            })
                        }
                        t.fileDel();
                        t.fileDell();
                    } else {
                        common.popup({
                            text: "最多可上传9张"
                        });
                    }
                }
                a.off("change");
            });
        },


        //上传图片AJAX
        upLoadPic: function (lv) {

            var _t = this;
            var _files='',
                _afreshIndex=lv.element.parent().index(),
                _imgType=lv.element.closest('.tc-upLoadItemBox').siblings('.tc-upLoadTitle').children('.tc-upLoadTitleName').attr("data-treatmentid");
            switch (parseInt(_imgType)){
                case 1:
                    _files = _t.op.files1[_afreshIndex];
                    break;
                case 2:
                    _files = _t.op.files2[_afreshIndex];
                    break;
                case 3:
                    _files = _t.op.files3[_afreshIndex];
                    break;
                case 4:
                    _files = _t.op.files4[_afreshIndex];
                    break;
                case 5:
                    _files = _t.op.files5[_afreshIndex];
                    break;
                case 6:
                    _files = _t.op.files6[_afreshIndex];
                    break;
                case 7:
                    _files = _t.op.files7[_afreshIndex];
                    break;
            }
            var _data = new FormData(),
                _params={
                    caseId: "123",
                    caseCategoryId: "1",
                    imageType: "1"
                 };
            _data.append('file', _files[0]);
            _data.append('paramJson', $.toJSON({caseId:3,imageType:1}));
            //_data.append('caseCategoryId',"1");
            //_data.append('imageType',"1");

            //_data.append('paramJson',{
            //    caseId: "123",
            //    caseCategoryId: "1",
            //    imageType: "1"
            //});

            $.ajax({
                url: _t.path.upFile,
                data: _data,
                type: "POST",
                dataType:'json',
               // method:'post',
                contentType: false,
                processData: false,     //此处是data的预处理，需要设置为false才可以
                beforeSend: function (data) {

                },
                success: function (data) {
                    console.log("成功！");
                    console.log(data);
                    if (data.responseObject.responseStatus) {
                        console.log("成功！")
                    } else {
                        console.log("上传失败！")
                    }
                },
                error: function (data) {
                    console.log("失败");
                    console.log(data);
                    //失败
                }
            });
        },
        //获取网络类型方法（1-WiFi 0-非WiFi）
        getConnectType: function () {
            var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {tyep: 'unknown'};
            var type_text = ['unknown', 'ethernet', 'wifi', '2g', '3g', '4g', 'none'];
            var checkKey = '';
            if (typeof(connection.type) == "number") {
                connection.type_text = type_text[connection.type];
            } else {
                connection.type_text = connection.type;
            }
            if (typeof(connection.bandwidth) == "number") {
                if (connection.bandwidth > 10) {
                    connection.type = 'wifi';
                } else if (connection.bandwidth > 2) {
                    connection.type = '3g';
                } else if (connection.bandwidth > 0) {
                    connection.type = '2g';
                } else if (connection.bandwidth == 0) {
                    connection.type = 'none';
                } else {
                    connection.type = 'unknown';
                }
            }
            if (connection.type_text == 'wifi') {
                checkKey = 1;
            } else {
                checkKey = 0;
            }
            return checkKey;
        },
        //删除图片事件
        fileDel: function () {
            var t = this;
            $('.tc-upLoadDel').on("click", function () {
                var dataName = $(this).parent().data('name');
                //t.op.fileName.splice(t.op.fileName.indexOf(dataName), 1);

                if ($(this).closest('.tc-upLoadItemBox').find('.ev-imgList').length == 1) {
                    $(this).closest('.tc-upLoadItemBox').hide();
                }
                $(this).parent().siblings('.tc-upLoadAdd').show();
                $(this).parent().remove();
            });
        },
        //公用Ajax数据请求
        rcoAjax: function (dv) {
            var _t = this,
                params = {paramJson: $.toJSON(dv.data)};
            common.loading.show();
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
    container.init(obj);
};
/**
 * @name:
 * @desc: 入口
 * @example:
 * @depend:
 * @date: 2017/1/22
 * @author: qiangkailiang
 */
var common = {};
var modules = {};

/**
 * @name:
 * @desc:根方法扩展/对象底层方法
 * @example:
 * @depend:
 * @date: 2017/1/22
 * @author: qiangkailiang
 */
if (typeof FastClick == "function") {
    FastClick.attach(document.body); //防止点击事件点透
}
//判断空对象
common.isEmptyObject = function (obj) {
    for (var n in obj) {
        return false
    }
    return true;
};
// 取消冒泡
common.stopBubble = function (event) {
    event && event.stopPropagation ? event.stopPropagation() : window.event.cancelBubble = !0
};
//字符串插值 近似于Array.prototype.splice
String.prototype.splice = function (idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};
//IE8添加forEach方法
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function forEach(callback, thisArg) {

        var T, k;

        if (this == null) {
            throw new TypeError("this is null or not defined");
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }
        if (arguments.length > 1) {
            T = thisArg;
        }
        k = 0;

        while (k < len) {

            var kValue;
            if (k in O) {

                kValue = O[k];
                callback.call(T, kValue, k, O);
            }
            k++;
        }
    };
}
//textarea高度自适应
$.fn.extend({
    textareaAutoHeight: function (options) {
        this._options = {
            minHeight: 0,
            maxHeight: 1000
        };
        this.init = function () {
            for (var p in options) {
                this._options[p] = options[p];
            }
            if (this._options.minHeight == 0) {
                this._options.minHeight=parseFloat($(this).height());
            }
            for (var p in this._options) {
                if ($(this).attr(p) == null) {
                    $(this).attr(p, this._options[p]);
                }
            }
            $(this).keydown(this.resetHeight).keyup(this.resetHeight).change(this.resetHeight)
                .focus(this.resetHeight);
            $(this)[0].onpaste=this.resetHeight;
        }
        this.resetHeight = function () {
            var _minHeight = parseFloat($(this).attr("minHeight"));
            var _maxHeight = parseFloat($(this).attr("maxHeight"));
            if (!$.browser.msie) {
                $(this).height(0);
            }
            var h = parseFloat(this.scrollHeight);
            h = h < _minHeight ? _minHeight :
                h > _maxHeight ? _maxHeight : h;
            $(this).height(h).scrollTop(h);
            if (h >= _maxHeight) {
                $(this).css("overflow-y", "scroll");
            }
            else {
                $(this).css("overflow-y", "hidden");
            }
        };
        this.init();
    }
});
//IE8 remove方法
if (!Array.remove) {
    //Array Remove - By John Resig (MIT Licensed)
    Array.prototype.remove = function(from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };
}
/**
 * @name:
 * @desc: 字符串方法
 * @example:
 * @depend:
 * @date: 2017/1/22
 * @author: qiangkailiang
 */
//字符串截断加省略号
common.getStrLen = function (str, len) {
    var strlen = 0,
        s = "";
    for (var i = 0; i < str.length; i++) {
        s = s + str.charAt(i);
        if (str.charCodeAt(i) > 128) {
            strlen = strlen + 2;
            if (strlen >= len) {
                return s.substring(0, s.length - 1) + "...";
            }
        } else {
            strlen = strlen + 1;
            if (strlen >= len) {
                return s.substring(0, s.length - 2) + "...";
            }
        }
    }
    return s;
};
//字符串截断
common.getStrByteLen = function (str, len) {
    var newStr = '',
        newLength = 0;
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 128) {
            newLength += 2;
        } else {
            newLength++;
        }
        if (newLength <= len) {
            newStr = newStr.concat(str[i]);
        } else {
            break;
        }
    }
    if (newLength > len) {
        newStr = newStr + "..."
    }
    return newStr;
};
//手机号中间隐藏
common.phoneMask = function (account) {
    return account.substr(0, 3) + "****" + account.substr(7, 11);
};
//隐藏手机或邮箱
common.getRegisterName = function (email, mobile) {
    var count = "";
    if (email) {
        count = email.substr(0, 2) + "****" + email.substring(email.lastIndexOf("@"));
    } else if (mobile) {
        count = mobile.substr(0, 3) + "****" + mobile.substring(mobile.length - 4);
    }
    return count;
};
//禁止input与textarea中输入标签
common.htmlToString = function (str) {
    var rstStr = (str + '').replace(/[<>&]/g, function (c) {
        return {'<': '&lt;', '>': '&gt;', '&': '&amp;'}[c];
    });
    var tempArr = rstStr.split("\&lt\;\/a\&gt\;&lt\;a");

    if (tempArr.length >= 2) {
        rstStr = tempArr.map(function (d, index) {
            var s = d.replace(/\&lt\;a[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)/gi, "<a href=\"$1\">$2");
            s = s.replace(/[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)&lt\;\/a\&gt\;/gi, " href=\"$1\">$2</a>");
            return s;
        }).join("</a><a");
    } else {
        rstStr = (rstStr + '').replace(/\&lt\;a[\s]*href\=\"?(\S*)\"?\&gt\;([\S\s]*)\&lt\;\/a\&gt\;/gi, "<a href=\"$1\">$2</a>");
        /* 恢复文本中的提醒谁看的A链接*/
    }
    rstStr = rstStr.replace(/@@/g, "@");
    return rstStr;
};

//判断用户是手机号登录还是邮箱登录
common.checkAccountType = function (account) {
    var type = "";
    if (/^(127|13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/.test(account)) {
        type = "mobile";
    }
    if (/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(account)) {
        type = "email";
    }
    return type;
};
//截取职称前面的数字_
common.cutLine = function(srcStr, type, callType) {
    if (!srcStr) {
        return;
    }
    var oneStep = srcStr.split(",");
    var str = "";

    $.each(oneStep, function(i, val) {
        if (val) {
            if (val.split(type)[1]) {
                str += val.split(type)[1] + callType;
            } else {
                str += val + callType;
            }
        }
    });
    return str.substring(0, str.length - 1);
};

//医师、非医师前缀裁剪
common.strHandle = {
    cutDoctorTitle: function(arr) { //截剪医师
        var title = "";
        if (arr.length > 0) {
            var arrList = arr.split(",");
            var regExp = /(医师)/g;
            for (var i = 0; i < arrList.length; i++) {
                if (regExp.test(arrList[i])) {
                    title = arrList[i];
                    break;
                }
            }
        }

        return title;
    },
    cutNotDoctorTitle: function(arr) { //裁剪非医师
        var title = "";
        if (arr.length > 0) {
            var arrList = arr.split(",");
            var regExp = /(医师)/g;
            for (var i = 0; i < arrList.length; i++) {
                if (!regExp.test(arrList[i])) {
                    title += arrList[i] + ",";
                }
            }
        }
        return title;
    }
};


//数字截取到k，大于1k到1w
String.prototype.toWK = function() {
    if (isNaN(parseInt(this))) return 0;

    if (parseInt(this) < 10000 && parseInt(this) > 999) {
        return Math.floor(parseInt(this) / 1000) + "K+";
    } else if (parseInt(this) > 9999) {
        return Math.floor(parseInt(this) / 10000) + "W+";
    } else {
        return this;
    }
}

Number.prototype.toWK = function() {
    if (isNaN(parseInt(this))) return 0;

    if (parseInt(this) < 10000 && parseInt(this) > 999) {
        return Math.floor(parseInt(this) / 1000) + "K+";
    } else if (parseInt(this) > 9999) {
        return Math.floor(parseInt(this) / 10000) + "W+";
    } else {
        return this;
    }
}

String.prototype.toInt = function() {
    return parseInt(this);
};
String.prototype.toK = function() {
    if (parseInt(this) > 999) {
        return Math.floor(parseInt(this) / 1000) + "K+";
    } else {
        return this;
    }
};
Number.prototype.toK = function() {
    if (parseInt(this) > 999) {
        return Math.floor(parseInt(this) / 1000) + "K+";
    } else {
        return this;
    }
};
String.prototype.toW = function() {
    if (parseInt(this) > 9999) {
        return Math.floor(parseInt(this) / 10000) + "W+";
    } else {
        return this;
    }
};
Number.prototype.toW = function() {
    if (parseInt(this) > 9999) {
        return Math.floor(parseInt(this) / 10000) + "W+";
    } else {
        return this;
    }
};

/*
 *获取字符串长度
 */
common.getByteLen = function(val) {
    var len = 0;
    for (var i = 0; i < val.length; i++) {
        if (val[i].match(/[^\x00-\xff]/ig) !== null){
            len += 2;
        }
        else{
            len += 1;
        }
    }
    return len;
};
/*
 *文本框超出字数限制截断
 * 用法 common.textChange({
 *            "$tex": $('.he-cureHistory').find('.he-cureHisItemInfo textarea'), //文本框元素
 *            "$num": $('.al-scorePagePopBox').find('.al-NumPrompt'),            //字数提示元素
 *            "noTop": 1,
 *            "numTip": 10
 *           });
 * 注意：需要在文本框标签里添加 max属性 例：max="500"
 */
String.prototype.subByte = function (start, bytes)
{
    for (var i=start; bytes>0; i++)
    {
        var code = this.charCodeAt(i);
        bytes -= code<256 ? 1 : 2;
    }
    return this.slice(start,i)
};
common.textChange=function(obj){
    var options={};
    var o={
        minTop:24,
        maxTop:32
    };
    options= $.extend(o,obj);
    var ie = jQuery.support.htmlSerialize; //是否ie
    var str = 0;//汉字的个数
    var abcnum = 0; //非汉字个数
    var maxNum = maxNum; //最大字符数
    var texts= 0;
    options.$tex.bind("focus",function(){
        options.$tex.parent().parent().find(".default_name").css("color","#3d84c6");
    });
    options.$tex.bind("blur",function(){
        options.$tex.parent().parent().find(".default_name").css("color","#808080");
    });
    //文本框字数计算和提示改变
    if(!!(window.attachEvent && navigator.userAgent.indexOf('Opera') === -1)){//ie
        options.$tex.bind("propertychange",function(){
            changeNum();
        });
        options.$tex.bind("keyup",function(){
            changeNum();
        });
    }else{//非ie
        options.$tex.bind("keyup keydown change input cut paste drop",function(){
            changeNum();
        })
    }
    function changeNum(){
        //汉字的个数
        //str = (options.$tex.val().replace(/\w/g,"")).length;
        //非汉字的个数
        //abcnum = options.$tex.val().length-str;
        var total=common.getByteLen(options.$tex.val());//str*2+abcnum;
        maxNum = options.$tex.attr("max")*2;
        if(!options.noTop){
            if(total==0){
                options.$tex.parent().parent().find(".default_name").hide();
                options.$tex.parent().css("top",options.minTop);
            }else{
                options.$tex.parent().parent().find(".default_name").show();
                options.$tex.parent().css("top",options.maxTop);
            }
        }
        if(total<maxNum || total == maxNum){ //未超出
            texts =Math.ceil((maxNum - total)/2);
            //texts= maxNum - abcnum;
            if(options.$num) {
                if(obj.numTip!=undefined&&obj.numTip>0){
                    if(texts<=obj.numTip){
                        options.$num.text(texts);
                        options.$num.css("color", "#F00");
                    }else {
                        options.$num.text("")
                    }
                }else{
                    options.$num.text(texts);
                    if (texts == 0) {
                        options.$num.css("color", "#F00");
                    } else {
                        options.$num.css("color", "#c5c5c5");
                    }
                }
            }
        }else if(total>maxNum){ //超出规定字符
            options.$tex.val(options.$tex.val().subByte(0,maxNum));
            if(options.$num) {
                options.$num.text(0).css("color", "#F00");
            }
        }
    }
};

/**
 * @name:
 * @desc:兼容性协助类
 * @example:
 * @depend:
 * @date: 2017/1/22
 * @author: qiangkailiang
 */
//判断是否是某浏览器
common.browser = {
    mozilla: /firefox/.test(navigator.userAgent.toLowerCase()),
    webkit: /webkit/.test(navigator.userAgent.toLowerCase()),
    opera: /opera/.test(navigator.userAgent.toLowerCase()),
    msie: /msie/.test(navigator.userAgent.toLowerCase()),
    versions: function () {
        var u = navigator.userAgent,
            app = navigator.appVersion;
        return { //移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') === -1 //是否web应该程序，没有头部与底部
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
};
//判断当前浏览器版本
common.getBrowseType = function () {
    var u = navigator.userAgent;
    var bbT = { //移动终端浏览器版本信息
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
        iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
        mac: u.indexOf('Mac') > -1,
        iPad: u.indexOf('iPad') > -1, //是否iPad
        webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
    };
    return bbT;
};

//判断是否PC端
common.ispc=function () {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
};
common.isWeiXin = function() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
};
/**
 * @name:
 * @desc: 提示框方法
 * @example:
 * @depend:
 * @date: 2017/1/22
 * @author: qiangkailiang
 */
//菊花图 读取中旋转
common.loading = {
    show: function () {
        if ($(".ev-loading").length == 0) {
            $("body").append('<section class="middle-tip-box ev-loading">' +
                '<section class="middle-tip-modal">' +
                '<figure class="middle-tip-box-text">' +
                '<img src="/image/img00/patientConsult/symptom_photo_loading@2x.png" alt="loading...">' +
                '</figure>' +
                '</section>' +
                '</section>');
        } else {
            $(".ev-loading").show();
        }
    },
    hide: function () {
        $(".ev-loading").hide();
    }
};
//confirm模态窗
common.confirmBox = function (options, role) {
    if ($('.confirmBox-tips').length === 0) {
        var template = '<section class="maskers confirmBox-tips">' +
            '<section class="confirmBox-inner">' +
            '<article class="confirmBox-content">' +
            '<article>' +
            (options.title ? '<h2>' + (options.title || '') + '</h2>' : '') +
            '<p>' + (options.content || '') + '</p>' +
            '</article>' +
            '</article>' +
            '<footer class="confirmBox-btns">' +
            '<button class="confirmBox-cancelBtn">' + (options.cancel || '') + '</button>' +
            '<button class="confirmBox-ensureBtn">' + (options.ensure || '') + '</button>' +
            '</footer>' +
            '</section>' +
            '</section>';
        $("body").append(template);

        setTimeout(function (e) {
            $(".confirmBox-tips").addClass('show');
        }, 50);
        $(".confirmBox-ensureBtn").on("click", function () {
            options.ensureCallback && options.ensureCallback();
            $(".confirmBox-tips").removeClass('show');
            $(".confirmBox-tips").on("transitionend WebkitTransitionEnd", function () {
                $(".confirmBox-tips").remove();
            });
            return false;
        });
        $(".confirmBox-cancelBtn").on("click",  function () {
            options.cancelCallback && options.cancelCallback();
            $(".confirmBox-tips").removeClass('show');
            $(".confirmBox-tips").on("transitionend WebkitTransitionEnd", function () {
                $(".confirmBox-tips").remove();
            });
            return false;
        });
    } else {
        $(".confirmBox-tips").addClass('show');
    }
};

//alert模态窗
common.alertBox = function (options) {
    if ($('.alertBox-tips').length === 0) {
        var template = '<section class="maskers alertBox-tips">' +
            '<section class="alertBox-inner">' +
            '<article class="alertBox-content">' +
            '<article>' +
            (options.title ? '<h2>' + (options.title || '') + '</h2>' : '') +
            '<p>' + (options.content || '') + '</p>' +
            '</article>' +
            '</article>' +
            '<footer class="alertBox-btns">' +
            '<button class="alertBox-ensureBtn" style="width: 100%;">' + (options.ensure || '') + '</button>' +
            '</footer>' +
            '</section>' +
            '</section>';
        $("body").append(template);

        setTimeout(function (e) {
            $(".alertBox-tips").addClass('show');
        }, 50);

        $("body").on("click", ".alertBox-ensureBtn", function () {
            options.ensureCallback && options.ensureCallback();
            $(".alertBox-tips").removeClass('show')
            $(".alertBox-tips").on("transitionend", function () {
                $(".alertBox-tips").remove();
            });
            return false;
        });
    } else {
        $(".alertBox-tips").addClass('show');
    }
};
common.btnBox = function (options) {
    if ($('.btnBox-tips').length === 0) {
        var template = '<section class="btnBox-tips maskers " '+options.direction+'>' +
            '    <section class="'+options.direction+'-box">' +
            '<article>' +
            (options.title ? '<h2>' + (options.title || '') + '</h2>' : '') +
            '</article>' +
            (function (list) {
                var result = "";
                $(list).each(function (index, element) {
                    result += '<a class="btnBox-btn ' + element.className + '" id="' + (element.id?element.id:"") + '" href="'+element.href+'">' + element.content + '</a>';
                });

                return result;
            }(options.btn)) +
            '    </section>' +
            '</section>';

        $("body").append(template);

        setTimeout(function (e) {
            $(".btnBox-tips").addClass('show');
        }, 50);

        $(".btnBox-tips").on("click",function (e) {
            if ($(e.target).hasClass("btnBox-btn")){
                return;
            }
            e.stopPropagation();

            $(".btnBox-tips").removeClass('show');
            $(".btnBox-tips").on("transitionend WebkitTransitionEnd", function () {
                $(".btnBox-tips").remove();
            });
        })
    } else {
        $(".btnBox-tips").addClass('show');
    }
};
//黑底提示框
common.popup = function (obj) {
    if ($(".popup-tips").length == 0) {
        $("body").append( '<section class="middle-tip-modal popup-tips">' +
            '<figure class="middle-tip-box-text">' +
            // (obj.hasImg ? '<img src="/image/personal/loading_finish.png" alt="">' : '') +
            '<p class="tipText">' + obj.text + '</p> ' +
            '</figure>' +
            '</section>');

        setTimeout(function () {
            $(".popup-tips").addClass('show')
        }, 100);
    } else {
        $(".popup-tips").addClass('show');
        $(".tipText").text(obj.text);
        if (!obj.hasImg) {
            $(".middle-tip-box-text img").hide();
        } else {
            $(".middle-tip-box-text img").show();
        }
    }
    setTimeout(function () {
        $(".popup-tips").removeClass('show');
    }, 3000)
};

//顶部条状提示层
common.topTips ={
    show:function (obj) {
        this.class=obj.class;
        var template = '<figure class="top-tips ' + obj.class + '">' +
            '    <span>' + obj.content + '</span>' +
            '</figure>';
        $("body").append(template);
        setTimeout(function () {
            $("." + obj.class).addClass('show');
        },100);
    },
    hide:function () {
        $("."+this.class).removeClass("show");
        $("."+this.class).on("transitionend WebkitTransitionEnd",function () {
            $(this).remove();
        })
    }
};
/**
 * @name:
 * @desc:网络，域名相关
 * @example:
 * @depend:
 * @date: 2017/1/22
 * @author: qiangkailiang
 */
//获取Url上的query
common.getpara = function (symbol) //获取参数的函数
{
    var url = window.location.origin+window.location.pathname+window.location.search;

    var param = {};
    var str, item;
    if (url.lastIndexOf(symbol ? symbol : "?") > 0) {
        str = url.substring(url.lastIndexOf(symbol ? symbol : "?") + 1, url.length);
        var arr = str.split("&");
        for (var i = 0; i < arr.length; i++) {
            item = arr[i].split("=");
            param[item[0]] = decodeURIComponent(item[1]);
        }
    }
    return param;
};
//键值对内容拼为query
common.buildAnchor = function (obj) {
    if (obj && obj != null && !$.isEmptyObject(obj)) {
        var a = window.location.pathname + location.search;
        if (a.indexOf("#") < 0) {
            a += "#";
        }
        for (var key in obj) {
            a += "&" + key + "=" + obj[key];
        }
        if (a.indexOf("share=app" > 0)) {
            a += "&share=app";
        }
        if (a.indexOf("visitSiteId") > 0) {
            var visitSiteId = common.getparaNew().visitSiteId;
            a += "&visitSiteId=" + visitSiteId;
        }
        window.location.href = a;
    } else {
        return;
    }
};
//获取参数的函数
common.getparaNew = function () {
    var url = document.URL;
    var param = {};
    var str, item;
    str = url;
    if (url.lastIndexOf("?") > 0) {
        str = url.substring(url.lastIndexOf("?") + 1, url.length);
    }
    if (url.lastIndexOf("#") > 0) {
        str = str.split("#")[1];
    }
    if (url.indexOf("=") == "-1") {
        return false;
    }
    if (str.length > 0) {
        var arr = str.split("&");
        if (arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                item = arr[i].split("=");
                param[item[0]] = decodeURIComponent(item[1]);
            }
            return param;
        }
        return false;
    }
    return false;
};
//App唤醒
common.bindCallApp = function (options) {
    if (typeof options != "object") {
        log();
        return;
    }

    if (!options.hasOwnProperty("ios") && !options.hasOwnProperty("android")) {
        log();
        return;
    }
    var u = window.navigator.userAgent;
    var isWeixin = /MicroMessenger/.test(u);
    var isIOS9 = false;
    var isIOS9_0_or_1 = false;

    isIOS9 = Boolean(navigator.userAgent.match(/OS ([9]_[0-9]|[10|11][_\d])[_\d]* like Mac OS X/i)); // ios9.2之前的版本，
    isIOS9_0_or_1 = Boolean(navigator.userAgent.match(/OS ([9]_[0-1])[_\d]* like Mac OS X/i)); // ios9.2之前的版本，

    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;

    var isIphone = u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1;
    var isWeibo = u.indexOf('weibo') > -1 || u.indexOf('Weibo') > -1;
    var isQQBrowser = u.indexOf('QQ') > -1 && u.indexOf("NetType") > -1;//qq内置浏览器
    var StartTime;
    var elements;
    var timeoutsArr = [];
    var url = getUrl();

    /**
     *  获取对应版本的 schema 地址
     * */
    function getUrl() {
        var url = "";
        var u = navigator.userAgent;
        if (isAndroid) {
            if (options.android != undefined) {
                url = options.android;
            }
        }

        if (isIphone) {
            if (options.ios != undefined) {
                url = options.ios;
            }
        }
        return url;
    }

    $(window).on("blur pagehide beforeunload", clearTimeouts);

    function clearTimeouts() {
        timeoutsArr.forEach(window.clearTimeout);
        timeoutsArr = [];
    }

    // 针对ios9 如果跳至中转页面,返回后仍然没有打开.则尝试用schema再打开一次,若再打不开,再跳转至下载页
    if (typeof common.getparaNew().ios9 != "undefined") {
        tryOpen(url);
    }
    /*尝试直接打开*/
    if (typeof options.runAtOnce == "boolean" && options.runAtOnce) {
        StartTime = +(new Date);

        if (isIOS9) {
            if (!(isWeixin || isWeibo)) {
                locationOpen(options.ios9);
            }

        } else {
            if (!(isWeixin || isWeibo)) {
                tryOpen(url);
            }

        }

    }

    /* 需要绑定按钮 */
    if (typeof options.el == "string") {

        elements = options.el;
        bindIng();
    }

    function bindIng() {

        if (isAndroid) {
            /*  alert(isAndroid + "isAndroid")
             alert(isWeixin + "isWeixin")
             alert(isWeibo + "isWeibo")
             alert(isQQBrowser + "isQQBrowser")*/
            if (isWeixin || isWeibo) {/* || isQQBrowser*/
                showWeixinGuide("android");
                return false;
            } else {
                bindOpen();
            }
        }

        if (isIphone) {

            if (isIOS9) { // ios9直接显示加链接
                if (isWeixin || isWeibo) {
                    showWeixinGuide("ios");
                    return false;
                } else {
                    bindOpen(options.ios9);
                }

            } else { //ios9以下 的话;          */
                if (isWeixin || isWeibo) {
                    showWeixinGuide("ios");
                    return false;
                } else {
                    bindOpen(options.ios);
                }
            }
        }
    }

    function bindOpen(url) {

        $(elements).off("click").on("click", {url: url || ""}, function (event) {
            var url = event.data.url;
            StartTime = +(new Date);
            if (!url) {
                var url = getUrl();
            }
            tryOpen(url);
        });
    }

    /*尝试去打开*/
    function tryOpen(url) {

        if (!url) return;
        if (isIOS9) {
            locationOpen(url);
        } else {
            var u = url;
            setTimeout(function () {
                if (isIOS9_0_or_1) {
                    locationOpen(u);
                } else {
                    iframeOpen(u);
                }

            }, 0);
        }
        checkIfFail();
    }


    function iframeOpen(url) {
        var iframe = document.createElement("iframe");
        iframe.src = url;
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        setTimeout(function () {
            document.body.removeChild(iframe);
            iframe = null
        }, 0);
    }


    function locationOpen(url) {
        window.location.href = url;
    }

    /**
     *  在不支持统一链接的微信内的话显示引导界面
     * */
    function showWeixinGuide(type) {
        var imgPath;
        if (type == "android") {
            imgPath = "/image/android.png";
        } else {
            imgPath = "/image/ios.png";
        }

        var $content = $(".content-page");
        if ($content.length > 0) {
            $content.append("<div class='app_download_wx'><img src='" + imgPath + "' /></div>");
        } else {
            $("body").append("<div class='app_download_wx'><img src='" + imgPath + "' /></div>");
        }
        $("body").css("overflow", "hidden").bind('touchmove', function (eve) {
            eve.preventDefault();
        });
        $(".app_download_wx").on("click", function () {
            $(this).remove();
            $("body").css("overflow", "auto").unbind('touchmove');
        });
    }

    /**
     * 检测是否失败
     * 失败后跳转到APP 下载
     * */
    function checkIfFail() {
        if (isAndroid) {
            timeoutsArr.push(window.setTimeout(function () {
                if (+(new Date) - StartTime < 3100) {
                    window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=cn.net.yiding"; // app download url
                }
            }, 3e3));
        } else {
            timeoutsArr.push(window.setTimeout(function () {
                console.log(Date.now() - StartTime);
                if (Date.now() - StartTime < 3100) {
                    if (isWeixin) {
                        window.location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=cn.net.yiding"; // app download url
                    } else {
                        window.location.href = "https://itunes.apple.com/cn/app/yi-ding/id1127209482?mt=8"; // app download url
                    }
                }
            }, 3e3));
        }

    }

    function log() {
        console.log("请传入要跳转的APP地址的参数对象，如：{ios:\"allinmdios://meettingBroadcast/meetInfo\",android:\"'allin://com.allin.social:75235?data=mydata\"}");
    }
};

common.recognizeAppShareLink = function (callAppOptions) {
    if (common.getparaNew() && common.getparaNew().share && (common.getparaNew().share.toLowerCase() == "app")) {

        var $content = $(".content-page");
        if ($content.size() == 0) {
            $content = $("body");
        }
        $content.append("<div class='app_download_wx_jump_app'><div class='bg'></div><div class='center'><img src='/images/img50/callApp/share-app-popup.png' alt='' ></div></div>");

        var vp = document.querySelector('meta[name="viewport"]').getAttribute('content');

        var scale = vp.match(/initial\-scale=([\d\.]+)/) || vp.match(/maximum\-scale=([\d\.]+)/);
        if (scale != null && parseInt(scale[1]) == 1) {
            $(".app_download_wx_jump_app").addClass("viewport-small");
        }
        $("video,input,select,textarea,object").hide(); // 隐藏某些不受z-index控制的元素。    当前层 z-index 10050

        // 扩展之前页面上已存在的唤醒参数
        if (typeof callAppOptions != "undefined") { // 若存在定义
            callAppOptions = $.extend(callAppOptions, {el: ".app_download_wx_jump_app .center"});
        } else {
            var callAppOptions = {
                el: ".app_download_wx_jump_app .center",
                ios: "allinmdios://",
                ios9: "http://app.allinmd.cn/applinks.html",
                android: "allin://com.allin.social:75235"
            }
        }
        common.bindCallApp(callAppOptions);

        $("body").css("overflow", "hidden").on("mousemove touchmove", function (e) {
            return false;
        });
        return true; // 分享的链接          7-26      http://cooperation.allinmd.cn/redmine/issues/14431
    } else {
        return false; // 非分享的链接         7-26
    }
};
//Ajax请求方法
/*
* options
*       url 请求地址
*       type 请求方式
*       data 请求参数
*       hasDataCallback 有数据的回调
*       noDataCallback 无数据的回调
*       successCallback 请求成功的回调
*       failCallback 请求失败回调
*
*       tips：以上回调均是可传可不传的
* */

common.ajax = function (options) {
    $.ajax({
        url: options.url,
        type: options.type,
        dataType: 'json',
        data: options.data,
        timeout: 10000,
        beforeSend: function () {
            common.loading.show();
        }
    })
        .done(function (data) {
            console.log("success");
            if (!$.isEmptyObject(data.responseObject.responseData)) {
                options.hasDataCallback && options.hasDataCallback();
            } else {
                options.noDataCallback && options.noDataCallback();
            }
            options.successCallback && options.successCallback();
        })
        .fail(function () {
            console.log("XHR error...");
            common.loading.hide();
            options.failCallback && options.failCallback();
        });
};
//是否江浙沪地区
common.checkJiangZheHu = function () {
    if (this.cache) {
        return this.cache;
    } else {
        var rst = false;
        var cookieLogin = $.cookie("accessLoginVersion");
        if (cookieLogin =="" || cookieLogin == null) {
            $.ajax({
                url: "/call/log/op/location/getIpArea/",
                async: false,
                success: function (data) {
                    if (data && data.responseObject && data.responseObject.responseData) {
                        //if ("zhejiang,jiangsu,shanghai".indexOf(data.responseObject.responseData.city.toLowerCase()) > 0) {
                        if (data.responseObject.responseData.isNew=="1") {
                            rst = true;
                            $.cookie("accessLoginVersion", "planB");
                        } else {
                            $.cookie("accessLoginVersion", "planA");
                        }

                    }
                }
            });
        }else{
            if(cookieLogin == "planB"){
                rst = true;
            }
        }
        this.cache = rst;
        return rst;
    }
};
//是否你国地区
common.checkIsChina = function () {
    if (this.cache) {
        return this.cache;
    } else {
        var rst = false;
        var cookieLogin = $.cookie("accessLoginCountry");
        if (cookieLogin =="" || cookieLogin == null) {
            $.ajax({
                url: "/mcall/log/op/location/getIpArea/",
                async: false,
                success: function (data) {
                    if (data && data.responseObject && data.responseObject.responseData) {
                        //if ("zhejiang,jiangsu,shanghai".indexOf(data.responseObject.responseData.city.toLowerCase()) > 0) {
                        if (data.responseObject.responseData.countryCode=="CN") {
                            rst = true;
                            $.cookie("accessLoginCountry", "CN");
                        } else {
                            $.cookie("accessLoginCountry", "NotCN");
                        }
                    }
                }
            });
        }else{
            if(cookieLogin == "CN"){
                rst = true;
            }
        }
        this.cache = rst;
        return rst;
    }
};

//Localstorate操作方法
var TempCache = {
    cache: function(value) {
        localStorage.setItem("EasyWayTempCache", value);
    },
    getCache: function() {
        return localStorage.getItem("EasyWayTempCache");
    },
    setItem: function(key, value) {
        localStorage.setItem(key, value);
    },
    getItem: function(key) {
        var item = localStorage.getItem(key);
        if (key && key == "fromPage") // 来源页面只能获取一次
            localStorage.removeItem(key);
        return item;
    },
    removeItem: function(key) {
        return localStorage.removeItem(key);
    },
    clear: function() {
        var wxBrowseAccessLockOn = localStorage.getItem("wxBrowseAccessLockOn");
        localStorage.clear();
        localStorage.setItem("wxBrowseAccessLockOn", wxBrowseAccessLockOn);
    }
};
/**
 * @name:
 * @desc:文件/上传相关
 * @example:
 * @depend:
 * @date: 2017/1/22
 * @author: qiangkailiang
 */
common.getFileSize = function (target) {
    var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
    var fileSize = 0;
    if (isIE && !target.files) {
        //          var filePath = target.value;
        //          var fileSystem = new ActiveXObject("Scripting.FileSystemObject");   ／／IE需要安全配置
        //
        //          if(!fileSystem.FileExists(filePath)){
        //             alert("附件不存在，请重新输入！");
        //             return;
        //          }
        //          var file = fileSystem.GetFile (filePath);
        //          fileSize = file.Size;
    } else {
        fileSize = target.files[0].size;
    }

    return fileSize;
};

common.file = {};
common.file.getFileSize = function (target) {
    var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
    var fileSize = 0;
    if(target){
        if (isIE && !target.files) {
//            var filePath = target.value;
//            var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
//
//            if(!fileSystem.FileExists(filePath)){
//               alert("附件不存在，请重新输入！");
//               return;
//            }
//            var file = fileSystem.GetFile (filePath);
//            fileSize = file.Size;
        } else {
            fileSize = target.files[0].size;
        }
    }
    return fileSize  ;
};

//获取文件名不包括后缀
common.file.getName = function (obj) {
    var path = obj//obj.val();
    var pos1 = path.lastIndexOf('/');
    var pos2 = path.lastIndexOf("\\");
    var pos3 = Math.max(pos1, pos2);
    var pos4 = path.lastIndexOf(".");
    var fileName = path.substring(pos3 + 1, pos4);
    var suffixName = path.substring(pos4 + 1, path.length);
    return {
        "fileName": fileName,   //文件名
        "suffixName": suffixName //文件后缀
    };
}
/**
 * @name:
 * @desc:时间处理方法
 * @example:
 * @depend:
 * @date: 2017/1/22
 * @author: qiangkailiang
 */

common.date = {
    local_time: function() {
        var local = new Date();
        var year = local.getFullYear();
        var month = local.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        var day = local.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        var time = local.toTimeString().substr(0, 8);
        var local_time = year + "-" + month + "-" + day + " " + time;
        return local_time;
    },
    am_pm_data: function(ampm) {
        var year = ampm.substr(0, 4);
        var month = ampm.substr(5, 2);
        var day = ampm.substr(8, 2);
        var hour = ampm.substr(11, 2);
        var data_ampm, ampm;
        if (hour < 12) {
            day_ampm = "上午 ";
        } else if (hour == 12) {
            day_ampm = "中午 ";
        } else if (hour > 12) {
            day_ampm = "下午 ";
        }
        var minute = ampm.substr(14, 2);
        ampm = day_ampm + hour + ":" + minute + " " + year + "年" + month + "月" + day + "日";
        return ampm;
    },
    cut_date_msec: function(java_date) {
        java_date = java_date.substr(0, 19);
        return java_date;
    },
    isSameDay: function(day1, day2) {
        return day1.substr(0, 10) == day2.substr(0, 10);
    },
    diffDay_one: function(dateStrBefore, dateStrAfter) {
        var dateStrBefore1 = dateStrBefore.substr(0, 10); //发布时间
        var dateStrAfter1 = dateStrAfter.substr(0, 10); //传入系统时间
        var dateStrBefore2 = dateStrBefore1.replace(/\-/g, '/');
        var dateStrAfter2 = dateStrAfter1.replace(/\-/g, '/');
        var days = 1000 * 60 * 60 * 24;
        var day1 = Date.parse(dateStrBefore2);
        var day2 = Date.parse(dateStrAfter2);
        if (isNaN(day1)) {
            //alert(dateStrBefore + "格式不正确");
            return NaN;
        }
        if (isNaN(day2)) {
            //alert(dateStrAfter + "格式不正确");
            return NaN;
        }
        var d = (day2 - day1) / days;
        if (dateStrBefore1.substring(0,4)!==dateStrAfter2.substring(0,4)){
            return dateStrBefore2;
        }
        if (d < 1) { //秒分小时
            var dateStrB = new Date(dateStrBefore.replace(/\-/g, '/'));
            var dateStrA = new Date(dateStrAfter.replace(/\-/g, '/'));
            var A_B = (dateStrA.getTime() - dateStrB.getTime()) / 1000;
            if (A_B < 60) { //
                return "刚刚"; //A_B+"秒前";
            } else {
                A_B = parseInt(A_B / 60);
                if (A_B < 60) { //
                    return  A_B+"分钟前";
                } else {
                    A_B = parseInt(A_B / 60);
                    if (A_B < 60) {
                        return A_B+"小时前";
                    }
                }
            }
        } else {
            if (d <2) {
                return "昨天";
            } else if (d<365){
                return dateStrBefore.replace(/\-/g, '/').substring(5, 10); //显示日期
                //return dateStrBefore; //显示到秒
            }

        }
    },
    diffDay_two: function(dateStrBefore, dateStrAfter) {
        var dateStrBefore1 = dateStrBefore.substr(0, 10);
        var dateStrAfter1 = dateStrAfter.substr(0, 10);

        var dateStrBefore2 = dateStrBefore1.replace(/\-/g, '/');
        var dateStrAfter2 = dateStrAfter1.replace(/\-/g, '/');

        var days = 1000 * 60 * 60 * 24;
        var day1 = Date.parse(dateStrBefore2);
        var day2 = Date.parse(dateStrAfter2);
        if (isNaN(day1)) {
            //alert(dateStrBefore + "格式不正确");
            return NaN;
        }
        if (isNaN(day2)) {
            //alert(dateStrAfter + "格式不正确");
            return NaN;
        }
        var d = (day2 - day1) / days;
        if (d > 7) {
            //return dateStrBefore; //显示到秒
            return dateStrBefore.substr(0, 10); //显示日期
        } else {
            return "7天前";
        }
    },
    date_word: function(a) {
        var year = a.substr(0, 4);
        var month = a.substr(5, 2);
        var day = a.substr(8, 2);
        if (month < 10) {
            month = month.substr(1, 1);
        }
        if (day < 10) {
            day = day.substr(1, 1);
        }
        a = year + "年" + month + "月" + day + "日";
        return a;
    },
    datafomat: function(tar) {
        var obj = tar;
        var text;
        obj.each(function(i) {
            text = date_word(obj.eq(i).html());
            obj.eq(i).html(text.substring(text.indexOf('年') + 1));
        });
    },
    dateJoint: function(date1, date2, sign, middleJoint) { //date1开始时间，date2结束时间

        var result;
        var signal = (sign != undefined && sign != "") ? sign : '.'; //
        var mJoint = (middleJoint != undefined && middleJoint != "") ? middleJoint : "-";
        var d1 = date1.substring(0, 10).replace(/-/g, signal);
        var d1Arr = d1.toString().split(signal);
        var d2 = date2.substring(0, 10).replace(/-/g, signal);
        var d2Arr = d2.toString().split(signal);
        if (parseInt(d2Arr[0]) > parseInt(d1Arr[0])) { //如果跨年
            result = d1 + mJoint + d2;
        } else { //同一年
            if (parseInt(d2Arr[1]) > parseInt(d1Arr[1])) { //如果结束月份大于开始月份
                result = d1 + mJoint + d2.substring(5, 10);
            } else {
                result = d1 + mJoint + d2.substring(8, 10);
            }
        }
        return result;
    }
};


common.ymd=function(opt) {
    var monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    //出始化年
    var dDate = new Date(),
        dCurYear = dDate.getFullYear(),
        str = "";

    if (opt.default1) {
        opt.year.css(opt.css);

    }
    for (var i = dCurYear; i >= (opt.startYear ? opt.startYear : 1930); i--) {
        if (i == (opt.order ? 1970 : dCurYear)) {
            str = "<option value=" + i + " selected=true>" + i + "</option>";
        } else {
            str = "<option value=" + i + ">" + i + "</option>";
        }
        opt.year.append(str);
        if (opt.defaultYear) {
            opt.year.val(opt.defaultYear)
        }
    }
    //出始化月
    if (opt.defaultMonth) {
        opt.month.css(opt.css);
    }

    if (opt.month) {
        for (var i = (opt.startMonth ? opt.startMonth : 1); i <= (opt.endMonth ? opt.endMonth : 12); i++) {
            if (i == (opt.order ? 7 : (dDate.getMonth() + 1))) {
                str = "<option value=" + (i < 10 ? "0" + i : i) + " selected=true>" + (opt.en ? monthArr[i - 1] : (i < 10 ? "0" + i : i)) + "</option>";
            } else {
                str = "<option value=" + (i < 10 ? "0" + i : i) + ">" + (opt.en ? monthArr[i - 1] : (i < 10 ? "0" + i : i)) + "</option>";
            }
            opt.month.append(str);
        }
    }
    if (opt.defaultMonth) {
        opt.month.val(opt.defaultMonth);
    }
    //调用函数出始化日
    if (opt.day) {
        TUpdateCal(opt);
        opt.year.bind("change", function() {
            if (opt.month.val() != "0") {

                TUpdateCal(opt);
            }
        });
        opt.month.bind("change", function() {
            TUpdateCal(opt);

        });
    }
    if (opt.defaultDay) {
        opt.day.val(opt.defaultDay);
    }
    function TGetDaysInMonth(year, month) {
        month = parseInt(month, 10);
        var dPrevDate = new Date(year, month, 0);
        return dPrevDate.getDate();
    }

    function TUpdateCal(opt) {
        var dDate = new Date();
        daysInMonth = TGetDaysInMonth(opt.year.val(), opt.month.val());
        str = "";
        n = "";
        $("option", opt.day).each(function(i, em) {

            if ($(em).attr("selected")) {
                n = $(em).val();
                if (n < 10) {
                    n = n.substring(1);
                }
                return;
            }
        })
        // opt.day.empty();
        if (opt.default1) {
            opt.day.css(opt.css);

        }

        for (var d = ((opt.month.val() == 05 && opt.startDay) ? opt.startDay : 1); d <= ((opt.month.val() == 10 && opt.endDay) ? 30 : parseInt(daysInMonth)); d++) {

            if (d == (n ? n : (opt.order ? 1 : dDate.getDate()))) {
                str = "<option value=" + (d < 10 ? "0" + d : d) + " selected=true>" + (d < 10 ? "0" + d : d) + "</option>";
            } else {
                str = "<option value=" + (d < 10 ? "0" + d : d) + ">" + (d < 10 ? "0" + d : d) + "</option>";
            }
            opt.day.append(str);
        }
    }
}


//时间匹配
function gettime(obj, time) {
    if (time) {
        obj.find("option").each(function(i, val) {
            if ($(val).val() == time) {
                $(val).attr("selected", true);
                return;
            }
        });
    }

};
//时间判断
function checkEndTime(startTime, endTime) {
    //var start=new Date(startTime.replace(/\-/g, "\/"));
    //var end=new Date(endTime.replace(/\-/g, "\/"));
    if (endTime) {
        var start = new Date(startTime.substring(0, 4), startTime.substring(5, 7), startTime.substring(8, 10), "", "", "");
        var end = new Date(endTime.substring(0, 4), endTime.substring(5, 7), endTime.substring(8, 10), "", "", "");
        if (end < start) {
            return false;
        }
    }
    return true;
}
//格式化英文的月份
function getEnTime(opt) {
    year = monthEn = day = '';
    if (opt.date) {
        year = opt.date.substring(0, 4);
        month = opt.date.substring(5, 7);
        if (month < 10) {
            monthEn = monthArr[month.substring(1) - 1];
        } else {
            monthEn = monthArr[month - 1];
        }
        day = opt.date.length > 7 ? opt.date.substring(8, 10) : 01;

    }
    return {
        'year': year,
        'month': monthEn,
        'day': day
    }
}

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
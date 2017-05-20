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

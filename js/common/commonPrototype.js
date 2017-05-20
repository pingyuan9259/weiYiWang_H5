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
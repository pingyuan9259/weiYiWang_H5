/**
 * @name:简易表单验证
 * @desc:
 * @example:
 * @depend:
 * @date: 2015/12/30
 * @author: qiangkailiang
 * @转载请注明作者github:khallmader@gmail.com,感谢您的合作
 */

(function ($) {
    var Validate = function (element, config) {
        var that = this;
        this.config = $.extend(true, $.fn.validate.config, config);
        this.element = element;
        $(this.element).addClass('validateEle');
        this.init();
    };
    Validate.prototype = {
        //环境类
        init: function () {
            this.addValidate();
        },
        addValidate: function () {
            var that = this;

            $(this.config.rules).each(function (index, element) {
                var rule = element.rule.split(":");
                var msg = VerifiPolicy[rule[0]](that.element.value, element.msg, rule[1]);
                if (msg) {

                    that.showValidateTips(msg);
                    return false;
                } else {
                    that.removeValidateTips();
                }
            })
        },
        removeValidateTips: function () {
            var style = this.config.hideStyle;
            var that = this;
            if (typeof(this.config.errorEle) === "function") {
                $(this.element).attr("data-validate", true);
            } else {
                if (style.animate) {
                    for (var i in style) {
                        that.config.errorEle.animate(i, style[i]);
                    }
                } else {
                    for (var i in style) {
                        that.config.errorEle.css(i, style[i]);
                    }
                }
                $(this.element).attr("data-validate", true);
                this.config.errorEle.text(tips);
            }
        },
        showValidateTips: function (tips) {
            var style = this.config.showStyle;
            var that = this;

            if (typeof(this.config.errorEle) === "function") {
                this.config.errorEle(tips)
                $(this.element).attr("data-validate", false);
            } else {
                if (style.animate) {
                    for (var i in style) {
                        that.config.errorEle.animate(i, style[i]);
                    }
                } else {
                    for (var i in style) {
                        that.config.errorEle.css(i, style[i]);
                    }
                }
                $(this.element).attr("data-validate", true);
                this.config.errorEle.text(tips);
            }
        }
    };
    //策略类
    var VerifiPolicy = {
        // 判断是否为空
        isNoEmpty: function (value, errorMsg) {
            if (value == '') {
                return errorMsg;
            }
        },
        // 判断最小长度
        minLength: function (value, errorMsg, length) {
            if (value.length < length) {
                return errorMsg;
            }
        },
        // 判断是否为手机号
        isMobile: function (value, errorMsg) {
            if (!(/^(127|13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/).test(value)) {
                return errorMsg;
            }
        },
        //判断身份证号码格式是否正确
        identityCard: function (Obj, errorMsg) {
            var city = {
                11: "北京",
                12: "天津",
                13: "河北",
                14: "山西",
                15: "内蒙古",
                21: "辽宁",
                22: "吉林",
                23: "黑龙江 ",
                31: "上海",
                32: "江苏",
                33: "浙江",
                34: "安徽",
                35: "福建",
                36: "江西",
                37: "山东",
                41: "河南",
                42: "湖北 ",
                43: "湖南",
                44: "广东",
                45: "广西",
                46: "海南",
                50: "重庆",
                51: "四川",
                52: "贵州",
                53: "云南",
                54: "西藏 ",
                61: "陕西",
                62: "甘肃",
                63: "青海",
                64: "宁夏",
                65: "新疆",
                71: "台湾",
                81: "香港",
                82: "澳门",
                91: "国外 "
            };
            var tip = "",
                pass = true;
            if (!Obj || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(Obj)) {
                //tip = "身份证号格式错误";
                pass = false;
            } else if (!city[Obj.substr(0, 2)]) {
                //tip = "地址编码错误";
                pass = false;
            } else {
                //18位身份证需要验证最后一位校验位
                if (Obj.length == 18) {
                    Obj = Obj.split('');
                    //∑(ai×Wi)(mod 11)
                    //加权因子
                    var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
                        parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2],//校验位
                        sum = 0,
                        ai = 0,
                        wi = 0;
                    for (var i = 0; i < 17; i++) {
                        ai = Obj[i];
                        wi = factor[i];
                        sum += ai * wi;
                    }
                    var last = parity[sum % 11];
                    if (parity[sum % 11] != Obj[17]) {
                        //tip = "校验位错误";
                        pass = false;
                    }
                }
            }
            //if(!pass){
            //    console.log(tip);
            //}
            if (pass == false) {
                return errorMsg
            }
            //return pass;
        },
        //护照校验
        protection: function (value, errorMsg) {
            var re = new RegExp("(^([PSE]{1}\\d{7}|[GS]{1}\\d{8})$)");//E字打头的后面不知道要跟几位
            var card = value.toUpperCase();
            if (!re.test(card)) {
                return errorMsg;
            }
        },
        //军官证校验
        officersCard: function (value, errorMsg) {
            var re = new RegExp("^([\u4e00-\u9fa5]{1,}[\u4e00-\u9fa50-9()（）-]{5,})$");
            if (!re.test(value)) {
                return errorMsg;
            }
        },
        //判断最大长度
        maxLength: function (value, errorMsg, length) {
            if (value.length > length) {
                return errorMsg;
            }
        },
        //判断邮箱
        isMailbox: function (value, errorMsg) {
            if (!(/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g).test(value)) {
                return errorMsg;
            }
        },
        //判断特殊字符
        normalString: function (value, errorMsg) {
            if (/[@\/'\\"#$%&\^*]/.test(value)) {
                return errorMsg;
            }
        },
        //判断数值最大值
        maxNumber: function (value, errorMsg, length) {
            if (parseInt(value) > length) {
                return errorMsg;
            }
        },
        minNumber: function (value, errorMsg, length) {
            if (parseInt(value) < length) {
                return errorMsg;
            }
        },
        //判断下拉选择框是否选中
        //默认：未选中状态option[value]=0
        selected: function (value, errorMsg) {
            if (value == 0) {
                return errorMsg;
            }
        }
    };

    $.fn.validate = function (config) {
        return $(this).each(function (index, element) {
            var v = new Validate(element, config);
            return v;
        })
    };
    $.fn.validate.config = {
        showStyle: {
            animate: false,
            display: 'block'
        },
        hideStyle: {
            animate: false,
            display: 'none'
        }
    };
})(jQuery);
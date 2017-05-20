/**
 * @name:双击编辑/单击选择功能
 * @desc:双击开启编辑、单击单选
 * @example:
 * $(".dbConfig").dbConfig({
        ensureBtn:"确定", //编辑态确定按钮文本
        cancelBtn:"取消", //编辑态取消按钮文本
        clearBtn:true, //编辑态是否需要文本清除按钮
        selectClass:"dbConfig-selected", //单选态选中时样式Class
        configCallback:function () {
        //    开启编辑时回调
        },
        selectCallback:function () {
        //单选选中时回调
        },
        saveCallback:function(){
            console.log($(".dbConfig-text").text());
        //    保存成功时回调
        },
        cancelCallback:function () {
        //取消编辑时回调
        }
    });
 * @depend:
 * @date: 2017/2/6
 * @author: qiangkailiang
 * @转载请注明作者github:khallmader@gmail.com,感谢您的合作
 */
;
(function ($) {
    var DbConfig = function (element, config) {
        this.element = element;
        this.config = $.extend(true, $.fn.dbConfig.defaultConfig, config);

        this.originContent = "";
        this.configEle = $("<input type='text' class='dbConfig-input'>");
        this.closeBtn = this.config.clearBtn ? $("<i class='dbConfig-closeBtn'>x</i>") : "";
        this.btnTemplate = "<figure class='dbConfig-btn'>" +
            "<button class='dbConfig-ensureBtn'>" + this.config.ensureBtn + "</button>" +
            "<button class='dbConfig-cancelBtn'>" + this.config.cancelBtn + "</button>" +
            "</figure>";


        this.init();
    };

    DbConfig.prototype = {
        init: function () {
            this.clickTimeRuner = "";

            this.clickSelect();
            this.dbclickConfig();
        },

        dbclickConfig: function () {
            var that = this;
            $(this.element).on("dblclick", function () {
                clearTimeout(that.clickTimeRuner);
                if (!$(this).hasClass("dbConfig-on")) {
                    that.originContent = $(this).find('.dbConfig-text').text();
                    $(this).find(".dbConfig-text").hide().text("");
                    $(this).append(that.configEle.val(that.originContent));
                    $(this).append(that.closeBtn);
                    $(this).addClass("dbConfig-on");
                    $(this).append(that.btnTemplate);

                    that.config.configCallback && that.config.configCallback();
                }
            })
        },
        clickSelect: function () {
            var that = this;
            $(this.element).on("click", function (e) {
                clearTimeout(that.clickTimeRuner);
                if (!$(this).hasClass("dbConfig-on")) {
                    that.clickTimeRuner = setTimeout(function () {
                        if ($(".dbConfig-text").hasClass(that.config.selectClass)) {
                            $(".dbConfig-text").removeClass(that.config.selectClass);
                        } else {
                            $(".dbConfig-text").addClass(that.config.selectClass);
                        }
                        that.config.selectCallback && that.config.selectCallback();
                    }, 350);
                }

                if ($(e.target).hasClass('dbConfig-closeBtn')) {
                    that.config.clearBtn ? that.configEle.val('') : "";
                }

                if ($(e.target).parent().hasClass("dbConfig-btn")) {
                    var ele = $(e.target);
                    if (ele.hasClass('dbConfig-ensureBtn')) {
                        that.configSave();
                    } else if (ele.hasClass('dbConfig-cancelBtn')) {
                        that.configCancel();
                    }
                }
            })
        },
        configSave: function () {
            var content = this.configEle.val();
            this.configEle.remove();
            $(".dbConfig-btn").remove();
            this.config.clearBtn ? this.closeBtn.remove() : "";
            $(this.element).removeClass("dbConfig-on");
            $(this.element).find(".dbConfig-text").show().text(content);

            this.config.saveCallback && this.config.saveCallback();

        },
        configCancel: function () {
            this.configEle.remove();
            $(".dbConfig-btn").remove();
            this.config.clearBtn ? this.closeBtn.remove() : "";
            $(this.element).removeClass("dbConfig-on");
            $(this.element).find(".dbConfig-text").show().text(this.originContent);

            this.config.cancelCallback && this.config.cancelCallback();
        }

    };

    $.fn.dbConfig = function (config) {
        return $(this).each(function (index, element) {
            var d = new DbConfig(element, config);
            return d;
        })
    };
    $.fn.dbConfig.defaultConfig = {
        ensureBtn: "保存",
        cancelBtn: "取消"
    };

})(jQuery);
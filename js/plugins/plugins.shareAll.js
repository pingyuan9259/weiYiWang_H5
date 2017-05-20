/**
 * 功能描述：  全站分享功能包括(动态，微信，微博，qq空间，qq)
 * 使用方法:   var share=new ShareAll({
 *               url: window.location.href,
 *               qqTitle: "qq分享标题",
 *               qqZoneSummary: "QQ分享正文",
 *               sinaTitle: "微博分享标题",
 *               sinaSummary: "微博分享正文，该项可传可不传，微博分享无正文",
 *               qqZoneTitle: "qq空间标题",
 *               qqSummary: "qq空间正文",
 *               hasH5:"true则有微信分享，无H5页面则不做微信扫码分享"
 *               h5Url:"",微信扫码跳转页面
 *               qqCallback: function() {
 *                  qq分享成功回调
 *               }, 
 *               qZoneCallback: function() {
 *                  qq空间分享成功回调
 *               }, 
 *               weiboCallback: function() {
 *                  微博分享成功回调
 *               },
 *               clickCallback:function(){
 *                  分享按钮点击执行回调
 *               }
 *            });
 * 注意事件：
 * 引入来源：
 *
 * Created by Sunhaibin on 2016/07/20.
 * Fixed by Qiangkailiang on 2017/02/08
 */
;
(function ($) {
    var ShareAll = function (options) {
        this.init(options);
    };

    ShareAll.prototype = {
        init: function (options) {
            var defaultObj = {
                url: window.location.href,
                title: document.title,
                pic: "",
                hasH5: true,
                hasWeiboImg: true,
                hasQzoneImg: true,
                hasQfriendImg: true
            };
            this.options = $.extend(defaultObj, options);
            this.layout();

        },
        layout: function () {
            if ($(".share").size() != 0) {
                $(".share").remove();
            }
            var that = this;
            setTimeout(function () {
                $(".al-rightNav").append('<div class="share rightNav" id="share">' +
                    '<i class="icon-share" style="display: block;"></i>' +
                    '<p class="shareTxt" style="display: none;">分享</p>' +
                    '<article class="sharePic" id="yd-shareBox" style="display: none;">' +
                    (that.options.hasH5 ? '<b class="yd-weixin"><i class="icon-weixin"></i><em>微信</em></b>' : '<section></section>') +
                    '<section class="Ev-shareWeixinCode" style="display: none;position: absolute;bottom: 100%;">' +
                    '<h3>使用微信扫描二维码</h3>' +
                    '</section>' +
                    '<b class="yd-qqFriends">' +
                    '<i class="icon-qq"></i>' +
                    '<em>QQ</em>' +
                    '</b>' +
                    '<b class="yd-qZone">' +
                    '<i class="icon-zone"></i>' +
                    '<em>QQ空间</em>' +
                    '</b>' +
                    '<b class="yd-weibo">' +
                    '<i class="icon-weibo"></i>' +
                    '<em>微博</em>' +
                    '</b>' +
                    '</article>' +
                    '</div>');

                $(".share").on("click", function () {
                    if ($("#yd-shareBox").is(":visible")) {
                        $("#yd-shareBox").hide();
                    } else {
                        $("#yd-shareBox").show();
                        that.options.clickCallback && that.options.clickCallback();
                    }
                });
                that.container = $("#yd-shareBox");
                that.qZone();
                that.weibo();
                that.qFriends();
                that.weixin();
            }, 10)
        },

        qZone: function () {
            var that = this;

            this.container.on("click", ".yd-qZone", function () {
                var qzoneUrl = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=" +
                    encodeURIComponent(that.options.qqZoneTitle ? that.options.qqZoneTitle : that.options.title) +
                    "&url=" + encodeURIComponent(that.options.url) +
                    (that.options.qqZoneSummary ? "&summary=" + encodeURIComponent(comm.getStrLen(that.options.qqZoneSummary, 50)) : '') +
                    (that.options.hasQzoneImg ? (that.options.pic ? "&pics=" + encodeURIComponent(that.options.pic ? that.options.pic : '') : '') : '');

                window.open(qzoneUrl);


                that.options.qZoneCallback && that.options.qZoneCallback();
                return false;
            });
        },
        weibo: function () {
            var that = this;

            this.container.find(".yd-weibo").on("click", function () {
                var sinaUrl = "http://service.weibo.com/share/share.php?title=" +
                    encodeURIComponent(that.options.sinaTitle) +
                    "&url=" + encodeURIComponent(that.options.url) +
                    (that.options.sinaSummary ? "&summary=" + encodeURIComponent(comm.getStrLen(that.options.sinaSummary, 50)) : '') +
                    (that.options.hasWeiboImg ? (that.options.pic ? "&pic=" + encodeURIComponent(that.options.pic) : '') : '');
                window.open(sinaUrl);
                that.options.weiboCallback && that.options.weiboCallback();
                return false;
            });
        },
        qFriends: function () {
            var that = this;

            this.container.find(".yd-qqFriends").on("click", function () {
                var qqUrl = "http://connect.qq.com/widget/shareqq/index.html?title=" +
                    encodeURIComponent(that.options.qqTitle ? that.options.qqTitle : that.options.title) +
                    "&url=" + encodeURIComponent(that.options.url) +
                    (that.options.qqSummary ? "&summary=" + encodeURIComponent(comm.getStrLen(that.options.qqSummary, 50)) : '') +
                    (that.options.hasWeiboImg ? (that.options.pic ? "&pics=" + encodeURIComponent(that.options.pic ? that.options.pic : '') : '') : '');
                window.open(qqUrl);
                that.options.qqCallback && that.options.qqCallback();
                return false;
            });
        },
        weixin: function () {
            var that = this;

            this.container.find(".yd-weixin").on("click", function () {
                that.weixingup = 0;
                if (!that.options.h5Url) {
                    that.options.h5Url = that.options.url;
                }
                var erweima = $(".Ev-shareWeixinCode");
                if (that.weixingup === 0) {
                    // 是否支持canvas
                    that.weixingup = 1;
                    if (!!document.createElement('canvas').getContext) {
                        console.log()
                        if ($(".Ev-shareWeixinCode canvas").size() !== 0) {
                            if ($(".Ev-shareWeixinCode").is(":visible")) {
                                $(".Ev-shareWeixinCode").hide();
                            } else {
                                $(".Ev-shareWeixinCode").show();
                            }
                        } else {
                            erweima.show().qrcode({
                                text: that.options.h5Url
                            });
                            erweima.find("canvas").css({
                                "width": "150px",
                                "height": "150px",
                            });
                        }
                    } else {
                        erweima.show().find(".qrcodeTable").qrcode({
                            render: "table",
                            text: that.options.h5Url
                        });
                        $("canvas", that.parent).css({
                            "margin-left": "62px",
                            "position": "absolute",
                            "width": "150px",
                            "height": "150px",
                            "left": "0"
                        });
                    }
                } else {
                    that.weixingup = 0;
                    erweima.hide();
                    var ele = $(this).find("table");
                    if (ele.length > 0) {
                        ele.remove();
                        $(".qrcodeTable", that.parent).removeAttr("style");
                    } else {
                        $("canvas", that.parent).remove();
                    }

                }
                return false;
            });
        },

    };
    window.ShareAll = ShareAll;
})(jQuery);

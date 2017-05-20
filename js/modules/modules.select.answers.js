/**
 * @Desc：症状描述
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang on 2017/2/28
 */

modules.selectAnswers = function () {
    var container = {
        init: function () {
            this.listRouter();
            this.selectSymptom();
            this.getAnswersCache();
            this.symptomQuery();
            this.inputCountLimit();
            this.confirmNext();
        },
        config: {
            answers: {
                1: {},
                2: {},
                3: {},
                4: {},
                5: {},
                main: ""
            }
        },
        template: {
            symptomQuery: function (data) {
                return '<section class="symptom-detail-desc">' +
                    '<figure>' +
                    '<img src="/image/img00/patientConsult/pain_detail.png" alt="">' +
                    '</figure>' +
                    '<figcaption>放射痛：病人除感觉患病器官的局部疼痛外，尚可感到远离该器官的某部体表或深部组织疼痛，这种疼痛称为放射痛。' +
                    '</figcaption>' +
                    '</section>';
            },
            answersList: function (data) {

            }
        },
        XHRList: {
            query: "",
            submit: ""
        },
        //全页路由操作
        listRouter: function () {
            var that = this;
            $(".next").on("click", function () {
                return that.nextBtnValidate();
            });
            $(".prev").on("click", function () {
                return that.backToLastRouter();
            });
        },
        //选择症状
        selectSymptom: function () {
            $(".util-selector").on("click", '[data-role="selector"]', function (e) {
                var selector = $(this).parent();
                var router = $("html").attr("view");
                e.stopPropagation();

                if (selector.hasClass('sSelector')) {
                    $(this).addClass('selected').siblings().removeClass('selected');
                } else if (selector.hasClass('mSelector')) {
                    $(this).toggleClass("selected");
                }

                if ($(".symptom-desc-inner[data-sort='" + router + "']").find(".util-selector").eq(0).find(">.selected").size() === 0) {
                    $(".symptom-desc-controller[data-sort='" + router + "']").find(".next").addClass("unfinish");
                } else {
                    $(".symptom-desc-controller[data-sort='" + router + "']").find(".next").removeClass("unfinish");
                }
            });
        },
        //显示症状详情
        symptomQuery: function () {
            var that = this;
            $(".icon-pain-detail").on("click", function (e) {
                e.stopPropagation();
                var ele = $(this).parents("[data-role='selector']").find(".symptom-detail-desc");
                if (ele.is(":visible")) {
                    ele.hide();
                } else {
                    ele.show();
                }

                that.queryMessage();
            })
        },
        //获取症状详情
        queryMessage: function () {
            var that = this;
            $.ajax({
                url: that.XHRList.query,
                type: 'POST',
                dataType: "json",
                timeout: 10000,
                beforeSend: function () {
                    common.loading.show()
                }
            })
                .done(function (data) {
                    common.loading.hide()
                })
                .fail(function () {
                    common.loading.hide()
                });
        }
        ,
        //前往下一步的验证...
        nextBtnValidate: function () {
            var that = this,
                router = $("html").attr("view");
            //第一级没有选中任何答案...
            if ($(".symptom-desc-inner[data-sort='" + router + "']").find(".util-selector").eq(0).find(">.selected").size() === 0) {
                return false;
                //    第一级有选中答案，第二级没有任何选中...
            } else if ($(".selected .util-selector").size() !== 0) {
                $(".symptom-desc-controller.active .unfinish").removeClass("unfinish");
                if ($(".selected").find(".util-selector>.selected").size() === 0) {
                    common.alertBox({
                        content: "您还有未完成的症状描述",
                        ensure: "确定",
                        ensureCallback: function () {

                        }
                    });
                    return false;
                } else {
                    $(".symptom-desc-controller.active .unfinish").removeClass("unfinish");
                    that.saveSelectAnswers(router);
                    return that.firstAnswerQuestion();
                }
                //    已通过选中逻辑，下一步后保存...
            } else {
                that.saveSelectAnswers(router);
                return that.firstAnswerQuestion();

            }
        },
        //第一题中，存在主从症状的询问...
        firstAnswerQuestion: function () {
            var that = this;
            var router=$("html").attr("view");

            if ($(".symptom-desc-inner[data-sort='" + router + "']").find(".util-selector").eq(0).find(">.selected").size() > 1) {
                if ($("html").attr("view") === "consult1" && $(".selected").parents(".symptom-desc-second-form").size() === 0) {
                    var btnList = [];
                    $(".symptom-desc-inner[data-sort='consult1'] .selected").each(function (index, element) {
                        if ($(element).parents(".symptom-desc-second-form").size() === 0) {
                            btnList.push({
                                className: "btn-hollow main-symptom",
                                id: $(element).attr("data-id"),
                                content: $(element).find(">p>span").text(),
                                href: "javascript:void(0)"
                            })
                        }
                    });
                    common.btnBox({
                        title: "哪种不适最明显？",
                        direction: "horizontal",
                        btn: btnList
                    });
                    $(".main-symptom").on("click", function () {
                        that.config.answers.main = $(this).attr("id");
                        $(".btnBox-tips").remove();
                        Q.go('consult2');
                    });
                    return false;
                }
            }
        },
        //保存本页选择的答案...
        saveSelectAnswers: function (router) {
            var container = $(".symptom-desc-inner[data-sort='" + router + "']");
            var firstS = [], secondS = [];

            //第一级...
            container.find(".util-selector>.selected").each(function (index, element) {
                if ($(element).parents(".selected").size() === 0) {
                    firstS.push($(element).attr("data-id"));
                }
            });
            //第二级...
            $(".selected").find(".util-selector>.selected").each(function (index, element) {
                secondS.push($(element).attr("data-id"));
            });
            this.config.answers[router.substr(-1, 1)] = {
                first: firstS.join(","),
                second: secondS.join(",")
            };
            localStorage.setItem("answers", JSON.stringify(this.config.answers))
        },
        //    假若返回上一步，当前页的答案清空，上一页保留...
        backToLastRouter: function () {
            var router = $("html").attr("view"),
                container = $(".symptom-desc-inner[data-sort='" + router + "']");
            $(".symptom-desc-controller[data-sort='" + router + "']").find(".next").addClass("unfinish");
            container.find(".symptom-desc-item").each(function (index, element) {
                $(element).removeClass("selected");
            });
            this.config.answers[router.substr(-1, 1)] = {};
        },
        //根据缓存调取用户退出前作答的数据...
        getAnswersCache: function () {
            //新入用户，可能无作答记录...
            var router = $("html").attr("view");
            if (localStorage.getItem("answers")) {
                this.config.answers = JSON.parse(localStorage.getItem("answers"));
                for (var i in this.config.answers) {
                    $(this.config.answers[i]).each(function (index, element) {
                        if (element.first) {
                            var container = $(".symptom-desc-inner[data-sort='consult" + i + "']");
                            var first = element.first.split(",");
                            var second = element.second.split(",");

                            $(first).each(function (index, element) {
                                container.find(".util-selector>.symptom-desc-item[data-id='" + element + "']").addClass("selected");
                            });

                            $(second).each(function (index, element) {
                                container.find(".util-selector>.symptom-desc-item[data-id='" + element + "']").addClass("selected");
                            });
                        }
                    })
                }

                if ($(".symptom-desc-inner[data-sort='" + router + "']").find(".util-selector").eq(0).find(">.selected").size() === 0) {
                    $(".symptom-desc-controller[data-sort='" + router + "']").find(".next").addClass("unfinish");
                } else {
                    $(".symptom-desc-controller[data-sort='" + router + "']").find(".next").removeClass("unfinish");
                }
            }
        },
        //确认下一题或有伴随症状...
        confirmNext: function () {
            var that = this;
            $(".sure").on("click", function () {
                common.btnBox({
                    title: "您还有其他伴随症状吗？",
                    direction: "horizontal",
                    btn: [
                        {
                            className: "btn-primary no-other-symptom",
                            id: "",
                            content: "没有了",
                            href: "/pages/imScene/im_main_scene.html"
                        },
                        {
                            className: "btn-hollow has-other-symptom",
                            id: "",
                            content: "有",
                            href: "select_parts.html"
                        }
                    ]
                })
            });
            //没有其他症状...执行后跳转至IM
            $("body").on("click", ".no-other-symptom", function () {
                that.allAnswerSubmit();
            });
            //有其他症状...返回部位选择并记录次数为1
            //Q：次数谁来记录？
            $("body").on("click", ".has-other-symptom", function () {
                that.allAnswerSubmit();
            });
        },
        //答案提交...
        allAnswerSubmit: function () {
            $.ajax({
                url: that.XHRList.submit,
                type: 'POST',
                dataType: "json",
                data: this.config.answers,
                timeout: 10000,
                beforeSend: function () {
                    common.loading.show()
                }
            })
                .done(function (data) {
                    common.loading.hide()
                })
                .fail(function () {
                    common.loading.hide()
                });
        },
        //    输入字数限制
        inputCountLimit: function () {
            $(".symptom-desc-others-content").on("keyup", function () {
                if ($(this).val().length > 500) {
                    $(this).val($(this).val().substring(0, 500));
                }
            })
        }
    };
    container.init();
};
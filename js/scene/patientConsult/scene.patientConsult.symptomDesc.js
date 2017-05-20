/**
 * @Desc：症状描述
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang on 2017/2/28
 */
$(function () {
    var symptomDesc = {
        init: function () {
            this.listRouter();
            // this.getAnswersCache();
            this.getAnswerList();
            this.symptomQuery();
            this.inputCountLimit();
            this.confirmNext();
            this.selectSymptom();

        },
        config: {
            caseId: "",
            visitSiteId: "1",
            patientId: common.getpara().patientId,
            optionList: [],
        },
        template: {
            symptomQuery: function (data) {
                return '<section class="symptom-detail-desc">' +
                    '<figure>' +
                    (function (iData) {
                        var result = "";
                        $(iData).each(function (index, element) {
                            result += '<img src="' + element.optionAttUrl + '" alt="">';
                        });
                        return result;

                    }(data.optionAttList)) +

                    '</figure>' +
                    '<figcaption>' + data.optionDesc + '</figcaption>' +
                    '</section>';
            },
            answersList: function (index, total, data) {
                var that = this;

                return '<section class="symptom-desc-inner" data-sort="consult' + (parseInt(index) + 1) + '" data-id="' + data.questionId + '">' +
                    '<section class="symptom-desc-form">' +
                    '<header class="symptom-desc-title">' +
                    '<p><span class="num"><em>' + (parseInt(index) + 1) + '</em>/' + total + '</span>' + data.questionDesc + (parseInt(data.questionType) === 1 ? '</p>' : '<span class="tips">(可多选)</span></p>') + (parseInt(data.isAttachment) === 1 ? '<i class="icon-pain-detail"></i>' : "") +
                    '</header>' +
                    '<section class="util-selector ' + (parseInt(data.questionType) === 1 ? " sSelector" : "mSelector") + '">' +
                    (function (sData) {
                        var result = "";
                        $(sData).each(function (index, element) {
                            result += that.answerItem(element, data.questionType);
                        });
                        return result;
                    }(data.optionList1)) +
                    '</section>' +
                    '</section>' +
                    '</section>';
            },
            answerItem: function (data, type) {
                var result = "", that = this;
                switch (parseInt(type)) {
                    case 1:
                        result = '<section class="symptom-desc-item single-choices" data-role="selector" data-id="' + data.optionId + '">' +
                            '<p><i class=" icon-select"></i><span>' + data.optionDesc + (parseInt(data.isAttachment) === 1 ? '<i class="icon-pain-detail"></i>' : '') + '</span></p>' +
                            (function (qData) {
                                var result = "";
                                $(qData).each(function (index, element) {
                                    result += that.childItem(element)
                                });
                                return $.isEmptyObject(qData) ? "" : result;
                            }(data.questionList2)) +
                            '</section>';
                        break;
                    case 2:
                        result = '<section class="symptom-desc-item multiple-choices" data-role="selector" data-id="' + data.optionId + '">' +
                            '<p><i class=" icon-select"></i><span>' + data.optionDesc + '<i class="icon-arrow"></i></span></p>' +
                            (function (qData) {

                                $(qData).each(function (index, element) {
                                    result += that.childItem(element)
                                });
                                return $.isEmptyObject(qData) ? "" : result;
                            }(data.questionList2)) +
                            '</section>';
                        break;
                }
                return result;
            },
            childItem: function (data) {
                var that = this;
                return '<section class="symptom-desc-form symptom-desc-second-form" data-role="selector">' +
                    '<header class="symptom-desc-title">' +
                    '<h4>' + data.questionDesc + '</h4>' +
                    '</header>' +
                    '<section class="util-selector ' + (parseInt(data.questionType) === 1 ? " sSelector" : "mSelector") + '">' +
                    (function (sData) {
                        var result = "";
                        $(sData).each(function (index, element) {
                            result += that.answerItem(element, data.questionType);
                        });
                        return result;
                    }(data.optionList2)) +
                    '</section>' +
                    '</section>';
            },
            routerController: function (data) {
                return '<footer class="symptom-desc-controller" data-sort="' + data.router + '">' +
                    '<a href="' + data.prevRouter + '" class="btn-hollow ' + data.prevClass + '">' + data.prevText + '</a>' +
                    '<a href="' + data.nextRouter + '" class="btn-primary ' + data.nextClass + '">' + data.nextText + '</a>' +
                    '</footer>';
            }

        },
        XHRList: {
            query: "http://rap.taobao.org/mockjsdata/14424/getMapList2",//"/mcall/cms/part/question/relation/v1/getMapList/",
            createMedicalRecord: "/mcall/customer/patient/case/v1/create/",
            submitMedicalRecord: "/mcall/customer/patient/case/option/v1/create/",
            symptomDetail: "/mcall/comm/data/symptom/option/v1/getMapById/"
        },
        //全页路由操作
        listRouter: function () {
            var that = this;

            Q.reg('consult1', function () {

            });
            Q.reg('consult2', function () {

            });
            Q.reg('consult3', function () {

            });
            Q.reg('consult4', function () {

            });
            Q.reg('consult5', function () {

            });

            Q.init({
                index: 'consult1'/* 首页地址 */,
                pop: function (L) {
                    that.getButtonUnfinish(L);
                }
            });
            $("body").on("click", ".next", function () {
                return that.nextBtnValidate();
            });
            $("body").on("click", ".prev", function () {
                return that.backToLastRouter();
            });
        },
        getAnswerList: function () {
            var that = this;

            $.ajax({
                url: this.XHRList.query,
                type: 'POST',
                dataType: "json",
                data: {
                    paramJson: $.toJSON({
                        partId: "1488513378853",//common.getpara().partId,
                        isValid: "1",
                        sortType: ""
                    })
                },
                timeout: 10000,
                beforeSend: function () {
                    common.loading.show()
                }
            })
                .done(function (data) {
                    common.loading.hide();
                    if (data.responseData) {
                        var dataList = data.responseData.dataList;
                        if (dataList && dataList.length !== 0) {
                            var total = dataList.length;
                            $(dataList).each(function (index, element) {
                                $(".main-inner-content").append(that.template.answersList(index, total, element));
                                that.config.optionList.push({
                                    partId: common.getpara().partId,
                                    questionId: element.questionId,
                                    optionIdList: "",
                                    mainOptionId: ""
                                });
                                var data = {
                                    router: "consult" + (index + 1),
                                    prevRouter: (index === 0) ? "select_parts.html" : "#!consult" + index,
                                    nextRouter: (index === total - 1) ? "javascript:void(0)" : "#!consult" + (index + 2),
                                    prevClass: "prev",
                                    nextClass: (index === total - 1) ? "sure" : "next",
                                    prevText: (index === 0) ? "返回" : "上一步",
                                    nextText: (index === total - 1) ? "提交" : "下一步"
                                };
                                $("body").append(that.template.routerController(data));
                            });
                            $(".symptom-desc-controller").eq(0).addClass("active");
                            $(".symptom-desc-inner").eq(0).addClass("active");
                            that.getButtonUnfinish($("html").attr("view"))
                        }
                    }
                })
                .fail(function () {
                    common.loading.hide()
                });
        },
        //监测题目的选中情况并响应到按钮的置灰情况...
        getButtonUnfinish: function (router) {
            $(".symptom-desc-inner").removeClass('active');
            $(".symptom-desc-controller").removeClass("active");
            $(".symptom-desc-controller[data-sort='" + router + "']").addClass('active');
            $(".symptom-desc-inner[data-sort='" + router + "']").addClass('active');
            if ($(".symptom-desc-inner[data-sort='" + router + "']").find(".util-selector").eq(0).find(">.selected").size() === 0) {
                $(".symptom-desc-controller[data-sort='" + router + "']").find(".next,.sure").addClass("unfinish");
            } else {
                $(".symptom-desc-controller[data-sort='" + router + "']").find(".next,.sure").removeClass("unfinish");
            }
        },
        //症状选择
        selectSymptom: function () {
            $("body").on("click", '.util-selector [data-role="selector"]', function (e) {
                var selector = $(this).parent();
                var router = $("html").attr("view");
                e.stopPropagation();
                if (!$(e.target).hasClass("symptom-detail-desc") && $(e.target).parents(".symptom-detail-desc").size() === 0) {
                    $(this).find('.symptom-detail-desc').hide();
                } else if ($(e.target).hasClass("symptom-detail-desc") || $(e.target).parents(".symptom-detail-desc").size() !== 0) {

                    return false;
                }
                if (selector.hasClass('sSelector')) {
                    $(this).addClass('selected').siblings().removeClass('selected');
                } else if (selector.hasClass('mSelector')) {
                    $(this).toggleClass("selected");
                }

                if ($(".symptom-desc-inner[data-sort='" + router + "']").find(".util-selector").eq(0).find(">.selected").size() === 0) {
                    $(".symptom-desc-controller[data-sort='" + router + "']").find(".next,.sure").addClass("unfinish");
                } else {
                    $(".symptom-desc-controller[data-sort='" + router + "']").find(".next,.sure").removeClass("unfinish");
                }
            });
        },
        //显示症状详情
        symptomQuery: function () {
            var that = this;
            $("body").on("click", function (e) {
                if (!$(e.target).hasClass(".symptom-detail-desc") && $(e.target).parents(".symptom-detail-desc").size() === 0) {
                    $('.symptom-detail-desc').hide();
                } else if ($(e.target).hasClass(".symptom-detail-desc") || $(e.target).parents(".symptom-detail-desc").size() !== 0) {
                    return false;
                }
            });

            $("body").on("click", ".icon-pain-detail", function (e) {
                e.stopPropagation();
                var container = $(this).parents(".symptom-desc-item");
                var id = container.attr("data-id");
                $(".symptom-detail-desc").hide()
                if (container.find(".symptom-detail-desc").size() === 1) {
                    container.find(".symptom-detail-desc").is(":visible") ? container.find(".symptom-detail-desc").hide() : container.find(".symptom-detail-desc").show();
                } else {
                    that.queryMessage($(this), {
                        optionId: id,
                        isValid: "1",
                        sortType: ""
                    });
                }
            })
        },
        //获取症状详情
        queryMessage: function (ele, obj) {
            var that = this;
            $.ajax({
                url: that.XHRList.symptomDetail,
                type: 'POST',
                dataType: "json",
                timeout: 10000,
                data: {
                    paramJson: $.toJSON(obj)
                },
                beforeSend: function () {
                    common.loading.show()
                }
            })
                .done(function (data) {
                    common.loading.hide();
                    if (data.responseObject.responseData) {
                        if (data.responseObject.responseData.dataList && data.responseObject.responseData.dataList.length !== 0) {
                            var dataList = data.responseObject.responseData.dataList[0];
                            ele.parent().append(that.template.symptomQuery(dataList));
                            setTimeout(function () {
                                ele.parent().find(".symptom-detail-desc").show();
                            }, 300)
                        }
                    }

                })
                .fail(function () {
                    common.loading.hide()
                });
        }
        ,
        //前往下一步的验证...
        nextBtnValidate: function () {
            var that = this,
                router = $("html").attr("view"),
                container = $(".symptom-desc-inner[data-sort='" + router + "']");
            //第一级没有选中任何答案...
            if (container.find(".util-selector").eq(0).find(">.selected").size() === 0) {
                return false;
                //    第一级有选中答案，第二级没有任何选中...
            } else if (container.find(".selected .symptom-desc-second-form").size() !== 0 && container.find(".symptom-desc-second-form .util-selector .selected").size() === 0) {

                $(".symptom-desc-controller.active .unfinish").removeClass("unfinish");
                if (container.find(".selected").find(".util-selector>.selected").size() === 0) {
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
            var router = $("html").attr("view");

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
                        that.config.optionList[0].mainOptionId = $(this).attr("id");
                        $(".btnBox-tips").remove();
                        Q.go('consult2');
                    });
                    return false;
                }
            } else if ($(".symptom-desc-inner[data-sort='" + router + "']").find(".util-selector").eq(0).find(">.selected").size() === 1) {
                that.config.optionList[0].mainOptionId = $(".symptom-desc-inner[data-sort='" + router + "']").find(".util-selector").eq(0).find(">.selected").attr("data-id");
            }
        },
        //保存本页选择的答案...
        saveSelectAnswers: function (router) {
            var container = $(".symptom-desc-inner[data-sort='" + router + "']");
            var firstS = [], secondS = [];
            var list = [];
            var index = parseInt(router.substr(-1, 1)) - 1;

            container.find(".selected").each(function (index, element) {
                list.push($(element).attr("data-id"));
            });

            this.config.optionList[index].optionIdList = list.join(",");
        },
        //    假若返回上一步，当前页的答案清空，上一页保留...
        backToLastRouter: function () {
            var router = $("html").attr("view"),
                container = $(".symptom-desc-inner[data-sort='" + router + "']");
            container.find(".symptom-desc-item").each(function (index, element) {
                $(element).removeClass("selected");
            });
            container.find(".next").addClass("unfinish");
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
            $("body").on("click", ".sure", function () {
                if (that.nextBtnValidate() === false) {
                    return false;
                }

                //通过判断缓存是否存在CaseId确定提交的走向...
                var router = $("html").attr("view"),
                    container = $(".symptom-desc-inner[data-sort='" + router + "']");
                if (container.find(".selected").size() === 0) {
                    return;
                }
                var cache = localStorage.getItem("caseId");
                if (cache) {
                    window.location.href = "http://m.tocure.cn/pages/imScene/im_main_scene.html";
                } else {
                    common.btnBox({
                        title: "您还有其他伴随症状吗？",
                        direction: "horizontal",
                        btn: [
                            {
                                className: "btn-primary no-other-symptom",
                                id: "",
                                content: "没有了",
                                href: "//m.tocure.cn/pages/imScene/im_main_scene.html"
                            },
                            {
                                className: "btn-hollow has-other-symptom",
                                id: "",
                                content: "有",
                                href: "select_parts.html?sex=" + common.getpara().sex + "&age=" + common.getpara().age + "&patientId=" + common.getpara().patientId + "&caseId=" + that.config.caseId
                            }
                        ]
                    })
                }
            });
            //没有其他症状...执行后跳转至IM
            $("body").on("click", ".no-other-symptom", function (e) {
                e.preventDefault();
                that.allAnswerSubmit(this);
            });
            //有其他症状...返回部位选择并记录次数为1
            //Q：次数谁来记录？
            $("body").on("click", ".has-other-symptom", function (e) {
                e.preventDefault();
                that.allAnswerSubmit(this);
            });
        },
        //答案提交...
        allAnswerSubmit: function (e) {
            var that = this;
            var data = {
                visitSiteId: 1,
                patientId: window.location.search.split("&")[1].split("=")[1],
                caseType: 0,
                customerId: "123"
            };
            $.ajax({
                url: this.XHRList.createMedicalRecord,
                type: 'POST',
                dataType: "json",
                data: {
                    paramJson: $.toJSON(data)
                },
                timeout: 10000,
                beforeSend: function () {
                    common.loading.show()
                }
            })
                .done(function (data) {
                    common.loading.hide()
                    if (data.responseObject.responseStatus) {
                        that.config.caseId = data.responseObject.responsePk;
                        that.submitSymptomMessage(e)
                    }
                })
                .fail(function () {
                    common.loading.hide()
                });
        },
        submitSymptomMessage: function (e) {
            var that = this;
            this.config.optionList = JSON.stringify((this.config.optionList));
            $.ajax({
                url: this.XHRList.submitMedicalRecord,
                type: 'POST',
                dataType: "json",
                data: {
                    paramJson: $.toJSON(this.config)
                },
                timeout: 10000,
                beforeSend: function () {
                    common.loading.show()
                }
            })
                .done(function (data) {
                    common.loading.hide()
                    if (data.responseObject.responseStatus) {
                        if ($(e).hasClass("has-other-symptom")) {
                            localStorage.setItem("caseId", that.config.caseId);
                            window.location.href = "select_parts.html?sex=" + common.getpara().sex + "&age=" + common.getpara().age + "&patientId=" + common.getpara().patientId + "&caseId=" + that.config.caseId;
                        } else if ($(e).hasClass("no-other-symptom")) {
                            window.location.href = "//m.tocure.cn/pages/imScene/im_main_scene.html";
                        }
                    }
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
        },
    };
    symptomDesc.init();
});
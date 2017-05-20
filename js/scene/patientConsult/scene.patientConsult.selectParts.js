/**
 * @Desc：选择部位
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang on 2017/2/28
 */

$(function () {
    var selectParts = {
        init: function () {
            this.selectTips();
            this.getPatientMessage();
            this.partSelect();
        },
        template: {},
        XHRList: {
            partList: "/mcall/cms/illness/property/v1/getMapList/"
        },
        partSelect: function () {
            var that = this;
            var pId=common.getpara().patientId;

            $(".pain-point").on("click", function () {
                $(this).addClass("on").siblings().removeClass("on");
                var data = {
                    parentId: $(this).attr("data-id"),
                    isValid: "1",
                    firstResult: "0",
                    maxResult: "20",
                    illnessType: "0"
                };
                $.ajax({
                    url: that.XHRList.partList,
                    type: 'POST',
                    dataType: "json",
                    timeout: 10000,
                    data: {
                        paramJson: $.toJSON(data)
                    },
                    beforeSend: function () {
                        common.loading.show()
                    }
                })
                    .done(function (data) {
                        if (data.responseObject.responseData) {
                            var dataList = data.responseObject.responseData.dataList,oArr = [];
                            $(dataList).each(function (index, element) {
                                oArr.push({
                                    className: "btn-hollow",
                                    id: "",
                                    content: element.propertyName,
                                    href: "symptom_desc.html?patientId=" + pId+"&partId="+element.propertyId+"&sex="+common.getpara().sex+"&age="+common.getpara().age
                                })
                            });
                            common.btnBox({
                                title: "请再确认一下不适部位",
                                direction: "vertical",
                                btn: oArr
                            })
                        }
                        common.loading.hide()
                    })
                    .fail(function () {
                        console.log("XHR error...");
                    });


            });
        },
        selectTips: function () {
            common.topTips.show({
                class: "symptom-tips",
                content: "您哪里不舒服？"
            });
            setTimeout(function () {
                common.topTips.hide();
            }, 3000);
        },
        getPatientMessage: function () {
            var msg = common.getpara();
            var type = this.patientType(msg);
            modules.symptom_select.render(type);
        },

        patientType: function (obj) {
            var age = parseInt(obj.age),
                sex = parseInt(obj.sex);
            if (age <= 12) {
                return "kid";
            } else {
                if (sex === 1) {
                    return "man";
                } else {
                    return "woman";
                }
            }
        }
    };

    selectParts.init();

});
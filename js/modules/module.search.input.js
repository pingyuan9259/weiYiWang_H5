/**
 * @Desc：
 * @Usage:
 * {
 *      type:"city/hospital/disease/illness
 * }
 *
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang on 2017/3/5
 */

modules.searchInput = function (obj) {
    var container = {
        init: function () {
            this.config = obj;
            this.searchContent();
        },
        template: {
            hospitalList: function (data) {
                return '<a class="searchResultItem" data-id="' + data.id + '" data-address="' + data.hospitalAddress + '">' + data.hospitalName + '</a>';
            },
            cityList:function (data) {
                return '<a class="searchResultItem" data-id="' + data.regionId + '">' + data.regionName + '</a>';
            },
            diseaseList:function (data) {
                return '<a class="searchResultItem" data-id="' + data.regionId + '">' + data.regionName + '</a>';
            },
            illnessList:function (data) {
                return '<a class="searchResultItem" data-id="' + data.regionId + '">' + data.regionName + '</a>';
            }
        },
        XHRList: {
            cityList: "/mcall/comm/data/baseinfo/v1/getRegionList/",
            diseaseList: "/mcall/cms/illness/property/v1/getMapList/",
            hospitalList: "/mcall/comm/data/baseinfo/v1/getHospitalList/",
            illnessList: "/mcall/cms/illness/property/v1/getMapList/"
        },
        searchContent: function () {
            var that = this;
            $("body").on("focus", ".tc-searchCommInput", function (e) {
                $(".ev-initList").hide();
                $(".ev-searchList").show();
            });
            $("body").on("blur", ".tc-searchCommInput", function (e) {
                $(".ev-initList").show();
                $(".ev-searchList").hide();
            });
            $("body").on("input propertychange", ".tc-searchCommInput", function (e) {
                var t = this;
                if ($(this).val()===0){
                    $(".ev-initList").show();
                    $(".ev-searchList").hide();
                }else{
                    $(".ev-initList").hide();
                    $(".ev-searchList").show();
                }
                clearTimeout(i);
                var i = setTimeout(function () {
                    that.getSearchResult(that.config.data);
                }, 300);
            });
        },
        getSearchResult: function () {
            var that = this;

            $.ajax({
                url: this.config.XHR,
                type: 'POST',
                dataType: "json",
                timeout: 10000,
                async: false,
                data: {
                    paramJson: $.toJSON($.extend(this.config.data, {[this.config.input.searchName] : this.config.input.inputEle.val()}))
                },
                beforeSend: function () {
                    common.loading.show();
                }
            })
                .done(function (data) {
                    var list = [];
                    if (data.responseObject.responseData) {
                        var dataList = data.responseObject.responseData.dataList;
                        if (dataList && dataList.length !== 0) {
                            console.log(dataList)
                            obj.container.children().remove();
                            $(dataList).each(function (index, element) {
                                obj.container.append(that.template[that.config.type+"List"](element));
                            });
                            that.config.successCallback && that.config.successCallback();
                            that.searchResultHighLight();
                        }else{
                            that.config.noResultCallback && that.config.noResultCallback();
                        }
                    }
                    common.loading.hide();
                })
                .fail(function () {

                });
        },
        searchResultHighLight: function () {
            $(".ev-searchList .searchResultItem").each(function (index, ele) {
                var input = $('.tc-searchCommInput').val(),
                    place1 = $(ele).text().toLowerCase().indexOf(input.toLowerCase());
                if (place1 != "-1") {
                    var replace1 = $(ele).text().splice(place1, 0, '<em>'),
                        result = replace1.splice(place1 + 4 + input.length, 0, '</em>');
                    $(ele).html(result);
                }
            });
        },
    };
    container.init();
}
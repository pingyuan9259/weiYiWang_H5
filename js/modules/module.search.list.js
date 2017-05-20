/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang on 2017/3/2
 */
modules.searchList = function (obj) {
    var container = {
        init: function () {
            this.config = obj;
            this.element = obj.targetEle;
            this.switchSearchList();
        },
        template: {
            mainInner: function (data) {
                return '<section class="search-box tc-mainInner">' +
                    '<section class="tc-searchCommFixedTop">' +
                    '<div class="tc-searchCommTop">' +
                    '<i class="tc-searchBtnPic"></i><input class="tc-searchCommInput" type="text" placeholder="请填写医院的名称">' +
                    '</div>' +
                    '</section>' +
                    '<section class="tc-searchMain">' +
                    '<section class="tc-searchContentInner ev-initList">' +
                    '<header class="tc-searchDocArea">' +
                    '<i class="tc-searchDocAreaLeft" style="display: none;"></i><span class="tc-searchAreaName">' + data.header + '</span>' +
                    ' </header>' +
                    //    Lists...
                    '</section>' +
                    '<section class="tc-searchContentInner ev-searchList">' +
                    '</section>' +
                    '</section>' +
                    '</section>';
            },
            diseaseList: function (data) {
                return '<section class="searchResult">' +
                    '<header class="searchResultTitle" id="' + data.propertyId + '">' + data.propertyName + '</header>' +
                    (function (sData) {
                        var result = "";
                        $(sData).each(function (index, element) {
                            result += '<a class="searchResultItem" data-id="' + element.propertyId + '">' + element.propertyName + '</a>';
                        });
                        return result;
                    }(data.children)) +
                    '</section>';
            },
            hospitalList: function (data) {
                return '<a class="searchResultItem" data-id="' + data.id + '" data-address="' + data.hospitalAddress + '">' + data.hospitalName + '</a>';
            },
            doctorList:function (data) {
                return '<li class="searchDoctorItem">'+
                    '<div class="searchDoctor-l">'+
                    '<a href="javascript:void(0)"><img src="../../image/img00/recoveryReport/recommendDocPhoto.png" alt=""></a>'+
                    '</div>'+
                    '<div class="searchDoctor-r">'+
                    '<div class="searchDoctorInfo">'+
                    '<span class="searchDoctorName">鞠坤吊炸天！！！</span>'+
                    '<span class="searchDoctorPost">副主任医师</span>'+
                    '</div>'+
                    '<p class="searchDoctorHospital">北京301解放军总医院</p>'+
                    '<p class="searchDoctorGood">擅长：脊柱、关节、脊柱外科，柱外科，包括脊柱外科，包括脊柱外科，包括脊柱外科，包括脊柱外科，包括脊柱外科，包括脊包括脊柱侧弯。</p>'+
                    '</div>'+
                    '</li>';
            },
            doctorFooter:function () {
                return '<footer class="searchFooter">'+
                    '<div class="searchItem searchCity active"><span>按城市</span></div>'+
                    '<div class="searchItem searchOffice"><span>按科室</span></div>'+
                    '</footer>';
            }
        },
        XHRList: {
            cityList: "/mcall/comm/data/baseinfo/v1/getRegionList/",
            diseaseList: "/mcall/cms/illness/property/v1/getMapList/",
            hospitalList: "/mcall/comm/data/baseinfo/v1/getHospitalList/",
            illnessList: "/mcall/cms/illness/property/v1/getMapList/",
            doctorList: ""//搜索医生的接口
        },
        switchSearchList: function () {

            switch (this.config.type) {
                case "city":
                    //参数Level:外部传入决定第一级为省/市
                    this.searchCity({
                        id: "",
                        level: this.config.level,
                        header: "选择城市"
                    });
                    this.selectCity();

                    modules.searchInput({
                        container:$(".ev-searchList"),
                        XHR:this.XHRList.cityList,
                        type:"city",
                        data: {
                            isValid: "1",
                            firstResult: "0",
                            maxResult: "20",
                        },
                        input:{
                            searchName:"regionName",
                            inputEle: $(".tc-searchCommInput")
                        },
                        successCallback:this.config.successCallback,
                        noResultCallback:this.config.noResultCallback
                    });
                    break;
                case "hospital":
                    this.searchCity({
                        id: "",
                        level: "3",
                        header: "选择医院所在城市",
                    });
                    this.selectCity();
                    modules.searchInput({
                        container:$(".ev-searchList"),
                        type:"hospital",
                        XHR:this.XHRList.hospitalList,
                        data: {
                            isValid: "1",
                            firstResult: "0",
                            maxResult: "20",
                        },
                        input:{
                            searchName:"hospitalName",
                            inputEle: $(".tc-searchCommInput")
                        },
                        successCallback:this.config.successCallback,
                        noResultCallback:this.config.noResultCallback
                    });
                    break;
                case "disease":
                    this.searchDiseaseList();
                    modules.searchInput({
                        container:$(".ev-searchList"),
                        type:"disease",
                        XHR:this.XHRList.diseaseList,
                        data: {
                            isValid: "1",
                            firstResult: "0",
                            maxResult: "20"
                        },
                        input:{
                            searchName:"propertyName",
                            inputEle: $(".tc-searchCommInput")
                        },
                        successCallback:this.config.successCallback,
                        noResultCallback:this.config.noResultCallback
                    });
                    break;
                case "illness":
                    this.searchDiseaseList();
                    modules.searchInput({
                        container:$(".ev-searchList"),
                        type:"illness",
                        XHR:this.XHRList.illnessList,
                        data: {
                            isValid: "1",
                            firstResult: "0",
                            maxResult: "20"
                        },
                        input:{
                            searchName:"propertyName",
                            inputEle: $(".tc-searchCommInput")
                        },
                        successCallback:this.config.successCallback,
                        noResultCallback:this.config.noResultCallback
                    });
                    break;
                case "doctor"://搜寻医生的步骤
                    this.searchDoctorList();
                    // modules.searchInput({
                    //     container:$(".ev-searchList"),
                    //     type:"illness",
                    //     XHR:this.XHRList.illnessList,
                    //     data: {
                    //         isValid: "1",
                    //         firstResult: "0",
                    //         maxResult: "20"
                    //     },
                    //     input:{
                    //         searchName:"propertyName",
                    //         inputEle: $(".tc-searchCommInput")
                    //     },
                    //     successCallback:this.config.successCallback,
                    //     noResultCallback:this.config.noResultCallback
                    // });
                    break;
            }
        },
        //搜索省市区...
        searchCity: function (data) {
            $("body").append(this.template.mainInner({
                header: data.header
            }));
            setTimeout(function () {
                $(".search-box").addClass("show");
            }, 100);
            $.ajax({
                url: this.XHRList.cityList,
                type: 'POST',
                dataType: "json",
                timeout: 10000,
                // async: false,
                data: {
                    paramJson: $.toJSON({
                        parentId: data.id,
                        isValid: "1",
                        firstResult: "0",
                        maxResult: "20",
                        treeLevel: data.level //1国2省3市4区
                    })
                },
                beforeSend: function () {
                    common.loading.show();
                }
            })
                .done(function (data) {
                    var list = [];
                    if (data.responseObject.responseData) {
                        var dataList = data.responseObject.responseData.dataList;
                        if (dataList.length !== 0) {
                            $(".he-main").hide();
                            $(".tc-mainInner").css("position", "static")
                            $(dataList).each(function (index, element) {
                                var item = {
                                    name: element.regionName,
                                    id: element.regionId,
                                    level: element.treeLevel
                                };
                                list.push(item);
                            });
                            new firstLetterPosition(list);
                        }
                    }
                    common.loading.hide();
                })
                .fail(function () {

                });
        },
        //搜索医院...
        searchHospitalList: function (data) {
            var that = this;
            $("body").append(this.template.mainInner({
                header: data.header
            }));
            setTimeout(function () {
                $(".search-box").addClass("show");
            }, 100);
            $.ajax({
                url: this.XHRList.hospitalList,
                type: 'POST',
                dataType: "json",
                timeout: 10000,
                async: false,
                data: {
                    paramJson: $.toJSON({
                        cityId: data.id,
                        isValid: "1",
                        firstResult: "0",
                        maxResult: "20",
                        treeLevel: data.level //1国2省3市4区
                    })
                },
                beforeSend: function () {
                    common.loading.show();
                }
            })
                .done(function (data) {
                    var list = [];
                    if (data.responseObject.responseData) {
                        var dataList = data.responseObject.responseData.dataList;

                        if (dataList.length !== 0) {
                            $(".he-main").hide();
                            $(".tc-mainInner").css("position", "static")
                            $(dataList).each(function (index, element) {
                                $(".ev-initList").append(that.template.hospitalList(element));
                            });
                            that.selectHospital()
                        }
                    }
                    common.loading.hide();
                })
                .fail(function () {

                });
        },
        //搜索疾病
        searchDiseaseList: function () {
            $("body").append(this.template.mainInner({
                header: "选择所患疾病"
            }));
            setTimeout(function () {
                $(".search-box").addClass("show");
            }, 100);
            var that = this;
            $.ajax({
                url: this.XHRList.diseaseList,
                type: 'POST',
                dataType: "json",
                timeout: 10000,
                // data: {
                //     paramJson: $.toJSON({
                //         isValid: "1",
                //         firstResult: "0",
                //         maxResult: "20",
                //         illnessType:"1"
                //     })
                // },
                beforeSend: function () {
                    common.loading.show();
                }
            })
                .done(function (data) {
                    var list = [];
                    if (data.responseObject.responseData) {
                        var dataList = data.responseObject.responseData.dataList;
                        if (dataList.length !== 0) {
                            $(dataList).each(function (index, element) {
                                $(".ev-initList").append(that.template.diseaseList(element));
                            });
                            that.selectDisease();
                        }
                    }
                    common.loading.hide();
                })
                .fail(function () {

                });
        },
        //搜索手术...
        searchIllenssList: function (data) {
            var that = this;
            $.ajax({
                url: this.XHRList.illnessList,
                type: 'POST',
                dataType: "json",
                timeout: 10000,
                // data: {
                //     paramJson: $.toJSON(data)
                // },
                beforeSend: function () {
                    common.loading.show();
                }
            })
                .done(function (data) {
                    var list = [];
                    console.log(data);
                    if (data.responseData) {
                        var dataList = data.responseData.dataList;
                        if (data && dataList.length !== 0) {
                            $(dataList).each(function (index, element) {
                                $(".ev-initList").append(that.template.diseaseList(element));
                            });
                            that.selectIllness();
                        }
                    }
                    common.loading.hide();
                })
                .fail(function () {

                });
        },
        //搜索医生...
        searchDoctorList: function (data) {
            var that = this;
            $.ajax({
                url: this.XHRList.doctorList,
                type: 'POST',
                dataType: "json",
                timeout: 10000,
                data: {
                    paramJson: $.toJSON(data)
                },
                beforeSend: function () {
                    common.loading.show();
                }
            })
                .done(function (data) {
                    if (data.responseData) {
                        var dataList = data.responseData.dataList;
                        if (data && dataList.length !== 0) {
                            $(dataList).each(function (index, element) {
                                $(".ev-initList").append(that.template.doctorList(element));//循环添加医生列表
                            });
                            that.selectDoctor();
                        }
                    }
                    if (!$(".search-box .searchFooter")){
                        $(".search-box").append(that.template.doctorFooter());//添加搜寻医生筛选条件底部
                    }
                    common.loading.hide();
                })
                .fail(function () {

                });
        },
        //选择省市区...
        selectCity: function () {
            var that = this;
            var cityObj={};
            //若为选择到指定的最后一级则继续搜索...
            $("body").off("click").on("click", ".searchResultItem", function () {
                //已到目标层级,目标元素获取信息...
                if (that.config.type === "city") {
                    switch (parseInt($(this).attr("data-level"))){
                        case 2:
                            $.extend(cityObj,{
                                province:$(this).text(),
                                provinceId:$(this).attr("data-id"),
                            });
                            break;
                        case 3:
                            $.extend(cityObj,{
                                city:$(this).text(),
                                cityId:$(this).attr("data-id"),
                            });
                            break;
                        case 4:
                            $.extend(cityObj,{
                                district:$(this).text(),
                                districtId:$(this).attr("data-id"),
                            });
                            break;
                    }
                    if (parseInt($(this).attr("data-level")) === parseInt(that.config.finalLevel)) {
                        that.targetGetMessage($.extend(cityObj,{name:cityObj.province+","+cityObj.city+","+cityObj.district}));
                        that.hideSearchList();
                        $(".he-main").show();
                        $(".searchTypeSelect").children().remove();
                        if(that.config.back){
                            Q.go(that.config.back);
                        }else{
                            Q.go('index');
                        }
                        that.config.backCallback && that.config.backCallback()
                    } else {
                        $(".tc-mainInner").remove();
                        $(".searchTypeSelect").children().remove();
                        that.searchCity({
                            id: $(this).attr("data-id"),
                            level: parseInt($(this).attr("data-level")) + 1,
                            header: $(this).text()
                        });

                    }
                } else if (that.config.type === "hospital") {
                    $(".tc-mainInner").remove();
                    $(".searchTypeSelect").children().remove();
                    that.searchHospitalList({
                        header: $(this).text(),
                        id: $(this).attr("data-id"),
                    })

                }
            })
        },
        //选择医院...
        selectHospital: function () {
            var that = this;
            $("body").off("click").on("click", ".searchResultItem", function () {
                that.targetGetMessage({
                    name: $(this).text(),
                    id: $(this).attr("data-id"),
                    address: $(this).attr("data-address")
                });
                that.hideSearchList();
                $(".he-main").show();
                if(that.config.back){
                    Q.go(that.config.back);
                }else{
                    Q.go('index');
                }
                that.config.backCallback && that.config.backCallback()
            })
        },
        //选择疾病...
        selectDisease: function () {
            var that = this;

            $("body").off("click").on("click", ".searchResultItem", function () {
                //当前场景为搜索疾病...
                if (that.config.type === "disease") {
                    that.targetGetMessage({
                        name: $(this).text(),
                        id: $(this).attr("data-id"),
                    });
                    that.hideSearchList();
                    if(that.config.back){
                        Q.go(that.config.back);
                    }else{
                        Q.go('index');
                    }
                    that.config.backCallback && that.config.backCallback()
                } else if (that.config.type === "illness") {
                    //当前场景为搜索手术——疾病为先决条件...
                    that.searchIllenssList({
                        isValid: "1",
                        firstResult: "0",
                        maxResult: "20",
                        illnessType:"2",
                        parentId:$(this).attr("data-id"),
                    });

                }
            });

        },
        //选择手术...
        selectIllness: function () {
            $("body").off("click").on("click", ".searchResultItem", function () {
                that.targetGetMessage({
                    name: $(this).text(),
                    id: $(this).attr("data-id"),
                });
                that.hideSearchList();
                if(that.config.back){
                    Q.go(that.config.back);
                }else{
                    Q.go('index');
                }
                that.config.backCallback && that.config.backCallback()
            })
        },
        //选择医生...
        selectDoctor: function () {

        },
        //目标获取信息...
        targetGetMessage: function (data) {
            for (var i in data) {
                console.log(data[i])
                this.element.attr("data-" + i, data[i]);
            }
            this.element.text(data.name)
        },
        //隐藏搜索页...
        hideSearchList: function () {
            $(".search-box").removeClass("show");
            $(".search-box").on("transitionend WebkitTransitionEnd", function () {
                $(this).remove();
            })
        },
    }

    container.init();
};
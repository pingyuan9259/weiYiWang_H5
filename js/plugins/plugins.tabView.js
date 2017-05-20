/**
 * @name:tabs点击切换/内容切换/tabs项动态添加控件
 * @desc:
 * @example:
 *     new TabsViewChange({
        tabsInner: $(".tabsInner"), //导航tabs容器（并非每个tabsItem，为其父容器
        views: $(".mainInner"), //tabs对应view容器
        changeCallback: function () { //tabs切换时执行回调
            console.log('喵')
        },
        role: "navtabs", //tabs与View对应的角色名，插件本身会按照索引号实现点击切换显示
        addBtn: $(".addBtn"),//可选参数，添加按钮的Class名
        newTemplate: function () { //添加新的tabs-views，tabs为新tabs名，view为view区域内容
            return [{                             //请注意，此处您可以传入一个对象，亦可传入一个数组，数组代表可一次添加多个条目
                tabs: "卧槽",
                view: "喵？",
                role: "navtabs"
            },
                {
                    tabs: "尼玛",
                    view: "喵？",
                    role: "navtabs"
                }
            ]
        },
    });
 * @depend:
 * @date: 2017/2/6
 * @author: qiangkailiang
 * @转载请注明作者github:khallmader@gmail.com,感谢您的合作
 */

var TabsViewChange=function (options) {
    var that=this;
    var defaultOptions={

    };
    this.options=$.extend(true,defaultOptions,options);
    this.init();
};

TabsViewChange.prototype={
    init:function(){
        this.tabsChange();
        if (this.options.addBtn) {
            this.addTabsViewer();
        }
    },
    tabsChange:function () {
        var that=this;
        this.options.views.find("[data-role]").hide();
        this.options.tabsInner.on("click", ".tabs", function () {
            var role = $(this).attr("data-role");
            that.options.views.find("[data-role]").hide();
            that.options.views.find("[data-role=" + role + "]").show();
            that.options.changeCallback && that.options.changeCallback();
        });
    },
    addTabsViewer:function () {
        var that=this;
        this.options.addBtn.on("click", function () {
            var newTemplate = "";
            if (typeof that.options.newTemplate === "function") {
                newTemplate = that.options.newTemplate();
            }

            if (Array.isArray(newTemplate)){
                $(newTemplate).each(function (index,element) {
                    var num = that.options.views.find("[data-role]").size() + 1;
                    that.elementGenerator(element,num);
                })
            }else{
                var num = that.options.views.find("[data-role]").size() + 1;
                that.elementGenerator(newTemplate,num);
            }
        })
    },
    elementGenerator:function (newTemplate,num) {
        var tabsElement=this.options.tabsInner.children().get(0);
        var viewElement=this.options.views.children().get(0);
        var tabsNodeName=tabsElement.nodeName.toLowerCase();
        var viewElementNodeName=viewElement.nodeName.toLowerCase();
        var newTabs=document.createElement(tabsNodeName);
        var newViews=document.createElement(viewElementNodeName);
        var tabsClass=tabsElement.className;
        var viewClass=viewElement.className;
        var role=tabsElement.getAttribute('data-role').split("-")[0];

        $(newTabs).addClass(tabsClass).attr("data-role",role+'-'+num).html(newTemplate.tabs).appendTo(this.options.tabsInner);
        $(newViews).addClass(viewClass).attr("data-role",role+'-'+num).html(newTemplate.view).appendTo(this.options.views).hide();
    }
};


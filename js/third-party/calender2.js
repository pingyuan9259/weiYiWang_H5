/**
 * @name:日历功能
 * @desc: 根据原有版本作了改动，title仅显示月份，增加了点击回调，增加了每一格的特殊显示
 * @example:
 * calender('#calend').init({
        format: 'MM', //设置显示格式
        button: false, //是否显示按钮
        insertEle: [{  //要塞入的内容
            month:2, //指定月份..
            day:3, //的几号..
            text: "已满",     //要插入什么内容..
            className:"full"  //添加Class，样式将有如何变化...
        }, {
            month:2,
            day:5,
            text: "已满",
            className:"full"
        }, {
            month:3,
            day:7 ,
            text: "余喵人",
            className:"last"
        }],
        onload: function () {
        }, //初始化完成执行，this为当前创建的日历对象
        clickCallback: function (ev) { //点击日历上任意一项的回调
            console.log("喵...");
            console.log(ev)
        }
    });
 * @depend:
 * @date: 2017/02/08
 * @author: ?
 * @fixed:qiangkailiang
 */
window.calender = (function (win, doc) {
    function C(str) {
        this.dom = doc.querySelector(str);
        this.s = {
            date: [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()],
            button: false,
            format: 'yyyy年MM月dd日',
            left: 0,
            top: 0,
            onload: function () {
            }
        }
    };
    C.prototype = {
        init: function () {
            var t = this;
            if (typeof arguments[0] == 'function') {
                t.cb = arguments[0];
            } else {
                t.newS = arguments[0];
                t.cb = arguments[1] || function () {
                    }
            }

            t.yoff = false;
            t.moff = false;
            t.extend(t.s, t.newS);
            t.nt = new Date();
            t.nt.setFullYear(t.s.date[0]);
            t.nt.setMonth(t.s.date[1] - 1);
            var len = this.getDateLength(t.nt.getFullYear(), t.nt.getMonth())
            t.nt.setDate(t.s.date[2] > len ? len : t.s.date[2]);
            t.day = t.nt.getDate();
            t.create();
            t.bind();
            t.s.onload.call(this);
            t.insert();
        },
        hide: function () {
            var t = this;
            t.cb.call(t.dom, t.format(t.nt.getFullYear() + '/' + (t.nt.getMonth() + 1) + '/' + t.day + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(), t.s.format));
            if (g('.calender-wrap')) doc.body.removeChild(g('.calender-wrap'))
        },
        bind: function () {
            var t = this;
            var Content = g('.calender-content');
            t.createDay();
            var Prev = g('#calender-prev'),
                Next = g('#calender-next'),
                Year = g('#calender-year'),
                Mon = g('#calender-mon');
            if (t.s.button) {
                var today = g('.calender-today');
                var enter = g('.calender-ent');

                // t.nt.setFullYear(new Date().getFullYear());
                t.nt.setMonth(new Date().getMonth());
                t.nt.setDate(new Date().getDate());
                t.s.date[2] = t.day = new Date().getDate()
                // t.createYear()
                t.createDay()
                t.createMon()


            }
            Content.onclick = function (ev) {
                var ev = ev || event;
                var _target = ev.target || ev.srcElement;
                if (!t.has(_target, 'calender-cell-dark')) {
                    var chl = this.children;
                    for (var i = 0; i < chl.length; i++) {
                        t.del(chl[i], 'active');
                    }
                    if (!$(_target).hasClass('unclickable')){
                        console.log(1)
                        t.add(_target, 'active');
                    }

                    t.nt.setDate(_target.getAttribute('data-n'));
                    t.s.date[2] = t.day = _target.getAttribute('data-n')
                    if (!t.s.button) {
                        t.s.clickCallback && t.s.clickCallback(t);
                    }
                }
            }
            Prev.onclick = Next.onclick = function () {
                var y = t.nt.getFullYear(), m = t.nt.getMonth();

                if (t.moff) return
                if (t.yoff) {
                    t.nt.setFullYear(this.id == "calender-prev" ? y -= 9 : y += 9)
                    t.createYear()
                } else {
                    this.id == "calender-prev" ? m-- : m++;
                    t.nt.setDate(1);
                    t.nt.setMonth(m);
                    t.createDay()
                }
                t.insert();
            };

            // Mon.onclick = function () {
            //     t.createMon();
            //     t.moff = true;
            //     t.yoff = false;
            //     t.del(g('.calender-wrap'), 'year');
            //     t.add(g('.calender-wrap'), 'month');
            // };
        },
        getDateLength: function (year, month) {
            //获取某一月有多少天, month为实际月份，一月即为1
            return new Date(year, month, 0).getDate();
        },
        getFirstDay: function (year, month) {
            //获取某一月第一天是周几,month为实际月份，一月即为1,返回0即为周日
            return new Date(year, month - 1, 0).getDay();
        },
        createMon: function () {
            var t = this, html = '';
            var m = t.nt.getMonth() + 1;
            m = m == 0 ? 12 : m;
            for (var i = 1; i <= 12; i++) {
                html += '<div class="calender-mon-cell ' + ( m == i ? 'active' : '') + ' ">' + (i) + '</div>';
            }

            g('.calender-list3').innerHTML = html;
            var cells = doc.querySelectorAll('.calender-mon-cell');
            for (var i2 = 0; i2 < cells.length; i2++) {
                cells[i2].onclick = function () {
                    t.moff = false
                    t.del(g('.calender-wrap'), 'month');
                    t.nt.setDate(1)
                    t.nt.setMonth(+this.innerHTML - 1);
                    t.createDay();
                }
            }
        },
        createYear: function () {
            var t = this, html = '', y = (t.nt.getFullYear());
            var Year = g('#calender-year');
            for (var i = 0; i < 9; i++) {
                html += '<div class="calender-year-cell ' + ( (y - (4 - i)) == y ? 'active' : '') + ' ">' + (y - (4 - i)) + '</div>';
            }
            Year.innerHTML = y
            g('.calender-list2').innerHTML = html;
            var cells = doc.querySelectorAll('.calender-year-cell');
            for (var i2 = 0; i2 < cells.length; i2++) {
                cells[i2].onclick = function () {
                    t.yoff = false;
                    t.del(g('.calender-wrap'), 'year');
                    t.nt.setFullYear(+this.innerHTML);
                    t.createDay();
                }
            }
        },
        createDay: function (n) {
            var t = this,
                y = t.nt.getFullYear(),
                m = (t.nt.getMonth()) + 1;
            // g('#calender-year').innerHTML = m === 0 ? y - 1 : y;
            g('#calender-mon').innerHTML = m === 0 ? this.toChinese(12) : this.toChinese(two(m));
            // if(t.nt.getMonth()+1 == t.s.date[1] && t.nt.getFullYear()==t.s.date[0]   ){
            //  	t.nt.setDate(t.s.date[2]);
            // };
            var firstDay = this.getFirstDay(y, m),
                length = this.getDateLength(y, m),
                lastMonthLength = this.getDateLength(y, m - 1),
                i, html = '';
            t.day = t.s.date[2] > length ? length : t.s.date[2];
            //循环输出月前空格
            $(".calender-wrap").attr("data-month",m)
            if (firstDay == 6) {
                firstDay = -1;
            }

            for (i = 0; i < firstDay + 1; i++) {
                html += '<div class="calender-cell calender-cell-dark"></div>';
            }
            //循环输出当前月所有天
            for (i = 1; i < length + 1; i++) {
                html += '<div  data-n=' + i + ' class="calender-cell ' + (i == t.day ? 'active' : '') + '">' + i + '</div>';
            }
            //if(8-(length+firstDay)%7 !=8){
            for (i = 1; i <= (31 - (length + (firstDay == 0 ? 7 : firstDay) - 1)); i++) {
                html += '<div class="calender-cell calender-cell-dark"></div>';
            }
            ;
            doc.querySelector('.calender-content').innerHTML = html
        },
        toChinese: function (num) {

            if (!/^\d*(\.\d*)?$/.test(num)) {
                alert("Number is wrong!");
                return "Number is wrong!";
            }
            var AA = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九");
            var BB = new Array("", "十", "百", "千", "万", "亿", "点", "");
            var a = ("" + num).replace(/(^0*)/g, "").split("."), k = 0, re = "";

            for (var i = a[0].length - 1; i >= 0; i--) {
                switch (k) {
                    case 0:
                        re = BB[7] + re;
                        break;
                    case 4:
                        if (!new RegExp("0{4}\\d{" + (a[0].length - i - 1) + "}$").test(a[0]))
                            re = BB[4] + re;
                        break;
                    case 8:
                        re = BB[5] + re;
                        BB[7] = BB[5];
                        k = 0;
                        break;
                }

                if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
                if (a[0].charAt(i) != 0) re = (AA[a[0].charAt(i)] + BB[k % 4] + re);
                k++;
            }

            if (a.length > 1) //加上小数部分(如果有小数部分)
            {
                re += BB[6];
                for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
            }
            if (re.indexOf("一十") != -1) {

                re = re.replace("一", "");
            }
            return re;

        },
        create: function () {
            var t = this;
            if (g('.calender-wrap')) doc.body.removeChild(g('.calender-wrap'))
            var private_Day_title = ['日', '一', '二', '三', '四', '五', '六'];
            //内容
            var html = '<div class="calender-wrap">';
            html += '<div id="calender-header" class="calender-header none-btn "><a id="calender-prev" href="javascript:;">&lt;</a><a id="calender-next" href="javascript:;">&gt;</a><span id="calender-mon">' + this.toChinese(10) + '</span>月</div>'
            //星期
            html += '<div class="calender-list"><div class="calender-caption">';
            for (i = 0; i < 7; i++) {
                html += '<div class="calender-cell">' + private_Day_title[i] + '</div>';
            }

            html += '</div><div class="calender-content"></div>';
            if (this.s.button) {
                html += '<div class="calender-button"><a href="javascript:;" class="calender-ent">确定</a><a href="javascript:;" class="calender-today">今天</a></div>';
            }

            html += '</div><div class="calender-list calender-list2"></div><div class="calender-list calender-list3"></div>'

            t.dom.insertAdjacentHTML("beforeend", html);
            var wrap = g('.calender-wrap');

            function setPosi() {
                var _top = doc.documentElement.scrollTop || doc.body.scrollTop;
                wrap.style.left = t.dom.getBoundingClientRect().left + t.s.left + 'px';

                wrap.style.top = t.dom.getBoundingClientRect().top + _top + t.dom.offsetHeight + t.s.top + 15 + 'px';
            };
            // setPosi();
            // addEvent(window, 'resize', function () {
            //     setPosi()
            // })
            wrap.onclick = function (ev) {
                var e = ev || event;
                e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true)
            }
        },
        format: function (da, format) {
            var _newDate = new Date(da);
            var WeekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
            var o = {
                'M+': _newDate.getMonth() + 1, //month
                'd+': _newDate.getDate(), //day
                'h+': _newDate.getHours(), //hour
                'm+': _newDate.getMinutes(), //minute
                's+': _newDate.getSeconds(), //second
                'q+': Math.floor((_newDate.getMonth() + 3) / 3), //quarter
                'S': _newDate.getMilliseconds(), //millisecond
                'E': WeekArr[_newDate.getDay()],
                'e+': _newDate.getDay()
            };
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (_newDate.getFullYear() + "").substr(4 - RegExp.$1.length));
            }

            for (var k in o) {
                if (new RegExp('(' + k + ')').test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
                }

            }

            return format;
        },
        extend: function (n, n1) {
            for (var i in n1) {
                n[i] = n1[i]
            }
            ;
        },
        has: function (o, n) {
            return new RegExp('\\b' + n + '\\b').test(o.className);
        },
        add: function (o, n) {
            if (!this.has(o, n)) o.className += ' ' + n;
        },
        del: function (o, n) {
            if (this.has(o, n)) {
                o.className = o.className.replace(new RegExp('(?:^|\\s)' + n + '(?=\\s|$)'), '').replace(/^\s*|\s*$/g, '');
            }
            ;
        },
        insert: function () {
            $(this.s.insertEle).each(function (index, ele) {
                var targetEle = $(".calender-wrap[data-month='"+ele.month+"']").find("[data-n='" + ele.day + "']");
                targetEle.text(ele.text);
                targetEle.addClass(ele.className);
                targetEle.addClass("unclickable")
            })
        }
    };
    function g(str) {
        return doc.querySelector(str)
    };
    function addEvent(obj, name, fn) {
        obj.addEventListener ? obj.addEventListener(name, fn, false) : obj.attachEvent('on' + name, fn);
    };
    function two(num) {
        return num < 10 ? ('0' + num) : ('' + num)
    };

    function c(o) {
        return new C(o)
    };
    return c;
})(window, document);
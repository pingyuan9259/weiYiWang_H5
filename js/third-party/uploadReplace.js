(function (window, undefined) {
    var czyx = {
        _tid: 0,
        getNextTempId: function () {
            var id = "czyx" + (++czyx._tid);
            return $('#' + id).length ? czyx.getNextTempId() : id
        },
        toFormString: function (obj, baseName) {
            if (baseName === undefined) {
                baseName = '';
            }
            var r = [];
            var getInputName = function (n, bn) {
                return bn ? bn + '[' + n + ']' : n;
            };
            var getInputValue = function (v) {
                switch (typeof v) {
                    case 'boolean':
                        return v ? 'true' : 'false';
                    case 'number':
                        return v;
                    case 'function' :
                        return getInputValue(v());
                    case 'string':
                        return czyx.quote(v);
                    default:
                        return 'null';
                }
            };
            for (var i in obj) {
                if (typeof obj[i] == 'object' && obj[i]) {
                    r[r.length] = czyx.toFormString(obj[i], getInputName(i, baseName));
                } else {
                    r[r.length] = '<input type="hidden" name="'
                        + getInputName(i, baseName)
                        + '" value="' + getInputValue(obj[i])
                        + '" data-role="none" />';
                }
            }
            return r.join('');
        },
        goToUrl: function (url, data, type, target) {
            data = data || {};
            if (typeof type != 'undefined' && type.toUpperCase() == 'POST') {
                if (target) {
                    $('<form method="post" target="' + target + '">'
                        + czyx.toFormString(data)
                        + '</form>'
                    ).attr('action', url)
                        .appendTo('body').submit().remove();
                } else {
                    $('<form method="post">'
                        + czyx.toFormString(data)
                        + '</form>'
                    ).attr('action', url)
                        .appendTo('body').submit();
                }
            } else {
                if (target) {
                    $('<form method="post" target="' + target + '">'
                        + czyx.toFormString(data)
                        + '</form>'
                    ).attr('action', url)
                        .appendTo('body')
                        .submit()
                        .remove();
                } else {
                    if (url.indexOf('?') == -1) {
                        url += '?';
                    } else {
                        var lastChar = url.charAt(url.length - 1);
                        if (lastChar != '?' && lastChar != '&') {
                            url += '&';
                        }
                    }
                    url += $.param(data);
                    window.location.href = url;
                }
            }
        },
        getWebSocket: function (url) {
            var socket = window.WebSocket || window.MozWebSocket || this.WebSocket;
            if (!socket) {
                this.loadPlugin('WebSocket');
                return;
            }
            return new socket(url);
        },
        loadPlugin: function (name, callback) {
            $.getScript(this.rootPath + 'czyx/' + name + '.js', callback);
            return this;
        },
        quote: function (html, type) {
            switch (type) {
                case 'url':
                    return;
                default:
                    return html.split('&').join('&amp;')
                        .split("<").join("&lt;")
                        .split(">").join("&gt;")
                        .split(" ").join("&nbsp;")
                        .split("'").join("&#039;")
                        .split('"').join("&quot;");
            }

        },
        error: function (msg, e) {
            if (this.debug) {
                $('<div></div>').appendTo('body').html(msg);
            }
        },
        isIe6: function () {
            return !-[1,] && /MSIE 6\.0/.test(navigator.userAgent);
        },
        reload: function () {
            window.location.href = window.location.href.replace(/&\_=[0-9]+/, '') + '&_=' + (+new Date);
        },
        rootPath: './'
    };
    window.czyx = czyx;
})(window);
$.extend(czyx, {
    uploadReplace: function (selectedQuery, param) {
        param = param || {};
        param = $.extend(true, {}, czyx.uploadSettings, param);
        param.url = param.url || window.location.href || '';
        param.MAX_FILE_SIZE = !-[1,] && param.MAX_FILE_SIZE;
        return $(selectedQuery).each(function () {
            var jThis = $(this).click(function () {
                $(this).parent().css({
                    opacity: 1,
                    filter: 'alpha(opacity=100)'
                });
            });
            if (jThis.is('input[type="file"]')) {
                var div = $('<div />')
                    .insertBefore(jThis.css(param.uploadInputCss))
                    .css(param.uploadReplaceCss)
                    .attr('id', czyx.getNextTempId())
                    .hover(function () {
                        $(this).css({
                            opacity: 0.7,
                            filter: 'alpha(opacity=70)'
                        });
                    }, function () {
                        $(this).css({
                            opacity: 1,
                            filter: 'alpha(opacity=100)'
                        });
                    });


                if (param.MAX_FILE_SIZE) {
                    this.MAX_FILE_SIZE = param.MAX_FILE_SIZE;
                }

                jThis.appendTo(div).change(function () {
                    var tidDiv = $(this).parent().attr('id'), jForm;
                    tidIframe = czyx.getNextTempId(),
                        tidForm = czyx.getNextTempId();

                    if (param.uploadBefore.call(this) === false) {
                        return false;
                    }
                    if (!this.name) {
                        $(this).attr('name', 'file').data('addTempName', 1);
                    }

                    jForm = $('<form id="' + tidForm + '" action="' + param.url + '" '
                        + 'method="post" style="display:none;" '
                        + 'enctype="multipart/form-data"></form>'
                    ).appendTo('body');

                    if (param.data) {
                        jForm.html(czyx.toFormString(param.data));
                    }
                    jForm.append(this).data('uploadEnd', param.uploadEnd);
                    $('<iframe src="'
                        + (/^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank')
                        + '" '
                        + 'id="' + tidIframe + '" '
                        + 'style="display:none;" '
                        + 'name="' + tidIframe + '" '
                        + ' onload="czyx._uploadEnd(this,\'' + tidDiv + '\',\'' + tidForm + '\');">'
                        //+ '>'
                        + '</iframe>'
                    ).appendTo('body');
                    var browseType = common.getBrowseType();
                    if (common.isWeiXin() && browseType.iPhone) {
                        czyx._uploadEnd($("#" + tidIframe).get(0), '' + tidDiv, '' + tidForm);
                    }
                });
            }
        });
    },
    uploadSettings: {
        uploadReplaceCss: {//�ϴ��ؼ�Ĭ����ʽ
            width: 80,
            height: 20,
            overflow: 'hidden',
            position: 'relative',
            background: 'url(upload.png) center no-repeat'
        },
        uploadInputCss: {
            fontSize: 72,
            cursor: 'pointer',
            position: 'absolute',
            right: 0,
            //bottom:0,
            filter: 'alpha(opacity=0)',
            opacity: 0,
            outline: 'none',
            hideFocus: 'expression(this.hideFocus=true)'
        },
        uploadEnd: $.noop,    //�ϴ�ǰ�Ļص��������� false����ִ���ϴ�
        uploadBefore: $.noop, //�ϴ���Ϻ�Ļص��������������˷��ص��ַ�
        MAX_FILE_SIZE: null   //�ϴ����ļ�����ֽ����ݲ�֧��
    },
    _uploadEnd: function (iframeNode, divId, formId) {
        var jForm = $('#' + formId);


        if (jForm.attr('target') != iframeNode.name) {
            jForm.attr('target', iframeNode.name).submit();
        } else {
            var jFile = jForm.find('input:last');
            if (jFile.data('addTempName')) {
                jFile.removeData('addTempName').removeAttr('name');
            }
            jForm.data('uploadEnd').call(
                jFile.appendTo('#' + divId).get(0),
                (iframeNode.contentWindow ?
                        iframeNode.contentWindow.document :
                        iframeNode.contentDocument ?
                            iframeNode.contentDocument :
                            iframeNode.document
                ).body.innerHTML
                    .split('&lt;').join('<')
                    .split('&gt;').join('>')
                    .split('&amp;').join('&')
            );
            jForm.removeData('uploadEnd').remove();
            $(iframeNode).remove();
        }
    }
});
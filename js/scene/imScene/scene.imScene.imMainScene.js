/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang on 2017/2/13
 */
$(function () {
    //通讯类
    var MessageCommunication = function () {

    };
    MessageCommunication.prototype = {
        //通讯类加载...
        init: function () {
            var that = this;
            this.nim = NIM.getInstance({
                // debug: true,
                appKey: '5f4c2f653abb8c46b09cddb625b728fa',
                account: controller.userData.account,
                token: controller.userData.token,
                onconnect: function (data) {
                    console.log('连接成功');
                },
                onmyinfo: function (userData) {
                    controller.getUserInfo(userData);
                    that.getTargetAvatar();
                    that.getMessageList();
                    that.sendMessage();
                    that.sendFile();
                },
                onwillreconnect: this.onWillReconnect,
                ondisconnect: this.onDisconnect,
                onerror: this.onError,
                onroamingmsgs: this.onRoamingMsgs,
                onofflinemsgs: this.onOfflineMsgs,
                onmsg: function (msg) {
                    controller.receiveMessage(msg)
                }
            });
        },
        sendMessage: function () {
            var that = this;
            //单条消息发送
            $(".main-input-box-send").on("click", function () {
                that.nim.sendText({
                    scene: 'p2p',
                    to: controller.targetData.account,
                    text: $(".main-input-box-textarea").val(),
                    done: function (error, obj) {
                        $(".main-input-box-textarea").val('')
                        controller.sendSingleMessage(error, obj)
                    },
                });
            });
            //病例发送
            $('.test-medical-record').on("click", function () {
                that.nim.sendCustomMsg({
                    scene: 'p2p',
                    to: controller.targetData.account,
                    content: JSON.stringify(controller.medicalReportData()),
                    done: function (error, msg) {
                        controller.sendMedicalReport(error, msg)
                    }
                });
            });
            //手术预约发送
            $(".main-header-item-pre").on("click", function () {
                that.nim.sendCustomMsg({
                    scene: 'p2p',
                    to: controller.targetData.account,
                    content: JSON.stringify(controller.sendOperationData()),
                    done: function (error, msg) {
                        controller.sendOperation(error, msg)
                    }
                });
            })
        },
        //获取历史消息……
        getMessageList: function () {
            this.nim.getHistoryMsgs({
                scene: 'p2p',
                to: controller.targetData.account,
                done: function (error, obj) {
                    controller.renderHistoryMessage(error, obj);
                },
                limit: 10
            });
        },
        //修改用户名片...
        //尚不确定如何修改
        configUserInfo: function () {
            this.nim.updateMyInfo(controller.configUserInfo());
        },
        //获取对方名片
        getTargetAvatar: function () {
            this.nim.getUser({
                account: controller.targetData.account,
                done: controller.getTragetInfo
            });
        },
    //    发送视频/音频/文件等
        sendFile:function () {
            var fileInput=$(".main-input-box-plus"),
                that=this;
            console.log(fileInput)
            fileInput.on("change",function () {
                that.nim.previewFile({
                    type: 'video',
                    fileInput: document.querySelectorAll(".main-input-box-plus")[0],
                    uploadprogress: function(obj) {
                        console.log('文件总大小: ' + obj.total + 'bytes');
                        console.log('已经上传的大小: ' + obj.loaded + 'bytes');
                        console.log('上传进度: ' + obj.percentage);
                        console.log('上传进度文本: ' + obj.percentageText);
                    },
                    done: function(error, file) {
                        console.log('上传image' + (!error?'成功':'失败'));
                        // show file to the user
                        if (!error) {
                            var msg = that.nim.sendFile({
                                scene: 'p2p',
                                to: controller.targetData.account,
                                file: file,
                                done: sendMsgDone
                            });
                            console.log('正在发送p2p image消息, id=' + msg.idClient);
                        }
                    }
                });
            })
            function sendMsgDone(error, msg) {
                console.log(error);
                console.log(msg);
                console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error?'成功':'失败') + ', id=' + msg.idClient);
            }
        }
    };

    //操作类
    var Controller = function () {
        this.messageBox = $(".main-message");
    };
    Controller.prototype = {
        //基础用户数据...
        userData: {
            account: '2bmc',
            token: 'd0daf6d76bb27729db2101a8c8b29a38',
        },
        //对话目标数据:
        targetData: {
            account: 'qkl'
        },

        //发送单条数据...
        sendSingleMessage: function (error, msg) {
            var that = this;
            console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error ? '成功' : '失败') + ', id=' + msg.idClient);
            if (!error) {
                $(".user-controller-input").val("");
                that.messageBox.append(template.mine(msg));
            }
        },
        //病例发送数据...
        medicalReportData: function () {

            return {
                type: 1,
                data: {
                    recordImg: ['http://img.jfdown.com/jfdown/201409/rw4fi0eoppn.jpg'],
                    userData: {
                        userName: controller.userData.nick,
                        age: "26",
                        sex: "男",
                        country: "帝都",
                        phone: "15201669519"
                    },
                    disease: {
                        content: ["膝关节中度钝痛三年；已确诊过膝关节骨关节炎；上下楼 下蹲",
                            "走路 负重时疼痛；夜间疼痛 间歇性疼痛；天冷时 上下楼 下蹲",
                            "走路 骑车时加重；热敷 休息 得以缓解"]
                    }
                }
            };
        },
        //发送病例..
        sendMedicalReport: function (error, msg) {
            console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error ? '成功' : '失败') + ', id=' + msg.idClient);
            if (!error) {
                this.messageBox.append(template.medicalRecord({
                    userData: {userName: controller.userData.nick},
                    recordImg: ["http://img.jfdown.com/jfdown/201409/rw4fi0eoppn.jpg"]
                }))
            }
        },
        //发送手术数据
        sendOperationData: function () {
            return {
                type: 3,
                data: {
                    recordImg: ['http://img.jfdown.com/jfdown/201409/rw4fi0eoppn.jpg'],
                    userData: {
                        userName: controller.userData.nick,
                        age: "26",
                        sex: "男",
                        country: "帝都",
                        phone: "15201669519"
                    },
                    operation: {
                        name: "膝关节置换",
                        time: "尽快",
                        country: "北京",
                        insurer: "城镇居民"
                    },
                    likeDoctor: {
                        content: " 张强,主任医师,北京301解放军总医院,教授,擅长：脊柱、关节、脊柱外科，包括脊柱侧弯，颈椎病，脊柱肿瘤"
                    }
                }

            };
        },
        //发送手术预约..
        sendOperation: function (error, msg) {
            console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error ? '成功' : '失败') + ', id=' + msg.idClient);
            if (!error) {
                this.messageBox.append(template.operation())
            }
        },
        //发送自定义消息 集中分配...
        sendCustomMessage: function () {

        },
        //接受消息...
        receiveMessage: function (element) {
            switch (element.type) {
                case 'custom':
                    //情况区分：病例？手术？康复报告？
                    this.receiveCustomMessage(JSON.parse(element.content));
                    break;
                case 'notification':
                    // 处理群通知消息
                    break;
                case "text":
                    //单聊消息
                    this.receiveSingleMessage(element);
                    break;
                default:
                    break;
            }
        },
        //接受单条消息...
        receiveSingleMessage: function (msg) {
            this.messageBox.append(msg.from === this.userData.account ? template.mine(msg) : template.others(msg));
        },
        //接受自定义消息 集中分配
        receiveCustomMessage: function (msg) {
            switch (msg.type) {
                case 1: //病例
                    this.messageBox.append(template.medicalRecord(msg.data));
                    break;
                case 2://分诊报告
                    this.messageBox.append(template.triageResult(msg.data));
                    break;
                case 3: //手术预约
                    this.messageBox.append(template.operation());
                    break;
            }
        },
        //接收用户信息...
        getUserInfo: function (data) {
            this.userData = data;
        },
        getTragetInfo: function (error, user) {
            controller.targetData = user;
            $(".main-header-item.doctor-name h3").text(user.nick + "医生")
        },
        //修改用户信息...
        //实际数据通过用户填写改变……并不在该页面
        configUserInfo: function () {
            return {
                nick: '强三皮',
                avatar: 'http://www.lpetl.com/attachment/201505/15/1_1431668967OW0Q.jpeg',
                sign: '强三皮测试中',
                gender: 'female',
                email: 'superpi@163.com',
                birth: '1991-01-15',
                tel: '15201669519',
                done: function (error, user) {
                    console.log('更新我的名片' + (!error ? '成功' : '失败'));
                    console.log(error);
                    console.log(user);
                }
            }
        },
        //输出历史消息...
        renderHistoryMessage: function (error, obj) {
            var that = this;
            if (!error) {
                $(obj.msgs.reverse()).each(function (index, element) {
                    that.receiveMessage(element)
                });
            }
        }
    };
    //策略类
    var Template = function () {
        var that = this;
    };
    Template.prototype = {
        others: function (data) {
            return '<section class="main-message-box">' +
                '<article class="main-message-box-item others-message">' +
                '<figure class="main-message-img">' +
                '<img src="' + controller.targetData.avatar + '" alt="">' +
                '</figure>' +
                '<figcaption class="main-message-content">' +
                '<p>' + data.text + '</p>' +
                '</figcaption>' +
                '</article>' +
                '</section>';
        },
        mine: function (data) {
            return '<section class="main-message-box">' +
                '<article class="main-message-box-item my-message">' +
                '<figcaption class="main-message-content">' +
                '<p>' + data.text + '</p>' +
                '</figcaption>' +
                '<figure class="main-message-img">' +
                '<img src="' + controller.userData.avatar + '" alt="">' +
                '</figure>' +
                '</article>' +
                '</section>';
        },
        medicalRecord: function (data) {
            return '<section class="main-message-box">' +
                '<article class="main-message-box-item my-message">' +
                '<figcaption class="main-message-content">' +
                '<section class="medical-record">' +
                '<figure class="medical-record-img">' +
                '<img src="' + data.recordImg[0] + '" alt="">' +
                '</figure>' +
                '<figcaption class="medical-record-text">' +
                '<h4>' + data.userData.userName + '的病例单</h4>' +
                '</figcaption>' +
                '</section>' +
                '</figcaption>' +
                '<figure class="main-message-img">' +
                '<img src="' + controller.userData.avatar + '" alt="">' +
                '</figure>' +
                '</article>' +
                '</section>';
        },
        triageResult: function (data) {
            return '<section class="main-message-box">' +
                '<article class="main-message-box-item others-message">' +
                '<figure class="main-message-img">' +
                '<img src="' + controller.targetData.avatar + '" alt="">' +
                '</figure>' +
                '<figcaption class="main-message-content">' +
                '<section class="message-triage-result">' +
                '<figcaption class="message-triage-result-content">' +
                '<span>感谢您对唯医会诊的信任！根据您当前情况，为你制定以下诊断康复报告，请点击查看，祝您早日康复！</span>' +
                '<a href="">' + data.userData.nick + '的康复报告</a>' +
                '</figcaption>' +
                '<figure class="message-triage-result-img">' +
                '<img src="' + data.recordImg[0] + '" alt="">' +
                '</figure>' +
                '</section>' +
                '</figcaption>' +
                '</article>' +
                '</section>'
        },
        operation: function (data) {
            return '<section class="main-message-box">' +
                '<article class="main-message-box-item others-message">' +
                '<figure class="main-message-img">' +
                '<img src="' + controller.targetData.avatar + '" alt="">' +
                '</figure>' +
                '<figcaption class="main-message-content">' +
                '<p>您好，分诊医生已收到您的全部信息，正在为您预约医生</p>' +
                '</figcaption>' +
                '</article>' +
                '</section>';

        }
    };
    //HTML模板 策略类启动...
    var template = new Template();
    //全局控制方法启动...
    var controller = new Controller();

    //集中控制 网易云信核心通讯SDK启动...
    var messageCommunication = new MessageCommunication();

    // 全页面业务流启动...
    messageCommunication.init();
});

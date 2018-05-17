const GameNetManager = require("GameNetManager");

var ZJHNetManager = cc.Class({
    extends: GameNetManager,

    statics: {
        getInstance() {
            if (!this.eventManager) {
                this.eventManager = new ZJHNetManager();
                this.eventManager.logName = 'ZJHNetManager';
            }
            return this.eventManager;
        },

        clearEventManager() {
            if(this.eventManager) {
                AppLog.log("ZJHNetManager.release() >>> this.eventManager(%s) will be set to null.", this.eventManager.logName);
                this.eventManager.close();
                this.eventManager = null;
            }
        },
    },
  
  

    // 处理服务器的响应
    onMsg( msgId, msgData) {
        bb.log("服务器响应:" + msgId);
        switch(msgId) {
            case 1001: // 登录协议
                bb.log("登录协议")
                bb["user"].Module.UpdateLogin(msgData);
                break;
            case 2008:
                bb["user"].Module.UpdateRoomList(msgData);
                break;
            case 2011: // 登录协议
                bb.log("登录协议")
                bb["user"].Module.UpdateCreateRoom(msgData);
                break;
            case 2010:
                bb["game"].Module.updateJoinRoom(msgData);
                break;
            case 2012: // 准备响应
                bb["game"].Module.updatePlayerReady(msgData);
                break;
            case 2013: // 开始游戏了
                break;

        }
    },

    // 向服务器发送请求
    startEvent(event, data) {

    },

    // 发起登录
    sendLogin(phone) {
        var obj = {
            "params":{"tel": phone,"pwd":"123456"},
            "controller_name":"PublicController",
            "method_name":"login"};
        bb.logObj1(obj);
        this.sendProto(obj);
    },

    // 获取房间列表
    getZJHRoomList() {
        var sendObj = {
            params:{"msg":"8"},
            controller_name:'ZhajinhuaController',
            method_name: 'roomlist',
        };
        this.sendProto(sendObj);
    },

    sendJoinRoom(roomid) {
        var sendObj = {
            params:{number: roomid}, //number=房号
            controller_name:'GamesController',
            method_name: 'joinedRoom',
        };
        bb.logObj1(sendObj);
        this.sendProto(sendObj);
    },

    createRoom(moshengren, type, rule, diZhu, ruchang, lichang) {
        var sendObj = {
            params:{"moshengren":moshengren,"rule_moshi":type,"rule_men":rule,"dizhu":diZhu,"ruchang":ruchang,"lichang":lichang},
            controller_name:'ZhajinhuaController',
            method_name: 'createroom',
        };
        bb.logObj1(sendObj);
        this.sendProto(sendObj);
    },


    sendReady() {
        var sendObj = {
            "params":{"msg":"12"},
            "controller_name":"ZhajinhuaController",
            "method_name":"ready"}
        bb.logObj1(sendObj);
        this.sendProto(sendObj);
    }
  

 

  
});

module.exports = ZJHNetManager;

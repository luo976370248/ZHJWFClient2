const ZJHNetManager = require("ZJHNetManager")

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    start () {
        bb["ui"].bindComponent(this);
        bb["user"].Event.addObserver(this);
    },

    onDestroy() {
        bb["user"].Event.removeObserver(this);
    },

    createRoom() {
        let moshenren = this["_toggle1"].getComponent(cc.Toggle).isChecked;

        moshenren = moshenren ? 0 : 1;
        let type = this["_toggle2"].getComponent(cc.Toggle).isChecked;
        type = type ? 0 : 2;
        let dizhu = this["_edit1"].getComponent(cc.Label).string;
        dizhu = parseInt(dizhu);
        let ruchang = this["_edit2"].getComponent(cc.Label).string;
        ruchang = parseInt(ruchang);
        let lichang = this["_edit3"].getComponent(cc.Label).string;
        lichang = parseInt(lichang);
     
       
        ZJHNetManager.getInstance().createRoom(moshenren, 0 ,type, dizhu, ruchang, lichang);
    },

    _onBtnTouchEnd(sender) {
        switch(sender.$) {
            case "1":
                this.createRoom();
                break;
            case "2":
                bb["gameEvent"].notifyEvent(bb["eventName"].ShowWindow, "Hall/EnterRoom");
                break;
            case "3":
                bb["loader"].destroy(this.node);
                break;
        }
    },

    onEventMessage(msgId, obj) {
        switch(msgId) {
            case bb["user"].Name.CreateRoomSucess:
                ZJHNetManager.getInstance().sendJoinRoom(obj);
                break;
            case bb["user"].Name.CreateRoomFaile:
                // TODO 弹出提示 表明创建房间失败
                bb["gameEvent"].notifyEvent(bb["eventName"].ShowOneTip, {"msg": obj, "callback": ()=> {
                    bb["loader"].destroy(this.node);
                }});
                break;
        }
    },

});

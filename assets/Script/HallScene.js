const ZJHNetManager = require("ZJHNetManager")
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    start () {
        bb["ui"].bindComponent(this);
        this._nick.getComponent(cc.Label).string = bb["user"].Module.player.nick;
        this._id.getComponent(cc.Label).string = bb["user"].Module.player.id;
        this._gold.getComponent(cc.Label).string = bb["user"].Module.player.vcoin;
        
        bb["user"].Event.addObserver(this);
        bb["game"].Event.addObserver(this);
    },

    onDestroy() {
        bb["user"].Event.removeObserver(this);
        bb["game"].Event.removeObserver(this);
    },

    _onBtnJinHuaTouchEnd(sender) {
       // bb["gameEvent"].notifyEvent(bb["eventName"].ShowWindow, "Hall/CreateRoom");
    
       ZJHNetManager.getInstance().getZJHRoomList();
    },

    _onBtnJoinRoomTouchEnd(sender) {
        bb["gameEvent"].notifyEvent(bb["eventName"].ShowWindow, "Hall/EnterRoom");
    },

    _onBtnSettingTouchEnd(sender) {
        bb["gameEvent"].notifyEvent(bb["eventName"].ShowWindow, "Hall/HallSetting");
    },

    _onBtnOptionTouchEnd(sender) {
        bb["gameEvent"].notifyEvent(bb["eventName"].ShowWindow, "Hall/HallOption");
    },

    _onBtnGoShopTouchEnd(sender) {
        bb["gameEvent"].notifyEvent(bb["eventName"].ShowWindow, "Hall/HallShop");
    },
 
    onEventMessage(msgId, obj) {
        switch(msgId) {
            case bb["game"].Name.JoinRoomSucess:
                bb["gameEvent"].notifyEvent(bb["eventName"].ChangeWindow, "Prefab/GameScene");
                break;
            case bb["game"].Name.JoinRoomFaile:
                // TODO 弹出提示 表明创建房间失败
                bb["gameEvent"].notifyEvent(bb["eventName"].ShowOneTip, {"msg": obj, "callback": ()=> {
                    bb["loader"].destroy(this.node);
                }});
                break;
            case  bb["user"].Name.GetRoomListInfo:
            bb["gameEvent"].notifyEvent(bb["eventName"].ShowWindow, "Hall/RoomList");
                break;
        }
    },
});

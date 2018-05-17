
const ZJHNetManager = require("ZJHNetManager")
cc.Class({
    extends: cc.Component,

    properties: {
    
    },


    start () {
        bb["ui"].bindComponent(this);
        bb["user"].Event.addObserver(this);
        // bb.log("---------");
        // bb.log(BB.WXApiHandler.IsWeiXinAvilible());
        // bb.log("---------");
    },

    onDestroy() {
        bb["user"].Event.removeObserver(this);
    },

    _onButtonTouchEnd(sender) {
        switch(sender.$) {
            case "1":
                ZJHNetManager.getInstance().sendLogin("18684001188");
                break;
            case "2":
                ZJHNetManager.getInstance().sendLogin("18708167688");    
                break;
            case "3":
                ZJHNetManager.getInstance().sendLogin("18708167687");
                break;
            case "4":
                ZJHNetManager.getInstance().sendLogin("18708167686");
                break;
        }
    },
    
    onEventMessage(msgId, obj) {
        switch(msgId) {
            case bb["user"].Name.LoginSucess:
                bb["gameEvent"].notifyEvent(bb["eventName"].ChangeWindow, "Prefab/HallScene");
                break;
            case bb["user"].Name.LoginFaile:
                // TODO 弹出提示 表明登录失败
                break;
        }
    },


});

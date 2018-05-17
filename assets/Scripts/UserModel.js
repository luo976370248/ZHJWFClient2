

var EventManager = require("EventManager");

bb["user"] = {}
var EventName = {
    "LoginSucess": "LoginSucess",
    "LoginFaile": "LoginFaile",
    "GetRoomListInfo": "GetRoomListInfo",
    "CreateRoomSucess": "CreateRoomSucess",
    "CreateRoomFaile": "CreateRoomFaile",
}

bb["user"].Name = EventName

var GameEvent = cc.Class({
    extends: EventManager,
});

bb["user"].Event = GameEvent.getInstance();

var UserModel = {
    player: null,
    roomList: null,
    UpdateLogin(msg) {
        if (msg["code"] != 1) {
            // 登录失败
            bb["user"].Event.notifyEvent(EventName.LoginFaile, msg.msg);
            return;
        }
        
        this.player = msg.data;
        bb["user"].Event.notifyEvent(EventName.LoginSucess);
    },

    UpdateRoomList(msgData) {
        this.roomList = msgData.data;
        bb["user"].Event.notifyEvent(EventName.GetRoomListInfo);
    },

    UpdateCreateRoom(msg) {
        if (msg["code"] != 1) {
            //  创建房间失败
            bb["user"].Event.notifyEvent(EventName.CreateRoomFaile,  msg.msg);
            return;
        }
        bb["user"].Event.notifyEvent(EventName.CreateRoomSucess,  msg["data"].number);
    }
}

bb["user"].Module = UserModel;
var EventManager = require("EventManager");

bb["game"] = {}
var EventName = {
    "JoinRoomSucess": "JoinRoomSucess",
    "JoinRoomFaile": "JoinRoomFaile",
    "ReadyResult": "ReadyResult"
}

bb["game"].Name = EventName

var GameEvent = cc.Class({
    extends: EventManager,
});

bb["game"].Event = GameEvent.getInstance();

var ZJHGameModel = {
    playerList: [null, null, null, null, null],
    roomInfo: null,
    yourIndex: 0,
    updateJoinRoom(msg) {
        if (msg["code"] && msg["code"] != 1) {
            // 登录失败
            bb["user"].Event.notifyEvent(EventName.JoinRoomFaile, msg.msg);
            return;
        }
        this.yourIndex = msg["data"].roomUser.seat_num;
        this.roomInfo = msg["data"].roomInfo;

        msg["data"].roomUserList.forEach((item) => {
            this.playerList[this.getLocalSeat(item.seat_num)] = item;
        });
        this.playerList = msg["data"].roomUserList;
        bb["user"].Event.notifyEvent(EventName.JoinRoomSucess);
    },

    updatePlayerReady(msg) {
        var localseat = this.getLocalSeatByUid(msg["data"].uid);
        this.playerList[localseat].status = 2;
        bb["game"].Event.notifyEvent(EventName.ReadyResult, localseat);
    },

    getLocalSeat(seat)
    {
        return (seat - this.yourIndex + 5) % 5;
    },

    getLocalSeatByUid(uid) {
        var index = -1;
        for (var i= 0; i < 5; i++) {
            if (this.playerList[i] && this.playerList[i].id == uid) {
                index = i;
                break;
            }
        }
        return index;
    }
}

bb["game"].Module = ZJHGameModel;
var ZJHNetManager = require("ZJHNetManager")

cc.Class({
    extends: cc.Component,

    properties: {
       index: 0,
    },


    start () {
        bb["ui"].bindComponent(this);

        for (var i = 1; i <= 9; i++) {
            this[`_item${i}`].active = false;
        }

        var roomlist = bb["user"].Module.roomList;
        var count = roomlist.length < 9 ? roomlist : 9; 
        for (var i = 1; i <= count; i++) {
           
            this[`_item${i}`].active = true;
            this[`_item${i}`].itemData = roomlist[i];
            this[`_seat${i}`].getComponent(cc.Label).string = "座位数 " + roomlist[i].seat_num1 + "/5 人";
            this[`_dizhu${i}`].getComponent(cc.Label).string = "底注 " + roomlist[i].dizhu;
            this[`_ruchang${i}`].getComponent(cc.Label).string= "入场 " + roomlist[i].ruchang;
            this.index++;
        } 
    },

    _onBtnCloseTouchEnd(sender) {
        bb["loader"].destroy(this.node);
    },

    _onBtnCreateRoomTouchEnd(sender) {
        bb["gameEvent"].notifyEvent(bb["eventName"].ShowWindow, "Hall/CreateRoom");
    },

    _onBtnEnterRoomTouchEnd(sender) {
        bb["gameEvent"].notifyEvent(bb["eventName"].ShowWindow, "Hall/EnterRoom");
    },


    _onBtnReshTouchEnd(sender) {
        var roomlist = bb["user"].Module.roomList;
        var count = this.index; 

        if (roomlist.length < count) {
            this.index = 0;
            count = 0;
        }

        for (var i = 1; i <= 9; i++) {
            this[`_item${i}`].active = false;
        }

        for (var i = count; i <= count + 8; i++) {
            if (roomlist.length <= i ) {
                this.index = 0;
                break;
            }
          
            this[`_item${i - count + 1}`].active = true;
            this[`_item${i- count + 1}`].itemData = roomlist[i];
            this[`_seat${i - count + 1}`].getComponent(cc.Label).string = "座位数 " + roomlist[i - count].seat_num1 + "/5 人";
            this[`_dizhu${i - count + 1}`].getComponent(cc.Label).string = "底注 " + roomlist[i - count].dizhu;
            this[`_ruchang${i - count + 1}`].getComponent(cc.Label).string= "入场 " + roomlist[i - count].ruchang;
            this.index++;
        } 
    },

    _onItemTouchEnd(sender) {
        ZJHNetManager.getInstance().sendJoinRoom(sender.itemData.number);
    }

});

const ZJHNetManager = require("ZJHNetManager")

cc.Class({
    extends: cc.Component,

    properties: {
      
    },

    start () {
        bb["ui"].bindComponent(this);
        this.RoomList = [];
        this.updateRoomLable();
    },

    onDestroy() {
        bb["user"].Event.removeObserver(this);
    },

    updateRoomLable() {
        for (let i = 1; i <= 6; i++) {
            this[`_lab${i}`].getComponent(cc.Label).string = "";
        }

        for (let i = 0; i < this.RoomList.length; i++) {
            this[`_lab${i + 1}`].getComponent(cc.Label).string = this.RoomList[i];
        }

        if (this.RoomList.length == 6) {
            // TODO 发起进入房间请求
            let room = "";
            for (let i = 0; i < this.RoomList.length; i++) {
                room += this.RoomList[i];
            }
            ZJHNetManager.getInstance().sendJoinRoom(room);
        }
    },

    _onBtnTouchEnd(sender) {
        switch(sender.$) {
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                this.RoomList.push(parseInt(sender.$));
                this.updateRoomLable();
                break;
            case "10":
                this.RoomList = [];
                this.updateRoomLable();
                break;
            case "11":
                this.RoomList.splice(this.RoomList.length - 1, 1);
                this.updateRoomLable();
                break;
            case "12":
                bb["loader"].destroy(this.node);
                break;
        }
        bb.log("..................");
    }
});

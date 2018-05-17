var ZJHNetManager = require("ZJHNetManager");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    start () {
        bb["ui"].bindComponent(this);
        bb["game"].Event.addObserver(this);
       //  this.sendCard([0, 1, 2, 3, 4]);
    },

    onDestroy() {
        bb["game"].Event.removeObserver(this);
    },



    sendCard(playerList) {
        let list = [];
        for (let i = 0; i < playerList.length; i++) {
            list.push(null);
            list.push(null);
            list.push(null);
        }
        
        for(let i = 0; i < 5; i++) {
            list[i] = this[`_poker${i + 1}`].children[0];
            list[i + playerList.length] = this[`_poker${i + 1}`].children[1];
            list[i + playerList.length * 2] = this[`_poker${i + 1}`].children[2];
        }

        for (let i = 0; i < list.length; i++)  {
            list[i].position = list[i].parent.convertToNodeSpaceAR(cc.v2(0,0));
        }


    },


    _onBtnReadyTouchEnd(sender) {
        ZJHNetManager.getInstance().sendReady();
    },

    onEventMessage(msgId, obj) {
        
    },

});

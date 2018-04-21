

cc.Class({
    extends: cc.Component,

    properties: {
        index: 0,
        nick: {
            default: null,
            type: cc.Label,

        },
        gold: {
            default: null,
            type: cc.Label,
        },
        state: {
            default: null,
            type: cc.Sprite,
        }
    },


    start () {
        bb["game"].Event.addObserver(this);
        var playerList = bb.game.Module.playerList;
        
        if (this.index >= playerList.length) {
            this.node.active = false;
        } else {
            this.node.active = true;
            this.nick.string = playerList[this.index].nick;
            this.gold.string = playerList[this.index].admin;
        }

        if (!playerList[this.index]) {
            return;
        }
        
        if (playerList[this.index].status < 2) {
            this.state.node.active = false;
            if (this.index == 0) {
                this.node.getChildByName("_btnReady").active = true;
            } else {
                this.state.spriteFrame = this.state.getComponent("ImageContor").sprites[0];
            }
        }
       
    },

    onDestroy() {
        bb["game"].Event.removeObserver(this);
    },

    updatePlayerReady() {
        var playerList = bb.game.Module.playerList;
        if (playerList[this.index].status == 2) {
            this.state.node.active = true;
            this.state.spriteFrame = this.state.getComponent("ImageContor").sprites[1];
            if (this.index == 0) {
                this.node.getChildByName("_btnReady").active = true;
            }
        }
    },

    onEventMessage(msgId, obj) {
        switch(msgId) {
            case bb["game"].Name.ReadyResult:
                if (this.index == parseInt(obj)) {
                    this.updatePlayerReady();
                }
               
                break;
            case bb["game"].Name.JoinRoomFaile:
               
        }
    },
    
});


cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    start () {

    },

    ShowCard() {

    },

    ShowAnSheCard(flag) {
        if (flag) {
            this.node.color = new cc.Color(123, 123, 123);
        } else {
            this.node.color = new cc.Color(255, 255, 255);
        }
        
    }
});


cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    start () {
        this.node.children[1].active = false;
    },

    onButtonTouchEnd(sender, custom) {
        this.node.children[1].active = true;
    },

    onScroeViewItemClick(sender, custom) {
        this.node.children[0].getComponent(cc.Label).string = custom;
        this.node.children[1].active = false;
    }


    // update (dt) {},
});

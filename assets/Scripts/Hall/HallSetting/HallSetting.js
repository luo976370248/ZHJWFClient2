
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        bb["ui"].bindComponent(this);
    },

    _onBtnCloseTouchEnd(sender) {
        bb["loader"].destroy(this.node);
    }
    // update (dt) {},
});

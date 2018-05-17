
cc.Class({
    extends: cc.Component,

    properties: {
    
    },

    start () {
       
    },

    ShowOne(message, callBack1) {
        bb["ui"].bindComponent(this);
        this["_content"].getComponent(cc.Label).string = message;
        this["_btn1"].active = true;
        this["_btn1"].x = 0;
        this["_btn2"].active = false;
        this.callBack1 = callBack1;
    },

    ShowTwo(message, callBack1, callBack2) {
        bb["ui"].bindComponent(this);
        this["_content"].getComponent(cc.Label).string = message;
        this["_btn1"].active = true;
        this["_btn2"].active = true;
        this.callBack1 = callBack1;
        this.callBack2 = callBack2;
    },

    _onBtnTouchEnd(sender) {
        switch(sender.$) {
            case "1":
                if (this.callBack1) {
                    this.callBack1();
                }
                break;
            case "2":
                if (this.callBack2) {
                    this.callBack2();
                }
                break;
        }
    }

});

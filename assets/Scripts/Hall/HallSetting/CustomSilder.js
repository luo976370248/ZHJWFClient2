
cc.Class({
    extends: cc.Component,

    properties: {
        progress: {
            type: cc.ProgressBar,
            default: null,
        },

        toggleOpen: {
            type: cc.Toggle,
            default: null,
        },

        toggleClose: {
            type: cc.Toggle,
            default: null,
        }
    },



    start () {

    },

    onButtonHandlerTouchEnd(sender) {
        this.progress.progress = sender.progress;
        if (sender.progress == 0) {
            this.toggleClose.isChecked = true;
            this.toggleOpen.isChecked = false;
        } else {
            this.toggleClose.isChecked = false;
            this.toggleOpen.isChecked = true;
        }
    },

    onButtonToggleClickOpen(sender) {
        this.progress.progress = 1;
    },

    onButtonToggleClickClose(sender) {
        this.progress.progress = 0;
    }
});

// 断点续传功能
const Continuingly = cc.Class({
    isWriting: false,
    // 资源描述文件
    versionJson: null,
    // 待写入的文件队列。
    writeingList: null,
    _mgr : null,
    statics: {
        getInstance() {
            if (!this._mgr) {
                this._mgr = new Continuingly();
            }

            return this._mgr;
        },
    },

    ctor() {

    },

    init() {
        this.versionJson = cc.dd.localDB.getHotVersionJson();
        this.writeingList = [];
    },

    getVersionJson() {
        return this.versionJson;
    },


    saveJson(json) {
        this.isWriting =  false;
        this.versionJson = json;
        cc.dd.log.log('保存 json 数据');
        cc.dd.localDB.setHotVersionJson(json);
    },

    readJson() {
        this.versionJson = cc.dd.localDB.getHotVersionJson();
    },

    removeJson(item) {
        this.writeingList.push(item);

        cc.dd.log(`this.writeingList.length = ${this.writeingList.length}   ${!this.isWriting}`);
        if (this.writeingList.length === 1 && !this.isWriting) {
            // 此时应该且有一条数据。
            cc.dd.log(`此时应该且有一条数据。update json`);
            this.updateJson[this.writeingList[0]];
        }
    },

    updateJson(item) {
        this.isWriting =  false;

        var idx = null;
        this.versionJson.forEach((elenemt, index) => {
            if (elenemt === item) {
                idx = index;
            }
        })
        if (idx !== null && idx !== undefined && idx >= 0) {

           cc.dd.log.log(`移除一条数据: 目前长度为1:${this.versionJson.length - 1} `);
            this.versionJson.splice(idx,1);
            cc.dd.log.log(`移除一条数据: 目前长度为2:${this.versionJson.length - 1} `);
            cc.dd.localDB.setHotVersionJson(this.versionJson);

        } else {
            cc.dd.log.log(`this.versionJson[item] 不存在 [item = ${item}]`);
        }

        if (this.writeingList.length > 0) {
            var list = this.writeingList.shift();
            this.updateJson(item);
        } else {
            this.isWriting = false;
        }
    },
});

module.exports = Continuingly;
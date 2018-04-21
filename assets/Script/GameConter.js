import { debug } from "util";
import { fail } from "assert";

const Http = require("Http");
const ZJHNetManager = require("ZJHNetManager")
cc.Class({
    extends: cc.Component,
    properties: {
        isSwitchScene: {
            default: false,
            visible: false,
        }
    },

    start () {
        bb["memory"].showMemoryStatus();
        bb["gameEvent"].addObserver(this);
        bb["loader"].retainScene(this.node);

        bb["loader"].loadRes("Prefab/LoginScene", cc.Prefab, (prefab)=> {
            bb["loader"].instantiate(prefab, this.node, (node) => {

            });
        });

        cc.loader.load(cc.url.raw("resources/Config/GameConfig.json"), (err, json) => {
            if(err) {
                cc.log(err);
                return;
            }
    
            bb["config"] = json;
            bb.logs.isLog =  bb["config"].IsLog;

            Http.get( bb["config"].IP, "", "", (err, data) => {
                if (err) {
                    return;
                }

                let newData = JSON.parse(data);
                ZJHNetManager.getInstance().init(`ws://${newData.data["host"]}:${newData.data["ws_port"]}`);
            
                // this.scheduleOnce(()=> {
                //     ZJHNetManager.getInstance().sendLogin();
                // }, 2);
            
            });
        });
    },

    onEventMessage(msgId, obj) {
        switch(msgId) {
            case bb["eventName"].ChangeWindow:
                this.changeWindow(obj);
                break;
            case bb["eventName"].ShowWindow:
                this.showWindow(obj);
                break;
            case bb["eventName"].ShowOneTip:
                this.showOneTip(obj);
                break;
        }
    },

    // 切换场景
    changeWindow(obj) {

        var a = {
            scene: "",
            res: {a :21},
        };

        if (!obj) {
            bb.log("参数错误")
            return;
        }

        if (this.isSwitchScene){
            return;
        }
        if (obj.res) {
            cc.log(`切换场景: ${obj.scene}`)
            let nameList = obj.scene.split("/");
            if (cc.director.getScene().children[0].children[1] == nameList[nameList.length -1]) {
                return;
            }
        } else {
            cc.log(`切换场景: ${obj}`)
            let nameList = obj.split("/");
            if (cc.director.getScene().children[0].children[1] == nameList[nameList.length -1]) {
                return;
            }
        }
        cc.log(cc.director.getScene().children[0].children[1].name)

        this.isSwitchScene = true;
        bb["loader"].destroy(cc.director.getScene().children[0].children[1]);
        
        // TODO 加载所需要的资源
        if(obj.res) {
            bb["loader"].loadResArr(obj.res, () => {
                bb["loader"].loadRes(obj, cc.Prefab, (prefab)=> {
                    bb["loader"].instantiate(prefab, this.node, (node) => {
                        this.isSwitchScene = false;
                    });
                });
            });
        } else {
           
            bb["loader"].loadRes(obj, cc.Prefab, (prefab)=> {
                bb["loader"].instantiate(prefab, this.node, (node) => {
                    this.isSwitchScene = false;
                });
            });
        }
       
        
        
    },

    // 弹窗
    showWindow(obj) {
        if (this.isSwitchScene) {
            return;
        }
        this.isSwitchScene = true;
        bb["loader"].loadRes(obj, cc.Prefab, (prefab)=> {
            bb["loader"].instantiate(prefab, cc.director.getScene().children[0].children[1], (node) => {
                this.isSwitchScene = false;
            });
        })
    },

    showOneTip(obj) {
        bb["loader"].loadRes("Hall/Tip", cc.Prefab, (prefab)=> {
            let childrens = cc.director.getScene().children[0].children[1].children;
            bb["loader"].instantiate(prefab, childrens[childrens.length - 1], (node) => {
                node.getComponent("Tip").ShowOne(obj.msg, obj.callback);
            });
        })
    }


    // update (dt) {},
});

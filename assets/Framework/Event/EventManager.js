var EventManager = cc.Class({
    eventManager:null,
    observer_list:null,

    protocol_list:null,
    is_cache:null,

    ctor:function(){
        this.observer_list = [];
        this.protocol_list = [];
        this.is_cache = false;
    },

    statics:{
        getInstance:function(){
            if(!this.eventManager){
                this.eventManager = new EventManager();
            }
            return this.eventManager;
        }
    },

    //添加观察者
    addObserver:function(target){
        this.observer_list.forEach(function(item,index){
            if(item === target){
                return true;
            }
        })

        if( target ) {
            this.observer_list.push(target);
        } else {
            bb.log("ERR: invalid addObserver target:%s", target);
        }

        this.observer_list.forEach(function (item,index) {
            bb.log("添加后 第 %s 个观察者 %s",index,item.name)
        });
    },

    //移除观察者
    removeObserver:function(target){
        var self = this;
        this.observer_list.forEach(function(item,index){
            if(item === target){
                self.observer_list.splice(index,1);
            }
        })

        this.observer_list.forEach(function (item,index) {
            bb.warn("移除后 第 %s 个观察者 %s",index,item.name)
        });
    },

    //移除所有观察者
    removeAllObserver:function(){
       this.observer_list = [];
    },

    destroyInstance:function(){
       this.eventManager = null;
    },

    notifyEvent:function(event,data){
        bb.log("EventManager.notifyEvent(%s): observer_list.len=%s", event, this.observer_list.length);
        this.observer_list.forEach(function(item){
            item.onEventMessage(event,data);
        });
    },

    addProtocolCache:function (name, data) {
        // this.protocol_list.forEach(function (item) {
        //     if(name == item){
        //         return;
        //     }
        // });

        if(data && name){
            this.protocol_list.push({name:name,data:data});
            _.forEach(this.protocol_list,function (item,index) {
                bb.log("第[%s]个协议缓存[item]",index,item.name);
            });

        }else{
            bb.err("协议缓存 数据为空");
        }

        if( !this.is_cache && this.protocol_list.length == 1){
            bb.log("无需缓存协议, 直接调用notifyProtocol()...");
            //this.is_cache = true;
            this.notifyProtocol();
            //this.is_cache = false;
            bb.log("notifyProtocol end.");
        } else {
            bb.warn("已缓存协议ID:%d  (当前缓存队列长度:%s)  is_cache=%s",name, this.protocol_list.length, this.is_cache);
        }
    },

    notifyProtocol:function (TAG) {
        var list = this.protocol_list.shift();
        if(list){
           // this.is_cache = true;
           bb.warn("[%s] notifyProtocol >>> is_cache=%s, 执行下一条 缓存协议ID:%s", TAG, this.is_cache, list.name);
            this.notifyEvent(list.name,list.data);
        }else{
            bb.log("[%s] notifyProtocol >>> 协议缓存队列为空, 忽略.", TAG);
        }
    },

    notifyProtocolCache:function (TAG) {
        this.is_cache = false;
        this.notifyProtocol(TAG);
    },

    clearProtocolCache: function() {
        this.is_cache = false;
        this.protocol_list = [];
    },
});


module.exports = EventManager;
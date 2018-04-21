var EventManager = require("EventManager");

var now = function() {
    var d = new Date();
    var str = d.getHours()+"";
    var timeStr = "";
    timeStr += (str.length==1 ? ("0"+str) : str) + ":";

    str = d.getMinutes()+"";
    timeStr += (str.length==1 ? ("0"+str) : str) + ":";

    str = d.getSeconds()+"";
    timeStr += (str.length==1 ? ("0"+str) : str) + ".";

    str = d.getMilliseconds()+"";
    if( str.length==1 ) str = "00"+str;
    if( str.length==2 ) str = "0"+str;
    timeStr += str;

    timeStr = "[" + timeStr + "]";
    return timeStr;
};


var GameNetManager = cc.Class({
    extends: EventManager,
    gameSocket: null,
    host : "",

    isConnecting : false, // 网络是否重连中
    connectionId : 0, // 连接的次数
    
    isReconnect : false, // 是否重连
  
    reconnectAttempts : 0,
    ctor() {
        this.msgQueue = [];//消息暂存队列
        this.isFirstConnect  = true; //初次连接(非断线重连)
        this.nextHeartbeatTimeout = 5; // 下次心跳包时间
        this.connectionId = 0; // 连接的次数
        this.heartbeatEnable = true; //是否开启心跳检测
    },

    init(svrhost) {
        this.connect(svrhost);
    },

    connect(svrhost, owner) {
        if (!svrhost) {
            bb.log("ERROR: connect() >>> svrhost is invalid:", svrhost)
            return;
        }

        this.connectionId ++;
        bb.log(now()+"socket.connect('%s') connId=%s", svrhost, this.connectionId);
        var network = this;
        this.isConnecting = true;
        this.host = svrhost;

        // 连接前关闭心跳
        this.clearHeartbeatTimer();

        this.gameSocket = new WebSocket( svrhost );

        this.gameSocket.onMsg = this.onMsgCommon;

        this.gameSocket.onopen = function(event) {
            bb.log("WebSocket::onOpen >>> 连接成功 (connId:%s)", network.connectionId);
            var isFirstConnect = network.isFirstConnect;
            network.isFirstConnect = false; //连接已成功,后续连接均视为断线重连(非初次连接)
            network.isConnecting = false;

            var isReconnect = network.isReconnect;
            network.resetCount();

            //初始化心跳检测
            network.initHeartBeat();

            // TODO 如果是重连，那么发送第一条缓存协议
            if(isReconnect === true && network.msgQueue.length > 0 ) {

            }
        }

        this.gameSocket.onmessage = function(event) {
            network.nextHeartbeatTimeout = Date.now() + bb["config"].HEARTBEAT_INTERVAL*1000;
            if( network.heartbeatTimeoutId ) {
                clearTimeout( network.heartbeatTimeoutId );
                network.heartbeatTimeoutId = null;
            }
            this.onReceiveData(JSON.parse(event.data));
        }

        this.gameSocket.onerror = function(event) {
            bb.log(" WebSocket::onError");
        }

        this.gameSocket.onclose = function(event) {
            // 自动重连
            if(!network.innerClose ) {
                bb.log(`WebSocket::onclose. (reason:(${event.code}:${event.reason}), [connId:${network.connectionId}] [${network.host}]自动重连中(${network.reconnectAttempts}) delay:${network.reconnectDelay}秒后...`);
                this.reconnect();
            }
            network.innerClose = false;
        }

        this.gameSocket.reconnect = function(forceConnect) {
            if( this.isConnecting ) {
                cc.log("===正在连接中, 无需reconnect.===");
                return;
            }

            //强制重连
            if(forceConnect) {
                network.resetCount(); //清空计数器
            }

            // 如果小于最大重连次数
            if(network.reconnectAttempts < bb["config"].MAX_RECONNECT_ATTEMPTS) {
                network.reconnectAttempts++;
                network.isReconnect = true;
                var delayTime = (network.reconnectAttempts>1 ? network.reconnectDelay : 1);
                if(delayTime > 30) delayTime = 30;
                cc.log(`${now()}socket.reconnect(${network.reconnectAttempts})... delay:${delayTime}秒后connect...`);
            
                if(network.checkConnTimerId) {
                    clearTimeout(network.checkConnTimerId);
                }

                network.reconncetTimer = setTimeout(function() {
                    network.connect( network.host );
                }, delayTime*1000 );

                if(network.reconnectAttempts >= 3) {
                    network.reconnectDelay += 5;
                }
            } else {
                cc.log("超出自动重连次数(%s), 提示用户手动点击重连", network.reconnectAttempts);
            }
        }

        this.gameSocket.sendProto = function (msg) {
            var sockState = network.getSocketState();
            if( sockState === WebSocket.OPEN) {
                //正常发送
                bb.log("发送协议请求");
                bb.log(msg);
                this.send(msg);
               
            } else {
                bb.log("ERR: [send时]服务器连接丢失, 重新连接中.. [%s] sockState=%s", network.host, sockState);
                network.msgQueue.push(bytes);
                this.reconnect(true);
            }
        }

        this.gameSocket.onReceiveData = function (data) {
           network.onReceiveData(JSON.parse(data));
        }.bind(this);

    },

    disconnect() {
        this.innerClose = true;

        if(this.heartbeatId) {
            clearTimeout(this.heartbeatId);
            this.heartbeatId = null;
        }
        if(this.heartbeatTimeoutId) {
            clearTimeout(this.heartbeatTimeoutId);
            this.heartbeatTimeoutId = null;
        }

        if( this.checkConnTimerId ) {
            clearTimeout( this.checkConnTimerId );
            this.checkConnTimerId = null;
        }

        if( this.gameSocket ) {
            cc.log(now()+'socket.disconnect');
            if(this.gameSocket.disconnect) this.gameSocket.disconnect();
            if(this.gameSocket.close) this.gameSocket.close();
        }
    },

    reconnect(forceConnect) {
        this.gameSocket.reconnect(forceConnect);
    },

    onReceiveData(event) {
        bb.log("收到协议2");
        if (!event["serverId"] && !event["msgId"]) {
            bb.info2("收到心跳包回复");
            return;
        }

        var msgId = event["serverId"]* 1000 + event["msgId"];
        bb.logObj1("收到服务器发来的数据:");
        bb.logObj1(event);
        this.onMsg(msgId, event);
    },

    sendProto (obj) {
        this.gameSocket.sendProto(JSON.stringify(obj));
    },

    resetCount() {
        if( this.checkConnTimerId ) {
            clearTimeout( this.checkConnTimerId );
            this.checkConnTimerId = null;
        }

        this.isReconnect = false;
        this.reconnectDelay = bb["config"].RECONNECT_DELAY; //默认5秒
        this.reconnectAttempts = 0;
        if (this.reconncetTimer) {
            clearTimeout(this.reconncetTimer);
            this.reconncetTimer = null;
        }
    },

    getSocketState : function() {
        var state = WebSocket.CLOSED;
        try{
            if (this.gameSocket) {
                state = this.gameSocket.readyState;
            }
        } catch (e) {
            bb.err("[%s] getSocketState exception:%s", this.host, e);
        }
        return state;
    },

    initHeartBeat() {
        if (!bb["config"].IsHeartbeat) {
            return;
        }
        if (!this.heartbeatEnable) {
            bb.log("未开启心跳检测");
            return;
        }

        var network = this;
        if(this.heartbeatId) {
            bb.log("ERROR: initHeartBeat重复调用 >>> heartbeatId已存在!");
            return;
        }

        var sendHeartbeat = function() { 
            if(!network.heartbeatEnable ) {
                cc.log("sendHeartbeat >> 心跳已被停用.");
                return;
            }

            var gap = network.nextHeartbeatTimeout - Date.now();

            if (!network.heartbeatTimeoutId) { 
                if (gap <= 100) {
                    var obj = {
                        "params":{"h":"1"},
                        "controller_name":"PublicController",
                        "method_name":"hb"
                    }

                    
                    //先清除上一次的超时检测timer
                    if( network.heartbeatTimeoutId ) {
                        cc.log(now()+" sendHeartbeat() >>> clearTimeout(%s) ...", network.heartbeatTimeoutId);
                        clearTimeout( network.heartbeatTimeoutId );
                        network.heartbeatTimeoutId = null;
                    }

                    network.sendProto(obj);
                    network.nextHeartbeatTimeout = Date.now() + bb["config"].HEARTBEAT_INTERVAL*1000;
                    
                    network.heartbeatTimeoutId = setTimeout(heartbeatTimeoutCb, bb["config"].HEARTBEAT_TIMEOUT*1000);
                    bb.log(" 发送心跳包到>>[%s]... (hbId:%s|%s)",network.host, network.heartbeatId, network.heartbeatTimeoutId);
                } else {
                    network.heartbeatId = setTimeout(sendHeartbeat, gap);
                    return;
                }
            } else {
                bb.log("[hbTimeId=%s] 此次不发心跳包, 等待下一个定时周期...", network.heartbeatTimeoutId);
            }

             //定时发送心跳包
             network.heartbeatId = setTimeout(sendHeartbeat, bb["config"].HEARTBEAT_INTERVAL*1000);
        };

        var heartbeatTimeoutCb = function() {
            if(!network.heartbeatEnable) {
                cc.log("heartbeatTimeoutCb >> 心跳已被停用.");
                return;
            }

            var gap = network.nextHeartbeatTimeout - Date.now();
            cc.log(now() + " heartbeatTimeoutCb(id:%s)... gap=%s", network.heartbeatTimeoutId, gap);
            network.heartbeatTimeoutId = null;

            if(gap > 100) {
                network.heartbeatTimeoutId = setTimeout(heartbeatTimeoutCb, gap);
            } else {
                cc.log(now() + '==== 心跳回复超时, 断开连接后重连( %s )====', network.host);
                network.disconnect();
                network.reconnect();
            }
        };

        network.heartbeatId = setTimeout(sendHeartbeat, bb["config"].HEARTBEAT_INTERVAL*1000);

    },

    clearHeartbeatTimer() {
        if(this.heartbeatId) {
            clearTimeout(this.heartbeatId);
            this.heartbeatId = null;
        }
        if(this.heartbeatTimeoutId) {
            clearTimeout(this.heartbeatTimeoutId);
            this.heartbeatTimeoutId = null;
        }
    }
});

module.exports = GameNetManager;
var self = null;
var hot_server_address = "http://192.168.1.153:6080/";
var writable_path = null;
const checkStaticHotNum = 3;

var isWriting = false;
    // 资源描述文件
var versionJson = null;
    // 待写入的文件队列。
var writeingList = null;

cc.Class({
    extends: cc.Component,

    properties: {
       progressBar: {
            type: cc.ProgressBar,
            default: null,
       },

       message: {
           type: cc.Label,
           default: null,
       },

       // 热更新检测的次数
       checkHotUpdateNum: 0,
       // 资源下载文件失败次数
       downLoadFailsNum: 0,
       // 需要下载资源的数组
       download_array: null,
       // 资源下载索引
       downIndex: 0,
       // 服务器上的描述文件
       server_data: null,
       // 下载失败的文件
       load_fails: null,
       // 当前已下载多少
       current_size: null,
       // 总共下载多少
       total_size: null,

       // 上次是否下载完成
       last_down_finsh: null,
       writeingList: null,
       isWriting: null,
       versionJson: null,
    },

    onLoad() {
        self = this;
    },

    onEnable() {
        self = this;
        this.checkHotUpdateNum = 0;
        this.download_array = [];
        this.current_size = 0;
        this.total_size = 0;
        this.downLoadFathis = 0;
        this.writeingList = [];
        this.isWriting = false;
        // 默认下载完成
        this.last_down_finsh = true;
        if (!cc.sys.isNative) {
            this.node.active = false;
            return;
        }
        writable_path = jsb.fileUtils.getWritablePath();
       
        // 检测上次是否下载完成
        var last_version = cc.dd.localDB.getHotVersionJson();
        this.versionJson = cc.dd.localDB.getHotVersionJson();
        this.message.string = "正在检查热更新资源...."

        if (last_version && last_version.length > 0) {
             cc.dd.log('上次下载未完成');
             // 说明没有热更新完成！
             this.last_down_finsh = false;
            self.download_array = cc.dd._.slice(last_version,0 , last_version.length);
            var ser_data =  cc.dd.localDB.getHotServerData();
            this.check_hotupdat_callBack(null, ser_data); 

            // 此次资源下载后应该还要检测一次是否需要热更新
        } else {
            cc.dd.log('上次下载完成');
            cc.dd.log('检测热更新是否需要热更新');
            self.check_hotupdate(self.check_hotupdat_callBack.bind(self));
        }
    },

    check_hotupdat_callBack(err, data) {
        if (err) {
                //
                if (self.checkHotUpdateNum > checkStaticHotNum) {
                    // 多次获取热更新资源的描述文件失败  
                    // TODO 通知 UI 热更新获取资源的描述文件失败  
                    self.node.active = false;
                    return;
                }
                self.checkHotUpdateNum++;
                self.check_hotupdate(self.check_hotupdat_callBack.bind(self));
        } else {
            // 说明获取 资源描述文件成功
            if (self.download_array.length <= 0) {
                // TODO 无需热更新
                cc.dd.log('不用去热更新资源');
                // cc.dd.user.EventEM.notifyEvent(cc.dd.user.EventName.HOT_UPDATE);   
                cc.dd.user.Module.hotupdate();                              
                self.node.active = false;
                return;
            }

            cc.dd.log('需要热更新版本');
            // 计算下载大小
            self.download_array.forEach((item) => {
                self.total_size += item.size;
            }); 
            var write_path = writable_path + "";
            var hotpath = writable_path + '/hotupdate';
            self.downIndex = 0;
            self.load_fails = [];
            self.server_data = data;
            // 去下载 差异文件
            this.message.string = "正在下载资源...."
            cc.dd.log('需要下载文件的大小为:' + self.total_size);

            if (DD.SystemTools.isWIFIEnabled()) {
                cc.dd.log('self.download_array[self.downIndex]:' + self.download_array[self.downIndex]);
                self.download_item(write_path, self.download_array[self.downIndex], self.downAssetsSuccess.bind(self),
                    self.downAssetsFails.bind(self));
            } else {
                let sure = function () {
                    cc.game.end();
                }
                let cancle = function () {
                    cc.dd.log('self.download_array[self.downIndex]:' + self.download_array[self.downIndex]);
                    self.download_item(write_path, self.download_array[self.downIndex], self.downAssetsSuccess.bind(self),
                        self.downAssetsFails.bind(self));
                }
                let str = `你正在使用流量数据冲浪，你是否确定要下载[${cc.dd.format.getFileSize(self.total_size)}]资源`;
                const persistRootNode = cc.find('PersistRootNode');
                const tip = persistRootNode.getChildByName("tip").getComponent('TipLayer');
                tip.showTip({message: str, fun1: sure, fun2: cancle});
            }
        }
    },

    onDisable() {

    },


    // 检测热更新
    check_hotupdate(start_func) {
        var write_path = writable_path;
        var hotpath = writable_path + '/hotupdate';
        var now_list = self.local_hotupdate_download_list(hotpath);

        var server_list = null;
        self.http_get(hot_server_address, '/hotupdate/hotupdate.json', null, (err, data) => {
            if (err) {
                cc.dd.log('检测热更新失败:' + err);
                if (start_func) {
                    start_func(err, []);   
                }
                return;
            }

            server_list = JSON.parse(data);
            cc.dd.localDB.setHotServerData(data);

            var i = 0;
            for (var key in server_list) {
                if (now_list[key] && now_list[key].md5 === server_list[key].md5) {
                    continue;
                }
                self.download_array.push(server_list[key]);
            }

            self.versionJson = cc.dd._.slice(self.download_array, 0, self.download_array.length);
            cc.dd.localDB.setHotVersionJson(self.versionJson);

            start_func(err, data);
        })
    },

    // 获取本地资源
    local_hotupdate_download_list(hotpath) {
        var str;
        if (jsb.fileUtils.isFileExist(hotpath + '/hotupdate.json')) {
            str = jsb.fileUtils.getStringFromFile(hotpath + '/hotupdate.json');
        } else {
            str = jsb.fileUtils.getStringFromFile('hotupdate.json');
        }

        if (!str) {
            var obj = {};
            str = JSON.stringify(obj);
        }
        var json = JSON.parse(str);
        return json;
    },

     // 资源下载成功
    downAssetsSuccess(size) {
        cc.dd.log('获取热更新资源描述文件成功');
        var write_path = writable_path;
        var hotpath = writable_path + '/hotupdate';
        self.downIndex++;
        cc.dd.log('self.downIndex++:' + self.downIndex + "download_array:" + self.download_array.length);
        if (self.downIndex >=  self.download_array.length) {
            // TODO 这里需要验证是否全部下载完成
            if (self.load_fails.length > 0) {
                // 有下载失败的文件
                cc.dd.log("资源下载失败!");
                self.reset_download_fails(self.load_fails);
                return;
            }

            // 下载成功
            cc.dd.log("资源下载成功!");
            // cc.dd.localDB.setHotServerData(null);
            cc.dd.user.Module.hotupdate(); 
            jsb.fileUtils.writeStringToFile(self.server_data, hotpath + "/hotupdate.json");
            cc.dd.localDB.setHotVersionJson(null);
            cc.dd.localDB.setUpdateFinish("1");
            cc.audioEngine.stopAll();
            cc.game.restart();
            return;
        } else {
            self.current_size += size;
            cc.log('当前已下载：' + (self.current_size / self.total_size).toFixed(5))
            self.message.string = `正在下载资源：${cc.dd.format.getFileSize(self.current_size)} / ${cc.dd.format.getFileSize(self.total_size)}`;
            self.progressBar.progress =  (self.current_size / self.total_size).toFixed(5);
            if (self.downIndex < self.download_array.length) {
                 cc.dd.log('==============2============');
                 var itemindx = self.download_array[self.downIndex - 1];
                cc.dd.log('==============2============');
                var idx = null;
                cc.log('------------------------------');
                cc.log(typeof(self.versionJson));
                self.versionJson.forEach((elenemt, index) => {
                    if (elenemt === itemindx) {
                        idx = index;
                    }
                })
                cc.dd.log(`移除一条数据:${idx}`);
                if (idx !== null && idx !== undefined && idx >= 0) {

                    cc.dd.log(`移除一条数据: 目前长度为1:${self.versionJson.length - 1} `);
                    self.versionJson.splice(idx,1);
                    cc.dd.log(`移除一条数据: 目前长度为2:${self.versionJson.length - 1} `);
                    cc.dd.localDB.setHotVersionJson(self.versionJson);

                } else {
                    cc.dd.log(`this.versionJson[item] 不存在 [item = ${item}]`);
                }
                cc.dd.log('==============4============');
                 self.download_item(write_path, self.download_array[self.downIndex], self.downAssetsSuccess.bind(self),
                    self.downAssetsFails.bind(self));
            }
          
        }
       
    },

    logind(){
        cc.dd.log('==============555============');
    },

    // 资源下载失败
    downAssetsFails(server_item) {
        cc.dd.log('获取热更新资源描述文件失败');
        self.load_fails.push(server_item);
        var write_path = writable_path;
        var hotpath = writable_path + '/hotupdate';
        self.downIndex++;
        cc.dd.log('self.downIndex++:' + self.downIndex + "download_array:" + self.download_array.length);
        if (self.downIndex >= self.download_array.length) {
            // TODO 这里需要验证是否全部下载完成
            if (self.load_fails.length > 0) {
                // 有下载失败的文件
                  cc.dd.log("资源下载失败!");
                self.reset_download_fails(self.load_fails);
            }
           
            if (!this.last_down_finsh) {
                cc.dd.log('第二次检测 热更新是否需要热更新');
                self.check_hotupdate(self.check_hotupdat_callBack.bind(self));
                return;
            } else {
                // 下载成功
                cc.dd.log("资源下载成功!");
                cc.dd.user.Module.hotupdate(); 
                jsb.fileUtils.writeStringToFile(self.server_data, hotpath + "/hotupdate.json");
                cc.dd.localDB.setUpdateFinish("1");
                cc.audioEngine.stopAll();
                cc.game.restart();
                return;
            }
        } else {
            if (self.downIndex < self.download_array.length) {
                self.download_item(write_path, self.download_array[self.downIndex], self.downAssetsSuccess.bind(self),
                    self.downAssetsFails.bind(self));
            }
            
        }
    },

    // 重新下载 失败文件
    reset_download_fails(server_list) {
        if (self.downLoadFailsNum > checkStaticHotNum)  {
            // 下载失败 cc.dd
            cc.dd.user.EventEM.notifyEvent(cc.dd.user.EventName.HOT_UPDATE_FAILS); 
            // cc.dd.user.Module.hotupdate(); 
            self.node.active = false;
        } 

        var write_path = writable_path;
        var hotpath = writable_path + 'hotupdate';
        self.downIndex = 0;
        self.load_fails = [];
        self.download_array = server_list;

        if (self.downIndex < self.download_array.length) {
            // 去下载 差异文件
            self.download_item(write_path, self.download_array[self.downIndex], self.downAssetsSuccess.bind(self),
                self.downAssetsFails.bind(self));
        }
        
    },

    http_download(url, path, params, callback) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 5000;
        var requestURL = url + path;
        if (params) {
            requestURL = requestURL + "?" + params;
        }

        xhr.responseType = "arraybuffer";  
        xhr.open("GET", requestURL, true);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "json/text/html;charset=UTF-8");
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                var buffer = xhr.response;
                var dataview = new DataView(buffer);
                var ints = new Uint8Array(buffer.byteLength);
                for (var i = 0; i < ints.length; i++) {
                    ints[i] = dataview.getUint8(i);
                }
                if (callback) {
                    callback(null, ints);    
                } 
            } else {
                if (callback) {
                    callback("" + xhr.status, null);    
                }
            }
        }

        xhr.send();
        return xhr;
    },

    http_get(url, path, params, callback) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = 5000;
        var requestURL = url + path;
        if (params) {
            requestURL = requestURL + "?" + params;
        }

        xhr.open("GET", requestURL, true);
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                try {
                    // var ret = JSON.parse(xhr.responseText);
                    var ret = xhr.responseText;
                    if (callback !== null) {
                        callback(null, ret);
                    }                        /* code */
                } catch (e) {
                    console.log("err:" + e);
                    callback(e, null);
                } finally {

                }
            } else {
                callback("" + xhr.status, null);
            } 
        };

        xhr.send();
        return xhr;
    },

    download_item(write_path, server_item, downAssetsSuccess, downAssetsFails) {
        cc.dd.log('server_item:' + server_item);
        if (server_item.file.indexOf(".json") >= 0) {
            self.http_get(hot_server_address, server_item.file, null, (err, data) => {
                if (err) {
                    if (downAssetsFails) {
                        downAssetsFails(server_item);
                    }
                    return;
                }

                var dir_array = [];
                dir_array = server_item.dir.split("/");
                var walk_dir = write_path;

                for (var j = 0; j < dir_array.length; j ++) {
                    walk_dir = walk_dir + "/" + dir_array[j];
                    if (!jsb.fileUtils.isDirectoryExist(walk_dir)) {
                        jsb.fileUtils.createDirectory(walk_dir);
                    }
                    jsb.fileUtils.writeStringToFile(data, write_path + "/" + server_item.file);
                }

                if (downAssetsSuccess) {
                    downAssetsSuccess(server_item.size);
                }
            });
        }  else {
            self.http_download(hot_server_address, server_item.file, null, (err, data) => {
                if (err) {
                    if (downAssetsFails) {
                        downAssetsFails(server_item);
                    }
                    return;
                }

                var dir_array = []; // 定义一数组 
                dir_array = server_item.dir.split("/");
                var walk_dir = write_path;

                for (var j = 0; j < dir_array.length; j ++) {
                    walk_dir = walk_dir + "/" + dir_array[j];
                    if (!jsb.fileUtils.isDirectoryExist(walk_dir)) {
                        jsb.fileUtils.createDirectory(walk_dir);
                    }
                    jsb.fileUtils.writeDataToFile(data, write_path + "/" + server_item.file);
                }

                if (downAssetsSuccess) {
                    downAssetsSuccess(server_item.size);
                }
            });
        }
    },

    set_hotupdate_search_path() {
        var path = jsb.fileUtils.getSearchPaths();
        var write_path = writable_path;
        var hotpath = write_path + "/hotupdate";
        if (!jsb.fileUtils.isDirectoryExist(hotpath)) {
            jsb.fileUtils.createDirectory(hotpath);
        }    
        path.unshift(hotpath);
        jsb.fileUtils.setSearchPaths(path);
    },

});

var _ = require("lodash");
// var parseObj = require("ParseObj");
var AppLog = cc.Class({

});

AppLog.dataList = [];

AppLog.isLog = true;

AppLog.getDateString = function () {
    var d = new Date();
    var str = d.getHours() + "";
    var timeStr = "";
    timeStr += (str.length === 1 ? ("0" + str) : str) + ":";

    str = d.getMinutes() + "";
    timeStr += (str.length === 1 ? ("0" + str) : str) + ":";

    str = d.getSeconds() + "";
    timeStr += (str.length === 1 ? ("0" + str) : str) + ".";

    str = d.getMilliseconds() + "";
    if (str.length === 1) str = "00" + str;
    if (str.length === 2) str = "0" + str;
    timeStr += str;

    timeStr = '[' + timeStr + ']';

    return timeStr;
};

AppLog.printStack = function () {
    var e = new Error();
    var lines = e.stack.split('\n');
    lines.shift();
    lines.forEach((line) => {
        cc.log('line:', line);
    });
};

AppLog.stack = function (index) {
    var e = new Error();
    var lines = e.stack.split("\n");
    lines.shift();
    var result = [];
    lines.forEach((line) => {
        line = line.substring(7);
        var lineBreak = line.split(" ");
        if (lineBreak.length < 2) {
            result.push(lineBreak[0]);
        } else {
            result.push({[lineBreak[0]]: lineBreak[1]});
        }
    });


    var list = [];

    for (var i = 0; i < result.length; i++) {
        for (var a in result[i]) {
            var l = a.split(".");
            if (l.length == 2) {
                list.push(a);
                list.push(i);
                break;
            }
        }
        if (list.length > 0) {
            break;
        }
    }
    
    if (list.length > 0) {
        var methodName = list[0].split(".")[1];
        // var lineNumber = result[list[1]][list[0]].split(":");
        // var lineNumber1 = lineNumber[lineNumber - 2];
        // var lineNumber2 = lineNumber[lineNumber - 1];
        var scriptName = result[list[1]][list[0]].split("/")
        scriptName = scriptName[scriptName.length - 1].split(".")[0]
        // return (`[${scriptName}.js->${methodName} ${lineNumber1}：${lineNumber2}]`);
        return (`[${scriptName}.js->${methodName}]`);
    }
    return "";
};

AppLog.trace = function () {
    var backLog = cc.log || console.log || log;

    if (AppLog.isLog) {
        backLog.call(AppLog, "%s%s" + cc.js.formatStr.apply(cc, arguments),
        AppLog.getDateString(), AppLog.stack(2));
    }
};


AppLog.log = function () {
    var backLog = cc.log || console.log ||  log;

    if (AppLog.isLog) {
        backLog.call(AppLog, "%s%s" + cc.js.formatStr.apply(cc, arguments),
        AppLog.getDateString(), AppLog.stack(2));
    }
};

AppLog.info1 = function () {
    var backLog = cc.log || console.log ||  log;
    if (AppLog.isLog) {
        backLog.call(AppLog, "%c%s%s:" + cc.js.formatStr.apply(cc, arguments),
            "color:#00CD00;", AppLog.getDateString(), AppLog.stack(2));

    }
};

AppLog.log2 = function () {
    var backLog = cc.log || console.log ||  log;
    if (AppLog.isLog) {
        backLog.call(AppLog, "%c%s%s:" + cc.js.formatStr.apply(cc, arguments),
         "color:#EED2EE;", AppLog.getDateString(), AppLog.stack(2));
    }
};

AppLog.info2 = function () {
    var backLog = cc.log || console.log ||  log;
    if (AppLog.isLog) {
        backLog.call(AppLog, "%c%s%s:" + cc.js.formatStr.apply(cc, arguments),
         "color:#F08080;", AppLog.getDateString(), AppLog.stack(2));
    }
};

AppLog.info3 = function () {
    var backLog = cc.log || console.log ||  log;
    if (AppLog.isLog) {
        backLog.call(AppLog, "%c%s%s:" + cc.js.formatStr.apply(cc, arguments),
         "color:#9B30FF;", AppLog.getDateString(), AppLog.stack(2));
    }
};
/**
 *  打印数据结构
 * @param data 数据
 */
AppLog.objInfo1 = (data) => {
    // if (AppLog.isLog) {
    //     AppLog.info3(parseObj(data));
    // }
};

AppLog.objInfo2 = (data) => {
    // if (AppLog.isLog) {
    //     AppLog.info2(parseObj(data));
    // }
};


AppLog.warn = function () {
    var backLog = cc.log || console.log ||  log;
    if (AppLog.isLog) {
        backLog.call(AppLog, "%c%s%s:" + cc.js.formatStr.apply(cc, arguments),
            "color:#ee7700;", AppLog.getDateString(), AppLog.stack(2));
    }
};

AppLog.error = function () {
    var backLog = cc.log || console.log ||  log;
    if (AppLog.isLog) {
        backLog.call(AppLog, "%c%s%s:" + cc.js.formatStr.apply(cc, arguments),
         "color:red", AppLog.getDateString(), AppLog.stack());
    }
};




module.exports = AppLog;

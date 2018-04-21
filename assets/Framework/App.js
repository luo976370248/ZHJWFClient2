// 游戏的命名空间
window.bb = {
};

initLib();

initScript("GameMsg")
initScript("AppLog")
function initScript(scripts) {
    require(scripts);
}

function addLib(namespace, scripts) {
    bb[namespace] = require(scripts);
}

function initLib() {
    addLib('logs', 'AppLog');
    bb.res = {};
    bb.logObj2= bb.logs.objInfo1;
    bb.logObj1 = bb.logs.objInfo2;
    bb.log = bb.logs.log;
    bb.err = bb.logs.err;
    bb.warn = bb.logs.warn;
    bb.info = bb.logs.info;
    bb.info1 = bb.logs.info1;
    bb.info2 = bb.logs.info2;
    // addLib("_", "lodash");
    addLib('memory', 'MemoryDetector');
    addLib('loader', "UILoader");
    addLib("ui", "UIKiller");
}


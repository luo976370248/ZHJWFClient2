var EventManager = require("EventManager");

var EventName = cc.Enum({
    ChangeWindow: 1,
    ShowWindow: 2,
    ShowOneTip: 3,
})

bb["eventName"] = EventName

var GameEvent = cc.Class({
    extends: EventManager,
});

bb["gameEvent"] = GameEvent.getInstance();

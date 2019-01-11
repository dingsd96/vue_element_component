define(['DCI'],function(DCI) {
    //订阅事件
    var subscribeEvent = function (name, calFun) {
        for (var i = 0; i < DCI.eventObj.length; i++) {
            if (DCI.eventObj[i].name === name) {
                document.getElementById(DCI.mapID).removeEventListener(DCI.eventObj[i].name, DCI.eventObj[i].calFun);
                DCI.eventObj.splice(i, 1)
            }
        }
        document.getElementById(DCI.mapID).addEventListener(name, calFun, false);

        DCI.eventObj.push({name: name, calFun: calFun});
    };

    //触发事件
    var triggerEvent = function (name, data) {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent(name, false, false);
        evt.data = data;
        document.getElementById(DCI.mapID).dispatchEvent(evt);
    };

    return {
        "subscribeEvent":subscribeEvent,
        "triggerEvent":triggerEvent
    }
})

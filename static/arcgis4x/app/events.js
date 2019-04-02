define([], function () {
    //订阅事件
    let subscribeEvent = function (name, cal) {
        if (this.eventObj[name]) {
            window.removeEventListener(name, this.eventObj[name]);
        }
        window.addEventListener(name, cal, false);
        this.eventObj[name] = cal
    };

    //触发事件
    let triggerEvent = function (name, data) {
        let evt = document.createEvent("HTMLEvents");
        evt.initEvent(name, false, false);
        evt.data = data;
        window.dispatchEvent(evt);
    };

    return {
        subscribeEvent,
        triggerEvent
    }
});
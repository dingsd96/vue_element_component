var gisServerPath = "" + "http://192.168.2.36:83/arcGIS"

function getServerPath() {
    return gisServerPath
}

dojoConfig = {
    has: {
        "dojo-firebug": true,
        "dojo-debug-messages": true
    },
    packages: [{
        name: "app",
        location: '../app'
    }]
}

function loadScript(src, callback) {
    // 如果已经加载过一次loadscript文件，那么就不再重新加载
    var isHasArcgisLoadScript = document.getElementById('arcgis-loadScript')
    if (isHasArcgisLoadScript) {
        callback && callback()
        return
    }
    var script = document.createElement('script');
    script.src = getServerPath() + src;
    script.id = 'arcgis-loadScript';
    document.body.appendChild(script);
    if (script.readyState) {    // ie
        script.onreadystatechange = function () {
            var state = this.readyState;
            if (state === 'loaded' || state === 'complete') {
                callback && callback()
            }
        }
    } else {    // Others: Firefox, Safari, Chrome, and Opera
        script.onload = function () {
            callback && callback()
        }
    }
}

class ArcGIS {
    constructor({
        position = {x: 20, y: 20},
        MapService = 'http://192.168.2.36:6080/arcgis/rest/services//gzmap18wz/MapServer',
        GeometryService = 'http://192.168.2.36:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer'
    }) {
        this.view = {}
        this.esri = {}
        this.eventObj = {}
        this.isInit = false
        this.toolbar = {}
        this.currentExtent = {}
        this.mouseOverGraphic = null
        this.hiddenMiniTimer = null
        this.position = position
        this.MapService = MapService
        this.GeometryService = GeometryService
        this.getScript()
    }

    getScript() {
        loadScript('/4.10/init.js', () => {
            require([
                'app/initMap',
                'app/events',
                'app/graphic',
                'app/draw',
                'app/hierarchical',
                'app/pointClustering',
                'app/lineBuffer',
                'app/commonUtils'
            ], (...data) => {
                for (let obj in data) {
                    for (let fun in data[obj]) {
                        this.__proto__[fun] = data[obj][fun]
                    }
                }
                this.isInit = true
            })
        })
    }


}


/*
var ArcGIS = function (calback) {
    loadScript('/4.10/init.js', function () {
        require([
            'app/DCI',
            'app/initMap'
        ], function (DCI) {
            var obj = DCI
            for (var item in arguments) {
                for (var i in arguments[item]) {
                    obj[i] = arguments[item][i]
                }
            }
            calback(obj)
        })
    });

    function loadScript(src, callback) {
        // 如果已经加载过一次loadscript文件，那么就不再重新加载
        var isHasArcgisLoadScript = document.getElementById('arcgis-loadScript')
        if (isHasArcgisLoadScript) {
            callback && callback()
            return
        }
        var script = document.createElement('script');
        script.src = getServerPath() + src;
        script.id = 'arcgis-loadScript';
        document.body.appendChild(script);
        if (script.readyState) {    // ie
            script.onreadystatechange = function () {
                var state = this.readyState;
                if (state === 'loaded' || state === 'complete') {
                    callback && callback()
                }
            }
        } else {    // Others: Firefox, Safari, Chrome, and Opera
            script.onload = function () {
                callback && callback()
            }
        }
    }
};
*/

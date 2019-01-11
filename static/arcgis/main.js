var gisServerPath = '' //"http://192.168.2.36:83/arcGis3.24"
function getServerPath() {
    return gisServerPath
}

var ArcGIS = function (calFun) {
    loadScript('/3.24/init.js', function() {
        require([
            'DCI',
            'commonUtils',
            'initMap',
            'eventMag',
            'loadSymbol',
            'polygon',
            'routeTask',
            'coordinateConversion',
            'pointClustering',
            'lineBuffer',
            'findRoad'
        ],function(DCI){
            var obj = DCI
            for(var item in arguments){
                for (var i in arguments[item]){
                    obj[i] =  arguments[item][i]
                }
            }
            calFun(obj)
        })
    });

    function loadScript(src, callback) {
        var script = document.createElement('script');
        script.src = getServerPath() + src;
        document.body.appendChild(script);
        if (script.readyState) {    // ie
            script.onreadystatechange = function() {
                var state = this.readyState;
                if (state === 'loaded' || state === 'complete') {
                    callback && callback()
                }
            }
        } else {    // Others: Firefox, Safari, Chrome, and Opera
            script.onload = function() {
                callback && callback()
            }
        }
    }
};

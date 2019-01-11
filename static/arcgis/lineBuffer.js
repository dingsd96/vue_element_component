define(['DCI'],function(DCI){
    // drawLineBuffer
    var drawLineBuffer = function(calFun,data){

        cleanToolbar();
        data = data || {};

        DCI.toolbar = new DCI.esri.Draw(DCI.map);
        DCI.toolbar.lineSymbol.color = data.color || {a:1,r:0,g:0,b:0};
        DCI.toolbar.lineSymbol.width = data.width || 1;
        DCI.toolbar.activate("polyline");

        // 绘画结束
        DCI.toolbar.on("draw-complete", function(event){
            showLineBuffer(event,data,calFun)
        });
    };

    var showLineBuffer = function (event,data,calFun){
        DCI.toolbar && DCI.toolbar.deactivate();
        DCI.map.graphics.clear();
        var graphics = [];

        // 画的线条
        var geometry = event.geometry;
        var lineSymbol = new DCI.esri.SimpleLineSymbol({
            'color': data.color || {a:1,r:0,g:0,b:0},
            'width': data.width || 1
        });
        var graphic = new DCI.esri.Graphic(geometry, lineSymbol);
        DCI.map.graphics.add(graphic);
        graphics.push(graphic);

        // 辐射范围
        var params = new DCI.esri.BufferParameters();
        params.distances = [data.distances || 100];
        params.outSpatialReference = DCI.map.spatialReference;
        var unitT = data.unit ? 'UNIT_KILOMETER' : 'UNIT_METER';
        params.unit = DCI.esri.GeometryService[unitT];
        DCI.esri.normalizeUtils.normalizeCentralMeridian([geometry]).then(function(normalizedGeometries){
            var normalizedGeometry = normalizedGeometries[0];
            params.geometries = [normalizedGeometry];
            DCI.esri.esriConfig.defaults.geometryService.buffer(params, function(bufferedGeometries){
                var polygonSymbol = new DCI.esri.SimpleFillSymbol();
                polygonSymbol.setColor({r:24,g:144,b:255,a:0.3});
                polygonSymbol.outline.color = {r:24,g:144,b:255,a:0.6};
                polygonSymbol.outline.width = 3;

                DCI.esri.array.forEach(bufferedGeometries, function(geometry) {
                    var graphicBuffer = new DCI.esri.Graphic(geometry, polygonSymbol);
                    DCI.map.graphics.add(graphicBuffer);
                    graphics.push(graphicBuffer);
                });

                if(calFun){
                    calFun(graphics);
                }
            });
        });
    };

    //清除绘制状态
    var cleanToolbar = function (){
        if(DCI.toolbar){
            DCI.toolbar.deactivate();
            DCI.toolbar = undefined
        }
    };

    //返回本模块API
    return {
        "drawLineBuffer":drawLineBuffer,
        "showLineBuffer":showLineBuffer
    }
})
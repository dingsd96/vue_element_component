define(['DCI'],function(DCI) {
    //DrawALine
    var drawALine = function(calFun,data){
        cleanToolbar();
        data = data || {};

        DCI.toolbar = new DCI.esri.Draw(DCI.map);
        DCI.toolbar.lineSymbol.color = data.color || {a:1,r:0,g:0,b:0};
        DCI.toolbar.lineSymbol.width = data.width || 1;
        DCI.toolbar.activate("polyline");

        DCI.toolbar.on("draw-complete", function(event){
        var graphics = [];
        DCI.map.graphics.clear();

        var geometry = event.geometry;
        var lineSymbol = new DCI.esri.SimpleLineSymbol({
            'color': data.color || {a:1,r:0,g:0,b:0},
            'width': data.width || 1
        });

        var graphic = new DCI.esri.Graphic(geometry, lineSymbol);
        DCI.map.graphics.add(graphic);
        graphics.push(graphic);

        var results;
        if(data.calculate){
            var polyLine = new DCI.esri.Polyline(DCI.mercator2LatLng(event.geometry.paths[0]));
            results = DCI.esri.GeodesicUtils.geodesicLengths([polyLine], "esriKilometers")[0].toFixed(6);
            if(data.show){
                var point = polyLine.paths[0][polyLine.paths[0].length-1];
                var gra = DCI.addTextSymbol({longitude:point[0],latitude:point[1]},{text:results});
                graphics.push(gra[0])
            }
        }

        if(calFun){
            calFun(graphics,results);
        }
        });
    };

    // ranging
    var ranging = function(calFun,data){
        cleanToolbar();
        data = data || {};

        DCI.toolbar = new DCI.esri.Draw(DCI.map);
        DCI.toolbar.lineSymbol.color = data.color || {a:1,r:0,g:0,b:0};
        DCI.toolbar.lineSymbol.width = data.width || 1;
        DCI.toolbar.activate("polyline");

        DCI.toolbar.on("draw-complete", function(event){
            var graphics = [];
            var distances = []
            DCI.map.graphics.clear();

            var geometry = event.geometry;
            var lineSymbol = new DCI.esri.SimpleLineSymbol({
                'color': data.color || {a:1,r:0,g:0,b:0},
                'width': data.width || 1
            });

            var graphic = new DCI.esri.Graphic(geometry, lineSymbol);
            DCI.map.graphics.add(graphic);
            graphics.push(graphic);

            var path = geometry.paths[0]
            for(var i = 1; i< path.length; i++){
                var line = DCI.mercator2LatLng([path[i-1],path[i]])
                distances.push(_showDistance(line[0],line[1]))
            }

            if(calFun){
                calFun(graphics,distances);
            }
        });
    };

    // showDistance
    var _showDistance = function(point1,point2){
        var distance =  DCI.getDistance(point1[1],point1[0],point2[1],point2[0])
        var point = {
            longitude: point2[0],
            latitude: point2[1]
        }
        DCI.addTextSymbol(point,{text:distance+'米'})

        return distance
    };

    //DrawACircle
    var drawACircle = function(calFun,symbol){
        cleanToolbar();
        symbol = symbol || {};
        _drawPolygon('circle',symbol,calFun);
    };

    //Draw an extent box.
    var drawAnExtentBox = function(calFun,symbol){
        cleanToolbar();
        symbol = symbol || {};
        _drawPolygon('extent',symbol,calFun);
    };

    //Draws a polygon.
    var drawAPolygon = function(calFun,symbol){
        cleanToolbar();
        symbol = symbol || {};
        _drawPolygon('polygon',symbol,calFun);
    };

    // draw 具体实现操作
    function _drawPolygon(value,data,calFun){
        data = data || {};
        DCI.toolbar = new DCI.esri.Draw(DCI.map);
        DCI.toolbar.fillSymbol.color = data.color || {r:24,g:144,b:255,a:0.3};
        DCI.toolbar.fillSymbol.outline.color = data.outlineColor || {a:1,r:0,g:0,b:0};
        DCI.toolbar.activate(value);

        DCI.toolbar.on("draw-complete", function(event){
        var graphics = [];

        DCI.map.graphics.clear();

        var geometry = event.geometry;
        var circleSymbol = new DCI.esri.SimpleFillSymbol();
        circleSymbol.setColor(data.color || {r:24,g:144,b:255,a:0.3});
        circleSymbol.outline.color = data.outlineColor || {a:1,r:255,g:255,b:255};
        circleSymbol.outline.width = data.outlineWidth || 1;

        var graphic = new DCI.esri.Graphic(geometry, circleSymbol);
        DCI.map.graphics.add(graphic);
        graphics.push(graphic);

        var results;
        if(data.calculate){
            var polyLine = new DCI.esri.Polyline(DCI.mercator2LatLng(event.geometry.rings[0]));
            results = DCI.esri.GeodesicUtils.geodesicLengths([polyLine], "esriSquareKilometers")[0].toFixed(6);
            if(data.show){
                var point = polyLine.paths[0];
                var longitude = 0, latitude = 0;
                for(var i = 0; i < point.length; i++){
                    longitude += point[i][0];
                    latitude += point[i][1];
                }
                longitude /= point.length;
                latitude /= point.length ;
                var gra = DCI.addTextSymbol({longitude:longitude,latitude:latitude},{text:results});
                graphics.push(gra[0])
            }
        }
        if(calFun){
            calFun(graphics);
        }
        });
    }

    //清除绘制状态
    var cleanToolbar = function (){
        if(DCI.toolbar){
            DCI.toolbar.deactivate();
            DCI.toolbar = undefined
        }
    };

    //获取某个点周围的范围( 根据半径选择范围 )
    var getRangByPoint =  function (point,radius){
        var points = [];
        var lengthT = radius/105 ;
        for(var i = 0; i < 360; i+=1){
        var pT ={
            x: point[0] + (Math.cos(i* 0.017453293)*lengthT),
            y: point[1] + (Math.sin(i* 0.017453293)*lengthT)
        }
        points.push(pT);
        }
        //最后一个值等于第一个值
        points.push(points[0]);

        return points;
    }

    return {
        "drawALine":drawALine,
        "ranging":ranging,
        "drawACircle":drawACircle,
        "drawAnExtentBox":drawAnExtentBox,
        "drawAPolygon":drawAPolygon,
        "cleanToolbar":cleanToolbar,
        "getRangByPoint":getRangByPoint
    }
})

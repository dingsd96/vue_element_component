define(['DCI'],function(DCI) {
    //点
    var addPointSymbol = function(point,symbol,attributes,infoTemplate){
        point = new DCI.esri.Point(point.longitude,point.latitude);
        symbol =  new DCI.esri.PictureMarkerSymbol({
            'url': symbol.url,
            'width': symbol.width || 20,
            'height': symbol.height || 20,
            'color': symbol.color || '',  //{a:1,r:255,g:255,b:255}
            'angle': symbol.angle || 0,
            'xoffset': symbol.xoffset || 0,
            'yoffset': symbol.yoffset || 0,
        });
        infoTemplate = infoTemplate ? new DCI.esri.InfoTemplate(infoTemplate) : '';

        var graphic = new DCI.esri.Graphic(point,symbol,attributes,infoTemplate);
        DCI.map.graphics.add(graphic);

        return [graphic]
    };

    //文字
    var addTextSymbol = function(point,symbol,attributes,infoTemplate) {
        point = new DCI.esri.Point(point.longitude,point.latitude);
        symbol =  new DCI.esri.TextSymbol({
            'text': symbol.text || 'Missing text',
            'color': symbol.color || {a:1,r:0,g:0,b:0},  //{a:1,r:255,g:255,b:255}
            'angle': symbol.angle || 0,
            'xoffset': symbol.xoffset || 0,
            'yoffset': symbol.yoffset || 0,
            'font': new DCI.esri.Font(
                symbol.fontSize || "14pt",
                DCI.esri.Font.STYLE_ITALIC,
                DCI.esri.Font.VARIANT_NORMAL,
                DCI.esri.Font.WEIGHT_BOLD,
                symbol.fontFamily || "Courier"
            )
        });
        infoTemplate = infoTemplate ? new DCI.esri.InfoTemplate(infoTemplate) : '';

        var graphic = new DCI.esri.Graphic(point,symbol,attributes,infoTemplate);
        DCI.map.graphics.add(graphic);

        return [graphic]
    };

    // 有背景的文字
    var addBackgroundTextSymbol = function(point,symbol,textSymbol,attributes,infoTemplate){
        point = new DCI.esri.Point(point.longitude,point.latitude);
        var _symbol = new DCI.esri.SimpleMarkerSymbol({
            "color": symbol.color || {a:1,r:255,g:0,b:0} ,
            "size": symbol.size || 'auto',
            "angle": symbol.angle || 0,
            "xoffset": symbol.xoffset || 0,
            "yoffset": symbol.yoffset || 0,
            "style": "esriSMSCircle",
            "outline": {
                "color": symbol.outlineColor || "",
                "width": symbol.outlineWidth || 0,
                "type": "esriSLS",
                "style": "esriSLSSolid"
            }
        });
        symbol.size ? _symbol.setSize(symbol.size) : '';
        infoTemplate = infoTemplate ? new DCI.esri.InfoTemplate(infoTemplate) : '';

        var graphic = new DCI.esri.Graphic(point,_symbol,attributes,infoTemplate);
        DCI.map.graphics.add(graphic);

        textSymbol =  new DCI.esri.TextSymbol({
            'text': textSymbol.text || 'Missing text',
            'color': textSymbol.color || '',  //{a:1,r:255,g:255,b:255}
            'angle': textSymbol.angle || 0,
            'xoffset': textSymbol.xoffset || 0,
            'yoffset': textSymbol.yoffset || 0,
            'font': new DCI.esri.Font(
                textSymbol.fontSize || "12",
                DCI.esri.Font.STYLE_ITALIC,
                DCI.esri.Font.VARIANT_NORMAL,
                DCI.esri.Font.WEIGHT_BOLD,
                textSymbol.fontFamily || "Courier"
            )
        });

        var textGraphic = new DCI.esri.Graphic(point,textSymbol,attributes,infoTemplate);
        DCI.map.graphics.add(textGraphic);

        return [graphic,textGraphic]
    };

    //线
    var addLineSymbol = function(startPoint,endPoint,symbol,arrow){
        var polyLine = new DCI.esri.Polyline([[startPoint.longitude,startPoint.latitude],[endPoint.longitude,endPoint.latitude]]);
        var lineSymbol = new DCI.esri.SimpleLineSymbol({
            'color': symbol.color || {a:1,r:0,g:0,b:255},
            'width': symbol.width || 1,
            'marker': {
                style: "arrow",
                placement: "end"
            }
        });
        var lineGraphic = new DCI.esri.Graphic(polyLine,lineSymbol);
        DCI.map.graphics.add(lineGraphic);

        if(arrow){
            var angle = _getAngle(startPoint,endPoint);
            var t = arrow.point >= 0 && arrow.point <= 1 ? arrow.point : 1/2;
            var arrowPoint = new DCI.esri.Point(
                startPoint.longitude - (startPoint.longitude - endPoint.longitude)*t,
                startPoint.latitude - (startPoint.latitude - endPoint.latitude)*t
            );
            var arrowSymbol =  new DCI.esri.PictureMarkerSymbol({
                "url":  DCI.baseUrl + "images/arrow.png",
                "width": arrow.width || 15,
                "height": arrow.height || 15,
                "angle": angle
            });

            var arrowGraphic = new DCI.esri.Graphic(arrowPoint,arrowSymbol);
            DCI.map.graphics.add(arrowGraphic);

            return [lineGraphic,arrowGraphic]
        }
        else{
            return [lineGraphic]
        }
    };

    //面
    var addAreaSymbol = function(points,symbol,attributes,infoTemplate){
        var polygon = new DCI.esri.Polygon(points);
        var polygonSymbol = new DCI.esri.SimpleFillSymbol();
            polygonSymbol.setColor(symbol.color || {a:1,r:255,g:0,b:0});
            polygonSymbol.outline.color = symbol.outlineColor || {a:1,r:255,g:255,b:255};
            polygonSymbol.outline.width = symbol.outlineWidth || 3;

        infoTemplate = infoTemplate ? new DCI.esri.InfoTemplate(infoTemplate) : '';

        var polygonGraphic = new DCI.esri.Graphic(polygon, polygonSymbol,attributes,infoTemplate);
        DCI.map.graphics.add(polygonGraphic);

        return [polygonGraphic];
    };

    //删除
    var deleteSymbol = function(graphic) {
        if(graphic){
            graphic.forEach(function(data){
                DCI.map.graphics.remove(data);
            })
        }
        else{
            DCI.map.graphics.clear();
        }
    };

    //聚合效果
    var polymerization = function (data,img) {
        DCI.allData = data;
        require([
                "esri/symbols/SimpleMarkerSymbol",
                "esri/symbols/SimpleLineSymbol",
                "esri/renderers/ClassBreaksRenderer",
                "FlareClusterLayer_v3"
            ],
        function(
            SimpleMarkerSymbol,
            SimpleLineSymbol,
            ClassBreaksRenderer,
            FlareClusterLayer
        ) {
            var clusterLayer = new FlareClusterLayer({
                id: "flare-cluster-layer",
                spatialReference: new DCI.esri.SpatialReference({"wkid": 4326}),
                preClustered: false,
                clusterRatio: 400
            });
            DCI.clusterLayer = clusterLayer;

            var defaultSym = new DCI.esri.PictureMarkerSymbol({
                "url": DCI.baseUrl + "images/"+img,
                "height":20,
                "width":20
            });
            var renderer = new ClassBreaksRenderer(defaultSym, "clusterCount");
            var xlSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 32, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, {a:0.8,r:200,g:52,b:59},1), {a:0.8,r:255,g:65,b:74});
            var lgSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 28, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, {a:0.8,r:41,g:163,b:41}, 1), {a:0.8,r:51,g:204,b:51});
            var mdSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 24, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, {a:0.8,r:82,g:163,b:204}, 1), {a:0.8,r:102,g:204,b:255});
            var smSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 22, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, {a:0.8,r:230,g:184,b:92}, 1), {a:0.8,r:255,g:204,b:102});
            renderer.addBreak(1, 19, smSymbol);
            renderer.addBreak(20, 150, mdSymbol);
            renderer.addBreak(151, 1000, lgSymbol);
            renderer.addBreak(1001, Infinity, xlSymbol);

            /*var template = new PopupTemplate({
                title: "{name}",
                fieldInfos: [
                    { fieldName: "facilityType", label: "Facility Type", visible: true},
                    { fieldName: "postcode", label: "Post Code", visible: true },
                    { fieldName: "isOpen", label: "Opening Hours", visible: true }
                ]
            });
            clusterLayer.infoTemplate = template;*/
            clusterLayer.setRenderer(renderer, "");
            DCI.map.addLayer(clusterLayer);
            DCI.clusterLayer = clusterLayer;

            clusterLayer.addData(data);
        })
    };

    //更改样式
    var changeSymbol = function(graphic,symbol){
        var graphics = [];
        for(var i = 0; i < graphic.length; i++){
            var tSymbol = graphic[i].symbol;
            for(var name in symbol[i]){
                var arr = name.split(",");
                if(arr.length === 1){
                    tSymbol[arr[0]] = symbol[i][name];
                }
                else if(arr.length === 2){
                    tSymbol[arr[0]][arr[1]] = symbol[i][name];
                }
                else if(arr.length === 3){
                    tSymbol[arr[0]][arr[1]][arr[2]] = symbol[i][name];
                }
            }
            graphic[i].setSymbol(tSymbol);
            graphics.push(graphic[i])
        }

        return graphics
    };

    //计算角度
    var _getAngle = function(start,end) {
        var x = Math.abs(start.longitude - end.longitude);
        var y = Math.abs(start.latitude - end.latitude);
        var z = Math.sqrt(x*x + y*y);
        var angle = Math.round((Math.asin(y / z) / Math.PI*180));

        if(start.longitude <= end.longitude){
            if(start.latitude <= end.latitude){
                return angle;
            }else{
                return 360 - angle;
            }
        }else{
            if(start.latitude <= end.latitude){
                return 180 - angle;
            }else{
                return 180 + angle;
            }
        }
    }

    return {
        "addPointSymbol":addPointSymbol,
        "addTextSymbol":addTextSymbol,
        "addBackgroundTextSymbol":addBackgroundTextSymbol,
        "addLineSymbol":addLineSymbol,
        "addAreaSymbol":addAreaSymbol,
        "deleteSymbol":deleteSymbol,
        "polymerization":polymerization,
        "changeSymbol":changeSymbol
    }
})


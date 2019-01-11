define(['DCI'],function(DCI) {
    // 初始化地图
    var _initMap = function (id, data, calFun) {

        DCI.mapID = id;
        var point = data.point || {longitude: 113.28, latitude: 23.157};
        var url = data.url || DCI.MapService;
        var zoom = data.zoom || 16

        DCI.map = new DCI.esri.Map(DCI.mapID, {
            center: new DCI.esri.Point(point.longitude, point.latitude),
            zoom: zoom,
            minZoom: 12,
            maxZoom: 18,
            slider: false,  // 缩放按钮
            logo: false
        });
        DCI.map.addLayer(new DCI.esri.ArcGISTiledMapServiceLayer(url));

        //比例尺
        var scalebar = new DCI.esri.Scalebar({
            map: DCI.map,    // 地图对象
            attachTo: "bottom-left",    // 控件的位置，右下角
            scalebarStyle: "line",    // line 比例尺样式类型
            scalebarUnit: "metric"      // 显示地图的单位，这里是km
        });

        //屏幕移动
        DCI.map.on("extent-change", function (data) {
            var extent = _maxExtent(data);
            if (calFun) {
                calFun(extent);
            }
        });

        //地图点击事件
        DCI.map.on('click', function (event) {
            DCI.eventObj.forEach(function (data) {
                if (data.name === 'mapClick') {
                    DCI.triggerEvent('mapClick', event);
                }
            });
        });

        //graphic点击事件
        DCI.map.on('load', function () {
            DCI.map.graphics.on('mouse-down', function (event) {
                DCI.clusterGraphicOnclickCalFun(event);
                DCI.eventObj.forEach(function (data) {
                    if (data.name === 'graphicClick') {
                        DCI.triggerEvent('graphicClick', event);
                    }
                });
            })
        });

        //graphic 鼠标移入事件
        DCI.map.on('load', function () {
            DCI.map.graphics.on('mouse-over', function (event) {
                DCI.clusterGraphicMouseOverCalFun(event);
                DCI.eventObj.forEach(function (data) {
                    if (data.name === 'graphicMouseOver') {
                        DCI.triggerEvent('graphicMouseOver', event);
                    }
                });
            })
        });

        //graphic 鼠标移出事件
        DCI.map.on('load', function () {
            DCI.map.graphics.on('mouse-out', function (event) {
                DCI.clusterGraphicMouseOutCalFun(event);
                DCI.eventObj.forEach(function (data) {
                    if (data.name === 'graphicMouseOut') {
                        DCI.triggerEvent('graphicMouseOut', event);
                    }
                });
            })
        });

        //地图mouseDown事件
        DCI.map.on('mouse-down', function (event) {
            DCI.mouseDown = DCI.esri.WebMercatorUtils.webMercatorToGeographic(event.mapPoint);
        });

        //鼠标移动事件
        DCI.map.on("mouse-move", function (event) {
            DCI.eventObj.forEach(function (data) {
                if (data.name === 'mouseMove') {
                    DCI.triggerEvent('mouseMove', DCI.esri.WebMercatorUtils.webMercatorToGeographic(event.mapPoint));
                }
            });
        });

    };

    var _maxExtent = function (extent) {

        var lnglats = DCI.mercator2LatLng([[extent.extent.xmax, extent.extent.ymax], [extent.extent.xmin, extent.extent.ymin]]);
        var extentT = {
            xmax: lnglats[0][0].toFixed(6),
            ymax: lnglats[0][1].toFixed(6),
            xmin: lnglats[1][0].toFixed(6),
            ymin: lnglats[1][1].toFixed(6)
        };
        extent.extent = extentT;

        if (extent.levelChange) {
            return extent
        }

        var flag = false;
        if (extentT.xmax > 114.1009) {
            extent.extent.xmin = extentT.xmin - (extentT.xmax - 114.1009);
            extent.extent.xmax = 114;
            flag = true
        }
        if (extentT.ymax > 23.9558) {
            extent.extent.ymin = extentT.ymin - (extentT.ymax - 23.9558);
            extent.extent.ymax = 23.9;
            flag = true
        }
        if (extentT.xmin < 112.9518) {
            extent.extent.xmax = extentT.xmax - 0 + (112.9518 - extentT.xmin);
            extent.extent.xmin = 113;
            flag = true
        }
        if (extentT.ymin < 22.5600) {
            extent.extent.ymax = extentT.ymax - 0 + (22.5600 - extentT.ymin);
            extent.extent.ymin = 22.7;
            flag = true
        }
        if (flag) {
            DCI.map.setExtent(new DCI.esri.Extent(extent.extent.xmin, extent.extent.ymin, extent.extent.xmax, extent.extent.ymax, new DCI.esri.SpatialReference({wkid: 4326})))
        }
        return extent
    };

    // 鹰眼图开启/关闭
    var overviewMap = function (flag){
        if(flag){
            DCI.overviewMapDijit = new DCI.esri.OverviewMap({
                map: DCI.map,   // 地图对象
                visible: true,  // 初始化可见，默认为false
                attachTo: "bottom-right",   // 默认右上角
                width: 150, // 默认值是地图高度的 1/4th
                height: 150, // 默认值是地图高度的 1/4th
                opacity: 0.4,    // 透明度 默认0.5
                maximizeButton: false,   // 最大化,最小化按钮，默认false
                expandFactor: 3,    //概览地图和总览图上显示的程度矩形的大小之间的比例。默认值是2，这意味着概览地图将至少是两倍的大小的程度矩形。
                color: "red"    // 默认颜色为#000000
            });
            DCI.overviewMapDijit.startup()
        }else {
            if(DCI.overviewMapDijit){
                DCI.overviewMapDijit.destroy()
            }
        }
    };

    // 加载文件之后调用初始化地图
    var initMap = function (id, data, calFun) {
        require([
            "esri/map",
            "esri/layers/ArcGISTiledMapServiceLayer",
            "esri/geometry/Point",
            "esri/dijit/OverviewMap",
            "esri/dijit/Scalebar",
            "esri/SpatialReference",
            "esri/geometry/webMercatorUtils",
            "esri/geometry/Extent",

            "esri/symbols/PictureMarkerSymbol",
            "esri/graphic",
            "esri/InfoTemplate",
            "esri/symbols/TextSymbol",
            "esri/symbols/Font",
            "esri/symbols/SimpleMarkerSymbol",
            "esri/geometry/Polyline",
            "esri/symbols/SimpleLineSymbol",
            "esri/geometry/Polygon",
            "esri/symbols/SimpleFillSymbol",

            "esri/toolbars/draw",
            "esri/geometry/geodesicUtils",

            "esri/config",
            "esri/tasks/GeometryService",
            "esri/tasks/BufferParameters",
            "esri/geometry/normalizeUtils",
            "dojo/_base/array",

            "esri/tasks/RouteTask",
            "esri/tasks/RouteParameters",
            "esri/tasks/FeatureSet",
            "dojo/on",

            "esri/tasks/FindTask",
            "esri/tasks/FindParameters",

            "dojo",
            "dojo/domReady!"
        ], function (
            Map,
            ArcGISTiledMapServiceLayer,
            Point,
            OverviewMap,
            Scalebar,
            SpatialReference,
            WebMercatorUtils,
            Extent,

            PictureMarkerSymbol,
            Graphic,
            InfoTemplate,
            TextSymbol,
            Font,
            SimpleMarkerSymbol,
            Polyline,
            SimpleLineSymbol,
            Polygon,
            SimpleFillSymbol,

            Draw,
            GeodesicUtils,

            esriConfig,
            GeometryService,
            BufferParameters,
            normalizeUtils,
            array,

            RouteTask,
            RouteParameters,
            FeatureSet,
            on,

            FindTask,
            FindParameters,

            dojo
        ) {

            DCI.esri.Map = Map; //map
            DCI.esri.ArcGISTiledMapServiceLayer = ArcGISTiledMapServiceLayer; //TitleMap
            DCI.esri.Point = Point;  //point
            DCI.esri.OverviewMap = OverviewMap;  //鹰眼图
            DCI.esri.Scalebar = Scalebar;  //比例尺
            DCI.esri.SpatialReference = SpatialReference;  //坐标系
            DCI.esri.WebMercatorUtils = WebMercatorUtils;  //坐标转换
            DCI.esri.Extent = Extent;

            DCI.esri.PictureMarkerSymbol = PictureMarkerSymbol;  //pointSymbol
            DCI.esri.Graphic = Graphic; //graphic
            DCI.esri.InfoTemplate = InfoTemplate;  //InfoTemplate
            DCI.esri.TextSymbol = TextSymbol;  //TextSymbol
            DCI.esri.Font = Font;  //Font
            DCI.esri.SimpleMarkerSymbol = SimpleMarkerSymbol;  //SimpleMarkerSymbol
            DCI.esri.Polyline = Polyline;  //Polyline
            DCI.esri.SimpleLineSymbol = SimpleLineSymbol;  //SimpleLineSymbol
            DCI.esri.Polygon = Polygon;  //Polygon
            DCI.esri.SimpleFillSymbol = SimpleFillSymbol;  //SimpleFillSymbol

            DCI.esri.Draw = Draw;    //draw
            DCI.esri.GeodesicUtils = GeodesicUtils;  //单位

            // 辐射渲染
            DCI.esri.esriConfig = esriConfig;
            DCI.esri.GeometryService = GeometryService; //
            DCI.esri.BufferParameters = BufferParameters; //
            DCI.esri.normalizeUtils = normalizeUtils; //
            DCI.esri.array = array; //

            // 路线规划
            DCI.esri.RouteTask = RouteTask;
            DCI.esri.RouteParameters = RouteParameters;
            DCI.esri.FeatureSet = FeatureSet;
            DCI.esri.on = on;

            // 路名查找
            DCI.esri.FindTask = FindTask;
            DCI.esri.FindParameters = FindParameters;

            DCI.dojo = dojo;//dojo

            // 绘画默认服务
            DCI.esri.esriConfig.defaults.geometryService = new DCI.esri.GeometryService(DCI.GeometryService);
            _initMap(id, data, calFun);
        });
    };

    var setZoom = function (level) {
        DCI.map.setZoom(level)
    }

    //返回本模块API
    return {
        "initMap":initMap,
        "overviewMap":overviewMap,
        "setZoom":setZoom
    }
})

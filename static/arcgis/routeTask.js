define(['DCI'],function(DCI) {

    var routeTask, routeParams, routes = [];
    var mapOnClick_addStops_connect, mapOnClick_addBarriers_connect;
    var stopSymbol,barrierSymbol,routeSymbols

    var initRoute = function (){
        routeTask = new DCI.esri.RouteTask(DCI.RouteTaskService);
        routeParams = new DCI.esri.RouteParameters();
        routeParams.stops = new DCI.esri.FeatureSet();
        routeParams.barriers = new DCI.esri.FeatureSet();
        routeParams.outSpatialReference = {"wkid": 102100};

        routeTask.on("solve-complete", _showRoute);
        routeTask.on("error", _errorHandler);

        stopSymbol = new DCI.esri.SimpleMarkerSymbol().setStyle(DCI.esri.SimpleMarkerSymbol.STYLE_CROSS).setSize(15);
        stopSymbol.outline.setWidth(3);

        barrierSymbol = new DCI.esri.SimpleMarkerSymbol().setStyle(DCI.esri.SimpleMarkerSymbol.STYLE_X).setSize(10);
        barrierSymbol.outline.setWidth(3).setColor({a: 1, r: 255, g: 0, b: 0});

        routeSymbols = new DCI.esri.SimpleLineSymbol().setColor({a: 0.5, r: 0, g: 255, b: 0}).setWidth(5);
    };

    var routeAddStops = function () {
        _removeEventHandlers();
        mapOnClick_addStops_connect = DCI.map.on("click", _addStop);
    };

    var routeClearStops = function () {
        _removeEventHandlers();
        for (var i = routeParams.stops.features.length - 1; i >= 0; i--) {
            DCI.map.graphics.remove(routeParams.stops.features.splice(i, 1)[0]);
        }
    };

    function _addStop(evt) {
        routeParams.stops.features.push(
            DCI.map.graphics.add(new DCI.esri.Graphic(evt.mapPoint, stopSymbol))
        );
    }

    var routeAddBarriers = function () {
        _removeEventHandlers();
        mapOnClick_addBarriers_connect = DCI.esri.on(DCI.map, "click", _addBarrier);
    };

    var routeClearBarriers = function () {
        _removeEventHandlers();
        for (var i = routeParams.barriers.features.length - 1; i >= 0; i--) {
            DCI.map.graphics.remove(routeParams.barriers.features.splice(i, 1)[0]);
        }
    };

    function _addBarrier(evt) {
        routeParams.barriers.features.push(
            DCI.map.graphics.add(
                new DCI.esri.Graphic(
                    evt.mapPoint,
                    barrierSymbol
                )
            )
        );
    }

    function _removeEventHandlers() {
        _init()
        if (mapOnClick_addStops_connect) {
            mapOnClick_addStops_connect.remove();
        }
        if (mapOnClick_addBarriers_connect) {
            mapOnClick_addBarriers_connect.remove();
        }
    }

    var routeSolveRoute = function () {
        _removeEventHandlers();
        routeTask.solve(routeParams);
    };

    var routeClearRoutes = function () {
        for (var i = routes.length - 1; i >= 0; i--) {
            DCI.map.graphics.remove(routes.splice(i, 1)[0]);
        }
        routes = [];
    };

    function _showRoute(evt) {
        routeClearRoutes()

        DCI.esri.array.forEach(evt.result.routeResults, function (routeResult, i) {
            routes.push(
                DCI.map.graphics.add(routeResult.route.setSymbol(routeSymbols))
            );
        });

        var msgs = ["Server messages:"];
        DCI.esri.array.forEach(evt.result.messages, function (message) {
            msgs.push(message.type + " : " + message.description);
        });
        if (msgs.length > 1) {
            alert(msgs.join("\n - "));
        }
    }

    function _errorHandler(err) {
        alert("该位置路网信息不足");
    }

    function _init(){
        if(!routeTask || !routeParams){
            initRoute()
        }
    }

    return {
        "initRoute":initRoute,
        "routeAddStops":routeAddStops,
        "routeClearStops":routeClearStops,
        "routeAddBarriers":routeAddBarriers,
        "routeClearBarriers":routeClearBarriers,
        "routeSolveRoute":routeSolveRoute,
        "routeClearRoutes":routeClearRoutes,
    }
});
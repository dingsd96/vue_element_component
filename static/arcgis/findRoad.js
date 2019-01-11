define(['DCI'],function(DCI) {

    var findTask,findParams;

    //初始化通过路名查找路径功能
    function initFindRoad() {
        //实例化FindTask
        findTask = new  DCI.esri.FindTask(DCI.FindTaskService);
        //FindTask的参数
        findParams = new DCI.esri.FindParameters();
        //返回Geometry
        findParams.returnGeometry = true;
        //查询的图层id
        findParams.layerIds = [0,1,2,3,4,5,6,7,8];
        //查询字段
        findParams.searchFields = ["Name_CHN"];
    }

    //根据输入的关键字进行findTask操纵
    function findRoad(searchText,calFun) {
        //set the search text to find parameters
        if(!findTask || !findParams){
            initFindRoad()
        }
        findParams.searchText = searchText;
        findTask.execute(findParams,function(results){
            var list = [];
            for(var i = 0; i < results.length; i++){
                var flag = false
                var result = results[i]
                for(var j = 0; j < list.length; j++ ){
                    if(list[j].name === result.value){
                        list[j].data.push(result)
                        flag = true
                        break;
                    }
                }
                if(!flag){
                    list.push({name:result.value, data: [ result ]} )
                }
            }
            calFun(list)
        });
    }

    //显示findTask的结果
    function showResultsRoad(results) {

        //清除上一次的高亮显示
        DCI.map.graphics.clear();
        var dataForGrid = [];

        for (var i=0, j=results.length; i<j; i++) {
            var curFeature = results[i];
            var graphic = curFeature.feature;

            //把查询到的字段信息等插入到dataForGrid
            var layerName = curFeature.layerName;
            var layerId = curFeature.layerId;
            var foundFieldName = curFeature.foundFieldName;
            var foundFieldValue = graphic.attributes[foundFieldName];

            var attValues = [layerName,layerId,foundFieldName,foundFieldValue];
            dataForGrid.push(attValues);
            //根据类型设置显示样式
            switch (graphic.geometry.type) {
                case "point":
                    var symbol = new DCI.esri.SimpleMarkerSymbol(DCI.esri.SimpleMarkerSymbol.STYLE_SQUARE, 10, new DCI.esri.SimpleLineSymbol(DCI.esri.SimpleLineSymbol.STYLE_SOLID, {a:1,r:255,g:0,b:0},1), {a:1,r:0,g:255,b:0},1);
                    break;
                case "polyline":
                    var symbol = new DCI.esri.SimpleLineSymbol(DCI.esri.SimpleLineSymbol.STYLE_DASH, {a:1,r:0,g:255,b:0}, 3);
                    break;
                case "polygon":
                    var symbol = new DCI.esri.SimpleFillSymbol(DCI.esri.SimpleFillSymbol.STYLE_NONE, new DCI.esri.SimpleLineSymbol(DCI.esri.SimpleLineSymbol.STYLE_DASHDOT, {a:1,r:255,g:0,b:0}, 2), {a:0.25,r:255,g:255,b:0});
                    break;
            }
            //设置显示样式
            graphic.setSymbol(symbol);
            //添加到graphics进行高亮显示
            DCI.map.graphics.add(graphic);
        }
    }

    return {
        "initFindRoad": initFindRoad,
        "findRoad": findRoad,
        "showResultsRoad": showResultsRoad
    }
});
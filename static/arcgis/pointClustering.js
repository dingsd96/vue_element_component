define(['DCI'],function(DCI) {
    var clusterTimer = undefined;
    var clusterLastGirId;
    var clusteringGraphic=[];

    //点聚类
    var pointClustering = function(data,calFun){
        clusteringGraphic = [];
        //DCI.subscribeEvent('clusterGraphicOnclickCalFun',calFun);

        var size =  {sm:30,md:150,lg:500};
        var graphics = [];

        var SimpleMarkerSymbol = DCI.esri.SimpleMarkerSymbol;
        var SimpleLineSymbol = DCI.esri.SimpleLineSymbol;
        var smSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 28, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, {a:0.8,r:230,g:184,b:92}, 1), {a:0.8,r:255,g:204,b:102});
        var mdSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 30, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, {a:0.8,r:82,g:163,b:204}, 1), {a:0.8,r:102,g:204,b:255});
        var lgSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 32, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, {a:0.8,r:41,g:163,b:41}, 1), {a:0.8,r:51,g:204,b:51});
        var xlSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 34, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, {a:0.8,r:200,g:52,b:59},1), {a:0.8,r:255,g:65,b:74});


        for(var i = 0; i < data.length; i++){
            if(data[i].length === 1){
                graphics.push(clusterAddAlone(data[i][0]));
            }
            else if(data[i].length < size.sm){
                graphics.push(clusterAddClustering(data[i],smSymbol,-3.5));
            }
            else if(data[i].length < size.md){
                graphics.push(clusterAddClustering(data[i],mdSymbol,-3.5));
            }
            else if(data[i].length < size.lg){
                graphics.push(clusterAddClustering(data[i],lgSymbol,-3.5));
            }
            else{
                graphics.push(clusterAddClustering(data[i],xlSymbol,-3.5));
            }
        }

        clusteringGraphic = graphics;
        return graphics
    };

    //alone
    function clusterAddAlone(data){
        var point = new DCI.esri.Point(data.longitude,data.latitude);
        var url = data.gisIcon || getServerPath() + '/images/arrow.png'
        var symbol =  new DCI.esri.PictureMarkerSymbol({
            'url': url,
            'width': data.width || 20,
            'height': data.height || 20,
            'color': data.color || '',  //{a:1,r:255,g:255,b:255}
            'angle': data.angle || 0,
            'xoffset': data.xoffset || 0,
            'yoffset': data.yoffset || 0,
        });

        var graphic = new DCI.esri.Graphic(point,symbol,Object.assign({alone:true,name:data.name},{data:data}));
        DCI.map.graphics.add(graphic);

        return [graphic]
    }

    //聚合点
    function clusterAddClustering(data,symbol,y){
        var graphics = [];

        var point = clusterGetCenterPoint(data);
        point = new DCI.esri.Point(point.longitude,point.latitude);

        var clusteringGraphic = new DCI.esri.Graphic(point,symbol,Object.assign({miniGir:data}, {girId:data[0].id}));
        DCI.map.graphics.add(clusteringGraphic);
        graphics.push(clusteringGraphic);

        var textSymbol =  new DCI.esri.TextSymbol({
            'text': data.length,
            'color': {a:1,r:255,g:255,b:255},  //{a:1,r:255,g:255,b:255}
            'xoffset': 0,
            'yoffset': y,
            'font': new DCI.esri.Font(
                "12",
                DCI.esri.Font.STYLE_ITALIC,
                DCI.esri.Font.VARIANT_NORMAL,
                DCI.esri.Font.WEIGHT_BOLD,
                "Courier"
            )
        });
        var textGraphic = new DCI.esri.Graphic(point,textSymbol,Object.assign({miniGir:data}, {girId:data[0].id}));
        DCI.map.graphics.add(textGraphic);
        graphics.push(textGraphic);

        //miniGraphic
        var miniSize = data.length <=8 ? data.length : 8;
        var angle = 2 * Math.PI / miniSize;
        for(var i = 0; i < miniSize; i++){
            var _symbol
            if(data[i].gisIcon){
                _symbol = diySymbol(Math.sin(angle*(i+1)),Math.cos(angle*(i+1)),data[i].gisIcon)
            }else{
                _symbol = clusterGetMiniSymbol(Math.sin(angle*(i+1)),Math.cos(angle*(i+1)))
            }
            var miniGraphic = new DCI.esri.Graphic(point,_symbol,Object.assign({pGirId:data[0].id},data[i]));
            if(i===7 && data.length > 8){
                var attributes=[];
                var name = '';
                for(var j = 7; j < data.length; j++){
                    attributes.push(data[j]);
                    j <= 9 ? name += data[j].name + '<br/>':'';
                    j === 9 ? name += '……':'';
                }

                miniGraphic.setAttributes(Object.assign({pGirId:data[0].id,name:name},attributes));
            }
            DCI.map.graphics.add(miniGraphic);
            miniGraphic.hide();
            graphics.push(miniGraphic);
        }

        return graphics;
    }

    //中心点
    function clusterGetCenterPoint(data){
        var lng = 0, lat = 0;
        for(var i in data){
            lng += data[i].longitude;
            lat += data[i].latitude;
        }
        lng /= data.length;
        lat /= data.length;

        return {longitude:lng,latitude:lat}
    }


    function diySymbol(x,y,url){
        return new DCI.esri.PictureMarkerSymbol({
            'url': url,
            'width': 20,
            'height': 20,
            'color': '',  //{a:1,r:255,g:255,b:255}
            'angle': 0,
            'xoffset': x * 30,
            'yoffset': y * 30
        });
    }

    //miniSymbol
    function clusterGetMiniSymbol(x,y){
        return new DCI.esri.SimpleMarkerSymbol({
            "color": {a: 0.8, r: 119, g: 119, b: 119},
            "size": 17,
            "angle": 0,
            "xoffset": x * 30,
            "yoffset": y * 30,
            "type": "esriSMS",
            "style": "esriSMSCircle",
            "outline": {
                "color": {a: 0.8, r: 255, g: 255, b: 255},
                "width": 1,
                "type": "esriSLS",
                "style": "esriSLSSolid"
            }
        });
    }

    //graphic移入
    function clusterGraphicMouseOverCalFun(event){
        var id;
        try{
            if(event.graphic.attributes.girId){    //pGir
                id = event.graphic.attributes.girId;
                DCI.hiddenTitle();
                if(event.graphic.attributes.miniGir.length > 20){
                    DCI.map.setMapCursor("pointer");
                    return
                }
            }
            else if(event.graphic.attributes.pGirId){    //miniGir
                id = event.graphic.attributes.pGirId;
                DCI.showTitle({x:event.clientX,y:event.clientY},event.graphic.attributes.name,0,0)
            }
            else if(event.graphic.attributes.alone){      //alone
                DCI.showTitle({x:event.clientX,y:event.clientY},event.graphic.attributes.name,0,0);
                return
            }
            else{
                return
            }
        }catch(e){return}

        var currentGraphic = clusterGetClusteringGraphic(id);
        DCI.changeSymbol(currentGraphic,[{size:45},{"font,size":'20'}]);
        if(clusterLastGirId === id){
            clusterShowMini(currentGraphic);
        }
        else{
            clusterShowMini(currentGraphic,true);
        }
    }

    //clusterShowMini
    function clusterShowMini(currentGraphic,flag){
        if(clusterTimer && !flag){
            clearTimeout(clusterTimer);
            clusterTimer = undefined
        }
        else{
            for(var i = 2; i <currentGraphic.length;i++){
                (function(i){
                    setTimeout(function(){currentGraphic[i].show()},50*i)
                })(i);
            }
        }
    }

    //graphic移出
    function clusterGraphicMouseOutCalFun(event){
        var id;
        try{
            if(event.graphic.attributes.girId){  //pGir
                id = event.graphic.attributes.girId;
            }
            else if(event.graphic.attributes.pGirId){  //miniGir
                id = event.graphic.attributes.pGirId;
            }
            else if(event.graphic.attributes.alone){    //alone
                DCI.hiddenTitle();
                return
            }
            else{
                return
            }
        }catch(e){return}

        DCI.hiddenTitle();
        var currentGraphic = clusterGetClusteringGraphic(id);
        clusterLastGirId = currentGraphic[0].attributes.girId
        clusterHiddenMini(currentGraphic);
    }

    // clusterHiddenMini
    function clusterHiddenMini(currentGraphic){
        clusterTimer = setTimeout(function(){
            DCI.changeSymbol(currentGraphic,[{size:35},{"font,size":'16'}]);
            DCI.hiddenTitle();
            for(var i = 2; i <currentGraphic.length;i++){
                (function(i){
                    setTimeout(function(){currentGraphic[i].hide()},50*i)
                })(i);
            }
            clusterTimer = undefined
        },200)
    }

    // getCurrentGraphic
    function clusterGetClusteringGraphic(id){
        for(var i = 0; i < clusteringGraphic.length; i++){
            if(clusteringGraphic[i][0].attributes.girId === id){
                return clusteringGraphic[i]
            }
        }
        return null;
    }

    // clusterGraphicOnclickCalFun
    function clusterGraphicOnclickCalFun(event){
        try{
            if(event.graphic.attributes.pGirId || event.graphic.attributes.alone){  //miniGir
                DCI.eventObj.forEach(function (data){
                    if(data.name === 'clusterGraphicOnclickCalFun'){
                        DCI.triggerEvent('clusterGraphicOnclickCalFun',event.graphic.attributes);
                    }
                });
            }
        }catch(e){}
    }

    return {
        "pointClustering":pointClustering,
        "clusterGraphicMouseOverCalFun":clusterGraphicMouseOverCalFun,
        "clusterGraphicMouseOutCalFun":clusterGraphicMouseOutCalFun,
        "clusterGraphicOnclickCalFun":clusterGraphicOnclickCalFun
    }
})
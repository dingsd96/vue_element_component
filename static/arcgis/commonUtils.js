define(['DCI'],function(DCI){
    // 墨卡托转经纬度
    var mercator2LatLng = function (mercators){
        /*var lnglats = [];
        for (var i = 0; i < mercators.length; i++) {
            lnglats.push(DCI.esri.WebMercatorUtils.xyToLngLat(mercators[i][0],mercators[i][1]));
        }
        return lnglats;*/
        if(!Array.isArray(mercators)) return
        mercators = mercators.map(function(arr){
            return DCI.esri.WebMercatorUtils.xyToLngLat(arr[0],arr[1])
        })
        return mercators
    };

    // 根据经纬度定位
    var locateByLatLng = function(point,zoom) {
        DCI.map.centerAndZoom(new DCI.esri.Point(point.longitude,point.latitude),zoom);
    };

    // showTitle
   var showTitle = function (e,title,x,y){
        if(title){
            DCI.map.setMapCursor("pointer");
            var scrPt = (e.x && e.y) ? e : DCI.map.toScreen(e.graphic.geometry);

            var textDiv = DCI.dojo.doc.createElement("div");
            DCI.dojo.attr(textDiv,{
                "id":"text"
            });
            x = x || 10 - DCI.position.x ;
            y = y || 10 - DCI.position.y ;
            DCI.dojo.style(textDiv, {
                "left": scrPt.x + x + "px",
                "top": scrPt.y + y + "px",
                "position": "absolute",
                "z-index":99,
                "background":"#fcffd1",
                "font-size":"10px",
                "border":"1px solid #0096ff",
                "padding": "0.1em 0.3em 0.1em",
                "border-radius": "3px",
                "box-shadow": "0 0 0.75em #777777"
            });
            textDiv.innerHTML =title;
            DCI.dojo.byId("map").appendChild(textDiv);
        }
    };

   // hiddenTitle
   var hiddenTitle = function (e){
     if(DCI.dojo.byId("text")){
        DCI.map.setMapCursor("default");
        DCI.dojo.byId("map").removeChild(DCI.dojo.byId("text"));
     }
   };

    /**
     * 计算经纬度距离，单位(米)
     * @return {number}
     */
    var getDistance = function(lat1,lng1,lat2,lng2){
        function rad(d){
            return d * Math.PI / 180.0;
        }
        var radLat1 = rad(lat1);
        var radLat2 = rad(lat2);
        var a = radLat1 - radLat2;
        var b = rad(lng1) - rad(lng2);
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +  Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
        s = s *6378.137 ;// EARTH_RADIUS;
        s = Math.round(s * 10000) / 10;
        return s;
    };

    // 聚合计算
    var getClusteringData = function (arrays,distance){
        switch(distance){
            case 18 : distance = 0.0001;
                break;
            case 17 : distance = 0.0005;
                break;
            case 16 : distance = 0.001;
                break;
            case 15 : distance = 0.0015;
                break;
            case 14 : distance = 0.002;
                break;
            case 13 : distance = 0.0025;
                break;
            case 12 : distance = 0.003;
                break;
            default: distance = 1;
                break;
        }

        // 1.将所有点分成单独的组
        var newArrays = [];
        arrays.forEach(function(arr){
            newArrays.push([arr])
        });

        var grouping = function(){
            var flag = false;
            // 2.将后面的组与前面的相比较
            for(var i = 0; i < newArrays.length-1; i++){
                for(var j = i+1; j < newArrays.length; j++){
                    // 3.判断是不是相近的两个点
                    var t = merge(newArrays[i],newArrays[j]);
                    // 4.如果是相近的点，将两个点合并
                    if(t){
                        newArrays.splice(j,1);
                        newArrays[i] = t;
                        flag = true
                    }
                }
            }
            // 5.一直合并直到没有合并的点
            if(flag){
                grouping();
            }
        };

        // 判断是不是相近的两个点
        var merge = function(arr1,arr2){
            var arr1Average = getAverageValue(arr1);
            var arr2Average = getAverageValue(arr2);

            if(getDistance(arr1Average,arr2Average) < distance){
                arr2.map(function(arr){
                    arr1.push(arr)
                });
                return arr1
            }
            else{
                return false
            }
        };

        // 两个组之间的中心距离
        var getAverageValue = function(arrs){
            var lng = 0, lat = 0;
            arrs.map(function(arr){
                lng += arr.longitude;
                lat += arr.latitude;
            });
            lng /= arrs.length;
            lat /= arrs.length;

            return {longitude:lng,latitude:lat}
        };

        // 两点之间的距离
        var getDistance = function(p1,p2){
            return Math.sqrt((p1.longitude - p2.longitude) * (p1.longitude - p2.longitude) + (p1.latitude - p2.latitude)*(p1.latitude - p2.latitude))
        };

        grouping();

        return newArrays;
    }

    // infoWindows
    var infoWindows = function(flag,data){
        if(!flag){
            DCI.map.infoWindow.hide()
        }else{
            var point = new DCI.esri.Point(data.point.longitude, data.point.latitude);
            DCI.map.infoWindow.show(point)
        }
    }

    // 计算面积 通过中心点画一个圆 功能预研
    /*
       DCI.drawACircle = function(calFun,symbol){
      require([
        "esri/toolbars/draw",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/geometry/webMercatorUtils",
        "esri/geometry/Polygon",
        "esri/geometry/geodesicUtils",
        "esri/units",
      ], function(
        Draw,
        SimpleLineSymbol,
        SimpleFillSymbol,
        webMercatorUtils,
        Polygon,
        geodesicUtils,
        Units,
      ) {
        DCI.esri.Draw = Draw
        DCI.esri.SimpleLineSymbol = SimpleLineSymbol
        DCI.esri.SimpleFillSymbol = SimpleFillSymbol
        DCI.esri.webMercatorUtils = webMercatorUtils
        DCI.esri.Polygon = Polygon
        DCI.esri.geodesicUtils = geodesicUtils
        DCI.esri.Units = Units

        symbol = symbol || {};
        _drawPolygon('circle',symbol,calFun);
      })
    };
    function _drawPolygon(value,data,calFun){
      data = data || {};
      var toolbar ={}
      toolbar = new DCI.esri.Draw(DCI.map);
      toolbar.fillSymbol.color = data.color || {r:24,g:144,b:255,a:0.3};
      toolbar.fillSymbol.outline.color = data.outlineColor || {a:1,r:0,g:0,b:0};
      toolbar.activate(value);

      toolbar.on("draw-complete", function(event){
        toolbar.deactivate();
        DCI.map.graphics.clear();

        var geometry = event.geometry;
        var circleSymbol = new DCI.esri.SimpleFillSymbol();
        circleSymbol.setColor(data.color || {r:24,g:144,b:255,a:0.3});
        circleSymbol.outline.color = data.outlineColor || {a:1,r:255,g:255,b:255};
        circleSymbol.outline.width = data.outlineWidth || 1;

        var graphic = new DCI.esri.Graphic(geometry, circleSymbol);
        DCI.map.graphics.add(graphic);

        var area =_getArea(graphic)

        if(calFun){
          calFun(graphic);
        }
      });
    }
    DCI.getRangByPoint2 = function (data,radius){
      DCI.map.graphics.clear()
      var point = _getPoint(data)
      var points = [];
      var lengthT = radius/105 ;
      for(var i = 0; i < 360; i+=6){
        var pT =[point[0] - 0 + (Math.cos(i* 0.017453293)*lengthT), point[1] - 0 + (Math.sin(i* 0.017453293)*lengthT)]
        points.push(pT);
      }
      //最后一个值等于第一个值
      points.push(points[0]);

      var geometry = new DCI.esri.Polygon(points)
      var circleSymbol = new DCI.esri.SimpleFillSymbol();
      circleSymbol.setColor(data.color || {r:24,g:144,b:255,a:0.3});
      circleSymbol.outline.color = data.outlineColor || {a:1,r:255,g:255,b:255};
      circleSymbol.outline.width = data.outlineWidth || 1;

      var graphic = new DCI.esri.Graphic(geometry, circleSymbol);
      DCI.map.graphics.add(graphic)

      var area = _getArea(graphic)

      return graphic
    }
    function _getPoint(data){
      var point =[]
      var geometry = data.geometry.rings[0]
      var sta = DCI.esri.webMercatorUtils.xyToLngLat(geometry[0][0],geometry[0][1])
      var end = DCI.esri.webMercatorUtils.xyToLngLat(geometry[31][0],geometry[31][1])
      point[0] = (((sta[0].toFixed(6) -0 )+ (end[0].toFixed(6) - 0))/2).toFixed(6)
      point[1] = (((sta[1].toFixed(6) -0 )+ (end[1].toFixed(6) - 0))/2).toFixed(6)
      return point
    }
    function _getArea(graphic){
      var data = graphic.geometry.rings[0]
      var polygonT = new DCI.esri.Polygon(data);
      var area = DCI.esri.geodesicUtils.geodesicAreas([polygonT], DCI.esri.Units.SQUARE_KILOMETERS);
      return Math.abs(area)
    }
   */

    // 是否在多边形里面 功能预研
    /*DCI.inside = function(points,point){
        var left = 0;
        var right = 0;
        for(var i = 0; i < points.length -1; i++){
            if((points[i][1] > point.y != points[i+1][1] > point.y)){
                var k = (points[i][1] - points[i+1][1]) / (points[i][0] - points[i+1][0]);
                var b = points[i][1] - (points[i][0] * k);
                if(point.y > (k * point.x) + b){
                    if(k>0){
                        right++;
                    }else{
                        left++;
                    }
                }else{
                    if(k>0){
                        left++;
                    }else{
                        right++;
                    }
                }
            }
        }
        if ((left % 2 == 1) && (right % 2 == 1)){
            return true;
        }else {
            return false;
        }
    }*/

    //返回本模块API
    return {
        "mercator2LatLng":mercator2LatLng,
        "locateByLatLng":locateByLatLng,
        "showTitle":showTitle,
        "hiddenTitle": hiddenTitle,
        "getDistance": getDistance,
        "getClusteringData" : getClusteringData,
        "infoWindows": infoWindows
    }
});


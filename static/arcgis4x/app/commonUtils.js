define([], function () {
    // 墨卡托转经纬度
    let mercator2LatLng = function (mercator) {
        return this.esri.webMercatorUtils.webMercatorToGeographic(mercator)
    };

    // 经纬度转墨卡托
    let latLng2Mercator = function (latlng) {
        return this.esri.webMercatorUtils.geographicToWebMercator(latlng)
    };

    // 根据经纬度定位
    let locateByLatLng = function (center, zoom) {
        this.view.goto({center, zoom})
    };

    /**
     * 计算经纬度距离，单位(米)
     * @return {number}
     */
    let getDistance = function (lat1, lng1, lat2, lng2) {
        function rad(d) {
            return d * Math.PI / 180.0;
        }

        let radLat1 = rad(lat1);
        let radLat2 = rad(lat2);
        let a = radLat1 - radLat2;
        let b = rad(lng1) - rad(lng2);
        let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137;// EARTH_RADIUS;
        s = Math.round(s * 10000) / 10;
        return s;
    };

    let getLength = function (polygon, acres) {
        acres = acres || 'kilometers'
        return Math.abs(this.esri.geometryEngine.planarLength(polygon, acres))
    }

    let getArea = function (polygon, acres) {
        acres = acres || 'square-kilometers'
        return Math.abs(this.esri.geometryEngine.geodesicArea(polygon, acres))
    }

    // infoWindows
    let infoWindows = function (flag, data) {
        if (!flag) {
            DCI.map.infoWindow.hide()
        } else {
            let point = new DCI.esri.Point(data.point.longitude, data.point.latitude);
            DCI.map.infoWindow.show(point)
            data.title && DCI.map.infoWindow.setTitle(data.title)
            data.content && DCI.map.infoWindow.setContent(data.content)
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
      let toolbar ={}
      toolbar = new DCI.esri.Draw(DCI.map);
      toolbar.fillSymbol.color = data.color || {r:24,g:144,b:255,a:0.3};
      toolbar.fillSymbol.outline.color = data.outlineColor || {a:1,r:0,g:0,b:0};
      toolbar.activate(value);

      toolbar.on("draw-complete", function(event){
        toolbar.deactivate();
        DCI.map.graphics.clear();

        let geometry = event.geometry;
        let circleSymbol = new DCI.esri.SimpleFillSymbol();
        circleSymbol.setColor(data.color || {r:24,g:144,b:255,a:0.3});
        circleSymbol.outline.color = data.outlineColor || {a:1,r:255,g:255,b:255};
        circleSymbol.outline.width = data.outlineWidth || 1;

        let graphic = new DCI.esri.Graphic(geometry, circleSymbol);
        DCI.map.graphics.add(graphic);

        let area =_getArea(graphic)

        if(calFun){
          calFun(graphic);
        }
      });
    }
    DCI.getRangByPoint2 = function (data,radius){
      DCI.map.graphics.clear()
      let point = _getPoint(data)
      let points = [];
      let lengthT = radius/105 ;
      for(let i = 0; i < 360; i+=6){
        let pT =[point[0] - 0 + (Math.cos(i* 0.017453293)*lengthT), point[1] - 0 + (Math.sin(i* 0.017453293)*lengthT)]
        points.push(pT);
      }
      //最后一个值等于第一个值
      points.push(points[0]);

      let geometry = new DCI.esri.Polygon(points)
      let circleSymbol = new DCI.esri.SimpleFillSymbol();
      circleSymbol.setColor(data.color || {r:24,g:144,b:255,a:0.3});
      circleSymbol.outline.color = data.outlineColor || {a:1,r:255,g:255,b:255};
      circleSymbol.outline.width = data.outlineWidth || 1;

      let graphic = new DCI.esri.Graphic(geometry, circleSymbol);
      DCI.map.graphics.add(graphic)

      let area = _getArea(graphic)

      return graphic
    }
    function _getPoint(data){
      let point =[]
      let geometry = data.geometry.rings[0]
      let sta = DCI.esri.webMercatorUtils.xyToLngLat(geometry[0][0],geometry[0][1])
      let end = DCI.esri.webMercatorUtils.xyToLngLat(geometry[31][0],geometry[31][1])
      point[0] = (((sta[0].toFixed(6) -0 )+ (end[0].toFixed(6) - 0))/2).toFixed(6)
      point[1] = (((sta[1].toFixed(6) -0 )+ (end[1].toFixed(6) - 0))/2).toFixed(6)
      return point
    }
    function _getArea(graphic){
      let data = graphic.geometry.rings[0]
      let polygonT = new DCI.esri.Polygon(data);
      let area = DCI.esri.geodesicUtils.geodesicAreas([polygonT], DCI.esri.Units.SQUARE_KILOMETERS);
      return Math.abs(area)
    }
   */

    // 是否在多边形里面 
    let inside = function (points, point) {
        let left = 0;
        let right = 0;
        for (let i = 0; i < points.length - 1; i++) {
            if ((points[i][1] > point.y !== points[i + 1][1] > point.y)) {
                let k = (points[i][1] - points[i + 1][1]) / (points[i][0] - points[i + 1][0]);
                let b = points[i][1] - (points[i][0] * k);
                if (point.y > (k * point.x) + b) {
                    if (k > 0) {
                        right++;
                    } else {
                        left++;
                    }
                } else {
                    if (k > 0) {
                        left++;
                    } else {
                        right++;
                    }
                }
            }
        }
        return ((left % 2 === 1) && (right % 2 === 1))
    }

    //返回本模块API
    return {
        mercator2LatLng,
        latLng2Mercator,
        locateByLatLng,
        getDistance,
        getLength,
        getArea,
        infoWindows,
        inside
    }
});


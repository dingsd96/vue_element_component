export default {
  name: 'ArcGIS',
  data () {
    return {
      gis: {}
    }
  },

  props: {
    gisURL: { // 地图服务路径
      type: String,
      default: '192.168.2.36:83/arcGis3.24'
    },
    mapServer: { // 地图服务路径
      type: String,
      default: 'http://192.168.2.178:6080/arcgis/rest/services/gzMap18/MapServer'
    },
    GeometryService: { // 辐射工具服务路径
      type: String,
      default: 'http://192.168.2.178:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer'
    },
    RouteTaskService: { // 路线规划服务路径
      type: String,
      default: 'http://192.168.2.36:6080/arcgis/rest/services/vecMapRoad/NAServer/%E8%B7%AF%E5%BE%84'
    },
    FindTaskService: { // 寻路服务路径
      type: String,
      default: 'http://192.168.2.178:6080/arcgis/rest/services/gzRouteName/MapServer'
    }
  },

  mounted () {
    this.getScript()
  },

  methods: {
    // 加载gisApi的文件
    getScript () {
      // 如果已经加载了这个文件
      if (window.ArcGIS) {
        this.getGisApi()
      } else {
        new Promise((resolve, reject) => {
          let script = document.createElement('script')
          script.type = 'text/javascript'
          script.src = 'http://' + this.gisURL + '/3.24/main.js'
          document.body.appendChild(script)
          script.onload = () => {
            resolve()
          }
          script.onerror = () => {
            reject(new Error('加载地图模块失败'))
          }
        }).then(() => {
          window.serverPath = this.gisURL
          this.getGisApi()
        }).catch((res) => {
          console.log(res)
        })
      }
    },

    // 将文件中的api放到这个组件中 并 通知父组件该组件已加载完成
    getGisApi () {
      window.ArcGIS((res) => {
        this.gis = res
        this.gis.mapServer = this.mapServer
        this.gis.GeometryService = this.GeometryService
        this.gis.RouteTaskService = this.RouteTaskService
        this.gis.FindTaskService = this.FindTaskService
      })
      this.$emit('initCompleted')
    },

    // 初始化地图
    initMap (id, data) {
      this.gis.initMap(id, data, this.getRange)
    },

    /**
     * 获取当前地图的信息
     * 返回地图的范围，层级，层级是否改变等信息
     * 每当地图移动，缩放的时候就会返回这些参数
     */
    getRange (data) {
      this.$emit('getRange', data)
    },

    /**
     * 鹰眼图开关
     * @param flag true:打开， false:关闭
     */
    overviewMap (flag) {
      this.gis.overviewMap(flag)
    },

    /**
     * 墨卡托坐标转换成经纬度
     * @param mercator [Array] 墨卡托坐标数组的数组
     * @returns [Array] 经纬度坐标数组的数组
     */
    mercator2LatLng (mercator) {
      const returns = this.gis.mercator2LatLng(mercator)
      this.$emit('mercator2LatLngCal', returns)
    },

    /**
     * 根据经纬度定位
     * const Obj = {longitude:Number, latitude:Number}
     * @param point Obj 要定位的点的坐标
     * @param zoom Number 定位之后的层级
     */
    locateByLatLng (point, zoom) {
      this.gis.locateByLatLng(point, zoom)
    },

    /**
     * 计算两个点之间的距离
     * const Obj = {longitude:Number, latitude:Number}
     * @param point1 Obj  点1的坐标
     * @param point2 Obj  点2的坐标
     * @returns Number 经纬度坐标数组的数组
     */
    getDistance (point1, point2) {
      const returns = this.gis.getDistance(point1.latitude, point1.longitude, point2.latitude, point2.longitude)
      this.$emit('getDistanceCal', returns)
    },

    /**
     * 聚合计算
     * 将对象数组基于密度分类
     * const Obj = {id:Number,name:String,longitude:Number, latitude:Number}
     * @param arrays [Obj] 点的数据的数组
     * @param distance Number 当前地图的层级
     * @returns [[Obj]]
     */
    getClusteringData (arrays, distance) {
      const returns = this.gis.getClusteringData(arrays, distance)
      this.$emit('getClusteringDataCal', returns)
    },

    /**
     * 生成聚合点
     * const Obj = {id:Number,name:String,longitude:Number, latitude:Number}
     * @param data [[Obj]]
     */
    pointClustering (data) {
      this.gis.pointClustering(data)
      this.gis.subscribeEvent('clusterGraphicOnclickCalFun', this.clusterGraphicOnclickCalFun)
    },
    // 鼠标点击聚合点的回调
    clusterGraphicOnclickCalFun (event) {
      this.$emit('clusterGraphicOnclickCalFun', event)
    },

    /**
     * 增加一个点的symbol
     * @param point / {longitude:Number,latitude:Number} symbol的位置
     * @param symbol / {url:''}  图片的地址和其它参数
     * @param attributes Object 该symbol的一些数据，在获取到这个symbol的时候会获取到这些信息
     * @param infoTemplate 鼠标放上去的弹窗信息（暂时没有用到）
     */
    addPointSymbol (point, symbol, attributes, infoTemplate) {
      const returns = this.gis.addPointSymbol(point, symbol, attributes, infoTemplate)
      this.$emit('addPointSymbolCal', returns)
    },

    /**
     * 增加一个文字的symbol
     * @param point / {longitude:Number,latitude:Number} symbol的位置
     * @param symbol / {text:''}  symbol的文字和其它参数
     * @param attributes Object 该symbol的一些数据，在获取到这个symbol的时候会获取到这些信息
     * @param infoTemplate 鼠标放上去的弹窗信息（暂时没有用到）
     */
    addTextSymbol (point, symbol, attributes, infoTemplate) {
      const returns = this.gis.addTextSymbol(point, symbol, attributes, infoTemplate)
      this.$emit('addTextSymbolCal', returns)
    },

    /**
     * 增加一个有背景的文字的symbol
     * @param point / {longitude:Number,latitude:Number} symbol的位置
     * @param symbol / {}  背景样式参数
     * @param textSymbol / {text:''}  symbol的文字和其它参数
     * @param attributes Object 该symbol的一些数据，在获取到这个symbol的时候会获取到这些信息
     * @param infoTemplate 鼠标放上去的弹窗信息（暂时没有用到）
     */
    addBackgroundTextSymbol (point, symbol, textSymbol, attributes, infoTemplate) {
      const returns = this.gis.addBackgroundTextSymbol(point, symbol, textSymbol, attributes, infoTemplate)
      this.$emit('addBackgroundTextSymbolCal', returns)
    },

    /**
     * 增加一个线的symbol
     * @param startPoint / {longitude:Number,latitude:Number} 开始点的坐标
     * @param endPoint /  {longitude:Number,latitude:Number} 结束点的坐标
     * @param symbol / {} 该线条的一些参数信息
     * @param arrow 箭头的参数，不传则不显示箭头
     */
    addLineSymbol (startPoint, endPoint, symbol, arrow) {
      const returns = this.gis.addLineSymbol(startPoint, endPoint, symbol, arrow)
      this.$emit('addLineSymbolCal', returns)
    },

    /**
     * 增加一个面的symbol
     * @param points / [{longitude:Number,latitude:Number}] 面的坐标的数组
     * @param symbol / {}  面的样式
     * @param attributes Object 该symbol的一些数据，在获取到这个symbol的时候会获取到这些信息
     * @param infoTemplate 鼠标放上去的弹窗信息（暂时没有用到）
     */
    addAreaSymbol (points, symbol, attributes, infoTemplate) {
      const returns = this.gis.addAreaSymbol(points, symbol, attributes, infoTemplate)
      this.$emit('addAreaSymbolCal', returns)
    },

    /**
     * 删除symbol
     * @param graphic 要删除的标注，不传则删除所有
     */
    deleteSymbol (graphic) {
      this.gis.deleteSymbol(graphic)
    },

    /**
     * 更改样式
     * @param graphic 需要更改的graphic
     * @param symbol 需要更改的样式
     */
    changeSymbol (graphic, symbol) {
      this.gis.changeSymbol(graphic, symbol)
    },

    /**
     * 画一条线
     * @param data symbol的样式属性
     */
    drawALine (data) {
      this.gis.drawALine((res) => {
        this.$emit('drawALineCal', res)
      }, data)
    },

    /**
     * 画一个圆
     * @param data symbol的样式属性
     */
    drawACircle (data) {
      this.gis.drawACircle((res) => {
        this.$emit('drawACircleCal', res)
      }, data)
    },

    /**
     * 画一个矩形
     * @param data symbol的样式属性
     */
    drawAnExtentBox (data) {
      this.gis.drawAnExtentBox((res) => {
        this.$emit('drawAnExtentBoxCal', res)
      }, data)
    },

    /**
     * 画一个多边形
     * @param data symbol的样式属性
     */
    drawAPolygon (data) {
      this.gis.drawAPolygon((res) => {
        this.$emit('drawAPolygonCal', res)
      }, data)
    },

    // 清除绘制状态
    cleanToolbar () {
      this.gis.cleanToolbar()
    },

    /**
     * 获取某个点周围的范围( 根据半径选择范围 )
     * @param point / {longitude:Number,latitude:Number} 点的坐标
     * @param radius Number 半径（米）
     */
    getRangByPoint (point, radius) {
      const returns = this.gis.getRangByPoint(point, radius)
      this.$emit('getRangByPointCal', returns)
    },

    // 初始化路径功能
    initRoute () {
      this.gis.initRoute()
    },

    // 增加一个停靠点
    routeAddStops () {
      this.gis.routeAddStops()
    },
    // 删除停靠点
    routeClearStops () {
      this.gis.routeClearStops()
    },
    // 增加一个障碍点
    routeAddBarriers () {
      this.gis.routeAddBarriers()
    },
    // 删除障碍点
    routeClearBarriers () {
      this.gis.routeClearBarriers()
    },
    // 绘制路线
    routeSolveRoute () {
      this.gis.routeSolveRoute()
    },
    // 删除路径
    routeClearRoutes () {
      this.gis.routeClearRoutes()
    },

    /**
     * 画一个具有辐射的线
     * @param data / {distances:Number} 辐射距离和其它样式修改
     */
    drawLineBuffer (data) {
      this.gis.drawLineBuffer((res) => {
        this.$emit('drawLineBufferCal', res)
      }, data)
    },

    /**
     * 生成一个具有辐射的线
     * @param event 中心线的graphic
     * @param data / {distances:Number} 辐射距离和其它样式修改
     */
    showLineBuffer (event, data) {
      this.gis.showLineBuffer(event, data, (res) => {
        this.$emit('showLineBufferCal', res)
      })
    }
  }

}

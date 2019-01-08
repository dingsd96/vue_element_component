import Gis from '@/components/ArcGis'
export default {
  name: 'gis',
  data () {
    return {
      gisApiURL: '192.168.2.36:83/arcGis3.24',
      mapServer: 'http://192.168.2.178:6080/arcgis/rest/services/gzMap18/MapServer',
      GeometryService: 'http://192.168.2.178:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer',
      RouteTaskService: 'http://192.168.2.36:6080/arcgis/rest/services/vecMapRoad/NAServer/%E8%B7%AF%E5%BE%84',
      FindTaskService: 'http://192.168.2.178:6080/arcgis/rest/services/gzRouteName/MapServer',
      gis: {},
      overviewMapFlag: false
    }
  },

  methods: {
    // 加载api完成
    initCompleted () {
      this.gis = this.$refs.gis
    },

    // 获取地图当前的范围
    getRange (data) {
      console.log('getRange-----------------', data)
    },

    // 初始化地图
    initMap () {
      this.gis.initMap(
        'map', // 地图显示的控件id
        {
          point: {longitude: 113.3221, latitude: 23.1631} // 地图显示的中心点坐标
          // url: this.mapServer // 地图服务的路径
        }
      )
    },

    // 鹰眼图开关
    overviewMap (data) {
      this.gis.overviewMap(data)
    },

    // 根据密度对数据分类
    pointClustering () {
      const jsonPoint = [
        {'id': '40033533336617991', 'name': '兴华派出所', 'longitude': 113.334392, 'latitude': 23.161834},
        {'id': '40033533336617992', 'name': '兴华派出所', 'longitude': 113.334392, 'latitude': 23.161643},
        {'id': '3962295690854410', 'name': '兴华派出所', 'longitude': 113.324392, 'latitude': 23.161834},
        {'id': '4003353333661731', 'name': '兴华派出所', 'longitude': 113.324392, 'latitude': 23.161834},
        {'id': '3962295690854411', 'name': '兴华派出所', 'longitude': 113.324392, 'latitude': 23.161834},
        {'id': '3962295692312677', 'name': '兴华派出所', 'longitude': 113.325463, 'latitude': 23.162122},
        {'id': '4003353346457645', 'name': '兴华派出所', 'longitude': 113.325463, 'latitude': 23.162122},
        {'id': '3962295691935886', 'name': '兴华派出所', 'longitude': 113.323, 'latitude': 23.163},
        {'id': '4003353344442416', 'name': '兴华派出所', 'longitude': 113.323, 'latitude': 23.163},
        {'id': '3962295690707048', 'name': '兴华派出所', 'longitude': 113.323, 'latitude': 23.163},
        {'id': '4003353333104681', 'name': '兴华派出所', 'longitude': 113.323, 'latitude': 23.163},
        {'id': '3962295690854413', 'name': '兴华派出所', 'longitude': 113.324224, 'latitude': 23.163864},
        {'id': '3962295690854414', 'name': '兴华派出所', 'longitude': 113.324224, 'latitude': 23.163864},
        {'id': '4003353333661735', 'name': '兴华派出所', 'longitude': 113.324224, 'latitude': 23.163864},
        {'id': '4003353333661734', 'name': '兴华派出所', 'longitude': 113.324224, 'latitude': 23.163864},
        {'id': '4003353333661699', 'name': '兴华派出所', 'longitude': 113.32295, 'latitude': 23.163243},
        {'id': '3962295690838214', 'name': '兴华派出所', 'longitude': 113.32295, 'latitude': 23.163243},
        {'id': '3962295691935945', 'name': '兴华派出所', 'longitude': 113.326, 'latitude': 23.162},
        {'id': '4003353344475143', 'name': '兴华派出所', 'longitude': 113.326, 'latitude': 23.162},
        {'id': '4003353344475146', 'name': '兴华派出所', 'longitude': 113.326, 'latitude': 23.162},
        {'id': '3962295691935941', 'name': '兴华派出所', 'longitude': 113.326, 'latitude': 23.162},
        {'id': '3962295691935944', 'name': '兴华派出所', 'longitude': 113.326, 'latitude': 23.162},
        {'id': '3962295691935940', 'name': '兴华派出所', 'longitude': 113.326, 'latitude': 23.162},
        {'id': '4003353344475147', 'name': '兴华派出所', 'longitude': 113.326, 'latitude': 23.162},
        {'id': '4003353344475142', 'name': '兴华派出所', 'longitude': 113.326, 'latitude': 23.162},
        {'id': '4003353344442417', 'name': '兴华派出所', 'longitude': 113.324, 'latitude': 23.164},
        {'id': '3962295691935887', 'name': '兴华派出所', 'longitude': 113.324, 'latitude': 23.164},
        {'id': '4003353344475165', 'name': '兴华派出所', 'longitude': 113.326, 'latitude': 23.163},
        {'id': '3962295691935942', 'name': '兴华派出所', 'longitude': 113.326, 'latitude': 23.163},
        {'id': '4003353344475164', 'name': '兴华派出所', 'longitude': 113.326, 'latitude': 23.163},
        {'id': '3962295691935943', 'name': '兴华派出所', 'longitude': 113.326, 'latitude': 23.163},
        {'id': '3962295691935963', 'name': '兴华派出所', 'longitude': 113.326, 'latitude': 23.163},
        {'id': '4003353344475145', 'name': '兴华派出所', 'longitude': 113.326, 'latitude': 23.163},
        {'id': '3962295691935962', 'name': '兴华派出所', 'longitude': 113.326, 'latitude': 23.163},
        {'id': '4003353344475144', 'name': '兴华派出所', 'longitude': 113.326, 'latitude': 23.163}, {'id': '3962295690707047', 'name': '兴华派出所', 'longitude': 113.325, 'latitude': 23.164}, {'id': '4003353333104680', 'name': '兴华派出所', 'longitude': 113.325, 'latitude': 23.164}, {'id': '3962295691935885', 'name': '兴华派出所', 'longitude': 113.323, 'latitude': 23.164}, {'id': '4003353344442415', 'name': '兴华派出所', 'longitude': 113.323, 'latitude': 23.164}, {'id': '3962295690707046', 'name': '兴华派出所', 'longitude': 113.322, 'latitude': 23.162}, {'id': '3962295690608844', 'name': '天河区城管执法局', 'longitude': 113.322, 'latitude': 23.162}, {'id': '4003353332924457', 'name': '天河区城管执法局', 'longitude': 113.322, 'latitude': 23.162}, {'id': '4003353333104679', 'name': '兴华派出所', 'longitude': 113.322, 'latitude': 23.162}, {'id': '3962295687184458', 'name': '5574兴华派出所', 'longitude': 113.325134, 'latitude': 23.164413}, {'id': '4003353324257303', 'name': '5574兴华派出所', 'longitude': 113.325134, 'latitude': 23.164413}, {'id': '4003353333661702', 'name': '兴华派出所', 'longitude': 113.323314, 'latitude': 23.164344}, {'id': '3962295690838217', 'name': '兴华派出所', 'longitude': 113.323314, 'latitude': 23.164344}, {'id': '4003353333661703', 'name': '兴华派出所', 'longitude': 113.323314, 'latitude': 23.164344}, {'id': '3962295690838218', 'name': '兴华派出所', 'longitude': 113.323314, 'latitude': 23.164344}, {'id': '4003353344475140', 'name': '兴华派出所', 'longitude': 113.324, 'latitude': 23.16}, {'id': '3962295691935938', 'name': '兴华派出所', 'longitude': 113.324, 'latitude': 23.16}, {'id': '3962295690838216', 'name': '兴华派出所', 'longitude': 113.325334, 'latitude': 23.164643}, {'id': '4003353333661701', 'name': '兴华派出所', 'longitude': 113.325334, 'latitude': 23.164643}, {'id': '3962295691935939', 'name': '兴华派出所', 'longitude': 113.322, 'latitude': 23.161}, {'id': '4003353344475141', 'name': '兴华派出所', 'longitude': 113.322, 'latitude': 23.161}, {'id': '3962295690854402', 'name': '兴华派出所', 'longitude': 113.321856, 'latitude': 23.161061}, {'id': '4003353333661724', 'name': '兴华派出所', 'longitude': 113.321856, 'latitude': 23.161061}, {'id': '3962295690854403', 'name': '兴华派出所', 'longitude': 113.321856, 'latitude': 23.161061}, {'id': '4003353333661723', 'name': '兴华派出所', 'longitude': 113.321856, 'latitude': 23.161061}, {'id': '4003353344475138', 'name': '兴华派出所', 'longitude': 113.323, 'latitude': 23.16}, {'id': '4003353344475137', 'name': '兴华派出所', 'longitude': 113.323, 'latitude': 23.16}, {'id': '3962295691935936', 'name': '兴华派出所', 'longitude': 113.323, 'latitude': 23.16}, {'id': '3962295691935935', 'name': '兴华派出所', 'longitude': 113.323, 'latitude': 23.16}, {'id': '3962295690707052', 'name': '兴华派出所', 'longitude': 113.322, 'latitude': 23.164}, {'id': '4003353333104685', 'name': '兴华派出所', 'longitude': 113.322, 'latitude': 23.164}]
      this.gis.getClusteringData(jsonPoint, 16)
    },
    // 根据密度对数据分类的回调，生成聚合点
    getClusteringDataCal (data) {
      this.gis.pointClustering(data)
    },
    // 点击聚合点的回调
    clusterGraphicOnclickCalFun (data) {
      console.log('clusterGraphicOnclickCalFun---------------------------', data)
    },

    // 画一条线
    drawALine () {
      this.gis.drawALine({calculate: true, show: true})
    },

    // 画线的回调
    drawALineCal (data) {
      console.log('drawALineCal---------------------------', data)
      this.gis.cleanToolbar()
    },

    // 清空
    deleteSymbol () {
      this.gis.deleteSymbol()
    }

  },

  components: {
    Gis
  }

}

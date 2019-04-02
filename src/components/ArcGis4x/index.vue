<template>
  <div></div>
</template>

<script>
export default {
  name: 'ArcGIS',
  data () {
    return {
      arcGis: {}
    }
  },

  props: {
    mapCss: { // gisCss
      type: String,
      default: 'http://192.168.2.36:83/arcGIS/4.10/esri/css/main.css'
    },
    gisURL: { // gisApi文件路径
      type: String,
      default: 'http://192.168.2.36:83/arcGIS/4.10/main.js'
    },
    gisServerPath: { // gis服务
      type: String,
      default: 'http://192.168.2.36:83/arcGIS'
    },
    MapService: { // 地图服务路径
      type: String,
      default: 'http://192.168.2.36:6080/arcgis/rest/services//gzmap18wz/MapServer'
    },
    GeometryService: { // 辐射工具服务路径
      type: String,
      default: 'http://192.168.2.36:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer'
    },
    position: {
      type: Object,
      default: () => {
        return {x: 0, y: 0}
      }
    }
  },

  mounted () {
    this.init()
  },

  methods: {
    // 初始化
    init () {
      // 获取css
      let getCss = new Promise((resolve, reject) => {
        let head = document.getElementsByTagName('head')[0]
        let mapCss = document.createElement('link')
        mapCss.href = this.mapCss
        mapCss.type = 'text/css'
        mapCss.rel = 'stylesheet'
        mapCss.onload = () => {
          resolve()
        }
        mapCss.onerror = () => {
          reject(new Error('加载地图js模块失败'))
        }
        head.appendChild(mapCss)
      })
      // 获取js
      let getScript = new Promise((resolve, reject) => {
        let script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = this.gisURL
        document.body.appendChild(script)
        script.onload = () => {
          resolve()
        }
        script.onerror = () => {
          reject(new Error('加载地图css模块失败'))
        }
      })

      let promiseArr = [getCss, getScript]
      Promise.all(promiseArr).then(() => {
        window.gisServerPath = this.gisServerPath
        this.getGisApi()
      }).catch((res) => {
        this.$emit('initError', res)
      })
    },

    // 将文件中的api放到这个组件中, 赋予默认值 并 通知父组件该组件已加载完成
    getGisApi: function () {
      // eslint-disable-next-line
      this.arcGis = new ArcGIS({})
      this._isInit()
    },

    _isInit () {
      if (this.arcGis.isInit) {
        this.$emit('initCompleted', this.arcGis)
      } else {
        setTimeout(function () {
          this._isInit()
        }.bind(this), 10)
      }
    }

  }
}
</script>

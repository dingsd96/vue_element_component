<template>
  <div class="mapWrapper">
    <div id="map4x"></div>
    <arcGis
      ref="arcGis4x"
      :gisURL="gisApiURL"
      :mapCss="mapCss"
      :gisServerPath="gisServerPath"
      :MapService="MapService"
      :GeometryService="GeometryService"
      @initCompleted=initCompleted></arcGis>
  </div>
</template>

<script>
import arcGis from '@/components/ArcGis4x/index.vue'
export default {
  data () {
    return {
      arcGis: {},
      mapCss: 'http://192.168.2.34:83/arcGIS/4.10/esri/css/main.css',
      gisApiURL: 'http://192.168.2.34:83/arcGIS/4.10/main.js',
      gisServerPath: 'http://192.168.2.34:83/arcGIS',
      MapService: 'http://192.168.2.36:6080/arcgis/rest/services//gzmap18wz/MapServer',
      GeometryService: 'http://192.168.2.36:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer'
    }
  },

  mounted () {
  },

  methods: {
    initCompleted (data) {
      console.log(data)
      this.arcGis = data
      this.initMap()
    },

    initMap () {
      this.arcGis.initMap('map4x', {
        point: {
          longitude: 113.3221,
          latitude: 23.1631
        },
        zoom: 6,
        url:  'gis/gisMapServer'//'http://192.168.2.36:6080/arcgis/rest/services//gzmap18wz/MapServer' //'gisMapServer'
    })
    }
  },

  components: {
    arcGis
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .mapWrapper {
    width: 100%;
    height: 100%;
    #map4x {
      width: 100%;
      height: 100%;
      border: 1px solid red;
    }
  }
</style>

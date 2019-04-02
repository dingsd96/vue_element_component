<template>
  <div class="gisContainer">
    <div id="map" class="map"></div>
    <div class="buttons">
      <el-button @click="initMap">加载地图</el-button>
      <el-switch v-model="overviewMapFlag" @change="overviewMap"></el-switch>
      <el-button @click="drawALine">画一条线</el-button>
      <el-button @click="deleteSymbol">清空</el-button>
      <el-button @click="getArea">计算面积</el-button>
      <el-button @click="showInfoWindow">infoWindow</el-button>
      <br/><el-button @click="pointClustering">聚合图层</el-button>
    </div>
    <Gis ref="gis"
         :gisURL="gisApiURL"
         :gisServerPath="gisServerPath"
         :MapService="MapService"
         :GeometryService="GeometryService"
         :RouteTaskService="RouteTaskService"
         :FindTaskService="FindTaskService"
         :position="position"
         @initCompleted="initCompleted"
         @getRange="getRange"
         @getClusteringDataCal="getClusteringDataCal"
         @clusterGraphicOnclickCalFun="clusterGraphicOnclickCalFun"
         @drawALineCal="drawALineCal"
    />
  </div>
</template>

<script>
import gis from './gis.js'
export default gis
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .gisContainer{
    height 100%
    background-color white
    .map{
      height 90%
      position relative
    }
    .buttons{
      width 100%
    }
  }
</style>

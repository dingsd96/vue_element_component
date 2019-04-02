if (!has('dojo-built')) {
  esriConfig.workers.loaderConfig = {
    paths: {
      'esri': '../arcgis-js-api'
    }
  }
}

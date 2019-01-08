// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// element UI
import ElementUI from '@/config/elementUiConfig.js'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.styl'

// iconFont全局注册
import '@/assets/iconfont/iconfont.css'

// filter全局注册
import filters from './utils/filters'

// Axios
import Api from './utils/Axios'

// arcgis CSS
import { loadCss } from 'esri-loader'
loadCss('http://192.168.2.36:83/arcGis3.24/3.24/esri/css/esri.css')

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.filters = filters
Vue.prototype.Api = Api

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  components: { App },
  template: '<App/>',
  Api
})

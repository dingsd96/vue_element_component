import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    /*
    * 非法路径跳转到404
    * 听说这个要放到最后面
    * 但我放这里好像暂时也没出现什么问题o(ﾟДﾟ)っ！
    * */
    {
      path: '*',
      redirect: '/404'
    },
    /*
    * import 默认找路径下的 index.js 文件
    * 如果不是引用 index.js 文件则需要把文件路径写全
    * !!!!!!!!!!!!!!!!!! 记得写后缀 !!!!!!!!!!!!!!!!!!!!
    * */
    {
      path: '/home',
      name: 'home',
      component: () => import('../view/home'),
      children: [
        {
          path: 'component/table',
          name: 'component',
          component: () => import('../view/home/component/tableDome.vue')
        },
        {
          path: 'gis/gis',
          name: 'gis',
          component: () => import('../view/home/gis')
        },
        {
          path: 'e-charts',
          name: 'gis',
          component: () => import('../view/home/eCharts/index.vue')
        }
      ]
    },
    {
      path: '/404',
      name: '404',
      component: () => import('../view/404')
    }

  ]
})

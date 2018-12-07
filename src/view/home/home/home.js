import menuData from './menuConfig'

export default {
  data () {
    return {
      collapseFlag: false,
      menuData: menuData
    }
  },

  computed: {
    /**
     * 用于决定哪些menu需要被展开
     */
    defaultOpen () {
      const path = this.$route.path
      // 首页不展开
      if (path === '/home') {
        return []
      }
      // 抬头一片苍茫月，是我生生不死心
      const openItem = menuData.find(item => {
        if (!item.menuItem) return null
        const idx = item.menuItem.findIndex(subItem => {
          return subItem.route === path
        })
        return idx !== -1
      })
      return openItem ? [openItem.name] : []
    }
  },

  methods: {
    /*
    * 点击标题div框时触发
    * 回到主页面
    * */
    handleLogoClick () {
      this.$router.push('/home')
    }
  }
}

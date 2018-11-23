import {
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup
} from 'element-ui'

export default {
  install (Vue) {
    Vue.use(Container)
    Vue.use(Header)
    Vue.use(Aside)
    Vue.use(Main)
    Vue.use(Menu)
    Vue.use(Submenu)
    Vue.use(MenuItem)
    Vue.use(MenuItemGroup)
  }
}

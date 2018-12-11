import {
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Table,
  TableColumn,
  Tooltip,
  Button,
  MessageBox,
  Message,
  Pagination

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
    Vue.use(Table)
    Vue.use(TableColumn)
    Vue.use(Tooltip)
    Vue.use(Button)
    Vue.prototype.$message = Message
    Vue.prototype.$msgbox = MessageBox
    Vue.prototype.$alert = MessageBox.alert
    Vue.prototype.$confirm = MessageBox.confirm
    Vue.prototype.$prompt = MessageBox.prompt
    Vue.use(Pagination)
  }
}

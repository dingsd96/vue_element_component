import {
  Transfer,
  Button,
  Row,
  Col,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Container,
  Header,
  Aside,
  Main,
  Icon,
  Input,
  InputNumber,
  Popover,
  Tree,
  Message,
  MessageBox,
  Table,
  TableColumn,
  Tabs,
  TabPane,
  Pagination,
  Tooltip,
  Dialog,
  Form,
  FormItem,
  Progress,
  Select,
  Option,
  Upload,
  Switch,
  TimePicker,
  Checkbox,
  CheckboxGroup,
  Collapse,
  CollapseItem,
  Radio,
  RadioGroup,
  RadioButton
} from 'element-ui'

export default {
  install (Vue) {
    Vue.use(Transfer)
    Vue.use(Button)
    Vue.use(Row)
    Vue.use(Col)
    Vue.use(Menu)
    Vue.use(Submenu)
    Vue.use(MenuItem)
    Vue.use(MenuItemGroup)
    Vue.use(Container)
    Vue.use(Header)
    Vue.use(Aside)
    Vue.use(Popover)
    Vue.use(Icon)
    Vue.use(Input)
    Vue.use(InputNumber)
    Vue.use(Popover)
    Vue.use(Tree)
    Vue.use(Main)
    Vue.prototype.$message = Message
    Vue.prototype.$msgbox = MessageBox
    Vue.prototype.$alert = MessageBox.alert
    Vue.prototype.$confirm = MessageBox.confirm
    Vue.prototype.$prompt = MessageBox.prompt
    Vue.use(Table)
    Vue.use(TableColumn)
    Vue.use(Tabs)
    Vue.use(TabPane)
    Vue.use(Pagination)
    Vue.use(Tooltip)
    Vue.use(Dialog)
    Vue.use(Form)
    Vue.use(FormItem)
    Vue.use(Progress)
    Vue.use(Select)
    Vue.use(Option)
    Vue.use(Upload)
    Vue.use(Switch)
    Vue.use(TimePicker)
    Vue.use(Checkbox)
    Vue.use(CheckboxGroup)
    Vue.use(Collapse)
    Vue.use(CollapseItem)
    Vue.use(Radio)
    Vue.use(RadioGroup)
    Vue.use(RadioButton)
  }
}

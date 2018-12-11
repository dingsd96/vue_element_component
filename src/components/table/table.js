import ClipboardJS from 'clipboard'
import TableTooltip from '../TableTooltip'

export default {
  name: 'DTable',
  data () {
    return {
      dataList: [],
      selectedList: [],
      // 分页数据
      pagination: {
        total: 0, // 总数
        currentPage: 0, // 当前页
        pageSize: 0 // 每页显示数
      }
    }
  },

  props: {
    tableSelectFlag: {
      type: Boolean,
      default: true
    },
    tableColumns: {
      type: Array,
      default: function () {
        return [{
          label: '',
          key: '',
          filter: ''
        }]
      }
    }
  },

  components: {
    TableTooltip
  },

  mounted () {
    const clipboard = new ClipboardJS('.copy') // 拷贝到剪贴板
    clipboard.on('success', () => {
      this.$message({message: '复制成功', type: 'success'})
    })
    clipboard.on('error', (e) => {
      this.$message({message: e, type: 'error'})
    })
    this.getTableData()
  },

  methods: {
    // 获取表格中的数据
    getTableData () {
      // 自己构造的假数据(￣▽￣)／
      this.dataList = [{
        label1: '栏目1-1',
        label2: '栏目1-2',
        copy: '12345467899'
      }, {
        label1: '新增按钮被过滤了',
        label2: '这栏文字超过长度了，超出部分会隐藏，在鼠标放上去之后才显示所有的内容',
        copy: '9876543211'
      }
      ]
    },
    // 操作
    callback (data, calFun) {
      this.$emit(calFun, data)
    },
    // 当前页改变
    pageCurrentChange (data) {
      this.pagination.currentPage = data
      this.getTableData()
    },
    // 每页数目改变
    pageSizeChange (data) {
      this.pagination.currentPage = 1
      this.pagination.pageSize = data
      this.getTableData()
    },
    // 表格中选项改变
    selectionChange (data) {
      this.selectedList = data
    },
    // 修改表头样式
    setRowHeaderStyle () {
      return 'background:#FAFAFA; height:54px; color: #000000;text '
    }
  }
}

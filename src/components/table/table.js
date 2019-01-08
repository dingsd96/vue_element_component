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
        currentPage: 1, // 当前页
        pageSize: 10 // 每页显示数
      }
    }
  },

  props: {
    tableSelectFlag: {
      type: Boolean,
      default: true
    },
    // 表格中数据的获取
    apiParameter: {
      type: Object,
      default: function () {
        return {

        }
      }
    },
    // 表格中显示的配置
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
    // this.getTableData()
  },

  methods: {
    // 获取表格中的数据
    getTableData () {
      const params = {
        pageNum: this.pagination.currentPage,
        pageSize: this.pagination.pageSize
      }
      this.Api.get(this.apiParameter.url, {
        params: Object.assign(params, this.apiParameter.params)
      }).then(res => {
        this.dataList = res.data
      })
      // 自己构造的假数据(￣▽￣)／
      /* this.dataList = [{
          name: '张三',
          age: 18,
          type: 1,
          phoneNum: '13627020000',
          rmk: ''
        }, {
          name: '李四',
          age: 17,
          type: 2,
          phoneNum: '13600000000',
          rmk: ''
        }
        ] */
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

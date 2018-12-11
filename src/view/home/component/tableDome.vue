<template>
  <div class="tableDomeContainer">
    <DTable
      :tableColumns = tableColumns
      @handleAdd = "handleAdd"
      @handleEdit = "handleEdit"
      @handleDelete = "handleDelete">
    </DTable>
  </div>
</template>

<script>
import DTable from '../../../components/table'
export default {
  name: 'tableDome',
  components: {
    DTable
  },
  data () {
    return {
      tableColumns: [{
        // 该列的标签名
        label: '栏目一',
        // 对应的数据key值
        key: 'label1'
      }, {
        label: '栏目二',
        key: 'label2',
        // 数据过滤的函数名
        filter: 'test'
      }, {
        label: '复制',
        key: 'copy',
        // copy类型列
        type: 'copy'
      }, {
        label: '操作',
        // btn类型列
        type: 'btn',
        // 使用options 存放按钮列表
        options: [{
          title: '新增',
          /*
          * 该按钮显示隐藏的判断函数
          * 不加这个函数默认为显示
          * @param row 这一行的数据
          * @returns Boolean
          * */
          showFun: (row) => {
            return !(row.label1 === '新增按钮被过滤了')
          },
          // 按钮的回调函数名
          calFun: 'handleAdd'
        }, {
          title: '修改',
          calFun: 'handleEdit'
        }, {
          title: '删除',
          calFun: 'handleDelete'
        }
        ]
      }
      ]
    }
  },

  mounted () {
    this.test()
  },

  methods: {
    test () {
      this.Api.get('user/findById?id=2').then(res => {

      })
    },
    /*
    * 新增按钮的回调函数
    * row 里面为整行的信息
    * */
    handleAdd (row) {
      this.$confirm(row, '新增按钮的回调')
    },
    // 修改按钮的回调函数 同上
    handleEdit (row) {
      this.$confirm(row, '修改按钮的回调')
    },
    // 删除按钮的回调函数 同上
    handleDelete (row) {
      this.$confirm(row, '删除按钮的回调')
    }
  }
}
</script>

<style lang="stylus" scoped>
  .tableDomeContainer{
    height 100%
    background-color #C0C0C0
    padding 50px
  }
</style>

<template>
  <div class="tableDomeContainer">
    <DTable
      :tableColumns = tableColumns
      :apiParameter = apiParameter
      @handleView = "handleView"
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
      // 传入table组件中的配置信息
      tableColumns: [
        {
        // 该列的标签名
          label: '姓名',
          // 对应的数据key值
          key: 'name'
        },
        {
          label: '年龄',
          key: 'age'
        },
        {
          label: '状态',
          key: 'type',
          // 数据过滤的函数名
          filter: 'tableType'
        },
        {
          label: '电话',
          key: 'phoneNumber',
          // copy类型列
          type: 'copy'
        },
        {
          label: '操作',
          // btn类型列
          type: 'btn',
          // 使用options 存放按钮列表
          options: [{
            title: '查看',
            /*
          * 该按钮显示隐藏的判断函数
          * 不加这个函数默认为显示
          * @param row 这一行的数据
          * @returns Boolean
          * */
            showFun: (row) => {
              return true
            },
            // 按钮的回调函数名
            calFun: 'handleView'
          }, {
            title: '修改',
            calFun: 'handleEdit'
          }, {
            title: '删除',
            calFun: 'handleDelete'
          }
          ]
        }
      ],
      // 传入table组件中的数据获取地址
      apiParameter: {
        url: 'component/table/select'
      }
    }
  },

  methods: {

    /*
    * 新增按钮的回调函数
    * row 里面为整行的信息
    * */
    handleView (row) {
      this.$confirm(row, '查看按钮的回调')
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

<template>
  <div class="tableContainer">
    <!-- 表格 主体部分 -->
    <div class="table">
      <el-table
        :data="dataList"
        height="100%"
        :header-cell-style="setRowHeaderStyle"
        @selection-change="selectionChange">
        <el-table-column v-if="tableSelectFlag" type="selection" width="30" />
        <el-table-column
          v-for="(item,index) in tableColumns"
          :key="index"
          :label="item.label"
          :sortable="item.sortable"
          :width="item.width">
          <template slot-scope="scope">
            <!-- 拷贝类型 -->
            <div v-if="item.type === 'copy'" >
              <!-- 抬头一片苍茫月，是我生生不死心 -->
              <el-tooltip effect="dark" :content="filters(item.filter,(scope.row[item.key]))" placement="top">
                <!-- 使用了clipboard，.copy用来识别是需要复制的DOM -->
                <el-button
                  :data-clipboard-text="filters(item.filter,(scope.row[item.key]))"
                  class="copy"
                  size="mini"
                  type="text">
                  点击复制
                </el-button>
              </el-tooltip>
            </div>
            <!-- 按钮类型 -->
            <div v-else-if="item.type === 'btn'">
              <span v-for="(op,index) in item.options" :key="index" >
                <!-- 不存在showFun则为显示，存在showFun则判断showFun(scope.row)的返回值是否为true -->
                <el-button v-if="!op.showFun || op.showFun(scope.row)"
                           class="tableTexBtn"
                           size="mini"
                           type="text"
                           @click="callback(scope.row,op.calFun)">
                  {{op.title}}
                </el-button>
                </span>
            </div>
            <!-- 普通类型 -->
            <div v-else>
              <!-- 不存在则不显示，否则会显示null或者undefined -->
              <TableTooltip v-if="scope.row[item.key]" :content="filters(item.filter,(scope.row[item.key]))" ></TableTooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- pagination 分页 底部部分 -->
    <div class="pagination">
        <span class="left">
          共<span class="font">{{ pagination.total }}</span>条记录，已选择<span class="font">{{ selectedList.length }}</span>项
        </span>
      <span class="right">
          <el-pagination
            :total="pagination.total"
            :current-page="pagination.currentPage"
            :page-sizes="[10, 15, 20]"
            :page-size="pagination.pageSize"
            layout="sizes, prev, pager, next, jumper"
            @current-change="pageCurrentChange"
            @size-change="pageSizeChange"/>
        </span>
    </div>
  </div>
</template>

<script>
import DTable from './table.js'
export default DTable
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .tableContainer{
    width 100%
    height 100%
    background-color white
    .table{
      height calc(100% - 64px)
      .tableTexBtn{
        padding-right 5px
      }
    }
    .pagination{
      height 64px
      padding 20px
      display flex
      justify-content space-between
      .left {
        height 24px;
        line-height 24px;
        .font{
          color #1790ff
          padding 0 5px
        }
      }
      .right{

      }
    }
  }
</style>

<style lang="stylus" rel="stylesheet/stylus" >
  .tableContainer{
    .table{
      .el-table
      .cell{
        white-space nowrap
      }
    }
    .pagination{
      .el-pagination,
      .el-pagination__sizes,
      .el-select,
      .el-input,
      .btn-prev,
      .el-pager,
      .btn-next,
      .el-pagination__jump,
      .el-input__inner{
        padding 0
        height 24px
      }
    }
    .el-button--mini{
      padding-top 5px
      padding-bottom 5px
    }
  }
</style>

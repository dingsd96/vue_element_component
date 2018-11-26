<template>
  <el-container class="indexContainer">
    <!-- 左边 -->
    <el-aside :width="collapseFlag ? '80px' : '256px'" class="leftMenuContainer">
      <div class="leftTitle">
        <img src="../../../static/images/doraemon1.png" height="32" width="32"/>
        <span v-if="!collapseFlag">这是系统名称</span>
      </div>
      <el-menu
        class="leftMenu"
        text-color="#909399"
        :collapse="collapseFlag"
        active-text-color="#ffffff">
        <el-submenu
          v-for="(menu,index) in menuData"
          :key="index"
          index="1">
          <template slot="title">
            <i :class="menu.icon"></i>
            <span slot="title" class="menuTitle">{{ menu.title }}</span>
          </template>
          <span v-if="menu.menuItem">
            <el-menu-item
              v-for="(item,index) in menu.menuItem"
              :key="index"
              index="1-1">
              {{ item.title }}
            </el-menu-item>
          </span>
        </el-submenu>
      </el-menu>
    </el-aside>
    <!-- 右边 -->
    <el-container>
      <el-header class="rightHeader">
        <i :class="collapseFlag ? 'iconfont icon-zhankai':'iconfont icon-shouqi'"
           :title="collapseFlag ? '展开' : '收起'"
           @click="collapseFlag = !collapseFlag"></i>
      </el-header>
      <el-main class="rightBody"></el-main>
    </el-container>
  </el-container>
</template>

<script>
import home from './home.js'
export default home
</script>

<style  lang="stylus" rel="stylesheet/stylus" scoped>
  .indexContainer{
    height 100vh
    .leftTitle{
      height 64px
      background-color #002240
      padding-left 20px
      display flex
      align-items center
      img{
        padding-right 10px
      }
    }
    .leftMenuContainer{
      border none
      background-color #001629
      color #fff
      .leftMenu{
        background-color #001629
        .menuTitle {
          font-size 14px
          color #fff
          font-family PingFangSC-Medium
        }
      }
    }
    .rightHeader{
      height 64px
      line-height 64px
      i{
        font-size 28px
        cursor pointer
      }
    }
    .rightBody{
      background-color #f5f5f5
    }
  }
</style>

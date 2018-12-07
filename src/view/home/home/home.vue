<template>
  <el-container class="homeContainer">
    <!-- 左边 menu导航菜单组件 -->
    <el-aside :width="collapseFlag ? '80px' : '256px'" class="leftMenuContainer">
      <!-- 使用 route-link 标签会有样式问题 -->
      <!-- <router-link to="/home"></router-link> -->
      <div class="leftTitle" @click="handleLogoClick">
        <img src="@static/images/logo.png" height="32" width="32"/>
        <span v-if="!collapseFlag">this is title</span>
      </div>
      <el-menu
        class="leftMenu"
        text-color="#909399"
        :collapse="collapseFlag"
        :router="true"
        active-text-color="#ffffff"
        :default-openeds="defaultOpen">
        <el-submenu
          v-for="(menu,index) in menuData"
          :key="index"
          :index="menu.name">
          <template slot="title">
            <i :class="menu.icon"></i>
            <span slot="title" class="menuTitle">{{ menu.title }}</span>
          </template>
          <span v-if="menu.menuItem">
            <el-menu-item
              v-for="(item,index) in menu.menuItem"
              :key="index"
              :index="item.route">
              {{ item.title }}
            </el-menu-item>
          </span>
        </el-submenu>
      </el-menu>
    </el-aside>

    <!-- 右边 -->
    <el-container>
      <!-- 右边顶栏 -->
      <el-header class="rightHeader">
        <i :class="collapseFlag ? 'iconfont icon-zhankai':'iconfont icon-shouqi'"
           :title="collapseFlag ? '展开' : '收起'"
           @click="collapseFlag = !collapseFlag"></i>
      </el-header>

      <!-- 右边body 主体部分 -->
      <el-main class="rightBody">
        <!--  keep-alive  用来保存route-view中的数据，切换的时候数据依然保存着 -->
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import home from './home.js'
export default home
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.homeContainer{
  height 100vh
  /* 左边 */
  .leftTitle{
    height 64px
    background-color #002240
    padding-left 20px
    display flex
    align-items center
    cursor pointer
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

  /* 右边 */
  .rightHeader{
    height 64px
    line-height 64px
    i{
      font-size 28px
      cursor pointer
    }
  }
  .rightBody{
    height 100%
    background-color #f5f5f5
  }
}
</style>

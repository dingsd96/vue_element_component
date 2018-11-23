<template>
  <el-container class="indexContainer">
    <!-- 左边 -->
    <el-aside width="256px" class="leftMenuContainer">
      <el-menu
        class="leftMenu"
        text-color="#fff"
        active-text-color="#ffffff">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">导航一</span>
          </template>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
            <el-menu-item index="1-3">选项3</el-menu-item>
            <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>
        <el-menu-item index="2">
          <i class="el-icon-menu"></i>
          <span slot="title">导航二</span>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="el-icon-document"></i>
          <span slot="title">导航三</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-setting"></i>
          <span slot="title">导航四</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <!-- 右边 -->
    <el-container>
      <el-header>Header</el-header>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default{
  name: 'App'
}
</script>

<style  lang="stylus" rel="stylesheet/stylus" scoped>
  .indexContainer{
    height 100vh
    .leftMenuContainer{
      border none
      background-color #001629
      color #fff
    }
    .leftMenu{
      background-color #001629
    }
  }
</style>

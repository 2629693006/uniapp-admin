<template>
  <el-container>
    <!-- aside侧边栏 -->
    <el-aside width="255px">
      <!-- top -->
      <aside-top-block></aside-top-block>
      <!-- 导航栏 -->
      <aside-menu-block></aside-menu-block>
    </el-aside>
    <el-container>
      <!-- header顶部 -->
      <el-header>
        <header-block></header-block>
      </el-header>
      <!-- 内容区 -->
      <el-main>
        <router-view></router-view>
      </el-main>
      <!-- 版权 -->
      <el-footer>购物商场后台管理系统</el-footer>
    </el-container>
  </el-container>
</template>
<script>
import Header from '@/components/header/header'
import Aside_top from '@/components/aside/aside_top'
import Menu from '@/components/aside/menu'
export default {
  components: {
    'header-block': Header,
    'aside-top-block': Aside_top,
    'aside-menu-block': Menu,
  },
  name: 'Index',
  data() {
    return {}
  },
}
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;

  .el-header {
    background-color: #f8f8f8;
  }
  .el-main {
    background-color: #f0f0f1;
  }
  .el-aside {
    background-color: #5c7d9b;
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
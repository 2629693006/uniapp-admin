<template>
  <div class="menu">
    <el-menu
      :default-active="menuActive + ''"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#99CCFF"
      :unique-opened="true"
    >
      <el-submenu
        :index="item.id + ''"
        v-for="(item, index) in menu"
        :key="index"
      >
        <template slot="title">
          <i :class="Icon[item.id]"></i>
          <span>{{ item.name }}</span>
        </template>
        <el-menu-item
          :index="items.id + ''"
          v-for="(items, i) in item.children"
          :key="i"
          @click="navTo(items.id, items.path)"
        >
          <i class="el-icon-menu"></i>
          <span>{{ items.name }}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      // 导航栏数据
      menu: [
        {
          id: 1,
          name: '用户管理',
          children: [
            {
              path: '/user',
              id: 2,
              name: '用户列表',
            },
          ],
        },
        {
          id: 3,
          name: '商品管理',
          children: [
            {
              path: '/goods',
              id: 4,
              name: '商品列表',
            },
            {
              path: '/goods_add',
              id: 5,
              name: '添加商品',
            },
          ],
        },
        {
          id: 6,
          name: '订单管理',
          children: [
            {
              path: '/order',
              id: 7,
              name: '订单列表',
            },
          ],
        },{
          id: 8,
          name: '分类管理',
          children: [
            {
              path: '/cate',
              id: 9,
              name: '分类列表',
            },
          ],
        },
        {
          id: 10,
          name: '轮播图管理',
          children: [
            {
              path: '/swi',
              id: 11,
              name: '配置轮播图',
            },
          ],
        },
      ],
      //   图片
      Icon: {
        1: 'el-icon-user-solid',
        3: 'el-icon-s-goods',
        6: 'el-icon-s-order',
        8: 'el-icon-s-grid',
        10: 'el-icon-picture',
      },
      //   激活状态
      menuActive: 0,
    }
  },
  created() {
    this.menuActive = this.Storage.session.get('menuActive')
  },
  computed: {
  },
  methods: {
    navTo(i, path) {
      this.menuActive = i
      this.Storage.session.set('menuActive', i)
      this.$router.push(path)
    },
  },
}
</script>
<style lang="less" scoped>
.el-menu {
  border: 0;
}
</style>
<template>
  <el-breadcrumb separator="/" class="crumbs">
    <el-breadcrumb-item v-for="(item, index) in bread" :key="index">{{
      item
    }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script>
export default {
  props: {
    bread: {
      type: Array,
    },
  },
  data() {
    return {}
  },
  created(){
  }
}
</script>
<style lang="less" scoped>
.crumbs {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ccc;
}
</style>
<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pageQuery.pagenum"
    :page-sizes="[2,3,10, 15]"
    :page-size="pageQuery.pagesize"
    :total="goodsTotal"
    layout="total, sizes, prev, pager, next, jumper"
    class="pagiation"
  >
  </el-pagination>
</template>
<script>
export default {
  props: {
    pageQuery: {
      type: Object,
    },
    goodsTotal: {
      type: Number,
    },
  },
  data() {
    return {}
  },
  methods: {
    handleSizeChange(size) {
        this.$emit('SizClick',size)
    },
    handleCurrentChange(num) {
      this.$emit('NumClick', num)
    },
  },
}
</script>
<style lang="less" scoped>
.pagiation {
  margin-top: 15px;
}
</style>
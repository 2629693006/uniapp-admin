<template>
  <div class="header">
    <div class="header-l">
      <h2>购物商场后台管理系统</h2>
    </div>
    <div class="header-r">
      <div class="user">
        <span><i class="el-icon-user-solid"></i> 个人信息</span>
      </div>
      <div class="back" @click="Back">退出</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  created() {},
  methods: {
    //   退出登录
    Back() {
      this.$http.delete(this.API.BASE_API_BACK).then((res) => {
        if (res.data.status !== 200) {
          return this.$message.error('退出失败')
        }
        this.$message.success(res.data.msg)
        this.$router.push('/')
        this.Storage.session.clear()
      })
    },
  },
}
</script>
<style lang="less" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  color: #555;
  .header-r {
    display: flex;
    font-size: 14px;
    > div {
      padding: 10px;
      cursor: pointer;
    }
    .user {
      margin-right: 35px;
    }
    > div:hover {
      color: cornflowerblue;
    }
  }
}
</style>
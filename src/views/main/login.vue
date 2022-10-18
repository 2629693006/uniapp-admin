<template>
  <!-- 登录页 -->
  <div class="logo">
    <div class="logo-body">
      <div class="logo-tit">管理员登录</div>
      <!-- 表单 -->
      <el-form :model="query" ref="LoginRef" :rules="LoginRules">
        <!-- 账号 -->
        <el-form-item prop="username">
          <el-input
            type="text"
            v-model.trim="query.username"
            prefix-icon="el-icon-user-solid"
            placeholder="账号"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="">
          <el-input
            type="password"
            v-model.trim="query.password"
            prefix-icon="el-icon-lock"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <!-- button按钮 -->
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="Login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data() {
    return {
      // 参数
      query: {
        username: '黑子',
        password: '15278548406',
      },
      // 参数验证
      LoginRules: {
        username: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入账号',
          },
          {
            min: 2,
            max: 24,
            message: '字符长度在2~24个字符之间',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入密码',
          },
          {
            min: 6,
            max: 26,
            message: '字符长度在6~26个字符之间',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
  },
  methods: {
    // 提交登录数据
    Login() {
        console.log(this.query);
      this.$refs.LoginRef.validate((valid) => {
        if (!valid) {
          return this.$message.error('请输入完整登录信息')
        }
        this.$http.post(this.API.BASE_API_LOGIN, this.query).then((res) => {
          if (res.data.status !== 200) {
            return this.$message.error(res.data.msg)
          }
          // token 
          this.Storage.session.set('token',res.data.token)
          this.Storage.session.set('user',res.data.data)
          this.$router.push('/index')
          this.$message.success('登录成功')
        })
      })
    },
  },
}
</script>
<style lang="less" scoped>
.logo {
  width: 100%;
  height: 100%;
  background-color: rgba(248, 248, 248, 0.8);

  .logo-body {
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -35%);
    width: 350px;
    padding: 20px;
    border-radius: 10px;

    .logo-tit {
      padding: 15px 0;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      color: #555;
    }

    .btn-login {
      width: 100%;
    }
  }
}
</style>
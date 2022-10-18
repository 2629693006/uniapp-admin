<template>
  <div>
    <el-dialog
      width="30%"
      :title="text"
      :visible.sync="state"
      :show-close="false"
      :before-close="Clear"
    >
      <el-form :model="data" ref="UserRef" :rules="UserRules">
        <el-form-item label="账号" prop="username" label-width="70px">
          <el-input v-model.trim="data.username"></el-input>
        </el-form-item>
        <el-form-item
          v-if="type == 'add'"
          label="密码"
          prop="password"
          label-width="70px"
        >
          <el-input type="password" v-model.trim="data.password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSate">取 消</el-button>
        <el-button type="primary" @click="DialogEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    state: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
    },
    data: {
      type: Object,
    },
  },
  data() {
    return {
      // 数据验证
      UserRules: {
        username: [
          {
            required: true,
            message: '请输入账号',
            trigger: 'blur',
          },
          {
            min: 2,
            max: 24,
            message: '账号字符串长度在2~24个之间',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
          },
          {
            min: 6,
            max: 26,
            message: '账号字符串长度在6~26个之间',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {},
  computed: {
    text() {
      return this.type == 'add' ? '添加用户' : '编辑用户信息'
    },
  },
  methods: {
    DialogEdit() {
      if (this.type == 'add') {
        this.addUser()
      } else if (this.type == 'edit') {
        this.ediUser()
      }
    },
    // 添加用户
    addUser() {
      this.$refs.UserRef.validate((valid) => {
        if (!valid) return this.$message.error('请输入账号信息')
        var query = {
          username: this.data.username,
          password: this.data.password,
          userId:this.Storage.session.get('user').id
        }
        this.$http.post(this.API.BASE_API_ADD_USER, query).then((res) => {
          if (res.data.status !== 201) {
            return this.$message.error(res.data.msg)
          }
          this.$message.success(res.data.msg)
          this.editSate()
        })
      })
    },
    // 修改用户信息
    ediUser() {
      this.$http
        .put(this.API.BASE_API_USER_EDIT, {
          username: this.data.username,
          id: this.data.id,
          userId:this.Storage.session.get('user').id
        })
        .then((res) => {
          if (res.data.status !== 200) {
            return this.$message.error(res.data.msg)
          }
          this.$message.success(res.data.msg)
          this.editSate()
        })
    },

    // 通过自定义事件让父组件修改子组件中的数据
    editSate() {
      this.$emit('editState', false)
    },
    // 对话框关闭回调
    Clear() {
      this.editSate()
      this.$refs.UserRef.resetFields()
    },
  },
}
</script>
<style lang="less" scoped>
</style>
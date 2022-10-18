<template>
  <div class="user-list">
    <el-card>
      <!-- 面包屑 -->
      <bread-block :bread="bread"></bread-block>
      <!-- 搜索添加区域 -->
      <el-row class="Row" :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入账号"
            v-model="search"
            class="input-with-select"
            clearable
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="16">
          <el-button style="float: right" type="primary" @click="add('add')"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="tableData" border stripe>
        <el-table-column
          type="index"
          label="序号"
          width="100"
        ></el-table-column>
        <el-table-column prop="username" label="账号"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.state == 1">启用中</el-tag>
            <el-tag type="danger" v-else>禁用中</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="钱包（￥）">
          <template slot-scope="scope">
            <span>￥{{ scope.row.account.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="日期"
          width="250"
        ></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="edit(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="Remove(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagiation-block
        :pageQuery="query"
        :goodsTotal="Total"
        @NumClick="pageNumClick"
        @SizClick="PageSizeClick"
      ></pagiation-block>
    </el-card>
    <!-- 对话框 -->
    <dialog-block
      :state="DialogState"
      :type="type"
      :data="UserInfo"
      @editState="DialogActiveState"
    ></dialog-block>
  </div>
</template>
<script>
import Dialog from '@/components/dialog/dialog'
export default {
  components: {
    'dialog-block': Dialog,
  },
  name: 'User',
  data() {
    return {
      // 面包屑
      bread: ['主页', '用户管理', '用户列表'],
      // 请求参数
      query: {
        pagesize: 10,
        pagenum: 1,
      },
      // 用户数据
      tableData: [],
      // 用户数据总数
      Total: 0,

      // 对话框状态
      DialogState: false,
      // 用户信息
      UserInfo: {},
      // 控制
      type: null,
      // 搜索数据
      search: null,
    }
  },
  created() {
    this.getUser()
  },
  computed: {},
  methods: {
    // 用户数据
    getUser() {
      this.$http
        .get(this.API.BASE_API_USER_LIST, { params: this.query })
        .then((res) => {
          if (res.data.status !== 200) {
            return this.$message.error('获取数据失败')
          }
          this.tableData = res.data.data
          this.Total = res.data.total
        })
    },
    // 页数量
    PageSizeClick(size) {
      this.query.pagesize = size
      this.getUser()
    },
    // 页码
    pageNumClick(num) {
      this.query.pagenum = num
      this.getUser()
    },
    // 删除用户
    Remove(id) {
      this.$confirm('您确定要永久删除该用户吗?', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          this.$http
            .delete(this.API.BASE_API_USER_DEL + '?id=' + id)
            .then((res) => {
              if (res.data.status !== 200) {
                return this.$message.error(res.data.msg)
              }
              this.$message.success(res.data.msg)
              this.getUser()
            })
        })
        .catch(() => {
          return this.$message.info('删除取消')
        })
    },
    // 修改用户
    edit(id) {
      this.DialogState = true
      this.type = 'edit'
      this.UserInfo = {}
      var edit = this.tableData.find((item) => {
        return item.id == id
      })
      this.UserInfo = { ...edit }
    },
    // 添加用户
    add(str) {
      this.UserInfo = {
        username: null,
        password: null,
      }
      this.type = str
      this.DialogState = true
    },
    // 控制对话框状态
    DialogActiveState(val) {
      this.DialogState = false
      this.getUser()
    },
  },
}
</script>
<style lang="less" scoped>
.page {
  margin-top: 15px;
}
.Row {
  margin-bottom: 15px;
}
</style>
<template>
  <div class="order">
    <el-card>
      <!-- 面包屑 -->
      <bread-block :bread="bread"></bread-block>
      <!-- 搜索 -->
      <div class="seach">
        <el-input
          placeholder="请输入订单编号"
          v-model.trim="OrderSearch"
          class="input-with-select"
          clearable
          @clear="Clear"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="OrderSearchBtn"
          ></el-button>
        </el-input>
      </div>
      <!-- 表格 -->
      <el-table :data="OrderData" border stripe>
        <el-table-column
          type="index"
          label="序号"
          width="100"
        ></el-table-column>
        <el-table-column label="订单编号" prop="order_num"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay_state == 1" type="success"
              >已付款</el-tag
            >
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_not_shipped_state == 1" type="success"
              >已发货</el-tag
            >
            <el-tag v-else type="danger">未发货</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否签收">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_received_state == 1" type="success"
              >已签收</el-tag
            >
            <el-tag v-else type="danger">未签收</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="总价￥">
          <template slot-scope="scope">
            <span v-if="scope.row.price"
              >￥{{ scope.row.price.toFixed(2) }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="日期" prop="create_time"></el-table-column>
        <el-table-column label="操作" width="350">
          <template slot-scope="scope">
            <el-button
              type="success"
              icon="el-icon-view"
              size="mini"
              @click="ViewOrder(scope.row.order_num)"
              >查看</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-setting"
              size="mini"
              @click="setUp(scope.row)"
              >设置</el-button
            >
            <!-- <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            > -->
            <el-button
              @click="orderRemove(scope.row.order_num)"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagiation-block
        :pageQuery="pageQuery"
        :goodsTotal="GoodsTotal"
        @NumClick="pageNumClick"
        @SizClick="PageSizeClick"
      ></pagiation-block>
    </el-card>
    <!-- 对话框 -->
    <el-dialog
      title="设置项"
      :visible.sync="dialogSetUpState"
      width="300px"
      :show-close="false"
      :before-close="handleClose"
    >
      <div class="group-btn">
        <el-button type="success" @click="deliver">已发货</el-button>
        <el-button type="danger">拒收</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Order',
  data() {
    return {
      // 面包屑数据
      bread: ['主页', '订单管理', '订单列表'],
      // 订单数据
      OrderData: [],
      // 请求参数
      pageQuery: {
        pagesize: 10,
        pagenum: 1,
        userId: null,
      },
      // 订单总数
      GoodsTotal: 0,
      // 搜索内容
      OrderSearch: '',
      // 控制设置按钮显示对话框
      dialogSetUpState: false,
      // 获取设置按钮项的订单编号
      setNum: null,
      // 控制是否是搜索数据还是默认获取的数据状态
      // SetBool为true的话说明当前数据是搜索数据不是默认数据
      SetBool: false,
      // 控制发货按钮
      paymentBool: 0,
    }
  },
  created() {
    this.getOrder()
  },
  methods: {
    // 获取订单
    getOrder() {
      this.pageQuery.userId = this.Storage.session.get('user').id
      this.$http
        .get(this.API.BASE_API_ORDER_LIST, { params: this.pageQuery })
        .then((res) => {
          if (res.data.status !== 200) return this.$message.error(res.data.msg)
          this.GoodsTotal = res.data.data.total
          this.OrderData = res.data.data.rows_data
        })
    },
    // 页码
    pageNumClick(num) {
      this.pageQuery.pagenum = num
      // SetBool为true的话说明当前数据是搜索数据不是默认数据
      if (this.SetBool) {
        this.OrderSearchBtn()
      } else {
        this.getOrder()
      }
    },
    // 分页数量
    PageSizeClick(size) {
      this.pageQuery.pagesize = size
      // SetBool为true的话说明当前数据是搜索数据不是默认数据
      if (this.SetBool) {
        this.OrderSearchBtn()
      } else {
        this.getOrder()
      }
    },
    // 订单搜索
    OrderSearchBtn() {
      if (this.OrderSearch.length == 0)
        return this.$message.error('请输入搜索内容')
      this.pageQuery.order_num = this.OrderSearch
      this.$http
        .get(this.API.BASE_API_ORDER_SEARCH, {
          params: this.pageQuery,
        })
        .then((res) => {
          this.SetBool = true
          if (res.data.status !== 200) return this.$message.error(res.data.msg)
          this.OrderData = res.data.data.rows_data
          this.GoodsTotal = res.data.data.total
        })
    },
    // 清空输入框
    Clear() {
      this.OrderSearch = ''
      // 输入框内容清空之后立马把控制搜索的状态重置为false,然后重新条用默认数据
      this.SetBool = false
      this.getOrder()
    },
    // 订单删除
    orderRemove(num) {
      this.$confirm('您确定要删除该订单吗？', { type: 'warning' })
        .then((res) => {
          if (!num) return this.$message.error('删除失败')
          this.$http
            .delete(this.API.BASE_API_ORDER_DEL, {
              data: {
                userId: this.Storage.session.get('user').id,
                order_num: num,
              },
            })
            .then((res) => {
              if (res.data.status !== 200)
                return this.$message.error(res.data.msg)
              this.$message.success(res.data.msg)
              this.getOrder()
            })
        })
        .catch((err) => {
          this.$message.info('删除取消')
        })
    },
    // 订单查看
    ViewOrder(num) {
      if (!num) return this, $message.error('查看失败')
      this.$router.push({
        path: '/order/info?num=' + num,
      })
    },
    // 设置按钮
    setUp(row) {
      // 获取当前项的订单编号
      this.setNum = row.order_num
      // 判断当前项订单的支付和是否发货状态
      if (row.order_pay_state == 0 && row.order_not_shipped_state == 0) {
        this.paymentBool = true
      } else {
        this.paymentBool = false
      }
      // 开启对话框
      this.dialogSetUpState = true
    },
    // 点击对话框的遮挡层关闭对话框
    handleClose() {
      this.dialogSetUpState = false
    },
    // 配置对话框选项
    deliver() {
      // 根据点击设置按钮获取的数据判断当前订单是否是已支付状态然后提示信息
      if (this.paymentBool) {
        this.$confirm('当前订单还未付款，您确定要发货吗?', { type: 'warning' })
          .then((res) => {
            this.deliverBtn()
          })
          .catch((err) => {
            this.$message.info('取消成功')
            this.dialogSetUpState = false
          })
      } else {
        this.deliverBtn()
      }
    },
    // 发货请求
    deliverBtn() {
      this.$http
        .put(this.API.BASE_API_ORDER_DELIVER, {
          userId: this.Storage.session.get('user').id,
          order_num: this.setNum,
        })
        .then((res) => {
          if (res.data.status !== 201) return this.$message.error(res.data.msg)
          this.$message.success(res.data.msg)
          if (this.SetBool) {
            this.OrderSearchBtn()
          } else {
            this.getOrder()
          }
          this.dialogSetUpState = false
        })
    },
  },
  mounted() {},
}
</script>
<style lang="less" scoped>
.seach {
  max-width: 350px;
  margin-bottom: 15px;
}
</style>
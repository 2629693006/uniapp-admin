<template>
  <el-card class="order-info" v-if="orderInfo">
    <bread-block :bread="bread"></bread-block>
    <div class="tit">订单信息</div>
    <div
      class="order-info-body"
      v-if="orderInfo.rows_order && orderInfo.address"
    >
      <p>订单编号：{{ orderInfo.rows_order.order_num }}</p>
      <p>
        订单状态：{{
          orderInfo.rows_order.order_pay_state == 1 ? '已付款' : '未付款'
        }}
      </p>
      <p>订单联系人：{{ orderInfo.address.username }}</p>
      <p>
        订单联系地址：<span
          v-for="(item, index) in orderInfo.address.rece_address"
          :key="index"
          >{{ item }}</span
        >
        <span>{{ orderInfo.address.details_address }}</span>
      </p>
    </div>
    <div class="tit" style="margin-top: 15px">订单商品</div>
    <div class="order-goods-list" v-if="orderInfo.children">
      <div class="list-item" v-for="item in orderInfo.children" :key="item.id">
        <img
          :src="API.BASE_API_DEFAULT + item.goods_small_img"
          alt=""
          width="100"
          height="100"
        />
        <div class="content">
          <div class="goods-name">{{ item.goods_name }}</div>
          <div class="goods-type">{{ item.goods_type }}</div>
        </div>
        <div class="price-count">
          <div class="goods-price">￥{{ item.goods_discount_price.toFixed(2) }}</div>
          <div class="goods-quantity">×{{ item.quantity }}</div>
        </div>
      </div>
    </div>
    <div class="order-price" v-if="orderInfo.rows_order">
      <div>
        合计：<span>￥{{ orderInfo.rows_order.price.toFixed(2) }}</span>
      </div>
    </div>
  </el-card>
</template>
<script>
export default {
  name: 'OrderInfo',
  data() {
    return {
      // 面包屑
      bread: ['主页', '订单管理', '订单详情'],
      orderInfo: [],
    }
  },
  created() {
    this.getOrderInfo()
  },
  methods: {
    // 获取订单数据
    getOrderInfo() {
      var query = {
        userId: this.Storage.session.get('user').id,
        order_num: this.$route.query.num,
      }
      this.$http
        .get(this.API.BASE_API_ORDER_KEY_INFO, { params: query })
        .then((res) => {
          if (res.data.status !== 200) return this.$message.error(res.data.msg)
          this.orderInfo = res.data.data
        })
    },
  },
}
</script>
<style lang="less" scoped>
.tit {
  padding: 5px 0;
  font-size: 18px;
  font-weight: 600;
}
.order-info-body {
    font-size: 14px;
  p {
    margin: 5px 0;
  }
}
.order-goods-list {
  .list-item {
    display: flex;
    justify-content: space-between;
    padding: 15px 0;
    border-bottom: 1px solid #eee;
    img {
      border-radius: 5px;
      overflow: hidden;
    }
    .content {
      flex: 1;
      margin-left: 10px;
      color: rgb(90, 90, 90);
      .goods-type{
          margin-top: 10px;
          padding: 5px;
          background-color: #eee;
      }
    }
    .price-count {
      width: 100px;
      text-align: right;
      .goods-price {
        color: #ff0000;
        font-weight: 600;
      }
    }
  }
}
.order-price {
  display: flex;
  justify-content: flex-end;
  padding: 10px 0;
  span {
    color: #ff0000;
    font-weight: 600;
  }
}
</style>
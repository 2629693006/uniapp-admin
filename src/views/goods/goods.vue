<template>
  <div class="goods">
    <el-card>
      <!-- 面包屑 -->
      <bread-block :bread="bread"></bread-block>
      <!-- 搜索 -->
      <div class="seach">
        <el-input
          placeholder="请输入内容"
          v-model="GoodsSearch"
          class="input-with-select"
          clearable
          @clear="Clear"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="GoodsSearchBtn"
          ></el-button>
        </el-input>
      </div>
      <!-- 表格 -->
      <el-table :data="GoodsData" :border="true" stripe>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="商品名称" width="350">
          <template slot-scope="scope">
            <div class="goods-name-body">
              <img
                :src="API.BASE_API_DEFAULT + scope.row.goods_small_img"
                width="80"
                height="80"
                style="border-radius:5px"
              />
              <span class="goods-name" :title="scope.row.goods_name">{{
                scope.row.goods_name
              }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品关键字" width="">
          <template slot-scope="scope">
            <el-tag v-for="item in scope.row.goods_keyword" :key="item.id">{{
              item
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="商品分类"
          width="85"
          prop="goods_cate_name"
        ></el-table-column>
        <el-table-column label="商品原价(￥)" width="130">
          <template slot-scope="scope">
            <span>￥{{ scope.row.goods_price.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.goods_state == 1" type="success"
              >售卖中</el-tag
            >
            <el-tag v-else type="danger">已下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="上架日期" width="180" prop="create_time">
        </el-table-column>
        <el-table-column
          label="商品库存"
          prop="goods_number"
          width="85"
        ></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="GoodsEdit(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="GoodsRemove(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-download"
              @click="lower(scope.row)"
              >{{ scope.row.goods_state == 1 ? '下架' : '上架' }}</el-button
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
  </div>
</template>
<script>
export default {
  name: 'Goods',
  data() {
    return {
      // 面包屑
      bread: ['主页', '商品管理', '商品列表'],
      // 搜索
      GoodsSearch: '',
      // 商品数据
      GoodsData: [],
      // 分页数据
      pageQuery: {
        pagesize: 10,
        pagenum: 1,
      },
      // 商品总数
      GoodsTotal: 0,
      //   搜索状态
      SearchType: false,
    }
  },
  created() {
    this.getGoods()
  },
  methods: {
    // 获取商品数据
    getGoods() {
      this.$http
        .get(this.API.BASE_API_GOODS_LIST, { params: this.pageQuery })
        .then((res) => {
          if (res.data.status !== 200) return this.$message.error(res.data.msg)
          res.data.data.forEach((item) => {
            item.goods_keyword = item.goods_keyword.split('-')
          })
          this.GoodsData = res.data.data
          this.GoodsTotal = res.data.total
        })
    },

    // 搜索商品
    GoodsSearchBtn() {
      this.SearchType = true
      this.$http
        .post(this.API.BASE_API_GOODS_SEARCH, {
          text: this.GoodsSearch,
          ...this.pageQuery,
        })
        .then((res) => {
          if (res.data.status !== 200) return this.$message.error(res.data.msg)
          res.data.data.forEach((item) => {
            item.goods_keyword = item.goods_keyword.split('-')
          })
          this.GoodsData = res.data.data
          this.GoodsTotal = res.data.total
        })
    },

    // 清空搜索框
    Clear() {
      this.GoodsSearch = ''
      this.getGoods()
    },

    // 编辑商品
    GoodsEdit(id) {
      this.$router.push('/goods_edit?id=' + id)
    },

    // 删除商品
    GoodsRemove(id) {
      this.$confirm('您确定要删除该商品吗?', { type: 'warning' })
        .then(() => {
          this.$http
            .delete(this.API.BASE_API_GOODS_DEL + '?id=' + id)
            .then((res) => {
              if (res.data.status !== 200)
                return this.$message.error(res.data.msg)
              this.$message.success(res.data.msg)
              this.getGoods()
            })
        })
        .catch(() => {
          this.$message.info('删除取消!')
        })
    },

    // 商品下架
    lower(row) {
      var params = {
        goods_state: row.goods_state,
        id: row.id,
      }
      this.$http.post(this.API.BASE_API_GOODS_LOWER, params).then((res) => {
        if (res.data.status !== 200) return this.$message.error(res.data.msg)
        this.$message.success(res.data.msg)
        this.getGoods()
      })
    },

    // 分页
    pageNumClick(val) {
      this.pageQuery.pagenum = val
      if (this.SearchType) {
        this.GoodsSearchBtn()
      } else {
        this.getGoods()
      }
    },

    // 控制每页显示数量
    PageSizeClick(val) {
      this.pageQuery.pagesize = val
      if (this.SearchType) {
        this.GoodsSearchBtn()
      } else {
        this.getGoods()
      }
    },
  },
}
</script>
<style lang="less" scoped>
.seach {
  max-width: 350px;
  margin-bottom: 15px;
}
.goods-name-body {
  display: flex;
  align-items: center;
  .goods-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  img {
    width: 80px;
    height: 80px;
    margin-right: 10px;
  }
  span {
    flex: 1;
  }
}
.el-tag {
  margin:0 8px 8px 0;
}
</style>
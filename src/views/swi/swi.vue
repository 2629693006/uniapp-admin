<template>
  <div class="swi">
    <el-card>
      <bread-block :bread="bread"></bread-block>
      <div class="swi-header">
        <el-button type="primary" @click="uploadBtn">添加焦点图</el-button>
      </div>
      <el-table :data="swiData" border>
        <el-table-column
          width="100"
          label="序号"
          type="index"
        ></el-table-column>
        <el-table-column label="图片" width="200">
          <template slot-scope="scope">
            <img
              :src="API.BASE_API_DEFAULT + scope.row.swi_img"
              alt=""
              width="90"
              height="80"
            />
          </template>
        </el-table-column>
        <el-table-column label="图片地址">
          <template slot-scope="scope">
            <a
              :href="API.BASE_API_DEFAULT + scope.row.swi_img"
              target="_blank"
              >{{ API.BASE_API_DEFAULT + scope.row.swi_img }}</a
            >
          </template>
        </el-table-column>
        <el-table-column
          label="关联商品标题"
          prop="goods_name"
        ></el-table-column>
        <el-table-column label="排序" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="success" plain @click="move(scope.row)"
              >上移</el-button
            >
            <el-button size="mini" type="success" plain>下移</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="RelationGoods(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="removeSwi(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 对话框 -->
    <el-dialog
      :title="isBool"
      :visible.sync="dialogSwi"
      width="50%"
      :before-close="handleClose"
      :show-close="false"
    >
      <div class="upload">
        <el-button type="primary" @click="uploadSwiBtn">上传焦点图</el-button>
        <img
          :src="API.BASE_API_DEFAULT + query.swi_img"
          alt=""
          class="swi-img"
        />
      </div>
      <el-select
        v-model="query.goods_id"
        class="relation"
        placeholder="请选择关联的商品"
      >
        <el-option
          :label="item.goods_name"
          :value="item.id"
          v-for="item in goodsData"
          :key="item.id"
          class="option"
        ></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogSwi = false">取 消</el-button>
        <el-button type="primary" @click="handSwi">确 定</el-button>
      </span>
    </el-dialog>
    <input type="file" ref="editShow" hidden @change="uploadSwi($event)" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 面包屑
      bread: ['主页', '轮播图管理', '配置轮播图'],
      // 焦点图数据
      swiData: [],
      // 商品信息
      goodsData: [],
      // 控制管理商品对话框
      dialogSwi: false,
      // 控制对话框是否是添加或者关联商品
      SwiBool: false,
      // 商品关联的商品数据
      RelationData: null,
      // 编辑焦点图数据
      EditSwiData: {},
      // 请求数据
      query: {
        goods_name: null,
        goods_id: null,
        SwiId: null,
        swi_img: null,
      },
    }
  },
  created() {
    this.getSwi()
  },
  computed: {
    isBool() {
      return this.SwiBool ? '添加焦点图' : '编辑焦点图'
    },
  },
  methods: {
    //   获取焦点图数据
    getSwi() {
      this.$http.get(this.API.BASE_API_SWI_LIST).then((res) => {
        if (res.data.status !== 200) return this.$message.error(res.data.msg)
        this.swiData = res.data.data
      })
    },
    // 获取需要进行关联的商品数据
    getGoods() {
      this.$http.get(this.API.BASE_API_RELATION_GOODS_LIST).then((res) => {
        if (res.data.status !== 200) return this.$message(res.data.msg)
        this.goodsData = res.data.data
      })
    },
    
    // 添加焦点图按钮
    uploadBtn() {
      if (this.swiData.length >= 5)
        return this.$message.warning('焦点图最多只能上传五张!')
      this.dialogSwi = true
      this.SwiBool = true
      this.getGoods()
    },

    // 编辑
    RelationGoods(id) {
      this.getGoods()
      this.dialogSwi = true
      this.swiInfo(id)
    },

    // 获取编辑焦点图数据
    swiInfo(id) {
      this.$http
        .get(this.API.BASE_API_SWI_INFO, { params: { id } })
        .then((res) => {
          if (res.data.status != 200) return this.$message.error(res.data.msg)
          this.query = res.data.data
          this.query.SwiId=id
        })
    },

    // 对话框遮挡层
    handleClose() {
      this.dialogSwi = false
      this.SwiBool = false
      this.query = {
        goods_name: null,
        goods_id: null,
        SwiId: null,
        swi_img: null,
      }
    },

    // 编辑或添加
    handSwi() {
      if (!this.query.swi_img && this.SwiBool) {
        return this.$message.error('请先上传焦点图!')
      } else if (!this.query.goods_id)
        return this.$message.error('请选择关联的商品!')
      var goods = this.goodsData.find((item) => item.id == this.query.goods_id)
      this.query.goods_name = goods.goods_name
      // 控制是否是编辑模式
      if (this.query.SwiId) {
        this.editSwi()
      } else {
        this.addSwi()
      }
    },

    // 添加焦点图
    addSwi() {
      this.$http.post(this.API.BASE_API_SWI_ADD, this.query).then((res) => {
        if (res.data.status !== 201) return this.$message.error(res.data.msg)
        this.$message.success(res.data.msg)
        this.getSwi()
        this.dialogSwi = false
      })
    },

    // 编辑焦点图信息
    editSwi() {
      this.$http.put(this.API.BASE_API_SWI_EDIT, this.query).then((res) => {
        if (res.data.status !== 200) return this.$message.error(res.data.msg)
        this.$message.success(res.data.msg)
        this.getSwi()
        this.dialogSwi = false
      })
    },
    // 焦点图位置控制
    move() {},

    // 焦点图上传按钮触发input:file
    uploadSwiBtn() {
      this.$refs.editShow.click()
    },

    //   上传轮播图
    uploadSwi(e) {
      // FormData
      var form = new FormData()
      form.append('file', e.target.files[0])
      this.$http
        .post(this.API.BASE_API_GOODS_IMG_SMALL_UPLOAD, form)
        .then((res) => {
          if (res.data.status !== 200) return this.$message.error(res.data.msg)
          this.query.swi_img = res.data.data.goods_small_img
          this.$message.success(res.data.msg)
        })
    },

    // 删除焦点图
    removeSwi(id) {
      this.$confirm('您确定要删除该焦点图吗?', { type: 'warning' })
        .then(() => {
          this.$http
            .delete(this.API.BASE_API_SWI_DEL + '?id=' + id)
            .then((res) => {
              if (res.data.status !== 200)
                return this.$message.error(res.data.msg)
              this.$message.success(res.data.msg)
              this.getSwi()
            })
        })
        .catch(() => {
          this.$message.info('删除取消!')
        })
    },
  },
}
</script>
<style lang="less" scoped>
.swi-header {
  margin-bottom: 15px;
}
.upload {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  .el-button {
    width: 150px;
  }
  .swi-img {
    margin-top: 10px;
    max-width: 722px;
    max-height: 500px;
  }
}
.relation {
  width: 100%;
}
</style>
<template>
  <div class="goods_Edit">
    <el-card>
      <!-- 面包屑 -->
      <bread-block :bread="bread"></bread-block>
      <!-- 添加商品表单 -->
      <el-tabs v-model="activeName">
        <!-- 商品基本信息 -->
        <el-tab-pane label="商品基本信息" name="goods_info">
          <el-form
            :model="queryGoods"
            ref="GoodsRef"
            :rules="GoodsRules"
            label-position="left"
            label-width="125px"
          >
            <el-form-item label="商品名称" prop="goods_name">
              <el-input
                v-model="queryGoods.goods_name"
                maxlength="100"
                :show-word-limit="true"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品原价(￥)" prop="goods_price">
              <el-input v-model.number="queryGoods.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品打折价(￥)" prop="goods_discount_price">
              <el-input
                v-model.number="queryGoods.goods_discount_price"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品库存" prop="goods_number">
              <el-input v-model.number="queryGoods.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量(kg)" prop="goods_weight">
              <el-input v-model.number="queryGoods.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cate_name">
              <el-cascader
                v-model="queryGoods.goods_cate_id"
                :options="CateData"
                :props="PropsPligin"
                @change="handleChange"
              >
              </el-cascader>
            </el-form-item>
            <el-form-item label="商品包装">
              <tag-block
                :tagName="queryGoods.goods_mode"
                @callClick="callQuery"
                @rulesType="rulesType(Cate[0])"
                @handValue="handValue"
                @removeTagName="removeTagName(Cate[0])"
              ></tag-block>
            </el-form-item>
            <el-form-item label="商品类型">
              <tag-block
                :tagName="queryGoods.goods_type"
                @callClick="callQuery"
                @rulesType="rulesType(Cate[1])"
                @handValue="handValue"
                @removeTagName="removeTagName(Cate[1])"
              ></tag-block>
            </el-form-item>
            <el-form-item label="商品关键字">
              <tag-block
                :tagName="queryGoods.goods_keyword"
                @callClick="callQuery"
                @rulesType="rulesType(Cate[2])"
                @handValue="handValue"
                @removeTagName="removeTagName(Cate[2])"
              ></tag-block>
            </el-form-item>
            <el-form-item label="商品产地">
              <tag-block
                :tagName="queryGoods.goods_origin"
                @callClick="callQuery"
                @rulesType="rulesType(Cate[3])"
                @handValue="handValue"
                @removeTagName="removeTagName(Cate[3])"
              ></tag-block>
            </el-form-item>
            <el-form-item label="商品封面">
              <label for="cover" class="cover_upload">
                上传封面
                <input
                  type="file"
                  hidden
                  id="cover"
                  @change="handChangeCover"
                />
              </label>
              <div class="samll-img" v-if="queryGoods.goods_small_img">
                <img :src="API.BASE_API_DEFAULT + queryGoods.goods_small_img" />
              </div>
            </el-form-item>
            <el-form-item label="商品图片">
              <label for="pic" class="cover_upload">
                上传图片
                <input
                  type="file"
                  hidden
                  id="pic"
                  @change="handChangeMoerImg"
                  multiple
                />
              </label>
              <div
                class="small-moer-img"
                v-if="queryGoods.goods_img_arr.length"
              >
                <div
                  class="samll-box"
                  v-for="item in queryGoods.goods_img_arr"
                  :key="item"
                >
                  <img :src="API.BASE_API_DEFAULT + item" alt="" class="pic" />
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!-- 商品富文本 -->
        <el-tab-pane label="商品详情介绍" name="goods_details">
          <mavon-editor
            v-model="queryGoods.contnt"
            @imgAdd="uploadImg"
            @change="handChange"
            ref="md"
          />
          <div class="btn">
            <el-button type="primary" @click="addGoods">提交</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'GoodsAdd',
  data() {
    return {
      // 面包屑导航
      bread: ['主页', '商品管理', '商品编辑'],

      //   tags切换控制
      activeName: 'goods_info',

      // 商品基本信息
      queryGoods: {
        goods_name: null,
        goods_price: 1,
        goods_discount_price: 1,
        goods_weight: 1,
        goods_number: 1,
        goods_mode: [],
        goods_type: [],
        goods_origin: [],
        goods_img_arr: [],
        goods_keyword: [],
        contnt: '',
        goods_small_img: null,
        editor_content: null,
        goods_cate_id: null,
        goods_cate_name: null,
      },

      // 标签类型
      Cate: ['mode', 'type', 'keyword', 'origin'],

      //   控制商品标签
      tagType: null,

      //   验证
      GoodsRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品原价', trigger: 'blur' },
        ],
        goods_discount_price: [
          { required: true, message: '请输入商品打折价', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品库存', trigger: 'blur' },
        ],
        goods_cate_id: [
          { required: true, message: '请选择商品分类', trigger: 'change' },
        ],
      },

      // 分类数据
      CateData: [],

      // 级联选择器配置
      PropsPligin: {
        value: 'id',
        label: 'cate_name',
        children: 'children',
      },
    }
  },
  created() {
    // 富文本
    this.queryGoods.contnt = this.Storage.local.get('editor')
    this.getCate()
    this.getGoods()
  },
  watch: {},
  methods: {
    //   获取商品信息
    getGoods() {
      var goodsId = this.$route.query.id
      this.$http
        .get(this.API.BASE_API_GOODS_INFO, { params: { goodsId } })
        .then((res) => {
          console.log(res);
          if (res.data.status !== 200) return this.$message.error(res.data.msg)
          //   this.queryGoods={...res.data.data}
          this.queryGoods.goods_mode.push(res.data.data.goods_mode)
          this.queryGoods.goods_origin.push(res.data.data.goods_origin)
          ;(this.queryGoods.goods_name = res.data.data.goods_name),
            (this.queryGoods.goods_price = res.data.data.goods_price),
            (this.queryGoods.goods_discount_price =
              res.data.data.goods_discount_price),
            (this.queryGoods.goods_weight = res.data.data.goods_weight),
            (this.queryGoods.goods_number = res.data.data.goods_number),
            (this.queryGoods.goods_type = res.data.data.goods_type),
            (this.queryGoods.goods_img_arr = res.data.data.goods_img_arr),
            (this.queryGoods.goods_keyword = res.data.data.goods_keyword),
            (this.queryGoods.contnt = res.data.data.contnt),
            (this.queryGoods.goods_small_img = res.data.data.goods_small_img),
            (this.queryGoods.editor_content = res.data.data.editor_content),
            (this.queryGoods.goods_cate_id = res.data.data.goods_cate_id),
            (this.queryGoods.goods_cate_name = res.data.data.goods_cate_name)
          //   }
        })
    },
    // 获取分类数据
    getCate() {
      this.$http.get(this.API.BASE_API_GOODS_CATE_LIST).then((res) => {
        if (res.data.status !== 200) return this.$message.error(res.data.msg)
        this.CateData = res.data.data
      })
    },
    // 分类选择
    handleChange() {
      this.queryGoods.goods_cate_id = this.queryGoods.goods_cate_id
      console.log(this.queryGoods.goods_cate_id);
    },
    // 富文本上传文件
    uploadImg(pos, file) {
      var form = new FormData()
      form.append('file', file)
      this.$http
        .post(this.API.BASE_API_GOODS_IMG_SMALL_UPLOAD, form)
        .then((res) => {
          if (res.data.status !== 200) return this.$message.error(res.data.msg)
          this.$refs.md.$img2Url(
            pos,
            this.API.BASE_API_DEFAULT + '/' + res.data.data.goods_small_img
          )
        })
    },

    // 富文本自动保存本地
    handChange() {
      this.Storage.local.set('editor', this.$refs.md.d_value)
    },

    // 上传封面
    handChangeCover(e) {
      var form = new FormData()
      form.append('file', e.target.files[0])
      this.$http
        .post(this.API.BASE_API_GOODS_IMG_SMALL_UPLOAD, form)
        .then((res) => {
          if (res.data.status !== 200) {
            return this.$message.error(res.msg)
          }
          this.queryGoods.goods_small_img = res.data.data.goods_small_img
          this.$message.success(res.data.msg)
        })
    },

    // 上传商品图片
    handChangeMoerImg(e) {
      this.queryGoods.goods_img_arr = []
      var form = new FormData()
      e.target.files.forEach((item) => {
        form.append('file', item)
      })
      this.$http
        .post(this.API.BASE_API_GOODS_IMG_MOER_UPLOAD, form)
        .then((res) => {
          if (res.data.status !== 200) return this.$message.error(res.data.msg)
          this.queryGoods.goods_img_arr = [...res.data.data]
          this.$message.success(res.data.msg)
        })
    },

    // 添加商品
    addGoods() {
      console.log(this.queryGoods.goods_cate_id)
      // 获取富文本的HTML结构内容
      this.queryGoods.editor_content = this.$refs.md.d_render

      this.$refs.GoodsRef.validate((valid) => {
        if (!valid) return this.$message.error('请输入完整的商品信息!')

        // 验证规则
        this.GoodsCount(this.queryGoods, (res) => {
          if (!res.state) return this.$message.error(res.msg)
          // 结构数据
          var params = {
            goods_name: this.queryGoods.goods_name,
            goods_price: this.queryGoods.goods_price,
            goods_discount_price: this.queryGoods.goods_discount_price,
            goods_weight: this.queryGoods.goods_weight,
            goods_number: this.queryGoods.goods_number,
            goods_mode: this.queryGoods.goods_mode.join(' '),
            goods_type: this.queryGoods.goods_type.join('|'),
            goods_origin: this.queryGoods.goods_origin.join(' '),
            goods_img_arr: this.queryGoods.goods_img_arr.join(','),
            goods_keyword: this.queryGoods.goods_keyword.join('-'),
            contnt: this.queryGoods.contnt,
            goods_small_img: this.queryGoods.goods_small_img,
            editor_content: this.queryGoods.editor_content,
            goods_cate_id: this.queryGoods.goods_cate_id.join('-'),
            goods_cate_name: null,
            goods_id: this.$route.query.id,
          }
          // 递归获取二级分类
          var vm = this
          cate(vm.CateData)
          function cate(val) {
            val.forEach((item) => {
              if (item.id == vm.queryGoods.goods_cate_id[1]) {
                console.log(item.cate_name)
                params.goods_cate_name = item.cate_name
              }
              if (item.children) {
                cate(item.children)
              }
            })
          }
          // 发送请求
          this.$http.put(this.API.BASE_API_GOODS_EDIT, params).then((res) => {
            console.log(res)
            if (res.data.status !== 201)
              return this.$message.error(res.data.msg)
            this.$message.success(res.data.msg)
            this.Storage.local.remove('editor')
            this.$router.push('/goods')
            this.queryGoods = {
              goods_name: null,
              goods_price: 1,
              goods_discount_price: 1,
              goods_weight: 1,
              goods_number: 1,
              goods_mode: [],
              goods_type: [],
              goods_origin: [],
              goods_img_arr: [],
              contnt: '',
              goods_small_img: null,
              editor_content: null,
            }
          })
        })
      })
    },

    // 验证
    GoodsCount(data, call) {
      if (
        data.goods_price == 0 ||
        data.goods_weight == 0 ||
        data.goods_discount_price == 0 ||
        data.goods_number == 0
      ) {
        call({ state: false, msg: '输入项不能为0!' })
      } else if (
        data.goods_mode.length == 0 ||
        data.goods_type.length == 0 ||
        data.goods_origin.length == 0 ||
        data.goods_keyword.length == 0
      ) {
        call({ state: false, msg: '请输入商品所需的标签项!' })
      } else if (data.goods_cate_id == null) {
        call({ state: false, msg: '请选择商品分类!' })
      } else if (!data.goods_small_img) {
        call({ state: false, msg: '需要上传商品封面!' })
      } else if (data.goods_img_arr.length < 2) {
        call({ state: false, msg: '商品图片至少需要2张!' })
      } else {
        call({ state: true })
      }
    },

    // 获取添加的数据并判断添加的类型
    callQuery(val) {
      switch (this.tagType) {
        case 'mode':
          return this.Goodsmode(val)
          break
        case 'type':
          return this.GoodsType(val)
          break
        case 'origin':
          return this.GoodsOrigin(val)
          break
        case 'keyword':
          return this.GoodsKeyword(val)
          break
      }
    },

    // 商品包装标签
    Goodsmode(val) {
      var mode = this.queryGoods.goods_mode
      if (this.TagRules(mode, val)) return
      if (mode.length >= 1) return this.$message.error('该项标签只能填1个')
      mode.push(val)
    },

    // 商品类型标签
    GoodsType(val) {
      var Type = this.queryGoods.goods_type
      if (this.TagRules(Type, val)) return
      if (Type.length >= 10) return this.$message.error('该项标签只能填10个')
      Type.push(val)
    },

    // 商品产地标签
    GoodsOrigin(val) {
      var Origin = this.queryGoods.goods_origin
      if (this.TagRules(Origin, val)) return
      if (Origin.length >= 1) return this.$message.error('该项标签只能填1个')
      Origin.push(val)
    },

    // 商品关键字验证
    GoodsKeyword(val) {
      var keyword = this.queryGoods.goods_keyword
      if (this.TagRules(keyword, val)) return
      if (keyword.length >= 5) return this.$message.error('该项标签只能填5个')
      keyword.push(val)
    },

    // 验证标签是否存在
    TagRules(data, val) {
      var bool = data.find((item) => item == val)
      if (bool) return this.$message.error('该标签已存在')
    },

    // 删除标签
    handValue(val) {
      switch (this.tagType) {
        case 'mode':
          return (this.queryGoods.goods_mode =
            this.queryGoods.goods_mode.filter((item) => item !== val))
          break

        case 'type':
          return (this.queryGoods.goods_type =
            this.queryGoods.goods_type.filter((item) => item !== val))
          break

        case 'keyword':
          return (this.queryGoods.goods_keyword =
            this.queryGoods.goods_keyword.filter((item) => item !== val))
          break

        case 'origin':
          return (this.queryGoods.goods_origin =
            this.queryGoods.goods_origin.filter((item) => item !== val))
          break
      }
    },

    // 判断需要删除的标签类型
    removeTagName(ty) {
      this.tagType = ty
    },

    // 控制商品包装和商品类型及商品产地的添加
    rulesType(ty) {
      this.tagType = ty
    },
  },
}
</script>
<style lang="less" scoped>
.btn {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
.cover_upload {
  padding: 10px 20px;
  background-color: #409eff;
  border-radius: 5px;
  color: white;
}
.samll-img {
  width: 35%;
  margin-top: 10px;
  img {
    width: 100%;
    height: 100%;
  }
}
.small-moer-img {
  display: flex;
  .samll-box {
    margin: 10px 10px 0px 0px;
    width: 20%;
    img {
      width: 100%;
    }
  }
}
.el-cascader {
  width: 100%;
}
</style>
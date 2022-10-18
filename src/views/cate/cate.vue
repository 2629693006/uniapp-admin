<template>
  <div class="cate">
    <el-card>
      <!-- 面包屑 -->
      <bread-block :bread="bread"></bread-block>
      <!-- 添加 -->
      <div class="cate-header">
        <el-button type="primary" @click="addCate">添加分类</el-button>
      </div>
      <!-- table -->
      <el-table
        :data="CateData"
        border
        stripe
        row-key="create_time"
        :tree-props="{ children: 'children', hasChildren: true }"
      >
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="cate_name" label="分类名称"></el-table-column>
        <el-table-column prop="create_time" label="日期"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="ErCate(scope.row.id)"
              v-if="!scope.row.one_id"
              >新增二级分类</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="CateEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="CateRemove(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 对话框 -->
    <el-dialog
      :title="Text"
      :visible.sync="handState"
      width="30%"
      :show-close="false"
      @close="Close"
    >
      <el-form
        label-position="left"
        :model="Catequery"
        ref="CateRef"
        :rules="CateRules"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model.trim="Catequery.cate_name"></el-input>
        </el-form-item>
        <el-form-item label="分类图片" v-if="Er">
          <label for="ErCate" class="Er">{{
            uploadState ? '更新图片' : '上传图片'
          }}</label>
          <div class="view-img" v-if="Catequery.cate_img">
            <img :src="API.BASE_API_DEFAULT + Catequery.cate_img" alt="" />
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handState = false">取 消</el-button>
        <el-button type="primary" @click="handQueryCate">确 定</el-button>
      </span>
    </el-dialog>
    <input type="file" id="ErCate" hidden @change="UploadCateImg" />
  </div>
</template>
<script>
export default {
  name: 'Cate',
  data() {
    return {
      // 面包屑
      bread: ['主页', '分类管理', '分类列表'],

      // 控制对话框
      handState: false,

      // 分类参数
      Catequery: {
        cate_name: null,
        cate_img: null,
        one_id: null,
        userId:this.Storage.session.get('user').id
      },

      //   验证
      CateRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '分类名称长度在1~5个字符之间',
            trigger: 'blur',
          },
        ],
      },

      //分类数据
      CateData: [],

      //添加或修改
      DialogType: null,

      // 二级分类数据
      Er: false,

      // 更新状态
      uploadState: false,
    }
  },
  created() {
    this.getCate()
  },
  methods: {
    // 获取分类
    getCate() {
      this.$http.get(this.API.BASE_API_GOODS_CATE_LIST).then((res) => {
        if (res.data.status !== 200) return this.$message.error(res.data.msg)
        this.CateData = res.data.data
      })
    },

    //对话框提交按钮
    handQueryCate() {
      this.$refs.CateRef.validate((valid) => {
        if (!valid) return this.$message.error('请输入分类名称')
        // 二级分类
        if (this.Er) {
          if (this.Catequery.cate_img == null)
            return this.$message.error('请上传商品分类图片')
          if (this.uploadState) {
            this.Er_edit()
          } else {
            this.addErCate()
          }
        } else {
          // 一级分类
          if (this.DialogType == 'add') {
            this.PushAdd()
          } else if (this.DialogType == 'edit') {
            this.One_edit()
          }
        }
      })
    },

    //添加一级
    PushAdd() {
      this.$http
        .post(this.API.BASE_API_GOODS_CATE_ADD, this.Catequery)
        .then((res) => {
          if (res.data.status != 201) return this.$message.error(res.data.msg)
          this.$message.success(res.data.msg)
          this.Catequery.cate_name = null
          this.handState = false
          this.getCate()
        })
    },

    // 修改一级
    One_edit() {
      this.$http
        .put(this.API.BASE_API_GOODS_CATE_EDIT, {
          cate_name: this.Catequery.cate_name,
          id: this.Catequery.id,
          userId:this.Storage.session.get('user').id
        })
        .then((res) => {
          if (res.data.status !== 200) return this.$message.error(res.data.msg)
          this.$message.success(res.data.msg)
          this.getCate()
          this.Close()
          this.handState = false
        })
    },

    // 添加二级
    addErCate() {
      this.$http
        .post(this.API.BASE_API_ER_CATE_ADD, this.Catequery)
        .then((res) => {
          console.log(res)
          if (res.data.status !== 201) return this.$message.error(res.data.msg)
          this.$message.success(res.data.msg)
          this.getCate()
          this.handState = false
        })
    },

    // 修改二级
    Er_edit() {
      this.$http
        .put(this.API.BASE_API_ER_CATE_EDIT, {
          id: this.Catequery.id,
          cate_name: this.Catequery.cate_name,
          cate_img: this.Catequery.cate_img,
          userId:this.Storage.session.get('user').id
        })
        .then((res) => {
          if (res.data.status !== 200) return this.$message.error(res.data.msg)
          this.$message.success(res.data.msg)
          this.getCate()
          this.handState = false
        })
    },

    // 控制顶部添加按钮
    addCate() {
      this.Er = false
      this.handState = true
      this.DialogType = 'add'
    },

    // 编辑
    CateEdit(val) {
      if (val.id && val.one_id) {
        // 二级
        this.Er = true
        this.uploadState = true //图片控制
      } else {
        // 一级
        this.Er = false
      }
      this.handState = true
      this.DialogType = 'edit'
      this.Catequery = { ...val } //数据
    },

    // 二级分类图片
    UploadCateImg(e) {
      var form = new FormData()
      form.append('file', e.target.files[0])
      this.$http
        .post(this.API.BASE_API_GOODS_IMG_SMALL_UPLOAD, form)
        .then((res) => {
          if (res.data.status !== 200) return this.$message.error(res.data.msg)
          this.Catequery.cate_img = res.data.data.goods_small_img
          this.$message.success(res.data.msg)
        })
    },

    // 二级添加控制
    ErCate(id) {
      this.Er = true
      this.handState = true
      this.Catequery.one_id = id
    },

    // 删除
    CateRemove(val) {
      this.$confirm('您确定要删除该分类项吗?', { type: 'warning' })
        .then(() => {
          var Url = null
          if (val.id && val.one_id) {
            Url = this.API.BASE_API_ER_CATE_DEL
          } else {
            Url = this.API.BASE_API_GOODS_CATE_DEL
          }
          this.$http.delete(Url,{
            data:{
              id:val.id,
              userId:this.Storage.session.get('user').id
            }
          }).then((res) => {
            if (res.data.status !== 200)
              return this.$message.error(res.data.msg)
            this.$message.success(res.data.msg)
            this.getCate()
          })
        })
        .catch(() => {
          this.$message.info('删除取消')
        })
      return
    },

    // 对话框关闭重置表单
    Close() {
      this.Catequery = {
        cate_name: null,
        cate_img: null,
        one_id: null,
      }
      this.$refs.CateRef.resetFields()
    },
  },
  computed: {
    Text() {
      return this.DialogType == 'add' ? '添加分类' : '修改分类'
    },
  },
}
</script>
<style lang="less" scoped>
.cate-header {
  margin-bottom: 15px;
}
.Er {
  padding: 10px 20px;
  background-color: #409eff;
  border-radius: 5px;
  color: white;
}
.view-img {
  width: 150px;
  height: 100px;
  margin-top: 10px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
<template>
  <div>
    <el-tag
      :key="tag"
      v-for="tag in tagName"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="small"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    >
    </el-input>
    <el-button v-else class="button-new-tag" size="small" @click="showInput"
      >+ New Tag</el-button
    >
  </div>
</template>
<script>
export default {
  props: {
    tagName: {
      type: Array,
    },
  },
  data() {
    return {
      inputVisible: false,
      inputValue: null,
    }
  },
  methods: {
    // 删除
    handleClose(val) {
      this.$emit('handValue',val)
      this.$emit('removeTagName')
    },

    // 输入框隐藏
    handleInputConfirm() {
      this.inputVisible = false
      this.callHanf()
      this.inputValue = null
    },

    // 控制输入显示
    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
      this.$emit('rulesType')
    },

    // 自定义事件传值给父组件
    callHanf() {
      if (this.inputValue) this.$emit('callClick', this.inputValue)
    },
  },
}
</script>
<style lang="less" scoped>
.el-tag {
  margin-right: 15px;
}
.el-input--small {
  width: 100px;
}
</style>
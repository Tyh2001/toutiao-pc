<template>
  <div id="CoverImg" @click="addd">
    <img
      class="UpImage"
      :src="UpImage ? UpImage : coverImg"
    >
    <el-dialog
      id="dialogImgList"
      title="选择封面"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :append-to-body="true"
    >
      <el-tabs v-model="activeName" type="card">

        <!-- 素材库 -->
        <el-tab-pane label="素材库" name="first">
          <ImageList
            :showOperation="false"
            :addImage="false"
            :choiceImg="true"
            ref="image-list"
          />
        </el-tab-pane>

        <!-- 上传图片 -->
        <el-tab-pane label="上传图片" name="second">
          <el-upload
            action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
            name="image"
            :headers="uploadHeaders"
            list-type="picture-card"
            :on-success="onSuccess"
            :on-error="upError"
            :limit="1"
            v-if="dialogVisible"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog visible.sync="true">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="determine">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 引入图片列表组件
import ImageList from '@/components/ImageList'
export default {
  name: 'CoverImg',
  props: {
    // 需要展示的图片列表
    coverImg: {
      type: String
    }
  },
  components: {
    ImageList // 图片列表组件
  },
  data () {
    return {
      uploadHeaders: {
        // 设置 token
        Authorization: `Bearer ${this.$store.state.user.token}`
      },
      dialogVisible: false, // 选则图片弹出框
      activeName: 'first',
      dialogImageUrl: '',
      UpImage: null // 需要发布封面素材
    }
  },
  methods: {
    // 点击弹出框中的 X 关闭
    handleClose () {
      this.dialogVisible = false // 模态框隐藏
    },
    addd () {
      this.dialogVisible = true
    },
    // 上传素材成功时
    onSuccess () {
      this.$message({
        message: '恭喜你，上传素材成功！',
        type: 'success'
      })
      this.dialogVisible = false
      this.dialogImageUrl = ''
    },
    // 上传素材失败时
    upError () {
      this.$message.error('上传失败，图片过大或服务器维护中！')
      this.dialogVisible = false
    },
    // 点击确定时
    determine () {
      // 通过 ref 可以直接获取到父组件的属性
      const sourceIndex = this.$refs['image-list'].sourceIndex
      // 获取到图片的 Src
      const imagSrc = this.$refs['image-list'].images[sourceIndex].url
      this.UpImage = imagSrc
      this.dialogVisible = false
      this.$emit('up-image', this.UpImage)
    }
  }
}
</script>

<style lang="less" scoped>
#CoverImg {
  width: 150px;
  height: 150px;
  border: 1px solid rgb(212, 212, 212);
  display: inline-block;
  margin: 10px;
  background-image: url("./images/pic_bg.png");
  background-size: contain;
  background-repeat: no-repeat;
  cursor: pointer;
  .UpImage {
    width: 150px;
    height: 150px;
  }
}
/deep/ .el-dialog {
  height: 80%;
  overflow: auto;
}
</style>

<template>
  <div>
    <div class="operation">
      <el-radio-group
        v-model="isCollapse"
        @change="onloadChange"
      >
        <el-radio-button
          :label="true"
        >
          全部
        </el-radio-button>
        <el-radio-button
          :label="false"
        >
          收藏
        </el-radio-button>
      </el-radio-group>

      <!-- 添加素材 -->
      <el-button
        type="success"
        v-if="addImage"
        @click="dialogVisible = true"
      >
        添加素材
      </el-button>
    </div>
    <!-- 全部图片素材 -->
    <div
      class="ImageSource"
      v-for="(img, index) in images"
      :key="index"
    >
      <el-image
        :src="img.url"
        fit="cover"
        @click.native="sourceIndex = index"
      />
      <!-- 文章选中状态的图标 -->
      <template v-if="choiceImg">
        <div
          v-if="sourceIndex === index"
          class="choiceImg"
        />
      </template>
      <div class="option" v-if="showOperation">
        <!-- 收藏 -->
        <el-button
          type="warning"
          icon="el-icon-star-off"
          size="mini"
          :disabled="CollectionBtn"
          circle
          :plain="!img.is_collected"
          @click="Collection(img)"
        />
        <!-- 删除 -->
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          circle
        />
      </div>
    </div>

    <!-- 分页器 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total_count"
      :page-size="per_page"
      :disabled="disabled"
      @current-change="onCurrentChange"
    />

    <!-- 添加素材的弹出框 -->
    <el-dialog
      title="上传素材"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      width="300px"
      :before-close="handleClose"
      :append-to-body="true"
    >
      <div style="width: 148px; margin: auto;">
        <el-upload
          action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
          name="image"
          :headers="uploadHeaders"
          list-type="picture-card"
          :on-success="onSuccess"
          :on-error="upError"
          :limit="1"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <el-dialog :visible.sync="upDialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>

    </el-dialog>
  </div>
</template>

<script>
// 获取用户图片素材 - 收藏图片素材
import { getImages, CollectionImages } from '@/api/images'
export default {
  name: 'imageList',
  props: {
    // 操作栏显示状态
    showOperation: {
      type: Boolean,
      required: true
    },
    // 添加图片的展示状态
    addImage: {
      type: Boolean,
      required: true
    },
    // 能否点击选择素材
    choiceImg: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      uploadHeaders: {
        // 设置 token
        Authorization: `Bearer ${this.$store.state.user.token}`
      },
      activeName: 'first',
      images: [], // 用户图片素材
      total_count: null, // 素材总数
      per_page: 10, // 每页显示条数
      page: 1, // 当前页码
      disabled: false, // 分页禁用
      isCollapse: true, // 选择器选中状态
      dialogVisible: false, // 添加素材的弹框显示状态
      dialogImageUrl: '', // 上传图片地址
      upDialogVisible: false, // 上传图片弹出层
      CollectionBtn: false, // 收藏按钮禁用状态
      sourceIndex: null // 素材的选中状态
    }
  },
  created () {
    this.loadgetImages() // 获取图片素材
  },
  methods: {
    // 获取图片素材
    async loadgetImages (page = 1, collect = false) {
      this.disabled = true
      const { data } = await getImages({
        collect,
        page,
        per_page: this.per_page
      })
      this.images = data.data.results // 获取图片素材
      this.total_count = data.data.total_count // 获取图片素材总数
      this.disabled = false
    },
    // 当页码改变时
    onCurrentChange (page) {
      this.loadgetImages(page)
    },
    // 点击弹出框中的 X 关闭
    handleClose () {
      this.dialogVisible = false // 模态框隐藏
    },
    // 收藏图片素材
    async Collection (img) {
      this.CollectionBtn = true
      await CollectionImages(img.id, !img.is_collected)
      if (!img.is_collected) {
        this.$message({
          showClose: true,
          message: '收藏素材成功',
          type: 'success'
        })
      } else {
        this.$message({
          showClose: true,
          message: '取消收藏素材成功',
          type: 'warning'
        })
      }
      img.is_collected = !img.is_collected // 更新视图显示
      this.CollectionBtn = false
    },
    onloadChange () {
      this.loadgetImages(1, !this.isCollapse) // 获取图片素材
    },
    // 上传素材成功时
    onSuccess () {
      this.$message({
        message: '恭喜你，上传素材成功！',
        type: 'success'
      })
      this.loadgetImages() // 获取图片素材
      this.dialogVisible = false
      this.dialogImageUrl = ''
    },
    // 上传素材失败时
    upError () {
      this.$message.error('上传失败，图片过大或服务器维护中！')
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
// 图片列表
.ImageSource {
  position: relative;
  width: 180px;
  height: 180px;
  display: inline-block;
  border: 2px solid rgb(204, 204, 204);
  margin: 20px;
  .el-image {
    width: 180px;
    height: 180px;
    position: relative;
    cursor: pointer;
  }
  // 操作
  .option {
    height: 30px;
    position: absolute;
    bottom: 0px;
    right: 0px;
    left: 0px;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: space-around;
    align-items: center;
    i {
      cursor: pointer;
      color: #fff;
    }
    .el-icon-star-on {
      color: orange;
    }
  }
}
// 操作栏
.operation {
  height: 40px;
  display: flex;
  justify-content: space-between;
}
// 分页器
.el-pagination {
  margin: 30px 0 10px 30px;
}
// 添加图片的标识
.addImgBox {
  width: 180px;
  height: 180px;
  border: 1px solid #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  cursor: pointer;
  .el-icon-plus {
    font-size: 30px;
  }
}
.choiceImg {
  width: 180px;
  height: 180px;
  background-image: url("./images/对号.png");
  background-repeat: no-repeat;
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  z-index: 100;
  cursor: pointer;
}
</style>

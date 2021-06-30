<template>
  <div>
    <!-- 个人设置 -->
    <el-card class="box-card">
      <!-- 面包屑 -->
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="text item">
        <!-- 设置表单 -->
        <div class="form">
          <el-form
            :model="userInfo"
            label-width="100px"
            :rules="userInfoRules"
            ref="setting-form"
          >
            <!-- 编号 -->
            <el-form-item label="编号：">
              {{ userInfo.id }}
            </el-form-item>

            <!-- 手机 -->
            <el-form-item label="手机：">
              {{ userInfo.mobile }}
            </el-form-item>

            <!-- 媒体名称 -->
            <el-form-item label="媒体名称：" prop="name">
              <el-input v-model="userInfo.name" />
            </el-form-item>

            <!-- 媒体介绍 -->
            <el-form-item label="媒体介绍" prop="intro">
              <el-input type="textarea" v-model="userInfo.intro"></el-input>
            </el-form-item>

            <!-- 邮箱 -->
            <el-form-item label="邮箱：" prop="email">
              <el-input v-model="userInfo.email"></el-input>
            </el-form-item>

            <!-- 保存按钮 -->
            <el-form-item>
              <el-button
                style="width: 120px"
                type="primary"
                @click="onChange"
                :loading="btnLoading"
                >保存设置</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <!-- 用户头像 -->
        <div class="photoBox">
          <img
            class="userPhoto"
            :src="userInfo.photo"
            @click="$refs['file-inp'].click()"
          />
          <p @click="$refs['file-inp'].click()">更换头像</p>
        </div>

        <!-- 上传文件的按钮 -->
        <input
          ref="file-inp"
          type="file"
          hidden
          accept="image/*"
          @change="photoOnChange"
        />

        <!-- 头像裁切的模态框 -->
        <el-dialog
          title="更换头像"
          :visible="dialogVisible"
          :append-to-body="true"
          :before-close="handleClose"
          @opened="dialogOpened"
          @closed="reomveOpened"
        >
          <div>
            <img :src="photoBlob" class="changeUserPhoto" ref="user-photo" />
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="SubmitPhoto"
              :loading="btnLoading"
            >
              确 定
            </el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
// 获取用户个人资料 - 编辑用户个人资料 - 编辑用户头像
import { getUserInfo, changUserInfo, changUserPhoto } from '@/api/user'
import 'cropperjs/dist/cropper.css'
// 头像裁切
import Cropper from 'cropperjs'
export default {
  name: 'settingIndex',
  data () {
    return {
      userInfo: {}, // 用户资料
      dialogVisible: false, // 上传头像的模态框
      photoBlob: null, // 新头像的地址
      cropper: null, // 裁切器实例
      btnLoading: false, // 保存按钮的 loading
      // 表单验证
      userInfoRules: {
        name: [
          { required: true, message: '请输入媒体名称', trigger: 'blur' },
          { min: 1, max: 7, message: '长度在 1 到 7 个字符', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '请输入媒体介绍', trigger: 'blur' },
          { min: 1, max: 5, message: '长度不能超过50个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入媒体邮箱', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
            message: '请输入正确邮箱',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.loadgetUserInfo() // 获取用户个人资料
  },
  methods: {
    // 获取用户个人资料
    async loadgetUserInfo () {
      const { data } = await getUserInfo()
      this.userInfo = data.data
      // 将个人信息存储到 Vuex容器中
      this.$store.commit('changeName', this.userInfo.name)
      this.$store.commit('changePhoto', this.userInfo.photo)
    },
    // 更新个人资料
    async onChange () {
      this.$refs['setting-form'].validate((valid) => {
        if (!valid) {
          return
        }
        this.changeUserInfo()
      })
    },
    // 封装的提交资料 只有表单验证通过才执行
    async changeUserInfo () {
      this.btnLoading = true
      await changUserInfo(this.userInfo)
      // 将用户个人信息存储到 vuex 容器中 方便头部导航栏实时更新数据
      this.$store.commit('changeName', this.userInfo.name)
      this.$message({
        showClose: true,
        message: '更新资料成功！',
        type: 'success'
      })
      this.btnLoading = false
    },
    // 当选择了需要上传头像的文件时
    photoOnChange () {
      const file = this.$refs['file-inp']
      const blob = window.URL.createObjectURL(file.files[0])
      this.photoBlob = blob
      this.dialogVisible = true // 模态框显示
    },
    // 当选择弹出框完全显示出来时 展示头像裁切器
    dialogOpened () {
      const image = this.$refs['user-photo']
      this.cropper = new Cropper(image, {
        aspectRatio: 1 / 1,
        viewMode: 1, // 裁切框不能移出图片范围
        dragMode: 'none' // 背景画布禁止移动
      })
    },
    // 当选择弹出框完全关闭时 销毁头像裁切器
    reomveOpened () {
      this.cropper.destroy() // 销毁裁切器
    },
    // 点击保存提交头像
    SubmitPhoto () {
      this.btnLoading = true
      // getCroppedCanvas().toBlob(filePhoto => {}) 这个方法可以直接获取裁剪后的对象 可以直接传递给后端
      this.cropper.getCroppedCanvas().toBlob(filePhoto => {
        const fd = new FormData()
        fd.append('photo', filePhoto)
        // const { data } = changUserPhoto(fd)
        changUserPhoto(fd).then(res => {
          // 更新视图显示
          this.userInfo.photo = window.URL.createObjectURL(filePhoto)
          this.$store.commit('changePhoto', this.userInfo.photo)
          // 将用户个人信息存储到 vuex 容器中 方便头部导航栏实时更新数据
        })
        this.btnLoading = false
      })
      this.$message({
        showClose: true,
        message: '更换头像成功！',
        type: 'success'
      })
      this.dialogVisible = false // 模态框隐藏
    },
    // 点击弹出框中的 X 关闭
    handleClose () {
      this.dialogVisible = false // 模态框隐藏
    }
  }
}
</script>

<style lang="less" scoped>
.text {
  display: flex;
  .form {
    width: 500px;
    .el-form {
      max-width: 500px;
    }
  }
  .photoBox {
    width: 210px;
    .userPhoto {
      margin-left: 50px;
      width: 160px;
      height: 160px;
      cursor: pointer;
      display: block;
    }
    p {
      margin: 10px 0 0 50px;
      text-align: center;
      cursor: pointer;
    }
  }
}
// 选择的头像图片
.changeUserPhoto {
  height: 300px;
}
</style>

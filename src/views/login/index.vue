<template>
  <div id="loginIndex">
    <!-- 登录页面 -->
    <div class="loginBox">
      <h2 class="loginTitle">登录</h2>
      <el-form
        :model="user"
        :rules="userRules"
        ref="login-form"
      >
        <!-- 手机号 -->
        <el-form-item prop="mobile">
          <el-input
            v-model="user.mobile"
            placeholder="请输入手机号"
            prefix-icon="el-icon-mobile-phone"
          />
        </el-form-item>

        <!-- 验证码 -->
        <el-form-item prop="code">
          <el-input
            v-model="user.code"
            placeholder="请输入验证码"
            prefix-icon="el-icon-lock"
          />
        </el-form-item>

        <!-- 同意协议 -->
        <el-form-item prop="agreement">
          <el-checkbox-group v-model="user.agreement" class="agreement">
            <el-checkbox label="" name="type">我已阅读并同意用户协议</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 登录按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            @click="userOnLogin"
            :loading="btnLoading"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 登录
import { onLogin } from '@/api/user'
export default {
  name: 'loginIndex',
  data () {
    return {
      // 用户登录信息
      user: {
        mobile: '13911111111', // 手机号
        code: '246810', // 验证码
        agreement: false // 同意协议
      },
      btnLoading: false, // 按钮 loading 状态
      // 表单验证
      userRules: {
        // 手机号验证
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          {
            pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
            message: '请输入正确手机号',
            trigger: 'blur'
          }
        ],
        // 验证码
        code: [
          { required: true, message: '验证码必填', trigger: 'blur' },
          { pattern: /^\d{6}$/, message: '请输6位验证码', trigger: 'blur' }
        ],
        // 协议验证
        agreement: [
          {
            validator: (rule, value, callback) => {
              // console.log(callback)
              if (value) {
                callback()
              } else {
                callback(new Error('无条件遵守我们的规则'))
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    // 登录
    userOnLogin () {
      this.$refs['login-form'].validate(valid => {
        if (!valid) {
          return
        }
        this.Login()
      })
    },
    Login () {
      this.btnLoading = true
      onLogin(this.user).then(res => {
        // 登录成功
        this.$message({
          showClose: true,
          message: '恭喜你，登录成功',
          type: 'success'
        })
        // 登录成功将 token 放到 vuex 中
        this.$store.commit('setUser', res.data.data)
        this.btnLoading = false
        this.$router.push('/')
      }).catch(err => {
        // 登录失败提示消息
        console.log(err)
        this.$message({
          showClose: true,
          message: '登录失败',
          type: 'warning'
        })
        this.btnLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
#loginIndex {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background-image: url('./image/login.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  .loginBox {
    width: 400px;
    height: 340px;
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    margin: auto;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.7);
    box-sizing: border-box;
    padding: 40px;
    // logo
    .loginTitle {
      text-align: center;
      color: #3a9cff;
      padding-bottom: 10px;
    }
    // 协议
    .agreement {
      line-height: 20px;
    }
    // 登录按钮
    .el-button {
      width: 100%;
    }
  }
}

</style>

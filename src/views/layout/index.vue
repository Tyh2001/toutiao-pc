<template>
  <div>
    <!-- 模板组件 -->
    <el-container>

      <!-- 侧边栏 -->
      <el-aside width="auto">
        <Sidebar />
      </el-aside>

      <el-container>

        <!-- 头部 -->
        <el-header>
          <span>
            <i class="el-icon-s-fold" />
            文章发布后台管理系统
          </span>

          <!-- 用户信息 下拉菜单 -->
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <!-- 用户头像 -->
              <img
                class="userPhoto"
                :src="$store.state.photo ? $store.state.photo : userInfo.photo"
              >
              <!-- 用户昵称 -->
              <div style="padding-left: 10px">
                {{ $store.state.name ? $store.state.name : userInfo.name }}
                <i class="el-icon-arrow-down el-icon--right" />
              </div>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                @click.native="$router.push('/setting')"
              >
                个人设置
              </el-dropdown-item>
              <el-dropdown-item @click.native="outLogin">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>

        <!-- 主体内容 -->
        <el-main>
          <router-view />
        </el-main>

      </el-container>
    </el-container>
  </div>
</template>

<script>
// 获取用户个人信息
import { getProfile } from '@/api/user'
// 侧边栏组件
import Sidebar from './components/Sidebar'
export default {
  name: 'layoutIndex',
  components: {
    Sidebar
  },
  data () {
    return {
      userInfo: {} // 用户个人信息
    }
  },
  created () {
    this.loadgetProfile() // 获取用户个人信息
  },
  methods: {
    // 获取用户个人信息
    async loadgetProfile () {
      const { data } = await getProfile()
      // console.log(data)
      this.userInfo = data.data
    },
    // 退出登录
    outLogin () {
      this.$confirm('确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除本地存储数据和 Vuex 中数据 并跳转登录页面
        window.localStorage.removeItem('userToken')
        this.$store.state.user = null
        this.$router.push('/login')
        this.$message({
          showClose: true,
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          showClose: true,
          type: 'info',
          message: '已取消操作'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  height: 60px;
  background-color: #495060;
  position: fixed;
  left: 200px;
  right: 0px;
  top: 0px;
  display: flex;
  align-items: center;
  color: #fff;
  justify-content: space-between;
  .el-dropdown-link {
    display: flex;
    color: #fff;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
  }
}
// 头像
.userPhoto {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #eee;
}
.el-main {
  position: fixed;
  top: 60px;
  left: 200px;
  right: 0px;
  bottom: 0px;
}
</style>

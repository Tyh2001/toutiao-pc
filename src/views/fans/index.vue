<template>
  <div>
    <!-- 粉丝管理 -->
    <el-card class="box-card">
      <!-- 面包屑 -->
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="text item">
        <el-tabs v-model="activeName" type="card">
          <!-- 粉丝列表 -->
          <el-tab-pane label="粉丝列表" name="first">
            <el-card
              shadow="never"
              v-for="(fan, index) in fansList"
              :key="index"
              class="fansList"
              :body-style="{ padding: '0px' }"
            >
              <el-avatar :src="fan.photo"></el-avatar>
              <p>{{ fan.name }}</p>
              <el-button
                type="primary"
                size="mini"
                plain
              >
                关注
              </el-button>
            </el-card>
            <!-- 分页器 -->
            <el-pagination
              background
              layout="prev, pager, next"
              :total="total_count"
              :page-size="20"
            />
          </el-tab-pane>

          <!-- 粉丝画像 -->
          <el-tab-pane label="粉丝画像" name="second">
            <FollowersList />
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
// 获取粉丝列表
import { getFollowers } from '@/api/user'
// 粉丝画像列表条形图
import FollowersList from './commponents/FollowersList'
export default {
  name: 'fansIndex',
  components: {
    FollowersList
  },
  data () {
    return {
      activeName: 'first',
      fansList: [], // 粉丝列表
      total_count: null // 粉丝数量
    }
  },
  created () {
    this.loadgetFollowers() // 获取粉丝列表
  },
  methods: {
    // 获取粉丝列表
    async loadgetFollowers () {
      const { data } = await getFollowers() // 获取粉丝列表
      this.fansList = data.data.results // 获取粉丝列表
      this.total_count = data.data.total_count // 粉丝数量
      // console.log(data)
    }
  }
}
</script>

<style lang="less" scoped>
.fansList {
  width: 120px;
  height: 190px;
  display: inline-block;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  .el-avatar {
    width: 80px;
    height: 80px;
  }
  .el-button {
    margin-top: 20px;
  }
}
// 分页器
.el-pagination {
  margin: 30px 0 10px 30px;
}
</style>

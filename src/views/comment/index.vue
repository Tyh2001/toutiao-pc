<template>
  <div>
    <!-- 评论管理 -->
    <el-card class="box-card">
      <!-- 面包屑 -->
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 下面内容 -->
      <div class="text item">
        <!-- 表格 -->
        <el-table
          :data="results"
          stripe
          style="width: 100%"
          v-loading="tableLoading"
        >
          <!-- 标题 -->
          <el-table-column
            prop="title"
            label="标题"
          />

          <!-- 总评论论数 -->
          <el-table-column
            prop="total_comment_count"
            label="总评论论数"
            width="150"
          />

          <!-- 粉丝评论数 -->
          <el-table-column
            prop="fans_comment_count"
            label="粉丝评论数"
            width="150"
          />

          <!-- 状态 -->
          <el-table-column
            prop="comment_status"
            label="状态"
            width="150"
          />

          <!-- 操作 -->
          <el-table-column
            label="操作"
            width="150"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.comment_status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :disabled="onDisabled"
                @change="onChange(scope.row.id, scope.row.comment_status)"
              />
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页器 -->
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total_count"
          :page-size="per_page"
          @current-change="onCurrentChange"
          :disabled="tableLoading"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
// 获取文章列表 - 修改文章评论状态
import { getArticles, changeStatus } from '@/api/article'
export default {
  name: 'commentIndex',
  data () {
    return {
      results: [], // 文章列表
      total_count: null, // 文章总数
      tableLoading: false, // 下边表格 loading 状态
      per_page: 10, // 每页显示的条数
      onDisabled: false // 开关按钮禁用状态
    }
  },
  created () {
    this.loadgetArticles() // 获取文章列表
  },
  methods: {
    // 获取文章列表
    async loadgetArticles (page = 1) {
      this.tableLoading = true
      const { data } = await getArticles({
        page,
        per_page: this.per_page,
        response_type: 'comment'
      }) // 获取文章列表
      // console.log(data)
      this.results = data.data.results // 获取文章列表
      this.total_count = data.data.total_count // 获取文章总数
      this.tableLoading = false
    },
    // 当页码发生变化时
    onCurrentChange (page) {
      this.loadgetArticles(page)
    },
    // 评论状态开关
    async onChange (resultsId, chan) {
      this.onDisabled = true
      await changeStatus(resultsId.toString(), chan)
      // console.log(data)
      this.onDisabled = false
      this.$message({
        showClose: true,
        message: chan ? '开启评论成功！' : '已关闭评论！',
        type: chan ? 'success' : 'warning'
      })
    }
  }
}
</script>

<style lang="less" scoped>
// 分页器
.el-pagination {
  margin: 30px 0 10px 30px;
}
</style>

<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 表单 -->
      <div class="text item">
        <el-form label-width="80px">

          <el-form-item label="状态：">
            <el-radio-group v-model="state">
              <el-radio :label="null">全部</el-radio>
              <el-radio label="0">草稿</el-radio>
              <el-radio label="1">待审核</el-radio>
              <el-radio label="2">审核通过</el-radio>
              <el-radio label="3">审核失败</el-radio>
              <el-radio label="4">删除</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="频道：">
            <el-select v-model="channelId" placeholder="请选择">
               <el-option
                label="全部"
                :value="null"
              />
              <el-option
                v-for="(channel, index) in channels"
                :label="channel.name"
                :value="channel.id"
                :key="index"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="日期：">
            <el-date-picker
              v-model="time"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="loadgetArticles()"
              :loading="tableLoading"
              style="width: 100px"
            >
              筛选
            </el-button>
          </el-form-item>
        </el-form>
      </div>

    </el-card>

    <!-- 下面表格部分 -->
    <el-card class="box-card bottomBox-card">
      <div slot="header" class="clearfix">
        <span>根据筛选条件共查询到 {{ total_count }} 条结果：</span>
      </div>
      <!-- 表格 -->
      <div class="text item">
        <el-table
          :data="results"
          stripe
          style="width: 100%"
          v-loading="tableLoading"
        >
          <!-- 封面 -->
          <el-table-column
            prop="date"
            label="封面"
            width="180"
          >
            <template slot-scope="scope">
              <el-image
                style="width: 170px; height: 100px"
                :src="scope.row.cover.images[0]"
                fit="contain"
                lazy
              />
            </template>
          </el-table-column>

          <!-- 标题 -->
          <el-table-column
            prop="title"
            label="标题"
          />

          <!-- 状态 -->
          <el-table-column
            label="状态"
            width="100"
          >
            <template slot-scope="scope">
              <el-button
                :type="stateBtn[scope.row.status].type"
                size="mini"
                plain
              >
                {{ stateBtn[scope.row.status].value }}
              </el-button>
            </template>
          </el-table-column>

          <!-- 发布时间 -->
          <el-table-column
            prop="pubdate"
            label="发布时间"
            width="180"
          />

          <!-- 操作 -->
          <el-table-column
            label="操作"
            width="150"
          >
            <!-- 删除 -->
            <template slot-scope="scope">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="small"
                plain
                circle
                @click="removeArticle(scope.row.id)"
              />
              <!-- 编辑 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="small"
                plain
                circle
                @click="$router.push('/publish?id=' + scope.row.id.toString())"
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
          :disabled="tableLoading"
          @current-change="onCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
// 获取频道列表 - 获取文章列表 - 删除文章 - 修改文章
import {
  getChannels,
  getArticles,
  deleteArticle
} from '@/api/article'
export default {
  name: 'articleIndex',
  data () {
    return {
      channels: [], // 频道列表
      channelId: null, // 选择的文章频道
      state: null, // 选择的文章的状态
      time: null, // 选择的文章的时间
      results: [], // 文章列表
      total_count: null, // 文章总数
      per_page: 10, // 每页数量
      page: 1, // 页数
      tableLoading: false, // 下边表格 loading 状态
      // 状态的按钮
      stateBtn: [
        { type: 'warning', value: '草稿' }, // 草稿
        { type: 'primary', value: '待审核' }, // 待审核
        { type: 'success', value: '审核通过' }, // 审核通过
        { type: 'danger', value: '审核失败' }, // 审核失败
        { type: '', value: '已删除' } // 已删除
      ]
    }
  },
  created () {
    this.loadgetChannels() // 获取频道列表
    this.loadgetArticles() // 获取文章列表
  },
  methods: {
    // 获取频道列表
    async loadgetChannels () {
      const { data } = await getChannels()
      // console.log(data)
      this.channels = data.data.channels // 获取频道列表
    },
    // 获取文章列表
    async loadgetArticles (page = 1) {
      this.tableLoading = true
      const { data } = await getArticles({
        status: this.state, // 文章状态，0-草稿，1-待审核，2-审核通过，3-审核失败，4-已删除，不传为全部
        channel_id: this.channelId, // 频道 id，不传为全部
        begin_pubdate: this.time ? this.time[0] : null, // 起始时间，不传就不限定开始时间
        end_pubdate: this.time ? this.time[1] : null, // 截止时间，不传就不限定结束时间
        page,
        per_page: this.per_page
      })
      // console.log(data)
      this.results = data.data.results // 获取文章列表
      this.total_count = data.data.total_count // 获取文章总数
      this.tableLoading = false
    },
    // 当页码发生变化时
    onCurrentChange (page) {
      this.loadgetArticles(page)
    },
    // 删除文章
    removeArticle (articleId) {
      this.$confirm('确定删除文章吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(articleId.toString()).then(res => {
          this.loadgetArticles(1) // 获取文章列表
        })
        this.$message({
          showClose: true,
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          showClose: true,
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
// 下方卡片
.bottomBox-card {
  margin-top: 20px;
}
// 分页器
.el-pagination {
  margin: 30px 0 10px 30px;
}
</style>

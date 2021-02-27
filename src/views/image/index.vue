<template>
  <div>
    <!-- 素材管理 -->
    <el-card class="box-card">
      <!-- 面包屑 -->
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="text item">
        <ImageList
          :showOperation="true"
          :addImage="true"
          :choiceImg="false"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入组件
import ImageList from '@/components/ImageList'
export default {
  name: 'imageIndex',
  components: {
    ImageList
  }
}
</script>

<style lang="less" scoped>

</style>

<template>
  <div>
    <!-- 首页 -->
    <el-card class="box-card">
      <!-- 面包屑 -->
      <div slot="header" class="clearfix">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="text item">
      </div>
    </el-card>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.item {
  height: 500px;
  background-image: url('./image/welcome.jpg');
  background-repeat: no-repeat;
  background-position: center;
}
</style>

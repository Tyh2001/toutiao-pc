<template>
  <div>
    <div ref="list-fans" style="width: 600px; height: 400px"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'FollowersList',
  data () {
    return {}
  },
  mounted () {
    const myChart = echarts.init(this.$refs['list-fans'])

    const option = {
      color: ['#4472c6'],
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }]
    }

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  }
}
</script>

<style lang="less" scoped>
</style>

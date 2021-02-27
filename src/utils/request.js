'user strict'

import axios from 'axios'
import JSONbig from 'json-bigint'

const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net/',

  // 这里可以做任何你想转换数据的事情
  transformResponse: [function (data) {
    try {
      return JSONbig.parse(data)
    } catch (err) {
      return data
    }
  }]
})

// 响应拦截器
request.interceptors.request.use(
  // 任何请求都是经过这里
  function (config) {
    // 从本地存储获取数据 统一设置 token
    const user = JSON.parse(window.localStorage.getItem('userToken'))
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }

    return config
  },
  // 请求失败都经过这里
  function (error) {
    return Promise.reject(error)
  }
)

export default request

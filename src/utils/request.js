import axios from 'axios'
import JSONbig from 'json-bigint'
// 在非组件模块中获取store必须通过这种方式
// 这里单独加载store，和在组件中 this.$store 一个东西
import store from '@/store/'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
  transformResponse: [function (data) {
    try {
      return JSONbig.parse(data)
    } catch (err) {
      return data
    }
  }]
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  const { userToken } = store.state
  // 如果用户已经登录了，接口统一设置token信息
  if (userToken) {
    config.headers.Authorization = `Bearer ${userToken.token}`
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器

export default request

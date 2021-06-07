import axios from 'axios'
import JSONbig from 'json-bigint'
// 在非组件模块中获取store必须通过这种方式
// 这里单独加载store，和在组件中 this.$store 一个东西
import store from '@/store/'
import { Toast } from 'vant'
import router from '@/router/'

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

const refreshTokenReq = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
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
request.interceptors.response.use(function (response) {
  return response
}, async function (error) {
  const status = error.response.status
  if (status === 400) { // 参数错误
    Toast.fail('客户端请求参数异常')
  } else if (status === 401) { // token无效
    const { userToken } = store.state
    if (!userToken || userToken.token) {
      return redirectLogin()
    }
    // 使用refresh_token获取新的tonken
    try {
      const { data } = await refreshTokenReq({
        method: 'PUT',
        url: '/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${userToken.refresh_token}`
        }
      })
      // 更新token
      userToken.token = data.data.token
      store.commit('setUserToken', userToken)
      // 把失败的请求重新发出去
      // error.config 是本次请求的相关配置信息对象
      // 使用reqeues发请求，会走自己的拦截器
      return request(error.config)
    } catch (err) {
      redirectLogin()
    }
  } else if (status === 403) { // 没有权限
    Toast.fail('没有权限操作')
  } else if (status === 500) { // 服务端异常
    Toast.fail('服务端异常')
  }
  return Promise.reject(error)
})

function redirectLogin () {
  // router.replace('/login')
  router.replace({
    name: 'login',
    // 传递查询参数，参数会以 ？作为分隔符放到 url 后面
    query: {
      // router.currentRoute 和组件中获取的 this.$route 是一个东西
      redirect: router.currentRoute.fullPath
    }
  })
}

export default request

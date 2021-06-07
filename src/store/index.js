import Vue from 'vue'
import Vuex from 'vuex'
import { getStorageItem, setStorageItem } from '@/utils/storage'

Vue.use(Vuex)

const USER_TOKEN_KEY = 'toutiao-user-token'

export default new Vuex.Store({
  state: {
    userToken: getStorageItem(USER_TOKEN_KEY), // 当前登录用户Token信息
    cachePages: ['LayoutIndex']
  },
  mutations: {
    setUserToken (state, data) {
      state.userToken = data
      // 持久化登录数据
      setStorageItem(USER_TOKEN_KEY, state.userToken)
    },
    // 添加缓存页面
    addCachePage (state, pageName) {
      if (!state.cachePages.includes(pageName)) {
        state.cachePages.push(pageName)
      }
    },
    // 移除缓存页面
    removeCachePage (state, pageName) {
      const index = state.cachePages.indexOf(pageName)
      if (index !== -1) {
        state.cachePages.splice(index, 1)
      }
    }
  },
  actions: {
  },
  modules: {
  }
})

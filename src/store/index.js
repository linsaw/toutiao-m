import Vue from 'vue'
import Vuex from 'vuex'
import { getStorageItem, setStorageItem } from '@/utils/storage'

Vue.use(Vuex)

const USER_TOKEN_KEY = 'toutiao-user-token'

export default new Vuex.Store({
  state: {
    userToken: getStorageItem(USER_TOKEN_KEY) // 当前登录用户Token信息
  },
  mutations: {
    setUserToken (state, data) {
      state.userToken = data
      // 持久化登录数据
      setStorageItem(USER_TOKEN_KEY, state.userToken)
    }
  },
  actions: {
  },
  modules: {
  }
})

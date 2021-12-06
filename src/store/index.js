import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({

  state: {
    user: JSON.parse(window.localStorage.getItem('userToken')), // 用户 token 数据
    name: null, // 用户的昵称
    photo: null // 用户的头像
  },

  mutations: {
    // 用户 token 数据
    setUser (state, data) {
      state.user = data

      // 防止页面刷新 token 丢失，还需要把 token 设置本地存储
      // 仅仅为了数据持久化
      window.localStorage.setItem('userToken', JSON.stringify(state.user))
    },
    // 更改用户昵称
    changeName (state, name) {
      state.name = name
    },
    // 更改用户头像
    changePhoto (state, photo) {
      state.photo = photo
    }
  }
})

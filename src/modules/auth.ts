import router from '../router'

const state = {
  isUserLoggedIn: false,
  userData: null
}

const getters = {
  getUserData (state) {
    return state.userData
  }
}

const mutations = {
  SET_LOGIN_STATE (state, value) {
    state.isUserLoggedIn = value
  },

  SET_USER_DATA (state, data) {
    state.userData = data
  }
}

const actions = {
  login ({commit}, data) {
    commit('SET_USER_DATA', data)
    commit('SET_LOGIN_STATE', true)
    router.replace('/')
  },

  logout ({commit}) {
    commit('SET_USER_DATA', null)
    commit('SET_LOGIN_STATE', false)
    router.replace('/login')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
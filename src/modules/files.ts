const state = {
  uploadDone: false
}

const getters = {

}

const mutations = {
  UPLOAD_DONE (state) {
    state.uploadDone = !state.uploadDone
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
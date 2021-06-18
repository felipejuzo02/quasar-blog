import axios from 'axios'

const state = {
  posts: []
}

const getters = {
  postsList: state => state.posts
}

const mutations = {
  setPosts (state, data) {
    state.posts = data
  }
}

const actions = {
  async fetchPosts ({ commit }, params) {
    try {
      const { data } = await axios({
        method: 'GET',
        url: 'posts',
        params
      })

      commit('setPosts', data)
    } catch {}
  },

  async addPost (context, data) {
    try {
      await axios({
        method: 'POST',
        url: 'posts',
        data
      })
    } catch {}
  },

  async deletePost (context, id) {
    try {
      await axios({
        method: 'DELETE',
        url: `posts/${id}`
      })
    } catch {}
  },

  async fetchPost (context, id) {
    try {
      const { data } = await axios({
        method: 'GET',
        url: `posts/${id}`
      })

      return data
    } catch {}
  },

  async editPost (context, post) {
    try {
      await axios({
        method: 'PUT',
        url: `posts/${post.id}`,
        data: post.values
      })
    } catch {}
  }
}

export default {
  namespaced: true,

  state,
  getters,
  mutations,
  actions
}

import axios from 'axios'

const state = {
  posts: []
}

const getters = {
  postsList: state => state.posts
}

const mutations = {
  fetchPosts (state, data) {
    state.posts = data
  },

  deletePost (state, id) {
    state.posts.splice(id, 1)
  }
}

const actions = {
  async fetchPosts ({ commit }) {
    try {
      const { data } = await axios({
        method: 'GET',
        url: 'posts'
      })

      commit('fetchPosts', data)
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

  async deletePost ({ commit }, id) {
    try {
      await axios({
        method: 'DELETE',
        url: `posts/${id}`
      })

      commit('deletePost', id)
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

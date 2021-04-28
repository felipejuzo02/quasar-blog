import axios from 'axios'

const state = {
  authors: []
}

const getters = {
  authorsList: state => state.authors
}

const mutations = {
  fecthAuthors (state, data) {
    state.authors = data
  },

  deleteAuthor (state, id) {
    state.authors.splice(id, 1)
  }
}

const actions = {
  async fecthAuthors ({ commit }) {
    try {
      const { data } = await axios({
        method: 'GET',
        url: 'authors'
      })

      commit('fecthAuthors', data)
    } catch {}
  },

  async addAuthor (context, data) {
    try {
      await axios({
        method: 'POST',
        url: 'authors',
        data
      })
    } catch {}
  },

  async fecthAuthor (context, id) {
    try {
      const { data } = await axios({
        method: 'GET',
        url: `authors/${id}`
      })

      return data
    } catch {}
  },

  async editAuthor (context, author) {
    try {
      await axios({
        method: 'PUT',
        url: `authors/${author.id}`,
        data: author.values
      })
    } catch {}
  },

  async deleteAuthor ({ commit }, id) {
    try {
      await axios({
        method: 'DELETE',
        url: `authors/${id}`
      })

      commit('deleteAuthor', id)
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

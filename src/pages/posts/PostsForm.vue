<template>
  <q-page class="bg-grey-2 q-pa-lg">
    <div class="flex justify-between">
      <div>
        <p class="text-h5 q-mb-xs">{{ pageTitle }}</p>
        <q-breadcrumbs>
          <q-breadcrumbs-el label="Home" />
          <q-breadcrumbs-el label="Postagens" />
          <q-breadcrumbs-el>{{ pageTitle }}</q-breadcrumbs-el>
        </q-breadcrumbs>
      </div>

      <div v-if="!isCreate">
        <q-btn flat color="negative" icon="delete" label="Deletar post" @click="confirmDelete" />
        <modal-delete v-model="confirmDeleteData" @onConfirm="deleteListPost" />
      </div>
    </div>

    <div class="q-my-lg">
      <q-input class="q-mb-md" outlined v-model="values.mainImageURL" label="Insira o link da imagem principal*"
      :rules="[validateRequiredFields]" />
      <q-input class="q-mb-md" outlined v-model="values.title" label="Informe o título*"
      :rules="[validateRequiredFields]" />
      <q-input class="q-mb-md" outlined v-model="values.shortDescription" label="Informe uma pequena descrição*"
      :rules="[validateRequiredFields]" />

      <div class="flex items-center q-mb-lg">
        <q-select class="col q-mr-sm" outlined v-model="values.authorName" :options="authorsOptions"
        label="Escolha o autor*" :rules="[validateRequiredFields]" />
        <q-select class="col q-ml-sm" outlined v-model="values.category" :options="categoryOptions"
        label="Informe a categoria da postagem*" :rules="[validateRequiredFields]" />
      </div>

      <q-editor class="q-my-lg bg-grey-2" v-model="values.mainText" />

      <div class="q-my-lg flex">
        <q-btn :disable="validateForm" color="primary" @click="actionChoose">{{ submitButtonLabel }}</q-btn>
        <q-btn color="primary" flat label="Cancelar" @click="confirmCancel" />
        <modal-cancel v-model="confirmCancelData" routeName="PostsList" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { validateRequiredFields, formatDateTime } from 'helpers'
import { extend } from 'quasar'
import modalCancel from 'components/modalCancel'
import modalDelete from 'components/modalDelete'

export default {
  components: {
    modalCancel,
    modalDelete
  },

  data () {
    return {
      categoryOptions: [
        'Esportes',
        'Tecnologia',
        'Culinária',
        'Mercado Financeiro',
        'Animais',
        'Brasil',
        'Exterior',
        'Outros'
      ],
      values: {
        mainImageURL: '',
        title: '',
        shortDescription: '',
        authorName: '',
        category: '',
        mainText: ''
      },
      confirmDeleteData: false,
      confirmCancelData: false
    }
  },

  methods: {
    ...mapActions({
      deletePost: 'posts/deletePost',
      editPost: 'posts/editPost',
      addPost: 'posts/addPost',
      fetchPosts: 'posts/fetchPosts',
      fetchPost: 'posts/fetchPost',
      fetchAuthors: 'authors/fecthAuthors'
    }),

    validateRequiredFields,

    formatDateTime,

    confirmDelete () {
      this.confirmDeleteData = true
    },

    confirmCancel () {
      this.confirmCancelData = true
    },

    async addPostToList () {
      this.values.postDate = formatDateTime()
      await this.addPost(this.values)

      this.$q.notify({
        message: 'Post criado com sucesso!',
        type: 'positive'
      })

      this.$router.push({ name: 'PostsList' })
    },

    async editPostList () {
      this.values.editDate = formatDateTime()
      const post = {
        values: this.values,
        id: this.postId
      }

      await this.editPost(post)

      this.$q.notify({
        message: 'Post alterado com sucesso!',
        type: 'positive'
      })

      this.$router.push({ name: 'PostsList' })
    },

    actionChoose () {
      this.isCreate ? this.addPostToList() : this.editPostList()
    },

    async deleteListPost () {
      await this.deletePost(this.postId)
      this.$q.notify({
        message: 'Post excluido com sucesso!',
        type: 'positive'
      })

      this.$router.push({ name: 'PostsList' })
    },

    async setInputValues () {
      const post = await this.fetchPost(this.postId)
      this.values = extend(true, {}, post)
    }
  },

  computed: {
    ...mapGetters({
      posts: 'posts/postsList',
      authorsList: 'authors/authorsList'
    }),

    pageTitle () {
      return `${this.isCreate ? 'Criar' : 'Editar'} postagem`
    },

    submitButtonLabel () {
      return this.isCreate ? 'Criar' : 'Editar'
    },

    authorsOptions () {
      return this.authorsList.map(author => author.name)
    },

    isCreate () {
      return this.$route.name === 'PostsCreate'
    },

    postId () {
      return this.$route.params.id
    },

    validateForm () {
      for (const key in this.values) {
        if (this.validateRequiredFields(this.values[key])) {
          return true
        }
      }

      return false
    }
  },

  created () {
    if (!this.isCreate) {
      this.setInputValues()
    }

    this.fetchAuthors()
  }
}
</script>

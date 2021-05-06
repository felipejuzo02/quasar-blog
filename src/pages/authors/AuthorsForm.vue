<template>
  <q-page class="bg-grey-2 q-pa-lg">
    <div class="flex justify-between">
      <div>
        <p class="text-h5 q-mb-xs">{{ pageTitle }}</p>
        <q-breadcrumbs>
          <q-breadcrumbs-el label="Home" />
          <q-breadcrumbs-el label="Autores" />
          <q-breadcrumbs-el>{{ pageTitle }}</q-breadcrumbs-el>
        </q-breadcrumbs>
      </div>

      <div v-if="!isCreate">
        <q-btn flat color="negative" icon="delete" label="Deletar post" @click="confirmDelete" />
        <modal-delete v-model="confirmDeleteData" @onConfirm="deleteListAuthor" />
      </div>
    </div>

    <div class="q-my-lg relative-position">
      <q-input outlined v-model="name" label="Nome do autor" class="q-my-md" :rules="[ validateRequiredFields ]" />
      <q-input outlined v-model="email" label="E-mail" :rules="[ validateEmailFields ]" />
      <div class="q-my-lg flex">
        <q-btn :disable="validateForm" color="primary" @click="actionChoose">{{ submitButtonLabel }}</q-btn>
        <q-btn color="primary" flat label="Cancelar" @click="confirmCancel" />
        <modal-cancel v-model="confirmCancelData" routeName="AuthorsList" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
import { validateRequiredFields, validateEmailFields } from 'helpers'
import modalCancel from 'components/modalCancel'
import modalDelete from 'components/modalDelete'

export default {
  components: {
    modalCancel,
    modalDelete
  },

  data () {
    return {
      name: '',
      email: '',
      confirmDeleteData: false,
      confirmCancelData: false
    }
  },

  methods: {
    ...mapActions({
      editAuthor: 'authors/editAuthor',
      addAuthor: 'authors/addAuthor',
      fecthAuthor: 'authors/fecthAuthor',
      deleteAuthor: 'authors/deleteAuthor',
      fetchAuthors: 'authors/fecthAuthors'
    }),

    validateRequiredFields,

    validateEmailFields,

    confirmDelete () {
      this.confirmDeleteData = true
    },

    confirmCancel () {
      this.confirmCancelData = true
    },

    editAuthorInformation () {
      const author = {
        values: {
          name: this.name,
          email: this.email
        },
        id: this.authorId
      }
      this.editAuthor(author)

      this.$q.notify({
        message: 'Autor editado com sucesso!',
        type: 'positive'
      })

      this.$router.push({ name: 'AuthorsList' })
    },

    deleteListAuthor () {
      this.deleteAuthor(this.authorId)

      this.$q.notify({
        message: 'Autor excluido com sucesso!',
        type: 'positive'
      })
      this.$router.push({ name: 'AuthorsList' })
    },

    async setInputValues () {
      const author = await this.fecthAuthor(this.authorId)
      this.name = author.name
      this.email = author.email
    },

    async addAuthorToList () {
      await this.addAuthor({ name: this.name, email: this.email })

      this.$q.notify({
        message: 'Autor criado com sucesso!',
        type: 'positive'
      })
      this.$router.push({ name: 'AuthorsList' })
    },

    actionChoose () {
      return this.isCreate ? this.addAuthorToList() : this.editAuthorInformation()
    }
  },

  computed: {
    authorId () {
      return Number(this.$route.params.id)
    },

    isCreate () {
      return this.$route.name === 'AuthorsCreate'
    },

    pageTitle () {
      return this.isCreate ? 'Criar autor' : 'Editar autor'
    },

    submitButtonLabel () {
      return this.isCreate ? 'Criar' : 'Editar'
    },

    validateForm () {
      return !!(this.validateRequiredFields(this.name) || this.validateEmailFields(this.email))
    }
  },

  created () {
    if (!this.isCreate) {
      this.setInputValues()
    }
  }
}
</script>

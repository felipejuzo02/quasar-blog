<template>
    <q-page class="bg-grey-2 q-pa-lg">
      <div class="flex justify-between">
        <div>
          <p class="text-h5 q-mb-xs">{{ pageTitle}}</p>
          <div>
            <q-breadcrumbs>
              <q-breadcrumbs-el label="Home" />
              <q-breadcrumbs-el label="Autores" />
              <q-breadcrumbs-el>{{ pageTitle }}</q-breadcrumbs-el>
            </q-breadcrumbs>
          </div>
        </div>

        <div v-if="!isCreate">
          <q-btn flat color="negative" icon="delete" label="Deletar autor" @click="confirmDelete" />
          <q-dialog v-model="confirmDeleteData" persistent>
            <q-card>
              <q-card-section class="row items-center">
                <span class="q-ml-sm">Deseja mesmo excluir o autor?</span>
              </q-card-section>
              <q-card-actions align="center">
                <q-btn flat label="Cancelar" color="primary" v-close-popup />
                <q-btn label="Confirmar" color="primary" v-close-popup @click="deleteListAuthor" />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </div>

      <div class="q-my-lg relative-position">
        <q-input outlined v-model="name" label="Nome do autor" class="q-my-md" :rules="[ validateRequiredFields ]" />
        <q-input outlined v-model="email" label="E-mail" :rules="[ validateEmailFields ]" />
        <div class="q-my-lg flex">
          <q-btn :disable="validateForm" color="primary" @click="actionChoose">{{ submitButtonLabel }}</q-btn>
          <modal-cancel hasPagination="AuthorsList" />
        </div>
      </div>
    </q-page>
</template>

<script>
import { mapActions } from 'vuex'
import { validateRequiredFields, validateEmailFields } from 'helpers'
import modalCancel from 'src/components/modalCancel.vue'

export default {
  components: {
    modalCancel
  },

  data () {
    return {
      name: '',
      email: '',
      confirmDeleteData: false
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
      this.fetchAuthors()

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

    addAuthorToList () {
      this.addAuthor({ name: this.name, email: this.email })
      this.fetchAuthors()

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

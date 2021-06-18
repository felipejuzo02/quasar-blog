<template>
    <q-page class="bg-grey-2 q-pa-lg page-authors-list">
      <div class="flex justify-between">
        <div>
          <p class="text-h5 q-mb-xs">Autores</p>
          <div>
            <q-breadcrumbs>
              <q-breadcrumbs-el label="Home" />
              <q-breadcrumbs-el label="Autores" />
            </q-breadcrumbs>
          </div>
        </div>
        <q-btn icon="add" unelevated rounded color="primary" :label="buttonLabel" :to="{ name: 'AuthorsCreate' }" />
      </div>
      <div class="flex q-my-lg justify-between">
        <q-input v-model="filters.name" ebounce="1000" @input="filterAuthors" label="Procurar" class="page-posts-list__search col" />
      </div>
      <div class="full-width">
        <q-list v-if="authorsList.length" bordered class="rounded-borders q-mb-xs">
          <div class="row q-px-md q-py-sm bg-primary text-white">
            <div class="q-mb-none col">Nome</div>
            <div class="q-mb-none col">E-mail</div>
          </div>
          <q-item clickable v-ripple v-for="(author, index) in authorsList" :key="index" class="row items-center">
            <p class="q-mb-none col ellipsis">{{ author.name }}</p>
            <p class="q-mb-none col ellipsis">{{ author.email }}</p>
            <q-btn flat icon="more_vert">
              <q-menu>
                <q-list class="page-authors-list">
                  <q-item>
                    <q-item-section>
                      <q-btn flat :to="{ name: 'AuthorsEdit', params: { id: author.id } }">Editar</q-btn>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-btn flat color="negative" @click="confirmDelete">Excluir</q-btn>
                      <q-dialog v-model="confirmDeleteData" persistent>
                        <q-card>
                          <q-card-section class="row items-center">
                            <span class="q-ml-sm">Quer realmente excluir o autor?</span>
                          </q-card-section>

                          <q-card-actions align="center">
                            <q-btn flat label="Cancelar" color="primary" v-close-popup />
                            <q-btn label="Confirmar" color="primary" v-close-popup @click="deleteListAuthor(author.id)" />
                          </q-card-actions>
                        </q-card>
                      </q-dialog>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-item>
        </q-list>

        <div v-if="!authorsList.length" class="flex flex-center q-pt-xl">
          <p class="q-mb-lg">Ops... Nenhum autor encontrado</p>
        </div>

        <div v-if="hasPagination" class="q-pa-lg flex flex-center">
          <q-pagination v-model="pagination._page" :max="2" direction-links boundary-links icon-first="skip_previous"
          icon-last="skip_next" icon-prev="fast_rewind" icon-next="fast_forward" @input="fetchAuthors(pagination)" />
        </div>
      </div>
    </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      filters: {
        name: ''
      },

      confirmDeleteData: false,

      pagination: {
        _page: 1,
        _limit: 10
      }
    }
  },

  computed: {
    ...mapGetters({
      authorsList: 'authors/authorsList'
    }),

    hasPagination () {
      return this.authorsList.length >= this.pagination._limit || this.pagination._page !== 1
    },

    buttonLabel () {
      return this.$q.screen.gt.sm ? 'Adicionar autor' : ''
    }
  },

  methods: {
    ...mapActions({
      deleteAuthor: 'authors/deleteAuthor',
      fetchAuthors: 'authors/fecthAuthors'
    }),

    async deleteListAuthor (id) {
      await this.deleteAuthor(id)
      this.$q.notify({
        message: 'Autor excluido com sucesso!',
        type: 'positive'
      })
      this.fetchAuthors(this.pagination)
    },

    confirmDelete () {
      this.confirmDeleteData = true
    },

    async filterAuthors () {
      const filter = {}
      for (const key in this.filters) {
        if (this.filters[key]) {
          filter[`${key}_like`] = this.filters[key]
        }
      }

      await this.fetchAuthors({ ...this.pagination, ...filter })
    }
  },

  created () {
    this.fetchAuthors(this.pagination)
  }
}
</script>

<style lang="scss" scoped>
  .page-authors-list{
    &__author-options{
      min-width: 150px;
    }
  }
</style>

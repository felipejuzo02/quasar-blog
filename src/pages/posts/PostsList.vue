<template>
  <q-page class="bg-grey-2 q-pa-lg page-posts-list">
    <div>
      <div class="flex justify-between">
        <div>
          <p class="text-h5 q-mb-xs">Postagens</p>
          <div>
            <q-breadcrumbs>
              <q-breadcrumbs-el label="Home" />
              <q-breadcrumbs-el label="Postagens" />
            </q-breadcrumbs>
          </div>
        </div>
        <q-btn icon="add" unelevated rounded color="primary" :label="buttonLabel" :to="{ name: 'PostsCreate' }" />
      </div>

      <div class="flex q-my-lg justify-between">
        <q-input debounce="1000" @input="filterPost" v-model="filters.title" label="Procurar" class="page-posts-list__search col" />
        <q-btn flat color="primary" :label="buttonFilterLabel" icon="filter_list">
          <q-menu>
            <q-list class="page-post-list__filter-options">
              <q-item>
                <q-item-section>
                  <q-select v-model="filters.authorName" :options="authorsOptions" label="Autor" />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-select v-model="filters.category" :options="categoryOptions" label="Categoria" />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-input filled v-model="filters.postDate" class="q-mt-md">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                          <q-date v-model="filters.postDate" mask="DD/MM/YYYY">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                   </q-input>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-btn color="primary" v-close-popup label="Filtrar" @click="filterPost" />
                  <q-btn color="primary" v-close-popup flat label="Limpar" @click="clearFilters" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>

    <div class="row full-width q-my-lg" :class="postsListsContainer">
      <div v-for="(post, index) in postsList" :key="index" class="col-sm-3 col-12 page-posts-list__card" :class="postsListsSize">
        <card-post :content="post" @click="acessPost(post.id)">
          <template v-slot:actions>
            <q-btn class="page-posts-list__edit-button absolute" flat icon="edit">
              <q-menu>
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-btn flat :to="{ name: 'PostsEdit', params: { id: post.id } }">Editar</q-btn>
                      <q-btn flat text-color="negative" @click="confirmDelete">Excluir</q-btn>
                      <q-dialog v-model="confirmDeleteData" persistent>
                        <q-card>
                          <q-card-section class="row items-center">
                            <span class="q-ml-sm">Quer realmente excluir o post?</span>
                          </q-card-section>

                          <q-card-actions align="center">
                            <q-btn flat label="Cancelar" color="primary" v-close-popup />
                            <q-btn label="Confirmar" color="primary" v-close-popup @click="deleteListPost(post.id)" />
                          </q-card-actions>
                        </q-card>
                      </q-dialog>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </template>
        </card-post>
      </div>
    </div>

    <div v-if="!postsList.length" class="flex flex-center q-pt-xl">
      <p class="q-mb-lg">Ops... Nenhum post encontrado.</p>
    </div>

    <div v-if="hasPagination" class="q-pa-lg flex flex-center">
      <q-pagination v-model="pagination._page" :max="2" direction-links boundary-links icon-first="skip_previous"
      icon-last="skip_next" icon-prev="fast_rewind" icon-next="fast_forward" @input="filterPost" />
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CardPost from 'src/components/CardPost.vue'

export default {
  components: {
    CardPost
  },

  data () {
    return {
      categoryOptions: [
        'Esportes',
        'Tecnologia',
        'Culinária', 'Mercado Financeiro',
        'Animais',
        'Brasil',
        'Exterior',
        'Outros'
      ],

      pagination: {
        _page: 1,
        _limit: 8
      },

      filters: {
        authorName: '',
        category: '',
        postDate: '',
        title: ''
      },

      confirmDeleteData: false
    }
  },

  methods: {
    ...mapActions({
      deletePost: 'posts/deletePost',
      fetchPosts: 'posts/fetchPosts',
      fetchAuthors: 'authors/fecthAuthors'
    }),

    confirmDelete () {
      this.confirmDeleteData = true
    },

    async deleteListPost (id) {
      await this.deletePost(id)
      this.$q.notify({
        message: 'Post excluido com sucesso!',
        type: 'positive'
      })

      await this.fetchPosts(this.pagination)
    },

    acessPost (id) {
      this.$router.push({ name: 'PostsSingle', params: { id } })
    },

    async filterPost () {
      const filter = {}
      for (const key in this.filters) {
        if (this.filters[key]) {
          filter[`${key}_like`] = this.filters[key]
        }
      }

      await this.fetchPosts({ ...this.pagination, ...filter })
    },

    clearFilters () {
      for (const objKey in this.filters) {
        this.filters[objKey] = ''
      }

      this.fetchPosts(this.pagination)
    }
  },

  computed: {
    ...mapGetters({
      postsList: 'posts/postsList',
      authorsList: 'authors/authorsList'
    }),

    authorsOptions () {
      return this.authorsList.map(author => author.name)
    },

    hasPagination () {
      return this.postsList.length >= 8 || this.pagination._page !== 1
    },

    postsListsContainer () {
      return this.$q.screen.gt.sm && 'q-col-gutter-md'
    },

    postsListsSize () {
      return !this.$q.screen.gt.sm && 'q-mb-md'
    },

    buttonLabel () {
      return this.$q.screen.gt.sm ? 'Adicionar post' : ''
    },

    buttonFilterLabel () {
      return this.$q.screen.gt.sm ? 'Filtrar' : ''
    }
  },

  created () {
    this.fetchPosts(this.pagination)

    this.fetchAuthors()
  }
}
</script>

<style lang="scss">
  .page-posts-list {
    &__card:nth-child(4n+1) {
      padding-left: 0;
    }

    &__edit-button {
      bottom: 10px;
      right: 10px;
    }
  }
</style>

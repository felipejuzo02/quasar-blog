<template>
  <q-page class="bg-grey-2 q-pa-lg page-posts">
    <div>
      <div class="text-primary" :class="titleClass">{{ values.title }}</div>
      <div class="text-subtitle1 q-my-sm text-grey-8">{{ values.shortDescription }}</div>
      <div class="text-caption">
        <p class="q-ma-none">Realizado por <span class="text-primary">{{ values.authorName }}</span></p>
        <div class="q-mb-none">
          <p class="inline-block q-mr-xs">Criado em {{ values.postDate }}</p>
          <p class="inline-block" v-if="values.editDate">| Editado em {{ values.editDate }}</p>
        </div>

      </div>
    </div>

    <div class="relative-position page-posts__category">
      <p class="q-ma-none absolute-right bg-primary text-white q-px-md">{{ values.category }}</p>
    </div>

    <q-separator color="primary" size="3px" />

    <div :class="postContainer" class="q-my-md">
      <img :class="imageSize" :src="values.mainImageURL" :alt="values.title">
      <div v-html="values.mainText" class="text-justify" />
    </div>
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      values: {
        mainImageURL: '',
        title: '',
        shortDescription: '',
        authorName: '',
        category: '',
        categoryOptions: ['Esportes', 'Tecnologia', 'Culinária', 'Mercado Financeiro', 'Animais', 'Brasil', 'Exterior', 'Outros'],
        postDate: '',
        editDate: '',
        mainText: ''
      }
    }
  },

  methods: {
    ...mapActions({ fetchPost: 'posts/fetchPost' }),

    async setValues () {
      const post = await this.fetchPost(this.postId)
      this.values = post
    }
  },

  computed: {
    postId () {
      return this.$route.params.id
    },

    postContainer () {
      return this.$q.screen.gt.sm && 'q-my-md'
    },

    imageSize () {
      return this.$q.screen.gt.sm ? 'page-posts__image q-ml-md' : 'full-width q-my-md'
    },

    titleClass () {
      return this.$q.screen.gt.sm ? 'text-h2' : 'text-h4 text-center'
    }
  },

  created () {
    this.setValues()
  }
}
</script>

<style lang="scss" scoped>
  .page-posts {
    &__category {
      height: 20px
    }

    &__image {
      width: 50%;
      float: right;
    }
  }
</style>

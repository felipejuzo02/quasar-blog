<template>
  <q-page class="bg-grey-2 q-pa-lg page-posts">
    <div>
      <div v-if="$q.screen.gt.sm" class="text-h2 text-primary">{{ values.title }}</div>
      <div v-if="!$q.screen.gt.sm" class="text-h4 text-center text-primary">{{ values.title }}</div>
      <div class="text-subtitle1 q-my-sm text-grey-8">{{ values.shortDescription }}</div>
      <div class="text-caption">
        <p class="q-ma-none">Realizado por <span class="text-primary">{{ values.authorName }}</span></p>
        <p class="q-mb-none">Criado em {{ values.postDate }} | Editado em {{ values.editDate }}</p>
      </div>
    </div>

    <div class="relative-position page-posts__category">
      <p class="q-ma-none absolute-right bg-primary text-white q-px-md">{{ values.category }}</p>
    </div>

    <q-separator color="primary" size="3px" />

    <div v-if="!$q.screen.gt.sm">
      <img class="full-width q-my-md" :src="values.mainImageURL" :alt="values.title">
      <div v-html="values.mainText" class="text-justify" />
    </div>

    <div v-if="$q.screen.gt.sm" class="q-my-md">
      <img class="page-posts__image q-ml-md" :src="values.mainImageURL" :alt="values.title">
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

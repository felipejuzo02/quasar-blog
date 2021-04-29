<template>
  <div>
    <q-btn flat color="negative" icon="delete" label="Deletar autor" @click="confirmDelete" />
    <q-dialog v-model="confirmDeleteData" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Deseja mesmo realizar a exclusão?</span>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn label="Confirmar" color="primary" v-close-popup v-on="$listeners" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      confirmDeleteData: false
    }
  },

  methods: {
    confirmDelete () {
      this.confirmDeleteData = true
    }
  }
}
</script>

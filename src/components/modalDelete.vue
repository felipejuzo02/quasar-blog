<template>
  <q-dialog v-model="confirmDeleteData" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <span class="q-ml-sm">Deseja mesmo realizar a exclusão?</span>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn label="Confirmar" color="primary" v-close-popup @click="$emit('onConfirm')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    confirmDeleteData: {
      type: Boolean
    }
  }
}
</script>

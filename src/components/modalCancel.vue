<template>
  <q-dialog v-bind="$attrs" v-on="$listeners" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <span class="q-ml-sm">Deseja mesmo cancelar?</span>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn flat label="Cancelar" color="primary" v-close-popup />
        <q-btn label="Confirmar" color="primary" v-close-popup :to="{ name: routeName }" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    routeName: {
      type: String,
      default: ''
    }
  }
}
</script>

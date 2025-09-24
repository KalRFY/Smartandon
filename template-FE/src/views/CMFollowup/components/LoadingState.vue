<template>
  <div>
    <CCol class="text-center">
      Loading data...
    </CCol>
    <CCol class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </CCol>
  </div>
</template>

<script setup>
import { CCol } from '@coreui/vue'
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.spinner-border {
  margin: 2rem 0;
}
</style>
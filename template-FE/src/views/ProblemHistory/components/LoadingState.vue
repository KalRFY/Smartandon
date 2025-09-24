<!-- LoadingState.vue -->
<template>
  <div>
    <CFormLabel>Loading data...</CFormLabel>
    <CCol class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </CCol>
  </div>
</template>

<script setup>
import { CFormLabel, CCol } from '@coreui/vue'


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

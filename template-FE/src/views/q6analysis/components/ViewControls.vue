<template>
  <CRow class="mb-3 justify-content-center">
    <CCol md="10" lg="8" class="w-100">
      <CCard class="w-100 mb-3">
        <CCardBody class="d-flex justify-content-center align-items-center p-2">
          <CButtonGroup role="group" aria-label="View options">
            <CButton
              v-for="view in viewOptions"
              :key="view.value"
              :color="selectedView === view.value ? 'primary' : 'outline-primary'"
              @click="selectView(view.value)"
              :disabled="isLoading"
            >
              {{ view.label }}
            </CButton>
          </CButtonGroup>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import {
  CButtonGroup,
  CButton,
  CCard,
  CCardBody,
  CRow,
  CCol,
} from '@coreui/vue'

const props = defineProps({
  selectedView: String,
  isLoading: Boolean
})

const emit = defineEmits(['update:selectedView'])

const viewOptions = [
  { value: 'abnormal', label: 'Abnormal' },
  { value: 'frequency', label: 'Frequency' }
]

const selectView = (view) => {
  emit('update:selectedView', view)
}
</script>

<style scoped>
/* Custom button group styling */
.btn-group .btn {
  border-radius: 0;
}

.btn-group .btn:first-child {
  border-top-left-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
}

.btn-group .btn:last-child {
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}
</style>
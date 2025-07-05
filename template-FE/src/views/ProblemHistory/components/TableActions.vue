<!-- TableActions.vue -->
<template>
  <CRow>
    <CCol>
      <CFormLabel style="font-weight: bold">Filters</CFormLabel>
      <CRow>
        <CCol sm="3">
          <CButton
            style="width: 100%; font-weight: bold; color: white"
            color="info"
            @click="$emit('freq')"
          >
            Frequency Problem
          </CButton>
        </CCol>
        <CCol sm="7">
          <CButton
            style="width: 50%; font-weight: bold; color: white"
            color="info"
            @click="$emit('ltb')"
          >
            LTB
          </CButton>
        </CCol>
      </CRow>
    </CCol>
    <CCol sm="2">
      <CFormLabel style="font-weight: bold">Download Excel</CFormLabel>
      <CButton
        style="width: 100%; font-weight: bold; color: white"
        color="success"
        @click="$emit('download')"
      >
        Download
      </CButton>
    </CCol>
  </CRow>
</template>

<script>
import { CRow, CCol, CButton, CFormLabel } from '@coreui/vue'

export default {
  name: 'TableActions',
  components: {
    CRow,
    CCol,
    CButton,
    CFormLabel,
  },

  emits: ['freq', 'ltb', 'download'],
}
</script>

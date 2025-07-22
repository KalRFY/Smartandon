<!-- TableActions.vue -->
<template>
  <CRow>
    <CCol>
      <CCard class="control-card">
        <CCardBody>
          <CRow>
            <CFormLabel style="font-weight: bold; font-size: medium;">Filters</CFormLabel>
          </CRow>
          <CRow>
            <CButtonGroup size="md">
              <CButton
                color="primary"
                variant="outline"
                style="width: 10;"
                :active="selectedCategory === 0"
                :disabled="isLoading"
                @click="onClickFilter(0)"
              >
                All
              </CButton>
              <CButton
                color="primary"
                variant="outline"
                style="width: 10;"
                :active="selectedCategory === 1"
                :disabled="isLoading"
                @click="onClickFilter(1)"
              >
                Small
              </CButton>
              <CButton
                color="primary"
                variant="outline"
                style="width: 10;"
                :active="selectedCategory === 2"
                :disabled="isLoading"
                @click="onClickFilter(2)"
              >
                Repeat
              </CButton>
              <CButton
                color="primary"
                variant="outline"
                style="width: 10;"
                :active="selectedCategory === 3"
                :disabled="isLoading"
                @click="onClickFilter(3)"
              >
                LTR
              </CButton>
              <CButton
                color="primary"
                variant="outline"
                style="width: 10;"
                :active="selectedCategory === 4"
                :disabled="isLoading"
                @click="onClickFilter(4)"
              >
                SLTR
              </CButton>
            </CButtonGroup>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
    <CCol sm="3">
      <CCard>
        <CCardBody>
          <CRow>
            <CFormLabel style="font-weight: bold; font-size: medium;">Download Excel</CFormLabel>
          </CRow>
          <CRow>
            <CCol>
              <CButton
                style="width: 100%; font-weight: bold; color: white"
                color="success"
                :disabled="isLoading"
                @click="$emit('download')"
              >
                Download
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import { CRow, CCol, CButton, CFormLabel, CButtonGroup } from '@coreui/vue'

export default {
  name: 'TableActions',
  components: {
    CRow,
    CCol,
    CButton,
    CFormLabel,
    CButtonGroup,
  },
  emits: ['freq', 'ltb', 'download', 'filterCategory'],
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedCategory: 0,
    }
  },
  methods: {
    onClickFilter(category) {
      if (!this.isLoading) {
        this.selectedCategory = category
        console.log(`[RepeatFlowChecker] TableActions button clicked with category: ${category}`)
        this.$emit('filterCategory', category)
      }
    },
  },
}
</script>

<style scoped>
.active-text-white {
  color: white !important;
}
.control-card {
  filter: none !important;
  opacity: 1 !important;
}
</style>

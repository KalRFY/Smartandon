<template>
  <CRow class="mb-3">
    <CCol>
      <div class="border-secondary" style="background-color: white; border-radius: 9px; height: 100%; box-shadow: 5px 5px 5px rgba(0,0,0,0.2);">
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
      </div>
    </CCol>
    <!-- <CCol sm="3">
      <CRow class="mb-3">
        <div class="border-secondary" style="background-color: white; border-radius: 9px; box-shadow: 5px 5px 5px rgba(0,0,0,0.2);">
          <CCardBody>
            <CCol>
              <CButton color="primary" style="width: 100%; font-size: x-small; font-weight: bold;">
                <label>5 Why Belum di isi</label>
              </CButton>
            </CCol>
          </CCardBody>
        </div>
      </CRow>
      <CRow>
        <div class="border-secondary" style="background-color: white; border-radius: 9px; box-shadow: 5px 5px 5px rgba(0,0,0,0.2);">
          <CCardBody>
            <CCol>
              <CButton color="warning" style="width: 100%; font-size: x-small; font-weight: bold;">
                <label>C/M Belum di isi</label>
              </CButton>
            </CCol>
          </CCardBody>
        </div>
      </CRow>
    </CCol> -->
    <CCol sm="2">
      <div class="border-secondary" style="background-color: white; border-radius: 9px; height: 100%; box-shadow: 5px 5px 5px rgba(0,0,0,0.2);">
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
      </div>
    </CCol>
  </CRow>
  <CRow>
    <CCol>
      <CButton style="width: 50%; font-size: x-small; font-weight: bold; background-color: #FF7F7F; color: white;" @click="onClickFilterWhyCm(1)">
        <label>5 Why Belum di isi</label>
      </CButton>
      <CButton style="width: 50%; font-size: x-small; font-weight: bold; background-color: #FFFFA0;" @click="onClickFilterWhyCm(2)">
        <label>C/M Belum di isi</label>
      </CButton>
    </CCol>
  </CRow>
  
</template>

<script setup>
import { ref } from 'vue'
import { CRow, CCol, CButton, CFormLabel, CButtonGroup } from '@coreui/vue'

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  filterStartDate: {
    type: String,
    default: ''
  },
  filterFinishDate: {
    type: String,
    default: ''
  },
  selectedLine: {
    type: [String, Number],
    default: null
  },
  selectedMachineName: {
    type: [String, Number],
    default: null
  },
  selectedProblem: {
    type: String,
    default: ''
  },
  selectedProblemCategory: {
    type: [String, Number],
    default: null
  },
  problemsData: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits(['freq', 'ltb', 'download', 'filterCategory'])

// State
const selectedCategory = ref(0)
const selectedFiltered = ref(0)

// Methods
const onClickFilter = (category) => {
  if (!props.isLoading) {
    selectedCategory.value = category
    console.log(`[RepeatFlowChecker] TableActions button clicked with category: ${category}`)
    emit('filterCategory', category)
  }
}

const onClickFilterWhyCm = (filtered) => {
  if (!props.isLoading) {
    selectedFiltered.value = filtered
    emit('filteredCategory', filtered)
  }
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
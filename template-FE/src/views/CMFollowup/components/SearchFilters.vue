<template>
  <CCard class="mt-3 mb-3 custom-card">
    <CCardBody>
      <CRow>
        <CCol>
          <CFormLabel for="startDate">Start</CFormLabel>
          <CInputGroup>
            <CInputGroupText id="basic-addon1">
              <Clock size="16" />
            </CInputGroupText>
            <CFormInput 
              id="startDate" 
              type="date" 
              v-model="filterStartDateModel"
              :disabled="loading"
            />
          </CInputGroup>
        </CCol>

        <CCol>
          <CFormLabel for="finishDate">Finish</CFormLabel>
          <CInputGroup>
            <CInputGroupText id="basic-addon2">
              <Clock size="16" />
            </CInputGroupText>
            <CFormInput 
              id="finishDate" 
              type="date" 
              v-model="filterFinishDateModel"
              :disabled="loading"
            />
          </CInputGroup>
        </CCol>

        <CCol class="md-3">
          <CFormLabel for="lineSelect">Line</CFormLabel>
          <Treeselect 
            id="lineSelect"
            v-model="selectedLineModel"
            :options="lineOptions"
            :multiple="false"
            :searchable="true"
            :clearable="true"
            :disabled="loading"
            placeholder="Select line"
          />
        </CCol>

        <CCol class="md-3">
          <CFormLabel for="selectedMachineName">Machine Name</CFormLabel>
          <Treeselect 
            id="selectedMachineName"
            v-model="selectedMachineNameModel"
            :options="machineOptions"
            :multiple="false"
            :searchable="true"
            :clearable="true"
            :disabled="loading"
            placeholder="Select machine"
          />
        </CCol>
      </CRow>

      <CRow class="mt-3 mb-4 g-1 align-items-end">
        <CCol md="10" class="px-1">
          <CFormLabel for="keyword">Search</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <Search size="16" />
            </CInputGroupText>
            <CFormInput
              id="keyword"
              placeholder="Search machine, problem, countermeasure, or PIC"
              v-model="searchKeywordModel"
              :disabled="loading"
            />
          </CInputGroup>
        </CCol>

        <CCol md="1" class="px-1">
          <CFormLabel>Category</CFormLabel>
          <CFormSelect v-model="selectedCategoryModel" :disabled="loading">
            <option value="">All</option>
            <option value="Taskforce">TASKFORCE</option>
            <option value="Thema">Focus Thema Member</option>
          </CFormSelect>
        </CCol>

        <CCol md="1" class="px-1">
          <CFormLabel>Shift</CFormLabel>
          <CFormSelect v-model="selectedShiftModel" :disabled="loading">
            <option value="">All</option>
            <option value="Red">Red Shift</option>
            <option value="White">White Shift</option>
          </CFormSelect>
        </CCol>
      </CRow>

      <hr />

      <CRow class="mt-4 mb-3">
        <CCol sm="2">
          <CButton 
            :disabled="loading" 
            style="width: 100%" 
            color="dark" 
            variant="outline" 
            @click="emit('reset')"
          >
            Reset
          </CButton>
        </CCol>
        <CCol sm="10">
          <CButton 
            :disabled="loading" 
            style="width: 100%" 
            color="primary" 
            @click="emit('search')"
          >
            Search
          </CButton>
        </CCol>
      </CRow>
    </CCardBody>
  </CCard>
</template>

<script setup>
import {
  CRow,
  CCol,
  CCard,
  CCardBody,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormSelect,
  CButton,
} from '@coreui/vue'
import { Clock, Search } from 'lucide-vue-next'
import { computed } from 'vue'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'

const props = defineProps({
  filterStartDate: { type: String, default: '' },
  filterFinishDate: { type: String, default: '' },
  selectedLine: { type: [String, Number], default: '' },
  selectedMachineName: { type: [String, Number], default: '' },
  searchKeyword: { type: String, default: '' },
  selectedCategory: { type: String, default: '' },
  selectedShift: { type: String, default: '' },
  lineOptions: { type: Array, default: () => [] },
  machineOptions: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits([
  'update:filterStartDate',
  'update:filterFinishDate',
  'update:selectedLine',
  'update:selectedMachineName',
  'update:searchKeyword',
  'update:selectedCategory',
  'update:selectedShift',
  'search',
  'reset',
])

const filterStartDateModel = computed({
  get: () => props.filterStartDate,
  set: (value) => emit('update:filterStartDate', value)
})

const filterFinishDateModel = computed({
  get: () => props.filterFinishDate,
  set: (value) => emit('update:filterFinishDate', value)
})

const selectedLineModel = computed({
  get: () => props.selectedLine,
  set: (value) => emit('update:selectedLine', value)
})

const selectedMachineNameModel = computed({
  get: () => props.selectedMachineName,
  set: (value) => emit('update:selectedMachineName', value)
})

const searchKeywordModel = computed({
  get: () => props.searchKeyword,
  set: (value) => emit('update:searchKeyword', value)
})

const selectedCategoryModel = computed({
  get: () => props.selectedCategory,
  set: (value) => emit('update:selectedCategory', value)
})

const selectedShiftModel = computed({
  get: () => props.selectedShift,
  set: (value) => emit('update:selectedShift', value)
})
</script>

<style scoped>
.custom-card {
  border-radius: 12px;
}
</style>

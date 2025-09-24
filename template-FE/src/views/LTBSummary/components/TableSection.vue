<template>
    <div>
        <LegendStatus class="mb-4" />

        <CRow class="mb-3 align-items-center">
        <CCol class="d-flex align-items-center" style="gap: 0.5rem;">
            <CCol class="flex-grow-1">
            <CInputGroup>
                <CInputGroupText id="search-icon">
                <Search size="16" />
                </CInputGroupText>
                <CFormInput 
                :model-value="searchKeyword" 
                @update:model-value="emit('update:searchKeyword', $event)"
                placeholder="Search machine or problem" 
                />
            </CInputGroup>
            </CCol>
            <CFormSelect 
            :model-value="selectedFilter" 
            @update:model-value="emit('update:selectedFilter', $event)"
            style="width: 100px;"
            >
            <option value="">All</option>
            <option value="LTR">LTR</option>
            <option value="SLTR">SLTR</option>
            </CFormSelect>
        </CCol>
        </CRow>

        <CCol class="tableFixHead">
        <CTable bordered hover class="text-center w-100">
            <CTableHead>
            <CTableRow>
                <CTableHeaderCell style="width: 30px;">No</CTableHeaderCell>
                <CTableHeaderCell style="width: 120px;">Date</CTableHeaderCell>
                <CTableHeaderCell style="width: 80px;">Machine</CTableHeaderCell>
                <CTableHeaderCell style="width: 300px;">Problem Description</CTableHeaderCell>
                <CTableHeaderCell style="width: 40px;">Duration</CTableHeaderCell>
                <CTableHeaderCell style="width: 40px;">TL Check</CTableHeaderCell>
                <CTableHeaderCell style="width: 40px;">GL Check</CTableHeaderCell>
                <CTableHeaderCell style="width: 40px;">SH Check</CTableHeaderCell>
                <CTableHeaderCell style="width: 40px;">Mgr Check</CTableHeaderCell>
            </CTableRow>
            </CTableHead>
            <CTableBody>
            <CTableRow v-for="(item, index) in filteredProblems" :key="item.fid || index">
                <CTableDataCell>{{ index + 1 }}</CTableDataCell>
                <CTableDataCell>{{ formatDate(item.fstart_time) }}</CTableDataCell>
                <CTableDataCell>{{ item.fmc_name }}</CTableDataCell>
                <CTableDataCell class="text-left">{{ item.ferror_name }}</CTableDataCell>
                <CTableDataCell>{{ item.fdur }} min</CTableDataCell>
                <CTableDataCell><span :class="['indicator', item.tlCheck]" /></CTableDataCell>
                <CTableDataCell><span :class="['indicator', item.lhCheck]" /></CTableDataCell>
                <CTableDataCell><span :class="['indicator', item.shCheck]" /></CTableDataCell>
                <CTableDataCell><span :class="['indicator', item.dhCheck]" /></CTableDataCell>
            </CTableRow>
            </CTableBody>
        </CTable>
        </CCol>

        <CRow v-if="isLoading" class="text-center mt-3">
        <CCol>
            <CSpinner /> Loading...
        </CCol>
        </CRow>
    </div>
</template>

<script setup>
import {
  CRow,
  CCol,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormSelect,
  CSpinner,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/vue'
import { Search } from 'lucide-vue-next'
import LegendStatus from '@/components/LTBSummary/LegendStatus.vue'

defineProps({
    filteredProblems: {
        type: Array,
        default: () => [],
    },
    searchKeyword: {
        type: String,
        default: '',
    },
    selectedFilter: {
        type: String,
        default: '',
    },
    isLoading: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['update:searchKeyword', 'update:selectedFilter'])

const formatDate = (dateTime) => {
    const date = new Date(dateTime)
    return date.toLocaleString()
}
</script>

<style scoped>
.tableFixHead {
  max-height: 70vh;
  overflow-y: auto;
  width: 100%;
}

.tableFixHead thead th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

.tableFixHead table {
  table-layout: fixed;
}

.tableFixHead th,
.tableFixHead td {
  word-wrap: break-word;
}

.indicator {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin: auto;
}

.indicator.delayed {
  background-color: #e55353;
}

.indicator.approved {
  background-color: #2eb85c;
}

.indicator.commented {
  background-color: #47a0fc;
}
</style>
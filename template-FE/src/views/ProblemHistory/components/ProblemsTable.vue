<template>
  <CRow>
    <CCol>
      <CCard>
        <CCardBody>
          <TableActions
            ref="tableActions"
            @freq="$emit('freq')"
            @ltb="$emit('ltb')"
            @filterCategory="onFilterCategory"
            @download="$emit('download')"
            :problemsData="problems"
          />

          <hr />

          <CRow>
            <CCol class="mb-3">
              <CTable v-if="problems.length" bordered hover responsive>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell scope="col">No</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Machine</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Problem</CTableHeaderCell>
                    <CTableHeaderCell scope="col">PIC</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Line</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Duration</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    <CTableHeaderCell scope="col">LTB Reports</CTableHeaderCell>

                    <!-- <CTableHeaderCell scope="col">Terjadi</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Lama</CTableHeaderCell>
                    <CTableHeaderCell scope="col">CM</CTableHeaderCell>
                    <CTableHeaderCell scope="col">CM Lama</CTableHeaderCell> -->

                  </CTableRow>
                </CTableHead>
                <CTableBody>
                <CTableRow
                  v-for="(problem, index) in problems"
                  :key="problem.fid"
                  :color="getRowColor(problem)"
                >
                    <CTableDataCell>{{
                      (currentPage - 1) * pageSize + index + 1
                    }}</CTableDataCell>
                    <CTableDataCell>{{
                      formatDate(problem.fend_time)
                    }}</CTableDataCell>
                    <CTableDataCell>{{
                      problem.fmc_name || ''
                    }}</CTableDataCell>
                    <CTableDataCell>{{
                      problem.ferror_name || ''
                    }}</CTableDataCell>
                    <CTableDataCell>{{
                      problem.foperator || ''
                    }}</CTableDataCell>
                    <CTableDataCell>{{ problem.fline }}</CTableDataCell>
                    <CTableDataCell>{{ problem.fdur || '' }}</CTableDataCell>
                    <CTableDataCell style="width: 10%;">
                      <CButton
                        class="mb-3"
                        shape="rounded-pill"
                        color="success"
                        style="
                          font-size: x-small;
                          font-weight: bold;
                          color: white;
                        "
                        @click="$emit('editProblem', problem)"
                      >
                        Edit Problem
                      </CButton>
                    </CTableDataCell>
                    <CTableDataCell style="width: 15%;">
                      <CButton
                        v-if="!problem.file_report && (isLtrProblem(problem) || isSltrProblem(problem))"
                        class="mb-3"
                        shape="rounded-pill"
                        color="primary"
                        style="
                          width: 100%;
                          font-size: x-small;
                          font-weight: bold;
                          color: white;
                        "
                      >
                        Belum Upload Report
                      </CButton>
                      <CButton
                        v-if="problem.file_report && (isLtrProblem(problem) || isSltrProblem(problem))"
                        class="mb-3"
                        shape="rounded-pill"
                        color="info"
                        style="
                          width: 100%;
                          font-size: x-small;
                          font-weight: bold;
                          color: white;
                        "
                        @click="$emit('viewLtbReport', problem)"
                      >
                        View LTB Report
                      </CButton>
                    </CTableDataCell>

                    <!-- <CTableDataCell>{{ problem.terjadiAnalysis || '' }}</CTableDataCell>
                    <CTableDataCell>{{ problem.lamaAnalysis || '' }}</CTableDataCell>
                    <CTableDataCell>{{ problem.fpermanet_cm || '' }}</CTableDataCell>
                    <CTableDataCell>{{ problem.fpermanet_cm_lama || '' }}</CTableDataCell> -->
                    
                  </CTableRow>
                </CTableBody>
              </CTable>

              <LoadingState v-else :loading="loading" />

              <PaginationControls
                :currentPage="currentPage"
                :totalPages="totalPages"
                :visiblePages="visiblePages"
                @goToPage="$emit('goToPage', $event)"
              />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script setup>
import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CButton,
} from '@coreui/vue'
import TableActions from './TableActions.vue'
import LoadingState from './LoadingState.vue'
import PaginationControls from './PaginationControls.vue'

defineProps({
  problems: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 50,
  },
  totalPages: {
    type: Number,
    default: 0,
  },
  visiblePages: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits([
  'editProblem',
  'viewLtbReport',
  'goToPage',
  'freq',
  'ltb',
  'download',
  'repeat',
  'ltr',
  'filterCategory',
  'filteredCategory',
])

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

const onFilterCategory = (category) => {
  console.log(`ProblemsTable emitted filterCategory with category: ${category}`)
  emit('filterCategory', category)
}

const onFilterCategoryWhycm = (filtered) => {
  emit('filteredCategory', filtered)
}

const getRowColor = (problem) => {
  const analysisArray = Array.isArray(problem.terjadiAnalysis) ? problem.terjadiAnalysis : []
  const hasTerjadi = analysisArray.some(item => item.id_problem === problem.fid)
  const analysisArrayLama = Array.isArray(problem.lamaAnalysis) ? problem.lamaAnalysis : []
  const hasLama = analysisArrayLama.some(item => item.id_problem === problem.fid)
  if (!hasTerjadi && !hasLama) {
    console.log('Row color: danger (Five Why missing)')
    return 'danger'
  }

  if (
    (problem.fpermanet_cm != '[]' && problem.fpermanet_cm.length !== 0) || 
    (problem.fpermanet_cm_lama != '[]' && problem.fpermanet_cm_lama.length !== 0)) {
    return ''
  }
  return 'warning'
}

const isLtrProblem = (problem) => {
  const duration = parseInt(problem.fdur) || 0
  const lineId = parseInt(problem.line_id) || 0
  
  return (
    (problem.problemCategory == 3) || ((duration >= 120 && duration < 659) && (lineId === 1 || lineId === 2)) ||
    ((duration >= 120 && duration < 359) && [3, 4, 5, 6].includes(lineId)) ||
    (duration >= 15 && duration < 179 && lineId === 7)
  )
}

const isSltrProblem = (problem) => {
  const duration = parseInt(problem.fdur) || 0
  const lineId = parseInt(problem.line_id) || 0
  
  return (
    (problem.problemCategory == 4) || (duration >= 659 && (lineId === 1 || lineId === 2)) ||
    (duration >= 359 && [3, 4, 5, 6].includes(lineId)) ||
    (duration >= 179 && lineId === 7)
  )
}
</script>
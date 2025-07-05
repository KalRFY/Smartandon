<!-- ProblemsTable.vue -->
<template>
  <CRow>
    <CCol>
      <CCard>
        <CCardHeader>Table History</CCardHeader>
        <CCardBody>
          <TableActions
            @freq="$emit('freq')"
            @ltb="$emit('ltb')"
            @download="$emit('download')"
          />

          <hr />

          <CRow>
            <CCol class="mb-3">
              <CTable v-if="problems.length" bordered hover responsive>
                <CTableHead>
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
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow
                    v-for="(problem, index) in problems"
                    :key="problem.fid"
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
                    <CTableDataCell>
                      <CButton
                        class="mb-3"
                        shape="rounded-pill"
                        color="success"
                        style="
                          font-size: small;
                          font-weight: bold;
                          color: white;
                        "
                        @click="$emit('editProblem', problem)"
                      >
                        Edit Problem
                      </CButton>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        class="mb-3"
                        shape="rounded-pill"
                        color="info"
                        style="
                          font-size: small;
                          font-weight: bold;
                          color: white;
                        "
                        @click="$emit('viewLtbReport', problem)"
                      >
                        View LTB Report
                      </CButton>
                    </CTableDataCell>
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

<script>
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

export default {
  name: 'ProblemsTable',
  components: {
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
    TableActions,
    LoadingState,
    PaginationControls,
  },

  props: {
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
  },

  emits: [
    'editProblem',
    'viewLtbReport',
    'goToPage',
    'freq',
    'ltb',
    'download',
  ],

  methods: {
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      return `${year}-${month}-${day}`
    },
  },
}
</script>

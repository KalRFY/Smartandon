<template>
  <CContainer fluid class="mt-4 mb-4">
    <CRow>
      <CCol>
        <h3>LTB Report Status</h3>
        <p>Problem (≥ 120 min, ASSY LINE ≥ 15 min)</p>
      </CCol>
    </CRow>

    <CCard class="mt-3 custom-card">
      <CCardHeader class="d-flex justify-content-between align-items-center custom-card">
        <!-- Tabs -->
        <CNav variant="tabs">
          <CNavItem>
            <CNavLink :active="currentTab === 0" @click="currentTab = 0">
              Table Summary
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink :active="currentTab === 1" @click="currentTab = 1">
              Graph Summary
            </CNavLink>
          </CNavItem>
        </CNav>
        <CFormSelect v-if="currentTab === 1 && yearOptions.length" v-model="selectedYear" class="w-auto">
          <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
        </CFormSelect>
      </CCardHeader>
    </CCard>

    <CCard class="mt-3 custom-card">
      <CCardBody>
        <CRow v-show="currentTab === 0">
          <CCol>
            <LegendStatus class="mb-3" />

            <CInputGroup class="mb-3">
              <CInputGroupText>Name</CInputGroupText>
              <CFormInput v-model="findDescription" placeholder="Search Problem" />
            </CInputGroup>

            <CCol class="tableFixHead">
              <CTable bordered hover class="text-center w-100">
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">No</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Mesin</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Problem Description</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Duration</CTableHeaderCell>
                    <CTableHeaderCell scope="col">TL Check</CTableHeaderCell>
                    <CTableHeaderCell scope="col">GL Check</CTableHeaderCell>
                    <CTableHeaderCell scope="col">SH Check</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Mgr Check</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow v-for="(item, i) in filteredProblems" :key="item.fid || i">
                    <CTableDataCell>{{ i + 1 }}</CTableDataCell>
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
          </CCol>
        </CRow>

        <CRow v-show="currentTab === 1">
          <CCol>
            <BarChart :data="yearlyGraphData" :options="graphOptions" />
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  </CContainer>
</template>

<script>
import {
  CContainer, CRow, CCol, CCard, CCardHeader, CCardBody,
  CNav, CNavItem, CNavLink, CFormSelect,
  CInputGroup, CInputGroupText, CFormInput, CSpinner,
  CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell
} from '@coreui/vue'
import LegendStatus from '@/components/LegendStatus.vue'
import BarChart from '@/components/BarChart.vue'
import axios from 'axios'

const monthNames = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

export default {
  name: 'LTBSummary',
  components: {
    CContainer, CRow, CCol, CCard, CCardHeader, CCardBody,
    CNav, CNavItem, CNavLink, CFormSelect,
    CInputGroup, CInputGroupText, CFormInput, CSpinner,
    CTable, CTableHead, CTableBody, CTableRow, CTableHeaderCell, CTableDataCell,
    LegendStatus, BarChart
  },
  data() {
    return {
      problems: [],
      findDescription: '',
      isLoading: false,
      currentTab: 0,
      selectedYear: null,
      graphData: { labels: [], datasets: [] },
      graphOptions: { responsive: true, scales: { yAxes: [{ ticks: { beginAtZero: true }, scaleLabel: { display: true, labelString: 'Total LTB' } }], xAxes: [{ scaleLabel: { display: true, labelString: 'Bulan' } }] } }
    }
  },
  computed: {
    filteredProblems() {
      if (!this.findDescription) return this.problems
      const key = this.findDescription.toLowerCase().trim()
      return this.problems.filter(p => p.ferror_name.toLowerCase().includes(key))
    },
    yearOptions() {
      return Array.from(new Set(this.problems.map(p => new Date(p.fstart_time).getFullYear()))).sort((a, b) => b - a)
    },
    yearlyGraphData() {
      if (!this.selectedYear) return this.graphData;

      const counts = {};
      this.problems
        .filter(p => new Date(p.fstart_time).getFullYear() === +this.selectedYear)
        .forEach(p => {
          const d = new Date(p.fstart_time);
          const month = d.getMonth();
          counts[month] = (counts[month] || 0) + 1;
        });

      const labels = monthNames;
      const data = Array.from({ length: 12 }, (_, i) => counts[i] || 0);

      return {
        labels,
        datasets: [{
          label: `Total LTB ${this.selectedYear}`,
          backgroundColor: '#5954f7',
          data
        }]
      };
    }
  },
  methods: {
    async fetchData() {
      this.isLoading = true
      try {
        const res = await axios.get(`${process.env.VUE_APP_HOST}/api/summary/ltb-summary`)
        const raw = res.data.data.delayProblems
        const arr = Array.isArray(raw[0]) ? raw[0] : raw
        this.problems = arr.map(item => ({
          ...item,
          tlCheck: this.getClass(item.cmTlApprove, item.cmTlFeedback),
          lhCheck: this.getClass(item.cmLhApprove, item.cmLhFeedback),
          shCheck: this.getClass(item.cmShApprove, item.cmShFeedback),
          dhCheck: this.getClass(+item.cmDhApprove, item.cmDhFeedback)
        }))
        const counts = {}
        this.problems.forEach(p => {
          const d = new Date(p.fstart_time)
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
          counts[key] = (counts[key] || 0) + 1
        })
        const labels = Object.keys(counts).sort()
        this.graphData = { labels, datasets: [{ label: 'Total LTB', backgroundColor: '#5954f7', data: labels.map(l => counts[l]) }] }
        if (this.yearOptions.length) this.selectedYear = this.yearOptions[0]
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },
    getClass(state, feedback) {
      if (state === 1) return 'approved'
      if (feedback) return 'commented'
      return 'delayed'
    },
    formatDate(dt) {
      return new Date(dt).toLocaleString()
    }
  },
  mounted() { this.fetchData() }
}
</script>

<style scoped>
.custom-card {
  border-radius: 12px;
}

.card-header {
  background: none !important;
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

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

:deep(.nav-link) {
  cursor: pointer;
}
</style>

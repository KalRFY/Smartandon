<template>
  <CContainer fluid class="mt-4 mb-4">
    <CRow>
      <CCol>
        <h3>LTB Report Status</h3>
        <p>Problem (≥ 120 min, ASSY LINE ≥ 15 min)</p>
      </CCol>
    </CRow>

    <CCard class="mt-3 custom-card">
      <CCardBody class="d-flex justify-content-between align-items-center custom-card p-2">
        <CNav variant="tabs">
          <CNavItem>
            <CNavLink :active="currentTab === 0" @click="selectTab(0)">
              Table Summary
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink :active="currentTab === 1" @click="selectTab(1)">
              Graph Summary
            </CNavLink>
          </CNavItem>
        </CNav>
        <CFormSelect v-if="showYearSelect" v-model="selectedYear" class="w-auto">
          <option v-for="year in yearOptions" :key="year" :value="year">
            {{ year }}
          </option>
        </CFormSelect>
      </CCardBody>
    </CCard>

    <CCard class="mt-3 custom-card">
      <CCardBody>
        <CRow v-show="currentTab === 0">
          <CCol>
            <LegendStatus class="mb-4" />

            <CRow class="mb-3 align-items-center">
              <CCol class="d-flex align-items-center" style="gap: 0.5rem;">
                <CCol class="flex-grow-1">
                  <CInputGroup>
                    <CInputGroupText id="search-icon">
                      <Search size="16" />
                    </CInputGroupText>
                    <CFormInput v-model="searchKeyword" placeholder="Search machine or problem" />
                  </CInputGroup>
                </CCol>
                <CFormSelect v-model="selectedFilter" style="width: 100px;">
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
          </CCol>
        </CRow>

        <CRow v-show="currentTab === 1">
          <CCol>
            <BarChart :data="yearlyGraphData" :options="chartOptions" />
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  </CContainer>
</template>

<script>
import axios from 'axios'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CNav,
  CNavItem,
  CNavLink,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CSpinner,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell
} from '@coreui/vue'
import { Search } from 'lucide-vue-next'
import LegendStatus from '@/components/LTBSummary/LegendStatus.vue'
import BarChart from '@/components/BarChart.vue'

const LINE_MAP = {
  hpdc: 'casting',
  cnc: 'machining',
  assy: 'assy'
}

export default {
  name: 'LTBSummary',
  components: {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CNav,
    CNavItem,
    CNavLink,
    CFormSelect,
    CInputGroup,
    CInputGroupText,
    CFormInput,
    CSpinner,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    LegendStatus,
    BarChart,
    Search,
  },
  data() {
    return {
      problems: [],
      searchKeyword: '',
      selectedFilter: '',
      isLoading: false,
      currentTab: 0,
      selectedYear: null,
      graphData: {
        labels: [],
        datasets: []
      },
      chartOptions: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'LTB Total'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Month'
            }
          }
        }
      }
    }
  },
  computed: {
    filteredProblems() {
      let list = this.problems

      if (this.searchKeyword) {
        const keyword = this.searchKeyword.toLowerCase().trim()
        list = list.filter(item => {
          const machineName = (item.fmc_name || '').toLowerCase()
          const problemName = (item.ferror_name || '').toLowerCase()
          return machineName.includes(keyword) || problemName.includes(keyword)
        })
      }
      if (this.selectedFilter === 'LTR') {
        list = list.filter(item => {
          const lineKey = (item.fline || '').trim().toLowerCase()
          const group = LINE_MAP[lineKey] || ''
          const duration = Number(item.fdur)
          if (group === 'casting' && duration >= 120 && duration <= 659) {
            return true
          }
          if (group === 'machining' && duration >= 120 && duration <= 359) {
            return true
          }
          if (group === 'assy' && duration >= 15 && duration <= 179) {
            return true
          }
          return false
        })
      } else if (this.selectedFilter === 'SLTR') {
        list = list.filter(item => {
          const lineKey = (item.fline || '').trim().toLowerCase()
          const group = LINE_MAP[lineKey] || ''
          const duration = Number(item.fdur)
          if (group === 'casting' && duration > 659) {
            return true
          }
          if (group === 'machining' && duration > 359) {
            return true
          }
          if (group === 'assy' && duration > 179) {
            return true
          }
          return false
        })
      }
      return list
    },
    yearOptions() {
      const years = this.problems.map(item => new Date(item.fstart_time).getFullYear())
      const uniqueYears = Array.from(new Set(years))
      uniqueYears.sort((a, b) => b - a)
      return uniqueYears
    },
    showYearSelect() {
      return this.currentTab === 1 && this.yearOptions.length > 0
    },
    yearlyGraphData() {
      if (!this.selectedYear) {
        return this.graphData
      }
      const monthlyCounts = {}
      this.problems.forEach(item => {
        const date = new Date(item.fstart_time)
        const year = date.getFullYear()
        const month = date.getMonth()
        if (year === Number(this.selectedYear)) {
          if (!monthlyCounts[month]) {
            monthlyCounts[month] = 0
          }
          monthlyCounts[month] += 1
        }
      })
      const monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const monthlyData = monthLabels.map((_, index) => monthlyCounts[index] || 0)
      return {
        labels: monthLabels,
        datasets: [{ label: 'LTB Total in ' + this.selectedYear, backgroundColor: '#5954f7', data: monthlyData }]
      }
    }
  },
  methods: {
    selectTab(tabIndex) {
      this.currentTab = tabIndex
    },
    formatDate(dateTime) {
      const date = new Date(dateTime)
      return date.toLocaleString()
    },
    getClass(approveState, feedback) {
      if (approveState === 1) {
        return 'approved'
      } else if (feedback) {
        return 'commented'
      } else {
        return 'delayed'
      }
    },
    getTlIndicator(item) {
      const hasPermanentCM = item.fpermanet_cm !== null
      const hasOldPermanentCM = item.fpermanet_cm_lama !== null
      if (hasPermanentCM || hasOldPermanentCM) {
        return 'approved'
      } else {
        return 'delayed'
      }
    },
    prepareProblems(raw) {
      return raw.map(item => {
        const processedItem = {
          ...item,
          tlCheck: this.getTlIndicator(item),
          lhCheck: this.getClass(Number(item.cmLhApprove), item.cmLhFeedback),
          shCheck: this.getClass(Number(item.cmShApprove), item.cmShFeedback),
          dhCheck: this.getClass(Number(item.cmDhApprove), item.cmDhFeedback)
        }
        return processedItem
      })
    },
    prepareGraphData(list) {
      const counts = {}
      list.forEach(item => {
        const date = new Date(item.fstart_time)
        const key = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0')
        if (!counts[key]) {
          counts[key] = 0
        }
        counts[key] += 1
      })
      const sortedKeys = Object.keys(counts).sort()
      return { labels: sortedKeys, datasets: [{ label: 'Total LTB', backgroundColor: '#5954f7', data: sortedKeys.map(key => counts[key]) }] }
    },
    async fetchData() {
      this.isLoading = true
      try {
        const response = await axios.get(process.env.VUE_APP_HOST + '/api/summary/ltb-summary')
        let raw = response.data.data.delayProblems
        raw = Array.isArray(raw[0]) ? raw[0] : raw
        console.log('▶️ RAW SAMPLE:', raw[0])
        this.problems = this.prepareProblems(raw)
        this.graphData = this.prepareGraphData(this.problems)
        if (this.yearOptions.length > 0) {
          this.selectedYear = this.yearOptions[0]
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    }
  },
  watch: {
    selectedFilter(newValue) {
      console.log('Selected Filter changed to:', newValue)
    }
  },
  mounted() {
    this.fetchData()
  }
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

:deep(.nav-link) {
  cursor: pointer;
}
</style>
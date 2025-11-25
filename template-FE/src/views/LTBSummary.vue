<template>
  <CRow>
    <CCol>
      <h3>LTB Report Status</h3>
      <p>Problem (≥ 120 min, ASSY LINE ≥ 15 min)</p>
    </CCol>
  </CRow>

  <CCard class="mb-3 custom-card">
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

  <CCard class="mb-3 custom-card">
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
              <CButton v-if="monthlyDetails.length > 0" color="secondary" @click="clearMonthlyFilter" size="sm">
                Clear Filter
              </CButton>
            </CCol>
          </CRow>

          <CCol class="tableFixHead">
            <CTable bordered hover class="text-center w-100">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>No</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Machine</CTableHeaderCell>
                  <CTableHeaderCell>Problem Description</CTableHeaderCell>
                  <CTableHeaderCell>Duration</CTableHeaderCell>
                  <CTableHeaderCell>TL Check</CTableHeaderCell>
                  <CTableHeaderCell>GL Check</CTableHeaderCell>
                  <CTableHeaderCell>SH Check</CTableHeaderCell>
                  <CTableHeaderCell>Mgr Check</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="(item, index) in (monthlyDetails.length > 0 ? monthlyDetails : filteredProblems)" :key="item.fid || index">
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
          <div style="border-radius: 9px; height: 100%; box-shadow: 5px 5px 5px rgba(0,0,0,0.2); background-color: transparent;">
            <CCardBody>
              <CRow class="mb-3">
                <CCol>
                  <CCardTitle style="font-size: medium; height: 35px; color: black;">LTB Summary Chart</CCardTitle>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <ApexCharts
                    :key="selectedYear + '_chart'"
                    :options="chartOptions"
                    :series="chartSeries"
                    type="bar"
                    height="350"
                  />
                </CCol>
              </CRow>

              <!-- Monthly Details Table -->
              <CRow class="mt-4">
                <CCol>
                  <CCard>
                    <CCardHeader>
                      <strong>{{ selectedMonthName ? `Details for ${selectedMonthName} ${selectedYear}` : 'Monthly Details' }}</strong>
                      <CButton v-if="selectedMonthName" color="secondary" size="sm" @click="clearMonthlyFilter" class="float-end">
                        Clear
                      </CButton>
                    </CCardHeader>
                    <CCardBody>
                      <div v-if="monthlyDetails.length > 0">
                        <CTable bordered hover responsive>
                          <CTableHead>
                            <CTableRow>
                              <CTableHeaderCell>No</CTableHeaderCell>
                              <CTableHeaderCell>Date</CTableHeaderCell>
                              <CTableHeaderCell>Machine</CTableHeaderCell>
                              <CTableHeaderCell>Problem Description</CTableHeaderCell>
                              <CTableHeaderCell>Duration</CTableHeaderCell>
                              <CTableHeaderCell>TL Check</CTableHeaderCell>
                              <CTableHeaderCell>GL Check</CTableHeaderCell>
                              <CTableHeaderCell>SH Check</CTableHeaderCell>
                              <CTableHeaderCell>Mgr Check</CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>
                            <CTableRow v-for="(item, index) in monthlyDetails" :key="item.fid || index">
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
                      </div>
                      <div v-else class="text-center">
                        {{ selectedMonthName ? 'No data available for this month.' : 'Click on a bar in the chart to view monthly details.' }}
                      </div>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CCardBody>
          </div>
        </CCol>
      </CRow>
    </CCardBody>
  </CCard>
</template>

<script>
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
import api from '@/apis/CommonAPI'
import ApexCharts from 'vue3-apexcharts'

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
    ApexCharts,
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
      showMonthlyModal: false,
      monthlyDetails: [],
      selectedMonthName: '',
      graphData: {
        labels: [],
        datasets: []
      },
      chartOptions: {
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            show: true
          },
          events: {
            dataPointSelection: (event, chartContext, config) => {
              const monthIndex = config.dataPointIndex;
              this.showMonthlyDetails(monthIndex);
            }
          }
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [0]
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          title: {
            text: 'Month'
          }
        },
        yaxis: {
          title: {
            text: 'LTB Total'
          },
          min: 0
        },
        fill: {
          opacity: 1
        },
        colors: ['#007bff'],
        title: {
          align: 'left',
          style: {
            fontSize: '16px',
            color: '#666'
          }
        }
      },
      chartSeries: [{
        name: 'LTB Total',
        data: []
      }]
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
      // Remove manual filtering since data is now fetched from API with proper filtering
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
      const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const monthlyData = monthLabels.map((_, index) => monthlyCounts[index] || 0)

      return {
        labels: monthLabels,
        datasets: [{ label: 'LTB Total in ' + this.selectedYear, backgroundColor: '#007bff', data: monthlyData }]
      }
    }
  },
  methods: {
    selectTab(tabIndex) {
      this.currentTab = tabIndex
    },
    formatDate(dateTime) {
      const date = new Date(dateTime)
      if (isNaN(date)) return dateTime
      // Format to show only year, month, day
      return date.toLocaleDateString('en-CA') // Format: YYYY-MM-DD
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
    getTlIndicator(fpermanet_cm, fpermanet_cm_lama) {
      const isNonEmpty = (value) => {
        if (Array.isArray(value)) {
          return value.length > 0
        } else if (typeof value === 'string') {
          const trimmed = value.trim()
          if (trimmed === '' || trimmed === '[]') {
            return false
          }
          return true
        }
        return false
      }
      if (isNonEmpty(fpermanet_cm) || isNonEmpty(fpermanet_cm_lama)) {
        return 'approved'
      } else {
        return 'delayed'
      }
    },
    prepareProblems(raw) {
      return raw.map(item => {
        const processedItem = {
          ...item,
          tlCheck: this.getTlIndicator(item.fpermanet_cm, item.fpermanet_cm_lama),
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
      return { labels: sortedKeys, datasets: [{ label: 'Total LTB', backgroundColor: '#007bff', data: sortedKeys.map(key => counts[key]) }] }
    },
    async fetchData() {
      this.isLoading = true
      try {
        const response = await api.get('/summary/ltb-summary')
        if (response.status !== 200) {
          throw new Error('Failed to fetch LTB summary, status: ' + response.status)
        }
        let raw = response.data.data.delayProblems
        raw = Array.isArray(raw[0]) ? raw[0] : raw
        console.log('▶️ RAW SAMPLE:', raw[0])
        console.log('📋 Total problems loaded:', raw.length)
        console.log('📅 Available years:', this.yearOptions)

        this.problems = this.prepareProblems(raw)
        this.graphData = this.prepareGraphData(this.problems)

        console.log('✅ Problems processed:', this.problems.length)
        console.log('📊 Graph data prepared:', this.graphData)

        if (this.yearOptions.length > 0) {
          this.selectedYear = this.yearOptions[0]
          console.log('🎯 Selected year set to:', this.selectedYear)
        }
        // Initialize chart series with empty data
        this.updateChartSeries()
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    async fetchFilteredData(type) {
      this.isLoading = true
      try {
        const response = await api.get(`/summary/ltr-sltr-summary?type=${type}`)
        if (response.status !== 200) {
          throw new Error('Failed to fetch filtered LTB summary, status: ' + response.status)
        }
        let raw = response.data.data.delayProblems
        raw = Array.isArray(raw[0]) ? raw[0] : raw
        console.log(`▶️ RAW SAMPLE for ${type}:`, raw[0])
        console.log(`📋 Total ${type} problems loaded:`, raw.length)

        this.problems = this.prepareProblems(raw)
        this.graphData = this.prepareGraphData(this.problems)

        console.log(`✅ ${type} Problems processed:`, this.problems.length)
        console.log('📊 Graph data prepared:', this.graphData)

        if (this.yearOptions.length > 0) {
          this.selectedYear = this.yearOptions[0]
          console.log('🎯 Selected year set to:', this.selectedYear)
        }
        // Initialize chart series with empty data
        this.updateChartSeries()
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    updateChartSeries() {
      if (!this.selectedYear) {
        this.chartSeries[0].data = new Array(12).fill(0)
        return
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

      const monthlyData = Array.from({ length: 12 }, (_, index) => monthlyCounts[index] || 0)
      this.chartSeries[0].data = monthlyData

      console.log('📊 Chart series updated:', {
        selectedYear: this.selectedYear,
        monthlyData: monthlyData,
        chartSeries: this.chartSeries[0].data
      })
    },
    showMonthlyDetails(monthIndex) {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      this.selectedMonthName = monthNames[monthIndex];
      const year = this.selectedYear;

      // Filter problems for the selected month and year
      this.monthlyDetails = this.problems.filter(item => {
        const date = new Date(item.fstart_time);
        return date.getFullYear() === Number(year) && date.getMonth() === monthIndex;
      });

      console.log(`Showing details for ${this.selectedMonthName} ${year}:`, this.monthlyDetails.length, 'problems');
    },
    clearMonthlyFilter() {
      this.monthlyDetails = [];
      this.selectedMonthName = '';
    }
  },
  watch: {
    selectedFilter(newValue) {
      console.log('Selected Filter changed to:', newValue)
    },
    selectedYear() {
      console.log('Selected year changed to:', this.selectedYear)
      this.updateChartSeries()
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

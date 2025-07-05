<template>
  <CContainer fluid class="mt-4">
    <CRow>
      <CCol>
        <h3>LTB Report Status</h3>
        <p>Problem (>= 120 min)</p>
      </CCol>
    </CRow>

    <CCard class="mt-2 mb-3 custom-card">
      <!-- Tab navigation in header -->
      <CCardHeader class="d-flex justify-content-between align-items-center">
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
        <!-- Year selector visible only on Graph tab -->
        <CFormSelect v-if="currentTab === 1 && yearOptions.length" v-model="selectedYear" class="w-auto ml-3">
          <option v-for="year in yearOptions" :key="year" :value="year">
            {{ year }}
          </option>
        </CFormSelect>
      </CCardHeader>

      <CCardBody>
        <!-- Table Pane -->
        <div v-show="currentTab === 0">
          <CRow class="px-3">
            <CCol xs="12">
              <LegendStatus class="d-flex justify-content-between align-items-center w-100 mb-2" />
              <CInputGroup size="lg" class="mt-3 w-100">
                <CInputGroupText>Name</CInputGroupText>
                <CFormInput placeholder="Filter TL/GL" v-model="findLeader" />
              </CInputGroup>

              <div class="tableFixHead mt-3 w-100 custom-table">
                <table class="table table-bordered w-100 mb-0">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Date</th>
                      <th>Mesin</th>
                      <th>Problem Description</th>
                      <th>Duration</th>
                      <th>TL Check</th>
                      <th>GL Check</th>
                      <th>SH Check</th>
                      <th>Mgr Check</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in visibleProblems" :key="item.fid || i">
                      <td>{{ i + 1 }}</td>
                      <td>{{ formatDate(item.fstart_time) }}</td>
                      <td>{{ item.fmc_name }}</td>
                      <td class="text-left">{{ item.ferror_name }}</td>
                      <td>{{ item.fdur }} min</td>
                      <td><span :class="['indicator', item.tlCheck]" /></td>
                      <td><span :class="['indicator', item.lhCheck]" /></td>
                      <td><span :class="['indicator', item.shCheck]" /></td>
                      <td><span :class="['indicator', item.dhCheck]" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-if="isLoading" class="text-center p-3">
                <CSpinner /> Loading...
              </div>
            </CCol>
          </CRow>
        </div>

        <!-- Graph Pane -->
        <div v-show="currentTab === 1">
          <BarChart :data="yearlyGraphData" :options="graphOptions" />
        </div>
      </CCardBody>
    </CCard>
  </CContainer>
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
} from '@coreui/vue'
import LegendStatus from '@/components/LegendStatus.vue'
import BarChart from '@/components/BarChart.vue'
import axios from 'axios'

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
    LegendStatus,
    BarChart,
  },
  data() {
    return {
      problems: [],
      findLeader: '',
      isLoading: false,
      currentTab: 0,
      selectedYear: null,
      graphData: { labels: [], datasets: [] },
      graphOptions: {
        responsive: true,
        legend: { display: false },
        scales: {
          yAxes: [{ ticks: { beginAtZero: true }, scaleLabel: { display: true, labelString: 'Total LTB' } }],
          xAxes: [{ scaleLabel: { display: true, labelString: 'Bulan' } }],
        },
      },
    }
  },
  computed: {
    visibleProblems() {
      if (!this.findLeader) return this.problems
      const key = this.findLeader.trim().toLowerCase()
      return this.problems.filter(item =>
        (item.tlName || '').toLowerCase().includes(key) ||
        (item.glName || '').toLowerCase().includes(key)
      )
    },
    yearOptions() {
      return this.problems
        .map(p => new Date(p.fstart_time).getFullYear())
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort((a, b) => b - a)
    },
    yearlyGraphData() {
      if (!this.selectedYear) return this.graphData
      const counts = {}
      this.problems
        .filter(p => new Date(p.fstart_time).getFullYear() === +this.selectedYear)
        .forEach(p => {
          const d = new Date(p.fstart_time)
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
          counts[key] = (counts[key] || 0) + 1
        })
      const labels = Object.keys(counts).sort()
      const dataSet = labels.map(l => counts[l])
      return {
        labels,
        datasets: [
          { label: `Total LTB in ${this.selectedYear}`, backgroundColor: '#5954f7', data: dataSet }
        ],
      }
    },
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
          tlName: item.tlName || '',
          glName: item.glName || '',
          tlCheck: this.getClass(item.cmTlApprove, 0, item.fstart_time, item.cmTlFeedback),
          lhCheck: this.getClass(item.cmLhApprove, 1, item.fstart_time, item.cmLhFeedback),
          shCheck: this.getClass(item.cmShApprove, 2, item.fstart_time, item.cmShFeedback),
          dhCheck: this.getClass(+item.cmDhApprove, 3, item.fstart_time, item.cmDhFeedback),
        }))

        // build all-years graph
        const counts = {}
        this.problems.forEach(p => {
          const d = new Date(p.fstart_time)
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
          counts[key] = (counts[key] || 0) + 1
        })
        const labels = Object.keys(counts).sort()
        const dataSet = labels.map(l => counts[l])
        this.graphData = {
          labels,
          datasets: [{ label: 'Total LTB', backgroundColor: '#5954f7', data: dataSet }],
        }

        if (this.yearOptions.length) {
          this.selectedYear = this.yearOptions[0]
        }
      } catch (e) {
        console.error('LTB fetch error', e)
      } finally {
        this.isLoading = false
      }
    },
    getClass(state, delay = 0, start, feedback) {
      if (state === 1) return 'approved'
      if (feedback) return 'commented'
      if (delay && start) {
        const days = (Date.now() - new Date(start).getTime()) / (1000 * 3600 * 24)
        if (days >= delay) return 'delayed'
      }
      return 'pending'
    },
    formatDate(dt) {
      return new Date(dt).toLocaleString()
    },
  },
  mounted() {
    this.fetchData()
  },
}
</script>

<style scoped>
/* Card background transparent */
.custom-card {
  background-color: transparent !important;
  box-shadow: none !important;
}

/* Remove header/body backgrounds */
.custom-card .card-header,
.custom-card .card-body {
  background-color: transparent !important;
  border: none !important;
}

.custom-table {
  border-radius: 12px;
}

.tableFixHead {
  overflow: auto;
  max-height: 70vh;
}

.tableFixHead thead th {
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

th,
td {
  font-size: 12px;
  text-align: center;
  white-space: nowrap;
}

.indicator {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin: auto;
}

.indicator.pending {
  background-color: #ccc;
}

.indicator.delayed {
  background-color: #e55353;
}

.indicator.approved {
  background-color: #2eb85c;
}

.indicator.commented {
  background-color: #3399ff;
}
</style>

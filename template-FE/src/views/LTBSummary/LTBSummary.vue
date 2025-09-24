<template>
  <CContainer fluid class="mt-4 mb-4">
    <PageHeader 
      title="LTB Report Status"
      description="Problem (≥ 120 min, ASSY LINE ≥ 15 min)"
    />

    <TabNavigation
      :active-tab="currentTab"
      :show-year-select="showYearSelect"
      v-model:selected-year="selectedYear"
      :year-options="yearOptions"
      @tab-change="selectTab"
    />

    <CCard class="mt-3 custom-card">
      <CCardBody>
        <CRow v-show="currentTab === 0">
          <CCol>
            <TableSection
              :filtered-problems="filteredProblems"
              v-model:search-keyword="searchKeyword"
              v-model:selected-filter="selectedFilter"
              :is-loading="isLoading"
            />
          </CCol>
        </CRow>

        <CRow v-show="currentTab === 1">
          <CCol>
            <GraphSection
              :chart-data="yearlyGraphData"
              :chart-options="chartOptions"
            />
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  </CContainer>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
} from '@coreui/vue'
import PageHeader from './components/PageHeader.vue'
import TabNavigation from './components/TabNavigation.vue'
import TableSection from './components/TableSection.vue'
import GraphSection from './components/GraphSection.vue'
import api from '@/apis/CommonAPI'

const LINE_MAP = {
  hpdc: 'casting',
  cnc: 'machining',
  assy: 'assy'
}

// Reactive data
const problems = ref([])
const searchKeyword = ref('')
const selectedFilter = ref('')
const isLoading = ref(false)
const currentTab = ref(0)
const selectedYear = ref(null)
const graphData = ref({
  labels: [],
  datasets: []
})

const chartOptions = ref({
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
})

const filteredProblems = computed(() => {
  let list = problems.value

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase().trim()
    list = list.filter(item => {
      const machineName = (item.fmc_name || '').toLowerCase()
      const problemName = (item.ferror_name || '').toLowerCase()
      return machineName.includes(keyword) || problemName.includes(keyword)
    })
  }
  
  if (selectedFilter.value === 'LTR') {
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
  } else if (selectedFilter.value === 'SLTR') {
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
})

const yearOptions = computed(() => {
  const years = problems.value.map(item => new Date(item.fstart_time).getFullYear())
  const uniqueYears = Array.from(new Set(years))
  uniqueYears.sort((a, b) => b - a)
  return uniqueYears
})

const showYearSelect = computed(() => {
  return currentTab.value === 1 && yearOptions.value.length > 0
})

const yearlyGraphData = computed(() => {
  if (!selectedYear.value) {
    return graphData.value
  }
  
  const monthlyCounts = {}
  problems.value.forEach(item => {
    const date = new Date(item.fstart_time)
    const year = date.getFullYear()
    const month = date.getMonth()
    if (year === Number(selectedYear.value)) {
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
    datasets: [{ 
      label: 'LTB Total in ' + selectedYear.value, 
      backgroundColor: '#5954f7', 
      data: monthlyData 
    }]
  }
})

const selectTab = (tabIndex) => {
  currentTab.value = tabIndex
}

const getClass = (approveState, feedback) => {
  if (approveState === 1) {
    return 'approved'
  } else if (feedback) {
    return 'commented'
  } else {
    return 'delayed'
  }
}

const getTlIndicator = (item) => {
  const hasPermanentCM = item.fpermanet_cm !== null
  const hasOldPermanentCM = item.fpermanet_cm_lama !== null
  if (hasPermanentCM || hasOldPermanentCM) {
    return 'approved'
  } else {
    return 'delayed'
  }
}

const prepareProblems = (raw) => {
  return raw.map(item => {
    const processedItem = {
      ...item,
      tlCheck: getTlIndicator(item),
      lhCheck: getClass(Number(item.cmLhApprove), item.cmLhFeedback),
      shCheck: getClass(Number(item.cmShApprove), item.cmShFeedback),
      dhCheck: getClass(Number(item.cmDhApprove), item.cmDhFeedback)
    }
    return processedItem
  })
}

const prepareGraphData = (list) => {
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
  return { 
    labels: sortedKeys, 
    datasets: [{ 
      label: 'Total LTB', 
      backgroundColor: '#5954f7', 
      data: sortedKeys.map(key => counts[key]) 
    }] 
  }
}

const fetchData = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/summary/ltb-summary')
    if (response.status !== 200) {
      throw new Error('Failed to fetch LTB summary, status: ' + response.status)
    }
    let raw = response.data.data.delayProblems
    raw = Array.isArray(raw[0]) ? raw[0] : raw
    console.log('▶️ RAW SAMPLE:', raw[0])
    problems.value = prepareProblems(raw)
    graphData.value = prepareGraphData(problems.value)
    if (yearOptions.value.length > 0) {
      selectedYear.value = yearOptions.value[0]
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

watch(selectedFilter, (newValue) => {
  console.log('Selected Filter changed to:', newValue)
})

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.custom-card {
  border-radius: 12px;
}
</style>
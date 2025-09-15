<template>
  <div class="realtime-pareto-container">
    
    <SearchSection
    v-model:startDate="startDate"
    v-model:endDate="endDate"
    v-model:selectedCategory="selectedCategory"
    :avCategories="avCategories"
    :isLoading="isLoading"
    @search="search"
    @selectTimeRange="selectTimeRange"
    />

    <CCard class="pareto-card mb-4">
      <CCardHeader class="text-white">
        <div class="d-flex justify-content-between align-items-center">
          <h3 class="m-0">REALTIME PARETO</h3>
          <div class="d-flex align-items-center">
            <span class="me-3">{{ currentDate }}</span>
            <div class="live-indicator d-flex align-items-center">
              <span class="live-dot"></span>
              <span class="ms-1">{{ currentTime }}</span>
            </div>
          </div>
        </div>
      </CCardHeader>

      <CCardBody>
        <ViewControlSection
        v-model:viewMode="viewMode"
        v-model:metricMode="metricMode"
        :isLoading="isLoading"
        />

        <div v-if="isLoading" class="loading-container">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3">Loading production data...</p>
        </div>

        <div v-else-if="dataLoaded && productionLines.length > 0" class="production-lines">
          <template v-for="(line, index) in productionLines" :key="`line-${index}-${line.title || index}`">
            <ProductionLineSection 
            :title="line.title" 
            :panelId="line.panelId" 
            :chartData="getChartData(line)"
            :tableData="getTableData(line)" 
            :viewMode="viewMode" 
            :metricMode="metricMode"
            :minQuantity="line.minQuantity" 
            @refresh="handleRefresh(line.panelId)" 
            @view-item="viewItem"
            @edit-item="editItem" 
            @delete-item="deleteItem" />
          </template>
        </div>

        <div v-else class="no-data-container">
          <div class="text-center py-5">
            <AlertTriangle size="48" class="text-muted mb-3" />
            <h5 class="text-muted">No Production Data Available</h5>
            <p class="text-muted">
              Please check your connection or try refreshing the page.
            </p>
            <CButton color="primary" @click="fetchAllData" :disabled="isLoading">
              <SearchIcon size="16" class="me-1" /> Retry
            </CButton>
          </div>
        </div>
      </CCardBody>
    </CCard>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
} from '@coreui/vue'
import {
  Search as SearchIcon,
  AlertTriangle,
} from 'lucide-vue-next'
import ProductionLineSection from './components/ProductionLineSection.vue'
import SearchSection from './components/SearchSection.vue'
import api from '@/apis/CommonAPI'
import ViewControlSection from './components/ViewControlSection.vue'

// Date formatting utilities
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDate2 = (date) => {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}

// Initial date setup
const todayStr = (() => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
})()

// Reactive state
const startDate = ref('2019-01-01')
const startDateFetch = ref('2019-01-01')
const endDate = ref(todayStr)
const endDateFetch = ref(todayStr)
const selectedCategory = ref('')
const avCategories = ref([{ value: '', label: 'Select category' }])

const currentTime = ref('')
const currentDate = ref('')
const viewMode = ref('machines')
const metricMode = ref('duration')
const isLoading = ref(true)
const dataLoaded = ref(false)

const productionLines = ref([])
let clockInterval = null

// Update date and time
const updateDateTime = () => {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// Fetch AV categories
const fetchAvCategories = async () => {
  console.log('Fetching AV categories')
  try {
    const response = await api.get('/realtime-pareto/av-category', null)
    if (response.status === 200) {
      avCategories.value = [
        { value: '', label: 'Select category' },
        ...response.data.data.map((item) => ({
          value: item.value,
          label: item.label,
        })),
      ]
    } else {
      throw new Error('Failed to fetch AV categories')
    }
  } catch (err) {
    console.error('Error fetching AV categories:', err)
  }
}

// Fetch all data
const fetchAllData = async () => {
  isLoading.value = true
  dataLoaded.value = false
  productionLines.value = []
  
  let avCategoty = ''
  let fline = ''
  let group = ``
  let order = 'sum(fdur)'
  const state = 'yesterdayDay'
  let startDateParam = ''
  let endDateParam = ''
  
  if (selectedCategory.value) {
    avCategoty = `fav_categoty = '${selectedCategory.value} AND'`
  }
  
  // Set grouping and ordering based on view and metric mode
  group = viewMode.value === 'machines' ? 'fmc_name' : 'ferror_name'
  order = metricMode.value === 'duration' ? 'sum(fdur)' : 'count(fid)'
  
  // Process dates
  if (startDate.value) {
    startDateParam = formatDate2(startDate.value)
  }
  
  if (endDate.value) {
    endDateParam = formatDate2(endDate.value)
  }
  
  let d = new Date(endDateParam)
  let offSetTimeEndDate = d.setDate(d.getDate() + 1)
  let offSetEndDate = formatDate2(new Date(offSetTimeEndDate))

  // Set time range based on state
  if (state == 'yesterdayDay') {
    startDateParam = `${startDateParam} 07:00:00`
    endDateParam = `${endDateParam} 19:59:59`
    startDateFetch.value = startDateParam
    endDateFetch.value = endDateParam
  } else if (state == 'yesterdayNight') {
    startDateParam = `${startDateParam} 20:00:00`
    endDateParam = `${offSetEndDate} 06:59:59`
    startDateFetch.value = startDateParam
    endDateFetch.value = endDateParam
  } else {
    startDateParam = `${startDateParam} 07:00:00`
    endDateParam = `${endDateParam} 06:59:59`
    startDateFetch.value = startDateParam
    endDateFetch.value = endDateParam
  }
  
  try {
    const result = await api.get(
      `/realtime-pareto/realtime-pareto?group=${group}&order=${order}&avCategory=${avCategoty}&fline=${fline}&startDate=${startDateParam}&endDate=${endDateParam}`,
    )
    productionLines.value = result.data.data
    dataLoaded.value = false
    setTimeout(() => {
      dataLoaded.value = true
    }, 200)
  } catch (error) {
    console.error('Error fetching production lines:', error)
  } finally {
    isLoading.value = false
  }
}

// Handle search with time range selection
const selectTimeRange = (range) => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  switch (range) {
    case 'today':
      startDate.value = formatDate(today)
      endDate.value = formatDate(now)
      break
    case 'yesterdayAll':
      startDate.value = formatDate(yesterday)
      endDate.value = formatDate(yesterday)
      break
    case 'yesterdayDay': {
      startDate.value = formatDate(yesterday)
      const yesterdayDay = new Date(yesterday)
      yesterdayDay.setHours(18, 0, 0, 0)
      endDate.value = formatDate(yesterdayDay)
      break
    }
    case 'yesterdayNight': {
      const yesterdayEvening = new Date(yesterday)
      yesterdayEvening.setHours(18, 0, 0, 0)
      startDate.value = formatDate(yesterdayEvening)
      endDate.value = formatDate(yesterday)
      break
    }
    case 'lastNight': {
      const lastNightStart = new Date(yesterday)
      lastNightStart.setHours(18, 0, 0, 0)
      startDate.value = formatDate(lastNightStart)
      const lastNightEnd = new Date(today)
      lastNightEnd.setHours(6, 0, 0, 0)
      endDate.value = formatDate(lastNightEnd)
      break
    }
    case 'thisMonth':
      startDate.value = formatDate(
        new Date(now.getFullYear(), now.getMonth(), 1),
      )
      endDate.value = formatDate(now)
      break
    case 'lastMonth':
      startDate.value = formatDate(
        new Date(now.getFullYear(), now.getMonth() - 1, 1),
      )
      endDate.value = formatDate(
        new Date(now.getFullYear(), now.getMonth(), 0),
      )
      break
  }
  search()
}

// Search action
const search = async () => {
  console.log('Searching with parameters:', {
    startDate: startDate.value,
    endDate: endDate.value,
    category: selectedCategory.value,
  })
  await fetchAllData()
}

// Computed props for chart and table data
const getChartData = (line) => {
  if (!Array.isArray(line.problems) || line.problems.length === 0) return []

  let data = line.problems.map((problem, idx) => ({
    name: problem.metric || `Problem ${idx + 1}`,
    quantity: Number(problem.fdur) || 0,
  }))

  if (typeof line.minQuantity === 'number') {
    data = data.filter((item) => item.quantity >= line.minQuantity)
  }
  return data
}

const getTableData = (line) => {
  if (!Array.isArray(line.problems) || line.problems.length === 0) return []
  return line.problems.map((problem, idx) => ({
    no: idx + 1,
    problem: problem.metric,
    operator: problem.operator || 'N/A',
    startTime: problem.fstart_time,
    duration: `${problem.fdur} min`,
  }))
}

// Event handlers
const handleRefresh = async (panelId) => {
  console.log(`Refreshing panel: ${panelId}`)
  await fetchAllData()
}

const viewItem = (item) => {
  console.log('View item:', item)
}

const editItem = (item) => {
  console.log('Edit item:', item)
}

const deleteItem = (item) => {
  console.log('Delete item:', item)
}

watch([viewMode, metricMode], async () => {
  if (!isLoading.value) {
    await fetchAllData()
  }
}, { deep: true })

// Lifecycle hooks
onMounted(async () => {
  updateDateTime()
  clockInterval = setInterval(updateDateTime, 1000)
  await fetchAvCategories()
  await fetchAllData()
})

onUnmounted(() => {
  if (clockInterval) {
    clearInterval(clockInterval)
  }
})
</script>

<style scoped>
.realtime-pareto-container {
  padding: 0px;
}

.pareto-card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  border: none;
}

.pareto-card .card-header {
  background-color: #3c4b64;
  border-bottom: none;
}

.control-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #3c4b64;
}

.live-indicator {
  display: flex;
  align-items: center;
}

.live-dot {
  width: 8px;
  height: 8px;
  background-color: #20c997;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

.production-lines {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.loading-container {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.no-data-container {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(32, 201, 151, 0.7);
  }

  70% {
    box-shadow: 0 0 0 6px rgba(32, 201, 151, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(32, 201, 151, 0);
  }
}

@media (max-width: 768px) {
  .loading-container,
  .no-data-container {
    min-height: 200px;
  }
}
</style>
<template>
  <CRow>
    <CCol>
      <h3>CM Follow-up</h3>
      <p>Post-problem countermeasure tracking</p>
    </CCol>
  </CRow>

  <SearchFilters 
    v-model:filterStartDate="filters.start_date" 
    v-model:filterFinishDate="filters.end_date"
    v-model:selectedLine="filters.line" 
    v-model:selectedMachineName="filters.machine" 
    v-model:searchKeyword="filters.keyword"
    v-model:selectedCategory="filters.category" 
    v-model:selectedShift="filters.shift" 
    :lineOptions="lineOptions"
    :machineOptions="machineOptions" 
    :loading="loading"
    @search="fetchCMFollowup" 
    @reset="resetFilters" 
  />

  <Container>
    <CRow>
      <CCol>
        <LoadingState v-if="loading" :progress="progress" :trigger="triggerKey" />
        <template v-else>
          <CMIndicator :data="filteredData" />
          <ProblemsTable :data="filteredData" :loading="loading" />
        </template>
      </CCol>
    </CRow>
  </Container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { CRow, CCol } from '@coreui/vue'
import dayjs from 'dayjs'
import api from '@/apis/CommonAPI'
import { getCMFollowup } from '@/apis/cmFollowup'

import SearchFilters from './components/SearchFilters.vue'
import ProblemsTable from './components/ProblemsTable.vue'
import CMIndicator from './components/CMIndicator.vue'
import LoadingState from './components/LoadingState.vue'

const filters = ref({
  line: '',                 
  machine: '',              
  start_date: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
  end_date: dayjs().format('YYYY-MM-DD'),
  keyword: '',              
  category: '',             
  shift: ''                 
})

const loading = ref(false)
const progress = ref(0)
const triggerKey = ref(0)
const tableData = ref([])
const lineOptions = ref([])
const machineOptions = ref([])

const getLineLabel = id => lineOptions.value.find(l => l.id === id)?.label
const getMachineLabel = id => machineOptions.value.find(m => m.id === id)?.label

const filteredData = computed(() => {
  return tableData.value.filter(item => {
    const lineMatch = filters.value.line ? item.line === getLineLabel(filters.value.line) : true
    const machineMatch = filters.value.machine ? item.machine === getMachineLabel(filters.value.machine) : true

    const keyword = filters.value.keyword?.toLowerCase() || ''
    const searchMatch = !keyword || 
      item.machine.toLowerCase().includes(keyword) ||
      item.problem.toLowerCase().includes(keyword) ||
      item.countermeasure.toLowerCase().includes(keyword) ||
      item.pic.toLowerCase().includes(keyword)

    let categoryMatch = true
    if (filters.value.category === "Taskforce") {
      categoryMatch = item.problem?.toLowerCase().includes("taskforce")
    } else if (filters.value.category === "Thema") {
      // Add your specific logic for Thema category here
      categoryMatch = item.problem?.toLowerCase().includes("thema") || 
      item.category?.toLowerCase().includes("thema")
    }

    return lineMatch && machineMatch && searchMatch && categoryMatch
  })
})

async function loadInitialData() {
  loading.value = true
  try {
    const [machineResponse, lineResponse] = await Promise.all([
      api.get('/smartandon/machine'),
      api.get('/smartandon/line')
    ])

    if (machineResponse.status !== 200 || lineResponse.status !== 200) {
      throw new Error('Failed to load line/machine data')
    }

    machineOptions.value = (machineResponse.data || []).map(m => ({
      id: m.fid,
      label: m.fmc_name
    }))
    lineOptions.value = (lineResponse.data || []).map(l => ({
      id: l.fid,
      label: l.fline
    }))
  } catch (error) {
    console.error('Failed to load line/machine data:', error)
  } finally {
    loading.value = false
  }
}

async function fetchCMFollowup() {
  loading.value = true
  triggerKey.value++
  progress.value = 0
  let internalProgress = 0
  const step = () => { 
    if (internalProgress < 100) { 
      internalProgress += 1; 
      progress.value = internalProgress; 
      setTimeout(step, 15) 
    } 
  }
  step()

  try {
    const apiFilters = { ...filters.value }
    if (filters.value.keyword) {
      apiFilters.start_date = ''
      apiFilters.end_date = ''
    }

    let rawData = await getCMFollowup(apiFilters)
    tableData.value = rawData
  } catch (err) {
    console.error('Error fetching CMFollowup data:', err)
    tableData.value = []
  } finally {
    await new Promise(resolve => {
      const check = () => {
        if (progress.value >= 100) resolve()
        else setTimeout(check, 30)
      }
      check()
    })
    loading.value = false
  }
}

function resetFilters() {
  filters.value = {
    line: '', 
    machine: '', 
    start_date: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    end_date: dayjs().format('YYYY-MM-DD'),
    keyword: '',
    category: '',
    shift: '',
  }
  fetchCMFollowup()
}

onMounted(() => {
  loadInitialData().then(fetchCMFollowup)
})
</script>

<style scoped>
.cm-followup-container {
  padding: 0;
}

h3 {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

p {
  color: #718096;
  margin-bottom: 1.5rem;
}
</style>
<template>
  <CRow>
    <CCol>
      <h3>CM Follow-up</h3>
      <p>Post-problem countermeasure tracking</p>
    </CCol>
  </CRow>

  <SearchFilters 
    :filterStartDate="filters.start_date" 
    :filterFinishDate="filters.end_date"
    :selectedLine="filters.line" 
    :selectedMachineName="filters.machine" 
    :searchKeyword="filters.keyword"
    :selectedCategory="filters.category" 
    :selectedShift="filters.shift" 
    :lineOptions="lineOptions"
    :machineOptions="machineOptions" 
    :loading="loading"
    @update:filterStartDate="val => filters.start_date = val"
    @update:filterFinishDate="val => filters.end_date = val" 
    @update:selectedLine="val => filters.line = val"
    @update:selectedMachineName="val => filters.machine = val"
    @update:searchKeyword="val => filters.keyword = val"
    @update:selectedCategory="val => filters.category = val" 
    @update:selectedShift="val => filters.shift = val"
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
import axios from 'axios'
import { ref, onMounted, computed } from 'vue'
import dayjs from 'dayjs'
import { getCMFollowup } from '@/apis/cmFollowup'
import SearchFilters from '@/views/CMFollowup/components/SearchFilters.vue'
import ProblemsTable from '@/views/CMFollowup/components/ProblemsTable.vue'
import CMIndicator from '@/views/CMFollowup/components/CMIndicator.vue'
import LoadingState from '@/views/CMFollowup/components/LoadingState.vue'

const filters = ref({
  line: '',
  machine: null,
  start_date: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
  end_date: dayjs().format('YYYY-MM-DD'),
  keyword: '',
  category: '',
  shift: '',
})

const loading = ref(false)
const progress = ref(0)
const triggerKey = ref(0)
const tableData = ref([])
const lineOptions = ref([])
const machineOptions = ref([])

const filteredData = computed(() => {
  if (!filters.value.keyword) {
    return tableData.value
  }
  const kw = filters.value.keyword.toLowerCase()
  return tableData.value.filter(row => {
    const missingFields = ['line', 'machine', 'date', 'problem', 'duration', 'rootcause'].some(key => !row[key])
    if (missingFields) return true
    return [row.machine, row.problem, row.countermeasure, row.pic].some(field => field && field.toString().toLowerCase().includes(kw))
  })
})

async function loadInitialData() {
  loading.value = true
  try {
    const [machineRes, lineRes] = await Promise.all([
      axios.get('/api/smartandon/machine'),
      axios.get('/api/smartandon/line')
    ])
    machineOptions.value = (machineRes.data || []).map(machine => ({ id: machine.fid, label: machine.fmc_name }))
    lineOptions.value = (lineRes.data || []).map(line => ({ id: line.fid, label: line.fline }))
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
  const step = () => { if (internalProgress < 100) { internalProgress += 1; progress.value = internalProgress; setTimeout(step, 15) } }
  step()

  try {
    const apiFilters = { ...filters.value }
    if (filters.value.keyword) {
      apiFilters.start_date = ''
      apiFilters.end_date = ''
    }
    // ALWAYS fetch full data without filtering by date
    // Use actual filters with start_date and end_date to ensure data fetched correctly
    tableData.value = await getCMFollowup(apiFilters)
  } catch (err) {
    console.error('Error fetching CMFollowup data:', err)
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
    machine: null,
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
<template>
  <div class="mtbf-mttr-dashboard">
    <DashboardHeader
      :username="username"
      :currentDate="currentDate"
      :currentTime="currentTime"
    />
    <SearchPanel
      v-model:startDate="startDate"
      v-model:endDate="endDate"
      @search="search"
      @selectTimeRange="selectTimeRange"
    />

    <div class="d-flex align-items-center mb-3">
      <div class="toggle-group">
        <div class="toggle-mode">
          <button
            v-for="mode in chartModes"
            :key="mode.value"
            :class="['toggle-btn', { active: chartViewMode === mode.value }]"
            @click="() => setChartViewMode(mode.value)"
            type="button"
          >
            {{ mode.label }}
          </button>
        </div>
        <span class="divider" />
        <div class="toggle-filter">
          <button
            v-for="type in filterTypes"
            :key="type.value"
            :class="[
              'toggle-btn',
              'toggle-btn-filter',
              { active: filterType === type.value },
            ]"
            @click="() => setFilterType(type.value)"
            type="button"
          >
            {{ type.label }}
          </button>
        </div>
      </div>
    </div>

    <div class="production-lines-container">
      <div v-if="isLoading" class="loading-message">Loading data...</div>
      <template v-else>
        <div
          v-for="lineId in lineIds"
          :key="lineId"
          class="line-chart-container"
        >
          <div v-if="!hasData(lineId)" class="empty-message">
            No data available for {{ getLineTitle(lineId) }}
          </div>
          <LineChart
            v-else
            :lineId="lineId"
            :lineTitle="getLineTitle(lineId)"
            :chartOptions="getChartOptions(lineId)"
            :chartSeries="getChartSeries(lineId)"
            @refresh="refreshData"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import DashboardHeader from './components/DashboardHeader.vue'
import SearchPanel from './components/SearchPanel.vue'
import LineChart from './components/LineChart.vue'

const chartModes = [
  { value: 'mtbf', label: 'MTBF' },
  { value: 'mttr', label: 'MTTR' },
  { value: 'comparison', label: 'Comparison' },
]
const filterTypes = [
  { value: 'daily', label: 'Daily' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'total', label: 'Total' },
]

const username = ref('AndreanDjabbar')
const currentTime = ref('2025-05-24 07:14:29')
const currentDate = ref('Saturday, May 24, 2025')
const startDate = ref('2025-05-01')
const endDate = ref('2025-05-24')
const chartViewMode = ref('mtbf')
const filterType = ref('daily')
const lineIds = [
  'lpdc',
  'hpdc',
  'camshaft',
  'crankshaft',
  'cylinderhead',
  'cylinderblock',
  'assyline',
]
const apiData = ref({})
const isLoading = ref(false)

const flineMap = {
  LPDC: 'lpdc',
  HPDC: 'hpdc',
  'CAM SHAFT': 'camshaft',
  'CRANK SHAFT': 'crankshaft',
  'CYLINDER HEAD': 'cylinderhead',
  'CYLINDER BLOCK': 'cylinderblock',
  'ASSY LINE': 'assyline',
}

function setChartViewMode(val) {
  if (chartViewMode.value !== val) {
    chartViewMode.value = val
  }
}
function setFilterType(val) {
  if (filterType.value !== val) {
    filterType.value = val
  }
}

const getApiEndpoint = () => {
  if (chartViewMode.value === 'mtbf') return '/api/mtbfmttr/mtbf'
  if (chartViewMode.value === 'mttr') return '/api/mtbfmttr/mttr'
  return '/api/mtbfmttr/mtbfmttr'
}

function safeArray(val) {
  return Array.isArray(val) ? val : []
}

const fetchAllData = async () => {
  isLoading.value = true
  try {
    const endpoint = getApiEndpoint()
    const url = `${endpoint}?startDate=${startDate.value}&endDate=${endDate.value}&type=${filterType.value}`
    const response = await fetch(url)
    const result = await response.json()
    if (result.status === 200 && Array.isArray(result.data)) {
      const mapped = {}
      result.data.forEach((item) => {
        const id =
          flineMap[item.fline] ||
          item.fline?.toLowerCase()?.replace(/\s/g, '') ||
          null
        if (!id) return

        if (filterType.value === 'daily' || filterType.value === 'monthly') {
          if (!Array.isArray(mapped[id])) mapped[id] = []
          mapped[id].push({
            date: item.date,
            mtbf: item.mtbf ? parseFloat(item.mtbf) : 0,
            mttr: item.mttr ? parseFloat(item.mttr) : 0,
          })
        } else if (filterType.value === 'total') {
          const totalFdur = parseFloat(item.total_fdur || item.mtbf || 0)
          const totalRows = parseFloat(item.total_rows || 1)
          const mtbf =
            totalRows > 0 ? Math.round((totalFdur / totalRows) * 100) / 100 : 0
          const mttr = item.mttr !== undefined ? parseFloat(item.mttr) : 0

          mapped[id] = {
            mtbf,
            mttr
          }
        }
      })
      apiData.value = mapped
    } else {
      apiData.value = {}
    }
  } catch (e) {
    apiData.value = {}
    console.error('Failed to fetch MTBF/MTTR data', e)
  } finally {
    isLoading.value = false
  }
}

const getLineTitle = (lineId) =>
  ({
    lpdc: 'LPDC Line',
    hpdc: 'HPDC Line',
    camshaft: 'CAM SHAFT Line',
    crankshaft: 'CRANK SHAFT Line',
    cylinderhead: 'CYLINDER HEAD Line',
    cylinderblock: 'CYLINDER BLOCK Line',
    assyline: 'ASSY LINE',
  }[lineId] || lineId)

const hasData = (lineId) => {
  const data = apiData.value[lineId]
  if (!data) return false
  if (Array.isArray(data)) {
    if (chartViewMode.value === 'mtbf')
      return data.length > 0 && data.some((d) => d.mtbf && d.mtbf > 0)
    if (chartViewMode.value === 'mttr')
      return data.length > 0 && data.some((d) => d.mttr && d.mttr > 0)
    if (chartViewMode.value === 'comparison') return data.length > 0
    return false
  }
  if (chartViewMode.value === 'comparison') {
    return (data.mtbf && data.mtbf > 0) || (data.mttr && data.mttr > 0)
  }
  if (chartViewMode.value === 'mtbf') {
    return data.mtbf && data.mtbf > 0
  }
  if (chartViewMode.value === 'mttr') {
    return data.mttr && data.mttr > 0
  }
  return false
}

const colorMTTRBar = '#FF4560'
const colorMTBFBar = '#008FFB'
const colorMTTRLine = '#FF2D55'
const colorMTBFLine = '#00F0FF'

const getChartOptions = (lineId) => {
  const data = safeArray(apiData.value[lineId])
  const title = getLineTitle(lineId)

  // PATCH: total mode for mtbf or mttr only
  if ((chartViewMode.value === 'mtbf' || chartViewMode.value === 'mttr') && filterType.value === 'total') {
    return {
      chart: { height: 350, type: 'bar', toolbar: { show: true } },
      dataLabels: {
        enabled: true,
        formatter: (val) => val,
        style: { fontSize: '14px', colors: ['#333'] },
      },
      title: { text: title, align: 'left' },
      xaxis: { categories: [chartViewMode.value.toUpperCase()] },
      yaxis: { title: { text: chartViewMode.value.toUpperCase() + ' (Minutes)' }, min: 0 },
      tooltip: { theme: 'dark' },
      colors: [chartViewMode.value === 'mtbf' ? colorMTBFBar : colorMTTRBar],
      plotOptions: {
        bar: {
          columnWidth: '50%',
          dataLabels: { position: 'top' },
        },
      },
      legend: { show: false }
    }
  }

  // PATCH: comparison total mode
  if (chartViewMode.value === 'comparison' && filterType.value === 'total') {
    return {
      chart: { height: 350, type: 'bar', toolbar: { show: true } },
      dataLabels: {
        enabled: true,
        formatter: (val) => val,
        style: { fontSize: '14px', colors: ['#333'] },
      },
      title: { text: title, align: 'left' },
      xaxis: { categories: ['Total'] },
      yaxis: { title: { text: 'Value (Minutes)' }, min: 0 },
      tooltip: { theme: 'dark' },
      colors: [colorMTBFBar, colorMTTRBar], // biru, merah
      plotOptions: {
        bar: {
          columnWidth: '50%',
          dataLabels: { position: 'top' },
        },
      },
      legend: { show: true }
    }
  }

  // Bar+line tracking untuk mode MTBF atau MTTR per hari/bulan
  if (
    (chartViewMode.value === 'mtbf' || chartViewMode.value === 'mttr') &&
    (filterType.value === 'daily' || filterType.value === 'monthly')
  ) {
    const highlightLineColor =
      chartViewMode.value === 'mtbf' ? colorMTBFLine : colorMTTRLine
    return {
      chart: { type: 'line', height: 350, toolbar: { show: true } },
      stroke: {
        width: [0, 4],
        curve: 'smooth',
        colors: [null, highlightLineColor],
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [0],
        formatter: (val) => val,
        style: { fontSize: '14px', colors: ['#333'] },
      },
      markers: {
        size: [0, 8],
        strokeWidth: [0, 4],
        strokeColors: [null, highlightLineColor],
        fillColors: [null, highlightLineColor],
        hover: { size: 12 },
        shape: 'circle',
      },
      title: { text: title, align: 'left' },
      xaxis: { categories: data.map((d) => d.date ?? '') },
      yaxis: [
        {
          title: { text: chartViewMode.value.toUpperCase() + ' (Minutes)' },
          min: 0,
        },
      ],
      tooltip: { theme: 'dark' },
      colors: [
        chartViewMode.value === 'mtbf' ? colorMTBFBar : colorMTTRBar,
        highlightLineColor,
      ],
      plotOptions: {
        bar: {
          columnWidth: '40%',
          dataLabels: { position: 'top' },
        },
      },
    }
  }
  // Comparison mode: 2 bar chart + 2 line chart + legend jelas, dot kecil dan presisi
  if (
    chartViewMode.value === 'comparison' &&
    (filterType.value === 'daily' || filterType.value === 'monthly')
  ) {
    return {
      chart: { type: 'line', height: 350, toolbar: { show: true } },
      stroke: {
        width: [0, 0, 3, 3],
        curve: 'smooth',
        colors: [colorMTTRBar, colorMTBFBar, colorMTTRLine, colorMTBFLine],
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [0, 1],
        formatter: (val) => val,
        style: { fontSize: '14px', colors: ['#333'] },
      },
      markers: {
        size: [0, 0, 5, 5],
        strokeWidth: [0, 0, 3, 3],
        strokeColors: [
          colorMTTRBar,
          colorMTBFBar,
          colorMTTRLine,
          colorMTBFLine,
        ],
        fillColors: [colorMTTRBar, colorMTBFBar, colorMTTRLine, colorMTBFLine],
        hover: { size: 7 },
        shape: 'circle',
        discrete: [],
      },
      legend: {
        show: true,
        labels: {
          colors: '#222',
          useSeriesColors: true,
        },
      },
      title: { text: title, align: 'left' },
      xaxis: {
        categories: data.map((d) => d.date ?? ''),
        tickPlacement: 'on',
      },
      yaxis: [
        {
          title: { text: 'Value (Minutes)' },
          min: 0,
        },
      ],
      tooltip: { theme: 'dark' },
      colors: [colorMTTRBar, colorMTBFBar, colorMTTRLine, colorMTBFLine],
      plotOptions: {
        bar: {
          columnWidth: '40%',
          dataLabels: { position: 'top' },
        },
      },
    }
  }

  // Mode total tunggal (fallback)
  let categories = []
  let ytitle = chartViewMode.value.toUpperCase() + ' (Minutes)'
  if (Array.isArray(data) && data.length > 0) {
    categories = data.map((d) => d.date ?? '')
  } else if (data) {
    categories = [chartViewMode.value.toUpperCase()]
  } else {
    categories = []
  }
  return {
    chart: { height: 350, type: 'bar', toolbar: { show: true } },
    dataLabels: {
      enabled: true,
      formatter: (val) => val,
      style: { fontSize: '14px', colors: ['#333'] },
    },
    title: { text: title, align: 'left' },
    xaxis: {
      categories,
      title: {
        text: Array.isArray(data)
          ? filterType.value === 'monthly'
            ? 'Month'
            : 'Date'
          : 'Metric',
      },
    },
    yaxis: { title: { text: ytitle }, min: 0 },
    tooltip: { theme: 'dark' },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        dataLabels: { position: 'top' },
      },
    },
    colors: [chartViewMode.value === 'mtbf' ? colorMTBFBar : colorMTTRBar],
  }
}

const getChartSeries = (lineId) => {
  const data = safeArray(apiData.value[lineId])

  // PATCH: total mode for all chart types
  if (filterType.value === 'total') {
    const d = apiData.value[lineId] || {}
    if (chartViewMode.value === 'mtbf') {
      return [{ name: 'MTBF', data: [parseFloat(d.mtbf) || 0] }]
    } else if (chartViewMode.value === 'mttr') {
      return [{ name: 'MTTR', data: [parseFloat(d.mttr) || 0] }]
    } else if (chartViewMode.value === 'comparison') {
      return [
        { name: 'MTBF', data: [parseFloat(d.mtbf) || 0] }, // biru
        { name: 'MTTR', data: [parseFloat(d.mttr) || 0] }  // merah
      ]
    }
  }

  // Tracking line for MTBF or MTTR per day/month
  if (
    (chartViewMode.value === 'mtbf' || chartViewMode.value === 'mttr') &&
    (filterType.value === 'daily' || filterType.value === 'monthly')
  ) {
    if (chartViewMode.value === 'mtbf') {
      const values = data.map((d) => parseFloat(d.mtbf) || 0)
      return [
        { name: 'MTBF', type: 'bar', data: values },
        { name: '', type: 'line', data: values },
      ]
    } else {
      const values = data.map((d) => parseFloat(d.mttr) || 0)
      return [
        { name: 'MTTR', type: 'bar', data: values },
        { name: '', type: 'line', data: values },
      ]
    }
  }
  // Comparison mode: 2 bar chart + 2 line chart
  if (
    chartViewMode.value === 'comparison' &&
    (filterType.value === 'daily' || filterType.value === 'monthly')
  ) {
    return [
      {
        name: 'MTTR (Bar)',
        type: 'bar',
        data: data.map((d) => parseFloat(d.mttr) || 0),
      },
      {
        name: 'MTBF (Bar)',
        type: 'bar',
        data: data.map((d) => parseFloat(d.mtbf) || 0),
      },
      {
        name: 'MTTR (Line)',
        type: 'line',
        data: data.map((d) => parseFloat(d.mttr) || 0),
      },
      {
        name: 'MTBF (Line)',
        type: 'line',
        data: data.map((d) => parseFloat(d.mtbf) || 0),
      },
    ]
  }

  // MTBF/MTTR mode total (fallback)
  if (Array.isArray(data) && data.length > 0) {
    if (chartViewMode.value === 'mtbf') {
      return [{ name: 'MTBF', data: data.map((d) => parseFloat(d.mtbf) || 0) }]
    } else {
      return [{ name: 'MTTR', data: data.map((d) => parseFloat(d.mttr) || 0) }]
    }
  } else if (data) {
    if (chartViewMode.value === 'mtbf') {
      return [{ name: 'MTBF', data: [parseFloat(data.mtbf) || 0] }]
    } else {
      return [{ name: 'MTTR', data: [parseFloat(data.mttr) || 0] }]
    }
  }
  return [{ name: chartViewMode.value.toUpperCase(), data: [] }]
}

const search = async () => {
  await fetchAllData()
}
watch([chartViewMode, filterType], fetchAllData)

const selectTimeRange = async (range) => {
  const now = new Date('2025-05-24')
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  switch (range) {
    case 'today':
      startDate.value = formatDate(today)
      endDate.value = formatDate(now)
      break
    case 'lastWeek': {
      const lastWeekStart = new Date(today)
      lastWeekStart.setDate(today.getDate() - 7)
      startDate.value = formatDate(lastWeekStart)
      endDate.value = formatDate(today)
      break
    }
    case 'lastMonth': {
      const lastMonthStart = new Date(today)
      lastMonthStart.setMonth(today.getMonth() - 1)
      startDate.value = formatDate(lastMonthStart)
      endDate.value = formatDate(today)
      break
    }
    case 'lastQuarter': {
      const lastQuarterStart = new Date(today)
      lastQuarterStart.setMonth(today.getMonth() - 3)
      startDate.value = formatDate(lastQuarterStart)
      endDate.value = formatDate(today)
      break
    }
    case 'thisYear': {
      const thisYearStart = new Date(today.getFullYear(), 0, 1)
      startDate.value = formatDate(thisYearStart)
      endDate.value = formatDate(today)
      break
    }
    case 'lastYear': {
      const lastYearStart = new Date(today.getFullYear() - 1, 0, 1)
      const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31)
      startDate.value = formatDate(lastYearStart)
      endDate.value = formatDate(lastYearEnd)
      break
    }
  }
  search()
}

const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const refreshData = () => fetchAllData()

onMounted(() => fetchAllData())
</script>

<style scoped>
.mtbf-mttr-dashboard {
  padding: 15px;
}
.toggle-group {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  background: #f5f6fa;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03);
  padding: 6px 12px;
  gap: 100px;
}
.toggle-btn {
  background: transparent;
  border: none;
  outline: none;
  padding: 8px 18px;
  font-weight: 600;
  font-size: 16px;
  color: #444;
  border-radius: 6px;
  transition: background 0.13s, color 0.13s;
  cursor: pointer;
}
.toggle-btn.active {
  background: linear-gradient(95deg, #0d6efd 60%, #0dcaf0 100%);
  color: #fff;
  box-shadow: 0 2px 8px 0 rgba(0, 123, 255, 0.08);
}
.toggle-btn:not(.active):hover {
  background: #e3eafc;
  color: #0d6efd;
}
.toggle-btn-filter {
  font-size: 14px;
  padding: 8px 16px;
  margin-left: 2px;
}
.divider {
  display: inline-block;
  width: 1.5px;
  height: 26px;
  background: #e5e7eb;
  margin: 0 8px;
  border-radius: 2px;
}

.loading-message {
  text-align: center;
  font-size: 18px;
  color: #666;
  padding: 20px;
}
.empty-message {
  text-align: center;
  color: #aaa;
  padding: 15px 0 30px 0;
  font-size: 16px;
}
.line-chart-container {
  margin-bottom: 30px;
}

.toggle-mode {
  display: flex;
  align-items: center;
  gap: 0;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}
.toggle-mode .toggle-btn {
  border-radius: 0;
  border-right: 1.5px solid #e5e7eb;
  margin: 0;
}
.toggle-mode .toggle-btn:last-child {
  border-right: none;
}
.toggle-filter {
  display: flex;
  align-items: center;
  gap: 0;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}
.toggle-filter .toggle-btn-filter {
  border-radius: 0;
  border-right: 1.5px solid #e5e7eb;
  margin: 0;
}
.toggle-filter .toggle-btn-filter:last-child {
  border-right: none;
}
</style>
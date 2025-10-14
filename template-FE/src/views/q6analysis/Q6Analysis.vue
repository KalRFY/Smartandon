<template>
    <div class="q6-analysis-dashboard">
        <DashboardHeader
            :username="username"
            :currentDate="currentDate"
            :currentTime="currentTime"
        />

        <SearchPanel
            v-model:startDate="startDate"
            v-model:endDate="endDate"
            v-model:selectedLine="selectedLine"
            :isLoading="isLoading"
            @search="search"
            @selectTimeRange="selectTimeRange"
        />

        <ViewControls
            v-model:selectedView="selectedView"
            :isLoading="isLoading"
        />

        <CRow class="production-lines-container flex flex-column">
            <CCol cols="12" class="line-chart-container w-100">
                <CCard class="w-100">
                    <CCardBody>
                        <template v-if="isLoading">
                            <div class="loading-message">Loading data...</div>
                        </template>
                        <template v-else>
                            <div v-if="filteredItems.length === 0" class="empty-message">
                                No data available
                            </div>
                            <ApexChart
                            v-else
                            :options="chartOptions"
                            :series="chartSeries"
                            :height="400"
                            type="line"
                            />
                        </template>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ApexChart from 'vue3-apexcharts'
import DashboardHeader from './components/DashboardHeader.vue'
import SearchPanel from './components/SearchPanel.vue'
import ViewControls from './components/ViewControls.vue'
import { CCard, CCardBody, CRow, CCol } from '@coreui/vue'

const username = ref('Admin User')
const currentTime = ref('')
const currentDate = ref('')

const now = new Date()
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]
currentDate.value = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`

const isLoading = ref(false)

const selectedLine = ref('')
const startDate = ref(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`)
const endDate = ref(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`)

const selectedView = ref('abnormal')

const q6Categories = [
    'Q1 (Diagnose)',
    'Q2 (SpareParts)',
    'Q3 (Tools)',
    'Q4 (Maintenance Ability)',
    'Q5 (Machine Setting)',
    'Q6 (Machine Backup)'
]

const getLineTitle = (lineId) => ({
    lpdc: 'LPDC LINE',
    hpdc: 'HPDC LINE',
    camshaft: 'CAMSHAFT LINE',
    crankshaft: 'CRANKSHAFT LINE',
    cylinderhead: 'CYLINDER HEAD LINE',
    cylinderblock: 'CYLINDER BLOCK LINE',
    assyline: 'ASSY LINE',
}[lineId] || String(lineId).toUpperCase())

const baseItems = ref([
    { name: 'Ganti unit spindle #2', actual: 340, ideal: 68, q6: 'Q4 (Maintenance Ability)', line: 'assyline' },
    { name: 'Setting zero gain spindle #2', actual: 340, ideal: 34, q6: 'Q5 (Machine Setting)', line: 'hpdc' },
    { name: 'Setting zero posisi all axis x, y', actual: 340, ideal: 34, q6: 'Q5 (Machine Setting)', line: 'lpdc' },
    { name: 'Setting nilai PSW', actual: 170, ideal: 34, q6: 'Q5 (Machine Setting)', line: 'camshaft' },
    { name: 'Ganti interface card', actual: 170, ideal: 68, q6: 'Q5 (Machine Setting)', line: 'crankshaft' },
    { name: 'Setting parameter interface card', actual: 260, ideal: 34, q6: 'Q5 (Machine Setting)', line: 'cylinderhead' },
])

const contextItems = computed(() => {
    const yyyy = now.getFullYear()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    return baseItems.value.map((it, idx) => ({
        ...it,
        date: `${yyyy}-${mm}-${String(2 + idx * 3).padStart(2, '0')}`,
    }))
})

const getQ6Label = (val) => {
    if (!val) return ''
    const trimmed = String(val).trim()
    const shorthandMatch = /^Q[1-6]$/.test(trimmed)
    if (shorthandMatch) {
        const found = q6Categories.find((c) => c.startsWith(trimmed + ' '))
        return found || trimmed
    }
    const exact = q6Categories.find((c) => c === trimmed)
    return exact || trimmed
}

const filteredItems = computed(() => {
    const start = new Date(startDate.value)
    const end = new Date(endDate.value)
    return contextItems.value.filter((it) => {
        const matchLine = selectedLine.value ? it.line === selectedLine.value : true
        const itDate = it.date ? new Date(it.date) : null
        const matchDate = itDate ? itDate >= start && itDate <= end : true
        return matchLine && matchDate
    })
})

const chartSeries = computed(() => {
    const barSeries = filteredItems.value.map((it) => ({
        name: it.name,
        type: 'column',
        data: q6Categories.map((cat) => (cat === getQ6Label(it.q6)
        ? (selectedView.value === 'abnormal' ? it.actual : 1)
        : 0)),
        _meta: { actual: it.actual, ideal: it.ideal, q6: it.q6, line: it.line },
    }))

    const totalsByQ6 = q6Categories.map((cat) => {
        const itemsInCat = filteredItems.value.filter((it) => getQ6Label(it.q6) === cat)
        if (selectedView.value === 'abnormal') {
        return itemsInCat.reduce((sum, it) => sum + (Number(it.actual) || 0), 0)
        }
        return itemsInCat.length
    })

    const lineSeries = selectedView.value === 'abnormal'
        ? { name: 'Total Actual (min)', type: 'line', data: totalsByQ6 }
        : { name: 'Total Count', type: 'line', data: totalsByQ6 }

    return [...barSeries, lineSeries]
})

const chartOptions = computed(() => {
    const barCount = Math.max(chartSeries.value.length - 1, 0)
    const basePalette = [
        '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
        '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
    ]
    const seriesColors = Array.from({ length: barCount }, (_, i) => basePalette[i % basePalette.length])
    const lineColor = '#FF2D55'
    const colors = [...seriesColors, lineColor]
    const sumsByQ6 = q6Categories.map((cat) => {
        const inCat = filteredItems.value.filter((it) => getQ6Label(it.q6) === cat)
        if (selectedView.value === 'abnormal') {
        const stackedActual = inCat.reduce((sum, it) => sum + (Number(it.actual) || 0), 0)
        const stackedIdeal = inCat.reduce((sum, it) => sum + (Number(it.ideal) || 0), 0)
        return Math.max(stackedActual, stackedIdeal)
        } else {
        return inCat.length
        }
    })
    const currentMax = Math.max(0, ...sumsByQ6)
    const padded = currentMax * 1.15
    const magnitude = Math.pow(10, Math.max(0, Math.floor(Math.log10(Math.max(1, padded)))))
    const niceStep = magnitude / 2
    const yMax = Math.ceil(padded / niceStep) * niceStep
    return ({
        chart: {
            type: 'line',
            stacked: true,
            background: '#fff',
            toolbar: { show: true },
            animations: { enabled: true },
        },
        colors,
        title: {
            text: `Q6 Analysis Graph - ${selectedView.value === 'abnormal' ? 'Abnormal' : 'Frequency'}`,
            align: 'left',
            style: { fontSize: '16px', fontWeight: 'bold', color: '#333' },
        },
        plotOptions: {
            bar: {
            horizontal: false,
            columnWidth: '55%',
            dataLabels: { position: 'top' },
            },
        },
        dataLabels: {
            enabled: true,
            enabledOnSeries: Array.from({ length: barCount }, (_, i) => i),
            formatter: (val, ctx) => {
            if (ctx && ctx.seriesIndex === barCount) return ''
            return val ? `${val}` : ''
            },
            style: { fontSize: '12px', colors: ['#333'] },
        },
        stroke: {
            width: 3,
            curve: 'smooth',
        },
        markers: {
            size: 4,
        },
        xaxis: {
            categories: q6Categories,
            crosshairs: {
            show: true,
            position: 'back',
            stroke: { color: '#999', width: 1, dashArray: 3 },
            fill: {
                type: 'gradient',
                gradient: {
                colorFrom: '#D8E3F0',
                colorTo: '#BED1E6',
                stops: [0, 100],
                opacityFrom: 0.3,
                opacityTo: 0.05,
                },
            },
            },
            title: { text: 'Q6 Category' },
            labels: { rotateAlways: false },
        },
        yaxis: {
            title: { text: selectedView.value === 'abnormal' ? 'Time (minutes)' : 'Frequency (count)' },
            min: 0,
            max: yMax,
            tickAmount: 6,
        },
        legend: { show: false },
        tooltip: {
            shared: true,
            intersect: false,
            followCursor: true,
            theme: 'dark',
            custom: ({ series, dataPointIndex, w }) => {
            try {
                const barCount = Math.max(w.config.series.length - 1, 0)
                const rows = []
                for (let i = 0; i < barCount; i++) {
                const val = w.globals.series[i][dataPointIndex]
                if (!val) continue
                const sCfg = w.config.series[i] || {}
                const color = (w.config.colors && w.config.colors[i]) || '#3b82f6'
                const meta = sCfg._meta || {}
                const lineTitle = getLineTitle(meta.line)
                const unit = selectedView.value === 'abnormal' ? 'min' : ''
                const valueText = selectedView.value === 'abnormal' ? `${val} ${unit}` : `${val}`
                const nameText = sCfg.name || 'Item'
                rows.push(
                    `<div style="display:flex;align-items:center;margin:2px 0;gap:8px;">
                    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color};flex:0 0 auto;"></span>
                    <span style="font-size:12px;color:#fff;">${lineTitle} - ${nameText}: <strong>${valueText}</strong></span>
                    </div>`
                )
                }
                if (rows.length === 0 && w.config.series.length > 0) {
                const lastIdx = w.config.series.length - 1
                const lineVal = w.globals.series[lastIdx][dataPointIndex]
                if (typeof lineVal === 'number') {
                    const title = selectedView.value === 'abnormal' ? 'Total Actual' : 'Total Count'
                    rows.push(`<div style="font-size:12px;color:#fff;">${title}: <strong>${lineVal}${selectedView.value === 'abnormal' ? ' min' : ''}</strong></div>`)
                }
                }
                if (rows.length === 0) return ''
                return `<div style="padding:8px 10px;">${rows.join('')}</div>`
            } catch (e) {
                return ''
            }
            },
        },
        grid: {
            xaxis: { lines: { show: true } },
            yaxis: { lines: { show: true } },
        },
        responsive: [
            {
            breakpoint: 768,
            options: {
                plotOptions: { bar: { columnWidth: '80%' } },
                dataLabels: { style: { fontSize: '10px' } },
                legend: { show: false },
            },
            },
        ],
    })
})

onMounted(() => {
    setInterval(() => {
        const now = new Date()
        currentTime.value = now.toLocaleString()
    }, 1000)
})

const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const search = async () => {
    isLoading.value = true
    try {
        await new Promise((r) => setTimeout(r, 400))
    } finally {
        isLoading.value = false
    }
}

const selectTimeRange = async (range) => {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    switch (range) {
        case 'today':
        startDate.value = formatDate(today)
        endDate.value = formatDate(now)
        break
        case 'lastWeek': {
        const s = new Date(today)
        s.setDate(today.getDate() - 7)
        startDate.value = formatDate(s)
        endDate.value = formatDate(today)
        break
        }
        case 'lastMonth': {
        const s = new Date(today)
        s.setMonth(today.getMonth() - 1)
        startDate.value = formatDate(s)
        endDate.value = formatDate(today)
        break
        }
        case 'lastQuarter': {
        const s = new Date(today)
        s.setMonth(today.getMonth() - 3)
        startDate.value = formatDate(s)
        endDate.value = formatDate(today)
        break
        }
        case 'thisYear': {
        const s = new Date(today.getFullYear(), 0, 1)
        startDate.value = formatDate(s)
        endDate.value = formatDate(today)
        break
        }
    }
    search()
}
</script>

<style scoped>
.q6-analysis-dashboard {
  padding: 0px;
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

.production-lines-container {
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .q6-analysis-dashboard {
    padding: 0 10px;
  }
}

/* Force crosshair cursor inside the chart area */
:deep(.apexcharts-canvas) {
  cursor: crosshair;
}
</style>

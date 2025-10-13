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
            <CCol
                v-for="lineId in lineIds"
                :key="lineId"
                cols="12"
                class="line-chart-container w-100"
            >
                <CCard class="w-100">
                <CCardBody>
                    <template v-if="isLoading">
                    <div class="loading-message">Loading data...</div>
                    </template>
                    <template v-else>
                    <div v-if="!hasData(lineId)" class="empty-message">
                        No data available for {{ getLineTitle(lineId) }}
                    </div>
                    <ApexChart
                        v-else
                        :options="getChartOptions(lineId)"
                        :series="getChartSeries(lineId)"
                        :height="350"
                        :type="getChartOptions(lineId).chart.type"
                    />
                    </template>
                </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import ApexChart from 'vue3-apexcharts'
import DashboardHeader from './components/DashboardHeader.vue'
import SearchPanel from './components/SearchPanel.vue'
import ViewControls from './components/ViewControls.vue'
import {
    CCard,
    CCardBody,
    CRow,
    CCol,
} from '@coreui/vue'

const username = ref('Admin User')
const currentTime = ref('')
const currentDate = ref('')

const now = new Date()
const days = [  
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
]
const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]

currentDate.value = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`
const startDate = ref(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`)
const endDate = ref(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`)

const lineIds = [
    'lpdc',
    'hpdc',
    'camshaft',
    'crankshaft',
    'cylinderhead',
    'cylinderblock',
    'assyline',
]

const selectedLine = ref('')
const selectedView = ref('abnormal')
const isLoading = ref(false)
const apiData = ref({})

const q6Categories = [
    'Q1 (Diagnose)',
    'Q2 (SpareParts)', 
    'Q3 (Tools)',
    'Q4 (Maintenance Ability)',
    'Q5 (Machine Setting)',
    'Q6 (Machine Backup)'
]

const generateDummyData = () => {
    const data = {}
    lineIds.forEach(lineId => {
        data[lineId] = {
        abnormal: q6Categories.map((category, index) => ({
            category,
            count: Math.floor(Math.random() * 50) + 10,
            percentage: Math.floor(Math.random() * 30) + 5
        })),
        frequency: q6Categories.map((category, index) => ({
            category,
            count: Math.floor(Math.random() * 100) + 20,
            percentage: Math.floor(Math.random() * 25) + 10
        }))
        }
    })
    
    return data
}

const dummyData = generateDummyData()

const getLineTitle = (lineId) => ({
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
    if (!data || !data[selectedView.value]) return false
    return Array.isArray(data[selectedView.value]) && data[selectedView.value].length > 0
}

const updateChartData = () => {
    if (selectedLine.value) {
        apiData.value = {
        [selectedLine.value]: dummyData[selectedLine.value]
        }
    } else {
        apiData.value = dummyData
    }
}

// Chart colors matching MTBF/MTTR style (bar + line overlay)
const colorAbnormalBar = '#FF4560'
const colorFrequencyBar = '#008FFB'
const colorAbnormalLine = '#FF2D55'
const colorFrequencyLine = '#00F0FF'
const chartBg = '#fff'

const getChartOptions = (lineId) => {
    const lineLabel = getLineTitle(lineId)
    const data = apiData.value[lineId]?.[selectedView.value] || []
    
    // Use mixed chart (bar + line) to connect each bar with a line overlay
    return {
        chart: {
            background: chartBg,
            height: 350,
            // For mixed charts, set a base type (line) and specify per-series types in series config
            type: 'line',
            toolbar: {
                show: true,
                tools: {
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true,
                    download: true,
                },
                autoSelected: 'zoom',
            },
            zoom: { enabled: true },
        },
        // Bar + line overlay styling
        stroke: {
            width: [0, 3],
            curve: 'smooth',
            colors: [
                null,
                selectedView.value === 'abnormal' ? colorAbnormalLine : colorFrequencyLine,
            ],
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '40%',
                dataLabels: {
                    position: 'top',
                },
            },
        },
        dataLabels: {
            enabled: true,
            // Only show dataLabels on the bar series
            enabledOnSeries: [0],
            formatter: (val) => val,
            style: { 
                fontSize: '14px', 
                colors: ['#333']
            },
        },
        markers: {
            size: [0, 6],
            strokeWidth: [0, 3],
            strokeColors: [
                null,
                selectedView.value === 'abnormal' ? colorAbnormalLine : colorFrequencyLine,
            ],
            fillColors: [
                null,
                selectedView.value === 'abnormal' ? colorAbnormalLine : colorFrequencyLine,
            ],
            hover: { size: 8 },
            shape: 'circle',
        },
        title: { 
            text: `${lineLabel} - Q6 Analysis (${selectedView.value === 'abnormal' ? 'Abnormal Issues' : 'Frequency Analysis'})`,
            align: 'left',
            style: {
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#333'
            }
        },
        xaxis: {
            categories: q6Categories,
            title: {
                text: 'Q6 Analysis Categories',
                style: {
                    fontSize: '14px',
                    fontWeight: 'normal',
                    color: '#666'
                }
            },
            labels: {
                style: {
                    fontSize: '12px',
                    colors: '#666'
                }
            }
        },
        yaxis: {
            title: {
                text: selectedView.value === 'abnormal' ? 'Abnormal Count' : 'Frequency Count',
                style: {
                    fontSize: '14px',
                    fontWeight: 'normal',
                    color: '#666'
                }
            },
            min: 0,
            labels: {
                style: {
                    colors: '#666',
                    fontSize: '12px'
                }
            }
        },
        colors: [
            selectedView.value === 'abnormal' ? colorAbnormalBar : colorFrequencyBar,
            selectedView.value === 'abnormal' ? colorAbnormalLine : colorFrequencyLine,
        ],
        legend: { 
            show: false
        },
        tooltip: { 
            theme: 'dark',
            y: {
                formatter: function(val, { seriesIndex, dataPointIndex }) {
                    const item = data[dataPointIndex]
                    if (item) {
                        return `<span style="color: #fff;">Count: ${item.count}<br/>Percentage: ${item.percentage}%</span>`
                    }
                    return val
                }
            },
            style: {
                fontSize: '12px'
            }
        },
        responsive: [{
            breakpoint: 768,
            options: {
                plotOptions: {
                    bar: {
                        columnWidth: '80%'
                    }
                },
                xaxis: {
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                dataLabels: {
                    style: {
                        fontSize: '10px'
                    }
                }
            }
        }]
    }
}

const getChartSeries = (lineId) => {
    const data = apiData.value[lineId]?.[selectedView.value] || []
    
    if (!Array.isArray(data) || data.length === 0) {
        return [
            { name: selectedView.value === 'abnormal' ? 'Abnormal Count' : 'Frequency Count', type: 'bar', data: [] },
            { name: '', type: 'line', data: [] },
        ]
    }
    
    const values = data.map((item) => parseFloat(item.count) || 0)
    return [
        {
            name: selectedView.value === 'abnormal' ? 'Abnormal Count' : 'Frequency Count',
            type: 'bar',
            data: values,
        },
        {
            name: '',
            type: 'line',
            data: values,
        },
    ]
}

const search = async () => {
    isLoading.value = true
    try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        updateChartData()
    } catch (error) {
        console.error('Error fetching Q6 Analysis data:', error)
    } finally {
        isLoading.value = false
    }
}

const selectTimeRange = async (range) => {
    const now = new Date()
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
    }
    search()
}

const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

watch(selectedView, () => {
    updateChartData()
})

watch(selectedLine, () => {
    updateChartData()
})

onMounted(() => {
    setInterval(() => {
        const now = new Date()
        currentTime.value = now.toLocaleString()
    }, 1000)
    
    updateChartData()
})
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
</style>

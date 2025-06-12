<template>
  <div class="production-line-section">
    <CCard>
      <CCardHeader
        class="bg-light d-flex justify-content-between align-items-center"
      >
        <h5 class="m-0 line-title">{{ title }}</h5>
        <div>
          <CButton
            size="sm"
            variant="ghost"
            color="success"
            @click="refreshData"
            class="me-2"
          >
            <RefreshCw size="16" class="me-1" /> Refresh
          </CButton>
          <CButton
            size="sm"
            variant="ghost"
            color="primary"
            @click="exportData"
            class="me-2"
          >
            <Download size="16" class="me-1" /> Export
          </CButton>
          <CButton
            size="sm"
            variant="ghost"
            color="secondary"
            @click="toggleExpanded"
          >
            {{ isExpanded ? 'Collapse' : 'Expand' }}
            <component
              :is="isExpanded ? 'ChevronUp' : 'ChevronDown'"
              size="16"
            />
          </CButton>
        </div>
      </CCardHeader>

      <CCardBody v-if="isExpanded">
        <div v-if="loading" class="text-center p-5">
          <CSpinner />
          <p class="mt-2">Loading data...</p>
        </div>
        <div v-else-if="error" class="alert alert-danger">
          {{ error }}
        </div>
        <div v-else>
          <div class="chart-container" ref="chartContainer">
            <canvas ref="chartCanvas"></canvas>
          </div>

          <CAccordion :active-item-key="1">
            <CAccordionItem :item-key="1">
              <CAccordionHeader>
                <div class="d-flex align-items-center">
                  <component :is="panelIcon" size="16" class="me-2" />
                  <span>{{ panelId }} Data Table</span>
                </div>
              </CAccordionHeader>
              <CAccordionBody>
                <CTable responsive hover>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">#</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Machine</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Problem</CTableHeaderCell>
                      <CTableHeaderCell scope="col">PIC</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Duration</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow v-for="(row, index) in tableData" :key="index">
                      <CTableHeaderCell scope="row">{{
                        row.no
                      }}</CTableHeaderCell>
                      <CTableDataCell>{{ row.date }}</CTableDataCell>
                      <CTableDataCell>{{ row.machine }}</CTableDataCell>
                      <CTableDataCell>{{ row.problem }}</CTableDataCell>
                      <CTableDataCell>{{ row.pic }}</CTableDataCell>
                      <CTableDataCell>{{ row.duration }}</CTableDataCell>
                      <CTableDataCell>
                        <CButtonGroup size="sm">
                          <CButton
                            color="info"
                            variant="ghost"
                            @click="viewItem(row)"
                          >
                            <Eye size="16" />
                          </CButton>
                          <CButton
                            color="warning"
                            variant="ghost"
                            @click="editItem(row)"
                          >
                            <Edit size="16" />
                          </CButton>
                          <CButton
                            color="danger"
                            variant="ghost"
                            @click="confirmDelete(row)"
                          >
                            <Trash2 size="16" />
                          </CButton>
                        </CButtonGroup>
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CAccordionBody>
            </CAccordionItem>
          </CAccordion>
        </div>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CButtonGroup,
  CSpinner,
} from '@coreui/vue'
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Edit,
  Trash2,
  FileSpreadsheet,
  BarChart,
  BarChart2,
  RefreshCw,
  Download,
} from 'lucide-vue-next'
import Chart from 'chart.js/auto'

export default {
  name: 'ProductionLineSection',
  components: {
    CCard,
    CCardHeader,
    CCardBody,
    CButton,
    CAccordion,
    CAccordionItem,
    CAccordionHeader,
    CAccordionBody,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CButtonGroup,
    CSpinner,
    ChevronDown,
    ChevronUp,
    Eye,
    Edit,
    Trash2,
    FileSpreadsheet,
    BarChart,
    BarChart2,
    RefreshCw,
    Download,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    panelId: {
      type: String,
      required: true,
    },
    chartData: {
      type: Array,
      required: true,
    },
    tableData: {
      type: Array,
      required: true,
    },
    viewMode: {
      type: String,
      default: 'machine',
    },
    metricMode: {
      type: String,
      default: 'duration',
    },
    minQuantity: {
      type: Number,
      default: 0,
    },
  },
  emits: ['refresh', 'view-item', 'edit-item', 'delete-item'],
  setup(props, { emit }) {
    const isExpanded = ref(true)
    const loading = ref(false)
    const error = ref(null)
    const chartCanvas = ref(null)
    const chartContainer = ref(null)
    const chartInstance = ref(null)

    const toggleExpanded = () => {
      isExpanded.value = !isExpanded.value
      if (isExpanded.value) {
        nextTick(() => {
          renderChart()
        })
      }
    }

    const refreshData = () => {
      loading.value = true
      error.value = null

      setTimeout(() => {
        loading.value = false
        emit('refresh', props.panelId)
        nextTick(() => {
          renderChart()
        })
      }, 1000)
    }

    const exportData = () => {
      const dataStr = JSON.stringify(props.chartData)
      const dataUri =
        'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

      const exportFileDefaultName = `${props.title}_${props.viewMode}_${
        props.metricMode
      }_${new Date().toISOString()}.json`

      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    }

    const viewItem = (item) => {
      emit('view-item', item)
    }

    const editItem = (item) => {
      emit('edit-item', item)
    }

    const confirmDelete = (item) => {
      if (confirm(`Are you sure you want to delete this item?`)) {
        emit('delete-item', item)
      }
    }

    const panelIcon = computed(() => {
      if (props.panelId.includes('PANEL')) {
        return FileSpreadsheet
      }
      return props.metricMode === 'duration' ? BarChart : BarChart2
    })

    const getChartConfig = () => {
      if (!props.chartData || props.chartData.length === 0) {
        console.warn('No chart data available for', props.title)
        return {
          type: 'bar',
          data: {
            labels: [],
            datasets: [
              {
                label: 'No Data',
                data: [],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        }
      }

      const dataLabel =
        props.metricMode === 'duration' ? 'Duration (mins)' : 'Frequency'
      const sortedData = [...props.chartData].sort(
        (a, b) => b.quantity - a.quantity,
      )

      return {
        type: 'bar',
        data: {
          labels: sortedData.map((item) => item.name),
          datasets: [
            {
              label: dataLabel,
              backgroundColor: '#4dabf7',
              data: sortedData.map((item) => item.quantity),
              order: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              left: 10,
              right: 25,
              top: 25,
              bottom: 10,
            },
          },
          plugins: {
            title: {
              display: true,
              text: `${props.title} - ${
                props.viewMode === 'machine' ? 'Machine' : 'Problem'
              } ${
                props.metricMode === 'duration' ? 'Duration' : 'Frequency'
              } Chart`,
              font: {
                size: 16,
                weight: 'bold',
              },
            },
            legend: {
              position: 'top',
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: props.viewMode === 'machine' ? 'Machines' : 'Problems',
              },
            },
            y: {
              display: true,
              position: 'left',
              title: {
                display: true,
                text: dataLabel,
              },
              beginAtZero: true,
            },
          },
        },
      }
    }

    const renderChart = async () => {
      if (chartInstance.value) {
        chartInstance.value.destroy()
        chartInstance.value = null
      }

      await nextTick()
      if (!chartCanvas.value) {
        console.error('Chart canvas element not found')
        return
      }

      try {
        const ctx = chartCanvas.value.getContext('2d')
        if (!ctx) {
          console.error('Could not get 2D context for canvas')
          return
        }

        chartInstance.value = new Chart(ctx, getChartConfig())
      } catch (err) {
        console.error('Error creating chart:', err)
        error.value = 'Failed to render chart: ' + err.message
      }
    }

    watch(
      () => [props.chartData, props.viewMode, props.metricMode],
      () => {
        if (isExpanded.value) {
          nextTick(() => {
            renderChart()
          })
        }
      },
      { deep: true },
    )

    watch(isExpanded, (newVal) => {
      if (newVal) {
        nextTick(() => {
          renderChart()
        })
      }
    })

    onMounted(async () => {
      await nextTick()
      if (isExpanded.value) {
        setTimeout(() => {
          renderChart()
        }, 100)
      }
    })

    onUnmounted(() => {
      if (chartInstance.value) {
        chartInstance.value.destroy()
        chartInstance.value = null
      }
    })

    return {
      isExpanded,
      loading,
      error,
      chartCanvas,
      chartContainer,
      toggleExpanded,
      refreshData,
      exportData,
      viewItem,
      editItem,
      confirmDelete,
      panelIcon,
    }
  },
}
</script>

<style scoped>
.production-line-section {
  margin-bottom: 15px;
}

.line-title {
  font-weight: 600;
  color: #3c4b64;
}

.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
  margin-bottom: 20px;
  border: 1px solid #eaeaea;
  padding: 10px;
}

.action-btn {
  margin-right: 5px;
}

@media (max-width: 768px) {
  .chart-container {
    height: 350px;
  }
}
</style>

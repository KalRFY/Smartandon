<template>
  <div>
    <CRow>
      <CCol v-for="(card, index) in dashboardCards" :key="index" sm="6" lg="4" class="mb-4">
        <CCard class="dashboard-card h-100" :color="card.color">
          <CCardBody class="d-flex flex-column align-items-center justify-content-center text-center p-4">
            <div class="icon-container mb-3">
              <component :is="card.icon" :size="48" :stroke-width="1.5" />
            </div>
            <h4>{{ card.title }}</h4>
            <p class="card-description">{{ card.description }}</p>
            <CButton color="light" class="mt-2" @click="navigateTo(card.route)">View Details</CButton>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <CCard>
      <CCardBody>
        <div class="machine-status-table">
          <div class="table-header">
            <div class="header-cell header-no">No</div>
            <div class="header-cell header-name">Machine Name</div>
            <div class="header-cell header-oee">OEE</div>
            <div class="header-cell header-status">Status</div>
            <div class="header-cell header-mtcall">MT Call</div>
            <div class="header-cell header-used">Used</div>
          </div>

          <div
            v-for="machine in machines"
            :key="machine.id"
            class="table-row"
          >
            <div class="cell cell-no">{{ machine.id }}</div>

            <div class="cell cell-name">{{ machine.name }}</div>

            <div class="cell cell-oee">{{ machine.oee }}</div>

            <div class="cell cell-status">
              <div 
                class="status-badge"
                :style="getStatusClass(machine.status)"
              >
                {{ getStatusText(machine.status) }}
              </div>
            </div>

            <div class="cell cell-mtcall">{{ machine.mtCall }} Min</div>

            <div class="cell cell-used">{{ machine.used }}</div>
          </div>
        </div>
      </CCardBody>
    </CCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  CCard, 
  CCardBody, 
  CRow, 
  CCol, 
  CButton 
} from '@coreui/vue'
import {
  AlertTriangle,
  Clock,
  Timer,
  History,
  BarChart2,
  FileText,
  CalendarClock,
  ChartColumnIncreasing,
  BookText
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const machines = ref([
  {
    id: 1,
    name: 'LPDC',
    oee: '95.3%',
    status: 'running',
    mtCall: 0,
    used: '211/416'
  },
  {
    id: 2,
    name: 'HPDC',
    oee: '95.3%',
    status: 'stop',
    mtCall: 20,
    used: '211/416'
  },
  {
    id: 3,
    name: 'Cam Shaft',
    oee: '95.3%',
    status: 'stop-critical',
    mtCall: 35,
    used: '211/416'
  },
  {
    id: 4,
    name: 'Crank Shaft',
    oee: '95.3%',
    status: 'running',
    mtCall: 0,
    used: '211/416'
  },
  {
    id: 5,
    name: 'Cylinder Head',
    oee: '95.3%',
    status: 'running',
    mtCall: 0,
    used: '211/416'
  },
  {
    id: 6,
    name: 'Cylinder Block',
    oee: '95.3%',
    status: 'running',
    mtCall: 0,
    used: '211/416'
  },
  {
    id: 7,
    name: 'Assy Line',
    oee: '95.3%',
    status: 'running',
    mtCall: 0,
    used: '211/416'
  }
])

// Dashboard cards configuration
const dashboardCards = [
  {
    title: 'Machine Stop Input',
    icon: AlertTriangle,
    description: 'Record and monitor machine stop events',
    color: 'danger',
    route: '/machine-stop'
  },
  {
    title: 'MTBF',
    icon: Clock,
    description: 'Mean Time Between Failures metrics',
    color: 'info',
    route: '/mtbf'
  },
  {
    title: 'MTTR',
    icon: Timer,
    description: 'Mean Time To Repair analytics',
    color: 'warning',
    route: '/mttr'
  },
  {
    title: 'Problem History',
    icon: History,
    description: 'Historical issues and resolutions',
    color: 'primary',
    route: '/app/problem-history'
  },
  {
    title: 'Realtime Pareto',
    icon: BarChart2,
    description: 'Live Pareto analysis of issues',
    color: 'success',
    route: '/realtime-pareto'
  },
  {
    title: 'LTB Report Status',
    icon: FileText,
    description: 'Last Time Buy reporting and analysis',
    color: 'secondary',
    route: '/app/LTBSummary'
  },
  {
    title: 'CM Followup',
    icon: CalendarClock,
    description: 'Countermeasure tracking and follow-up monitoring',
    color: 'secondary',
    route: '/app/CMFollowup'
  }
]

// Computed properties
const getStatusClass = computed(() => {
  return (status) => {
    switch (status) {
      case 'running':
        return {
          backgroundColor: '#00FF8C',
          color: 'white'
        }
      case 'stop':
        return {
          backgroundColor: '#F9B115',
          color: 'white'
        }
      case 'stop-critical':
        return {
          backgroundColor: '#E55353',
          color: 'white'
        }
      default:
        return {
          backgroundColor: '#6c757d',
          color: 'white'
        }
    }
  }
})

const getStatusText = computed(() => {
  return (status) => {
    switch (status) {
      case 'running':
        return 'Running'
      case 'stop':
      case 'stop-critical':
        return 'Stop'
      default:
        return 'Unknown'
    }
  }
})

const navigateTo = (route) => {
  router.push(route)
}

let refreshInterval = null

const startAutoRefresh = () => {
  refreshInterval = setInterval(() => {
    console.log('Refreshing machine data...')
  }, 30000)
}

const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
}

// Lifecycle hooks
onMounted(() => {
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped>
.dashboard-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.dashboard-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.icon-container {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.machine-status-table {
  padding: 10px;
  background: rgba(255, 255, 255, 0.30);
  border-radius: 20px;
  border: 0.75px solid rgba(255, 255, 255, 0.50);
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-height: 460px;
}

.table-header,
.table-row {
  height: 70px;
  background: white;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05);
  border-radius: 30px;
  border: 0.75px solid rgba(5, 14, 97, 0.10);
  display: flex;
  align-items: center;
}

.table-header {
  font-weight: 800;
}

.table-row {
  font-weight: 500;
}

.header-cell,
.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: black;
  font-size: 20px;
  font-family: 'Inter', sans-serif;
  word-wrap: break-word;
  padding: 0 10px;
}

.header-no,
.cell-no {
  width: 75px;
}

.header-name,
.cell-name {
  width: 235px;
}

.header-oee,
.cell-oee {
  width: 350px;
}

.header-status,
.cell-status {
  width: 290px;
}

.header-mtcall,
.cell-mtcall {
  width: 250px;
}

.header-used,
.cell-used {
  flex: 1;
}

.status-badge {
  width: 159px;
  padding: 10px 20px;
  border-radius: 20px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.20);
  font-size: 15px;
  font-weight: 500;
  text-align: center;
}

.card-description {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .machine-status-table {
    overflow-x: auto;
  }
  
  .table-header,
  .table-row {
    min-width: 800px;
  }
}
</style>
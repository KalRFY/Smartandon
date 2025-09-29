<template>
    <div class="dashboard-cards-container">
        <div
        v-for="(card, index) in dashboardCards"
        :key="index"
        class="dashboard-card-wrapper"
        >
            <CCard style="height: 100%;" class="dashboard-card h-100" :color="card.color">
                <CCardBody class="d-flex flex-column align-items-center justify-content-center text-center p-4">
                <div class="icon-container mb-3">
                    <component :is="card.icon" :size="30" :stroke-width="1" />
                </div>
                <h4>{{ card.title }}</h4>
                <CButton color="light" class="mt-2" @click="$emit('navigate', card.route)">View Details</CButton>
                </CCardBody>
            </CCard>
        </div>
    </div>
</template>

<script setup>
import { CCard, CCardBody, CButton } from '@coreui/vue'
import {
    Clock,
    History,
    BarChart2,
    FileText,
    CalendarClock,
} from 'lucide-vue-next'

defineEmits(['navigate'])

const dashboardCards = [
    {
        title: 'MTBF',
        icon: Clock,
        description: 'Mean Time Between Failures metrics',
        color: 'info',
        route: '/app/MTBFMTTR',
    },
    {
        title: 'Problem History',
        icon: History,
        description: 'Historical issues and resolutions',
        color: 'primary',
        route: '/app/ProblemHistory',
    },
    {
        title: 'Realtime Pareto',
        icon: BarChart2,
        description: 'Live Pareto analysis of issues',
        color: 'success',
        route: '/app/RealtimeParetto',
    },
    {
        title: 'LTB Report Status',
        icon: FileText,
        description: 'Last Time Buy reporting and analysis',
        color: 'secondary',
        route: '/app/LTBSummary',
    },
    {
        title: 'CM Followup',
        icon: CalendarClock,
        description: 'Countermeasure tracking and follow-up monitoring',
        color: 'secondary',
        route: '/app/CMFollowup',
    },
    {
        title: 'TPM System',
        icon: FileText,
        description: 'TPM System',
        color: 'secondary',
        route: '/app/tpm-redirect',
    },
    {
        title: 'Order Spareparts',
        icon: BarChart2,
        description: 'Order Spareparts',
        color: 'secondary',
        route: '/app/order-spareparts-redirect',
    },
]
</script>

<style scoped>
.dashboard-card {
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 10px;
  overflow: hidden;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.icon-container {
  width: 60px;
  height: 60px;
  padding: 15px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-description {
  color: rgb(80, 106, 113);
  margin-top: 10px;
}

.dashboard-cards-container {
  display: flex;
  overflow-x: auto;
  padding-bottom: 10px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.dashboard-cards-container::-webkit-scrollbar {
  height: 8px;
}

.dashboard-cards-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.dashboard-card-wrapper {
  flex: 0 0 auto;
  width: calc((100% - 40px) / 5);
  margin-right: 10px;
}

.dashboard-card-wrapper:last-child {
  margin-right: 0;
}
</style>
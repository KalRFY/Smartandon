<template>
    <div class="dashboard-container">
      <div class="flex justify-between items-center mb-6">
        <div class="header bg-white p-3 rounded-md shadow flex flex-col items-center justify-center w-24 h-24 flex-shrink-0">
          <img src="/api/placeholder/40/40" alt="Smart Andon Logo" class="mb-1" />
          <h1 class="text-xs font-bold text-gray-700 text-center">Smart Andon</h1>
        </div>

        <div class="flex-grow ml-4">
          <div class="nav-tabs flex flex-row gap-3 overflow-x-auto pb-2">
            <div @click="navigateTo('/parameter-monitoring')" class="tab-card bg-white rounded-md shadow cursor-pointer hover:bg-gray-50 flex-shrink-0">
              <div class="p-3 flex flex-col items-center justify-center h-24 w-24">
                <div class="icon-container mb-1">
                  <BarChart2 size="20" />
                </div>
                <h3 class="text-xs text-center font-medium">Symptom Parameter</h3>
              </div>
            </div>
            <div @click="navigateTo('/qc-analysis')" class="tab-card bg-white rounded-md shadow cursor-pointer hover:bg-gray-50 flex-shrink-0">
              <div class="p-3 flex flex-col items-center justify-center h-24 w-24">
                <div class="icon-container mb-1">
                  <ChartColumnIncreasing size="20" />
                </div>
                <h3 class="text-xs text-center font-medium">QC Analysis</h3>
              </div>
            </div>
            <div @click="navigateTo('/symptom-management')" class="tab-card bg-white rounded-md shadow cursor-pointer hover:bg-gray-50 flex-shrink-0">
              <div class="p-3 flex flex-col items-center justify-center h-24 w-24">
                <div class="icon-container mb-1">
                  <FileText size="20" />
                </div>
                <h3 class="text-xs text-center font-medium">Symptom Management</h3>
              </div>
            </div>
            <div @click="navigateTo('/runtime-pareto')" class="tab-card bg-white rounded-md shadow cursor-pointer hover:bg-gray-50 flex-shrink-0">
              <div class="p-3 flex flex-col items-center justify-center h-24 w-24">
                <div class="icon-container mb-1">
                  <Clock size="20" />
                </div>
                <h3 class="text-xs text-center font-medium">Runtime Pareto</h3>
              </div>
            </div>
            <div @click="navigateTo('/repair-analysis')" class="tab-card bg-white rounded-md shadow cursor-pointer hover:bg-gray-50 flex-shrink-0">
              <div class="p-3 flex flex-col items-center justify-center h-24 w-24">
                <div class="icon-container mb-1">
                  <BookText size="20" />
                </div>
                <h3 class="text-xs text-center font-medium">Repair Analysis</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="alert-banner bg-orange-500 text-white p-3 rounded-md mb-6 text-center font-bold">
        <AlertTriangle class="inline mr-2" size="20" />
        !!! Machine Stop Input !!!
      </div>
  
      <div class="stats-overview mb-6">
        <div class="flex justify-between mb-3">
          <h2 class="text-lg font-semibold">Machine Status</h2>
          <div class="flex items-center">
            <span class="mr-2">Filter</span>
            <button class="bg-white p-1 px-3 rounded-md border flex items-center">
              <span class="mr-1">All</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
          </div>
        </div>
  
        <div class="overflow-x-auto bg-white rounded-md shadow">
          <table class="min-w-full">
            <thead class="bg-gray-100">
              <tr>
                <th class="p-3 text-left text-sm font-medium text-gray-700">No</th>
                <th class="p-3 text-left text-sm font-medium text-gray-700">Machine Name</th>
                <th class="p-3 text-left text-sm font-medium text-gray-700">OEE</th>
                <th class="p-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th class="p-3 text-left text-sm font-medium text-gray-700">MT Call</th>
                <th class="p-3 text-left text-sm font-medium text-gray-700">Used</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(machine, index) in machines" :key="index" class="border-t">
                <td class="p-3 text-sm">{{ machine.id }}</td>
                <td class="p-3 text-sm">{{ machine.name }}</td>
                <td class="p-3 text-sm">{{ machine.oee }}</td>
                <td class="p-3 text-sm">
                  <span :class="getStatusClass(machine.status)" class="px-3 py-1 rounded-full text-white text-xs">
                    {{ machine.status }}
                  </span>
                </td>
                <td class="p-3 text-sm">{{ machine.mtCall }}</td>
                <td class="p-3 text-sm">{{ machine.used }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
</template>
  
<script>
import MainChartExample from './charts/MainChartExample'
import WidgetsStatsA from './widgets/WidgetsStatsTypeA.vue'
import WidgetsStatsD from './widgets/WidgetsStatsTypeD.vue'
import {
  AlertTriangle,
  Clock,
  Timer,
  History,
  BarChart2,
  FileText,
  ChartColumnIncreasing,
  BookText
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

export default {
  name: 'Dashboard',
  components: {
    MainChartExample,
    WidgetsStatsA,
    WidgetsStatsD,
    AlertTriangle,
    Clock,
    Timer,
    History,
    BarChart2,
    FileText,
    ChartColumnIncreasing,
    BookText
  },
  setup() {
    const router = useRouter();
    
    const machines = ref([
      { id: 1, name: 'LPDC', oee: '95.3%', status: 'Running', mtCall: '0 Min', used: '211/416' },
      { id: 2, name: 'HPDC', oee: '95.3%', status: 'Alarm', mtCall: '20 Min', used: '211/416' },
      { id: 3, name: 'Cam Shaft', oee: '95.3%', status: 'Stop', mtCall: '35 Min', used: '211/416' },
      { id: 4, name: 'Crank Shaft', oee: '95.3%', status: 'Running', mtCall: '0 Min', used: '211/416' },
      { id: 5, name: 'Cylinder Head', oee: '95.3%', status: 'Running', mtCall: '0 Min', used: '211/416' }
    ]);

    const recentActivities = ref([
      { type: 'stop', message: 'Cam Shaft machine stopped', time: '35 min ago' },
      { type: 'alarm', message: 'HPDC machine alarm triggered', time: '20 min ago' },
      { type: 'maintenance', message: 'Scheduled maintenance for LPDC', time: '2 hours ago' },
      { type: 'restart', message: 'HPDC machine restarted', time: '4 hours ago' }
    ]);

    const maintenanceStats = ref([
      { title: 'Average Downtime', value: '18 min', percentage: '5%', color: 'green' },
      { title: 'Response Time', value: '3.2 min', percentage: '10%', color: 'green' },
      { title: 'Daily Alerts', value: '5', percentage: '15%', color: 'red' }
    ]);

    const navigateTo = (route) => {
      router.push(route);
    };

    const getStatusClass = (status) => {
      switch (status) {
        case 'Running':
          return 'bg-green-500';
        case 'Alarm':
          return 'bg-yellow-500';
        case 'Stop':
          return 'bg-red-500';
        default:
          return 'bg-gray-500';
      }
    };

    const getActivityIconClass = (type) => {
      switch (type) {
        case 'stop':
          return 'bg-red-500';
        case 'alarm':
          return 'bg-yellow-500';
        case 'maintenance':
          return 'bg-blue-500';
        case 'restart':
          return 'bg-green-500';
        default:
          return 'bg-gray-500';
      }
    };

    return {
      machines,
      recentActivities,
      maintenanceStats,
      navigateTo,
      getStatusClass,
      getActivityIconClass
    };
  }
};
</script>
  
<style scoped>
.dashboard-container {
  padding: 1.5rem;
  background-color: #f7f9fc;
  min-height: 100vh;
}

.header {
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.nav-tabs {
  scrollbar-width: thin;
}

.tab-card {
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  border: 1px solid #eaeaea;
}

.tab-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  border-color: #ddd;
}

.icon-container {
  color: #4a5568;
}
</style>
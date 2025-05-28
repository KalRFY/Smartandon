<template>
  <CCard class="mb-4 production-line-card">
    <CCardHeader>
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="mb-0">{{ lineTitle }}</h4>
        <div class="d-flex align-items-center">
          <CButton 
            variant="ghost" 
            color="primary" 
            size="sm" 
            @click="$emit('refresh', lineId)"
          >
            <RefreshCw size="16" />
          </CButton>
        </div>
      </div>
    </CCardHeader>
    <CCardBody>
      <div class="chart-container">
        <ApexCharts 
          type="line" 
          height="350" 
          :options="chartOptions" 
          :series="chartSeries"
        />
      </div>
    </CCardBody>
  </CCard>
</template>

<script>
import { 
  CCard, 
  CCardHeader, 
  CCardBody,
  CButton
} from '@coreui/vue';
import ApexCharts from 'vue3-apexcharts';
import { RefreshCw } from 'lucide-vue-next';

export default {
  name: 'LineChart',
  components: {
    CCard,
    CCardHeader,
    CCardBody,
    CButton,
    ApexCharts,
    RefreshCw
  },
  props: {
    lineId: {
      type: String,
      required: true
    },
    lineTitle: {
      type: String,
      required: true
    },
    chartOptions: {
      type: Object,
      required: true
    },
    chartSeries: {
      type: Array,
      required: true
    }
  },
  emits: ['refresh']
}
</script>

<style scoped>
.production-line-card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.production-line-card .card-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #ebedef;
}

.chart-container {
  background-color: #fff;
  border-radius: 8px;
  padding: 10px;
}
</style>
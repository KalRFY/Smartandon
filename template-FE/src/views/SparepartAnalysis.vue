<template>
  <CRow class="mb-3">
    <CCol>
      <CCard>
        <CCardHeader style="font-weight: bold; font-size: medium;">
          Add New Machines
        </CCardHeader>
        <CCardBody>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
  <CRow>
    <CCol>
      <CCard>
        <CCardHeader style="font-weight: bold; font-size: medium;">Sparepart Change Frequency</CCardHeader>
        <CCardBody>
          <CRow>
            <CCol class="mb-3">
              <Apexchart type="line" :options="problemFrequencyOptions" :series="problemFrequencySeries" :key="formatKey"></Apexchart>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
  <CRow>
    <CCol>
      <CCard>
        <CCardHeader style="font-weight: bold; font-size: medium;">Top Sparepart Usage</CCardHeader>
        <CCardBody>
          <CRow>
            <CCol class="mb-3">
              <Apexchart type="bar" :options="sparepartUsageOptions" :series="sparepartUsageSeries"></Apexchart>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
  <CRow>
    <CCol>
      <CCard>
        <CCardHeader style="font-weight: bold; font-size: medium;">Sparepart Changes by Machine</CCardHeader>
        <CCardBody>
          <CRow>
            <CCol class="mb-3">
              <apexchart type="bar" :options="sparepartByMachineOptions" :series="sparepartByMachineSeries"></apexchart>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import { ref } from 'vue'
import { CButton, CCard, CCardBody, CCardTitle, CContainer, CTable, CTableHead, CTableBody, CTableHeaderCell, CTableRow, CTableDataCell, CCardHeader, CCardText, CoffCanvas, CAccordionItem, CFormCheck, CRow, CCol } from '@coreui/vue';
import { CChart } from '@coreui/vue-chartjs'
import ApexCharts from 'vue3-apexcharts'
import api from '../apis/CommonAPI'
import {
  AlertTriangle,
  Clock,
  Timer,
  History,
  BarChart2,
  FileText,
  CalendarClock,
  ChartColumnIncreasing,
  BookText,
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
const visibleStaticBackdropDemo = ref(false);
const visibleEnd = ref(false)

export default {
  name: 'Dashboard',
  data() {
    return {
      problemFrequencySeries: [],
      problemFrequencyOptions: {},
      formatKey: 0,
      sparepartUsageSeries: [],
      sparepartUsageOptions: {},
      sparepartByMachineSeries: [],
      sparepartByMachineOptions: {},

      submit: {
        machineName: null,
        lineName: null,
      },
    }
  },

  components: {
    AlertTriangle,
    Clock,
    Timer,
    History,
    BarChart2,
    FileText,
    CalendarClock,
    ChartColumnIncreasing,
    BookText,
    CChart,
    ApexCharts,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CoffCanvas,
    Treeselect,
    ApexCharts,
  },

  async created() {
    try {
      const response = await api.get('/smartandon/spareparts');
      if (response.status !== 200) {
        throw new Error('Failed to fetch spareparts, status: ' + response.status);
      }
      this.spareparts = response.data?.data || response.data;
      this.sparepartsOption = this.spareparts.map(sparepart => ({
        id: sparepart.sparepart_id,
        label: sparepart.sparepart_nm
      }));
    } catch (error) {
      console.error('Failed to fetch spareparts:', error);
    }
    try {
      const response = await api.get('/smartandon/machine');
      if (response.status !== 200) {
        throw new Error('Failed to fetch machines, status: ' + response.status);
      }
      this.machines = response.data?.data || response.data;
      this.machineOptions = this.machines.map(machine => ({
        id: machine.fid,
        label: machine.fmc_name
      }));
      // Extract unique makers from machines data, excluding 'unknown'
      this.makerOptions = [...new Set(this.machines.map(machine => machine.fmaker).filter(maker => maker && maker.trim() !== '' && maker.toLowerCase() !== 'unknown'))].map(maker => ({
        id: maker,
        label: maker
      }));
      // Fetch lines from dedicated endpoint
      try {
        const lineResponse = await api.get('/smartandon/line');
        this.lineOptions = lineResponse.data.map(line => ({
          id: line.fid,
          label: line.fline
        }));
      } catch (error) {
        console.error('Failed to fetch lines:', error);
        this.lineOptions = [];
      }
    } catch (error) {
      console.error('Failed to fetch machines:', error);
    }
    try {
      const problemResponse = await api.get('/smartandon/problemView', { params: { search: JSON.stringify({ limitView: 0 }) } });
      const problems = problemResponse.data?.data || problemResponse.data;
      // Filter problems where fpart_change is not null and not empty
      const sparepartChangeProblems = problems.filter(problem => problem.fpart_change && problem.fpart_change.trim() !== '');
      // Group by date (YYYY-MM-DD from fstart_time)
      const frequencyMap = {};
      sparepartChangeProblems.forEach(problem => {
        const date = new Date(problem.fstart_time).toISOString().split('T')[0];
        frequencyMap[date] = (frequencyMap[date] || 0) + 1;
      });
      // Sort dates
      const sortedDates = Object.keys(frequencyMap).sort();
      // Set series
      this.problemFrequencySeries = [{
        name: 'Sparepart Changes',
        data: sortedDates.map(date => frequencyMap[date])
      }];
      // Set options
      this.problemFrequencyOptions = {
        chart: {
          type: 'line',
          height: 350
        },
        xaxis: {
          categories: sortedDates
        },
        yaxis: {
          title: {
            text: 'Frequency'
          }
        },
        title: {
          text: 'Sparepart Change Frequency Over Time'
        }
      };
      this.formatKey = Date.now();
      // Sparepart usage frequency
      const sparepartMap = {};
      sparepartChangeProblems.forEach(problem => {
        let parts = [];
        if (problem.fpart_change) {
          if (typeof problem.fpart_change === 'string') {
            try {
              const parsed = JSON.parse(problem.fpart_change);
              if (Array.isArray(parsed)) {
                parts = parsed.map(p => p.toString().trim());
              } else {
                parts = problem.fpart_change.split(',').map(p => p.trim());
              }
            } catch {
              parts = problem.fpart_change.split(',').map(p => p.trim());
            }
          } else if (Array.isArray(problem.fpart_change)) {
            parts = problem.fpart_change.map(p => p.toString().trim());
          }
        }
        parts.forEach(part => {
          if (part) {
            sparepartMap[part] = (sparepartMap[part] || 0) + 1;
          }
        });
      });
      const sortedSpareparts = Object.entries(sparepartMap).sort((a, b) => b[1] - a[1]).slice(0, 10);
      this.sparepartUsageSeries = [{
        name: 'Usage Count',
        data: sortedSpareparts.map(([name, count]) => count)
      }];
      this.sparepartUsageOptions = {
        chart: {
          type: 'bar',
          height: 350
        },
        xaxis: {
          categories: sortedSpareparts.map(([name]) => name)
        },
        yaxis: {
          title: {
            text: 'Usage Count'
          }
        },
        title: {
          text: 'Top 10 Sparepart Usage Frequency'
        }
      };
      // Sparepart changes by machine
      const machineMap = {};
      sparepartChangeProblems.forEach(problem => {
        const machineName = problem.fmc_name || 'Unknown';
        machineMap[machineName] = (machineMap[machineName] || 0) + 1;
      });
      const sortedMachines = Object.entries(machineMap).sort((a, b) => b[1] - a[1]).slice(0, 10);
      this.sparepartByMachineSeries = [{
        name: 'Change Count',
        data: sortedMachines.map(([name, count]) => count)
      }];
      this.sparepartByMachineOptions = {
        chart: {
          type: 'bar',
          height: 350
        },
        xaxis: {
          categories: sortedMachines.map(([name]) => name)
        },
        yaxis: {
          title: {
            text: 'Change Count'
          }
        },
        title: {
          text: 'Top 10 Machines by Sparepart Changes'
        }
      };
    } catch (error) {
      console.error('Failed to fetch problems for chart:', error);
    }
  },
}
</script>

<style scoped>
.dashboard-card {
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 10px;
  overflow: hidden;
}

</style>
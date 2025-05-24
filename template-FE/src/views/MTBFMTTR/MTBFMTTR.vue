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
    
    <ViewControls
      v-model:chartViewMode="chartViewMode"
    />

    <div class="production-lines-container">
      <LineChart 
        v-for="(lineId, index) in lineIds" 
        :key="lineId"
        :lineId="lineId"
        :lineTitle="productionData[lineId].title"
        :chartOptions="getChartOptions(lineId)"
        :chartSeries="getChartSeries(lineId)"
        @refresh="refreshData"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import DashboardHeader from './components/DashboardHeader.vue';
import SearchPanel from './components/SearchPanel.vue';
import ViewControls from './components/ViewControls.vue';
import LineChart from './components/LineChart.vue';

export default {
  name: 'MTBFMTTRDashboard',
  components: {
    DashboardHeader,
    SearchPanel,
    ViewControls,
    LineChart
  },
  setup() {
    const username = ref('AndreanDjabbar');
    
    const currentTime = ref('2025-05-24 07:14:29');
    const currentDate = ref('Saturday, May 24, 2025');
    
    const startDate = ref('2025-05-01');
    const endDate = ref('2025-05-24');
    
    const chartViewMode = ref('comparison');
    
    const lineIds = [
      'lpdc', 'hpdc', 'camshaft', 'crankshaft', 
      'cylinderhead', 'cylinderblock', 'assyline'
    ];
    
    const productionData = {
      lpdc: {
        title: 'LPDC Line',
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        mtbf: [240, 180, 220, 190, 260, 200, 230, 270],
        mttr: [4.5, 6.2, 3.8, 5.1, 2.9, 4.8, 3.5, 2.7],
        availability: [98.1, 96.7, 98.3, 97.4, 98.9, 97.6, 98.5, 99.0]
      },
      hpdc: {
        title: 'HPDC Line',
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        mtbf: [210, 190, 200, 180, 220, 205, 215, 230],
        mttr: [5.0, 5.5, 4.2, 5.8, 3.5, 4.1, 3.8, 3.2],
        availability: [97.7, 97.2, 97.9, 96.9, 98.4, 98.0, 98.3, 98.6]
      },
      camshaft: {
        title: 'CAM SHAFT Line',
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        mtbf: [180, 190, 175, 185, 200, 195, 205, 210],
        mttr: [4.8, 4.5, 5.0, 4.7, 4.3, 4.5, 4.2, 4.0],
        availability: [97.4, 97.7, 97.2, 97.5, 97.9, 97.7, 98.0, 98.1]
      },
      crankshaft: {
        title: 'CRANK SHAFT Line',
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        mtbf: [210, 215, 220, 225, 230, 225, 235, 240],
        mttr: [4.2, 4.0, 3.9, 3.8, 3.7, 3.9, 3.6, 3.5],
        availability: [98.0, 98.2, 98.3, 98.3, 98.4, 98.3, 98.5, 98.6]
      },
      cylinderhead: {
        title: 'CYLINDER HEAD Line',
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        mtbf: [200, 205, 210, 215, 210, 205, 215, 220],
        mttr: [4.5, 4.4, 4.3, 4.2, 4.3, 4.4, 4.2, 4.1],
        availability: [97.8, 97.9, 98.0, 98.1, 98.0, 97.9, 98.1, 98.2]
      },
      cylinderblock: {
        title: 'CYLINDER BLOCK Line',
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        mtbf: [205, 210, 215, 220, 215, 210, 220, 225],
        mttr: [4.3, 4.2, 4.1, 4.0, 4.1, 4.2, 4.0, 3.9],
        availability: [97.9, 98.0, 98.1, 98.2, 98.1, 98.0, 98.2, 98.3]
      },
      assyline: {
        title: 'ASSY LINE',
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        mtbf: [220, 225, 230, 235, 230, 225, 235, 240],
        mttr: [3.9, 3.8, 3.7, 3.6, 3.7, 3.8, 3.6, 3.5],
        availability: [98.3, 98.3, 98.4, 98.5, 98.4, 98.3, 98.5, 98.6]
      }
    };
    
    const getChartOptions = (lineId) => {
      const lineData = productionData[lineId];
      const title = lineData.title;
      
      if (chartViewMode.value === 'comparison') {
        return {
          chart: {
            height: 350,
            type: 'line',
            stacked: false,
            toolbar: {
              show: true,
              tools: {
                download: true,
                selection: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true
              }
            },
            animations: {
              enabled: true,
              easing: 'easeinout',
              speed: 800
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            width: [4, 4],
            curve: 'smooth'
          },
          title: {
            text: title,
            align: 'left'
          },
          grid: {
            borderColor: '#e7e7e7',
            row: {
              colors: ['#f3f3f3', 'transparent'],
              opacity: 0.5
            },
          },
          markers: {
            size: 6
          },
          xaxis: {
            categories: lineData.months
          },
          yaxis: [
            {
              seriesName: 'MTBF',
              title: {
                text: "MTBF (Hours)",
                style: {
                  color: '#008FFB',
                }
              },
              labels: {
                style: {
                  colors: '#008FFB',
                }
              }
            },
            {
              seriesName: 'MTTR',
              opposite: true,
              title: {
                text: "MTTR (Hours)",
                style: {
                  color: '#FF4560',
                }
              },
              labels: {
                style: {
                  colors: '#FF4560',
                }
              }
            }
          ],
          tooltip: {
            shared: true,
            intersect: false,
            theme: 'dark',
            y: {
              formatter: function (y) {
                if (typeof y !== "undefined") {
                  return y.toFixed(1) + " hours";
                }
                return y;
              }
            }
          },
          legend: {
            horizontalAlign: 'left',
            offsetX: 40
          },
          colors: ['#008FFB', '#FF4560']
        };
      } else {
        const metric = chartViewMode.value;
        return {
          chart: {
            height: 350,
            type: 'line',
            toolbar: {
              show: true
            },
            animations: {
              enabled: true
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth',
            width: 4
          },
          title: {
            text: `${title} - ${metric.toUpperCase()}`,
            align: 'left'
          },
          grid: {
            borderColor: '#e7e7e7',
            row: {
              colors: ['#f3f3f3', 'transparent'],
              opacity: 0.5
            },
          },
          markers: {
            size: 6
          },
          xaxis: {
            categories: lineData.months
          },
          yaxis: {
            title: {
              text: metric === 'mtbf' ? "MTBF (Hours)" : "MTTR (Hours)"
            }
          },
          tooltip: {
            theme: 'dark',
            y: {
              formatter: function (y) {
                if (typeof y !== "undefined") {
                  return y.toFixed(1) + " hours";
                }
                return y;
              }
            }
          },
          colors: [metric === 'mtbf' ? '#008FFB' : '#FF4560']
        };
      }
    };
    
    const getChartSeries = (lineId) => {
      const lineData = productionData[lineId];
      
      if (chartViewMode.value === 'comparison') {
        return [
          {
            name: 'MTBF',
            type: 'line',
            data: lineData.mtbf
          },
          {
            name: 'MTTR',
            type: 'line',
            data: lineData.mttr
          }
        ];
      } else {
        return [
          {
            name: chartViewMode.value === 'mtbf' ? 'MTBF' : 'MTTR',
            data: chartViewMode.value === 'mtbf' ? lineData.mtbf : lineData.mttr
          }
        ];
      }
    };
    
    const search = () => {
      console.log('Searching with parameters:', {
        startDate: startDate.value,
        endDate: endDate.value
      });
    };
    
    const selectTimeRange = (range) => {
      const now = new Date('2025-05-24');
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch(range) {
        case 'today':
          startDate.value = formatDate(today);
          endDate.value = formatDate(now);
          break;
        case 'lastWeek': {
          const lastWeekStart = new Date(today);
          lastWeekStart.setDate(today.getDate() - 7);
          startDate.value = formatDate(lastWeekStart);
          endDate.value = formatDate(today);
          break;
        }
        case 'lastMonth': {
          const lastMonthStart = new Date(today);
          lastMonthStart.setMonth(today.getMonth() - 1);
          startDate.value = formatDate(lastMonthStart);
          endDate.value = formatDate(today);
          break;
        }
        case 'lastQuarter': {
          const lastQuarterStart = new Date(today);
          lastQuarterStart.setMonth(today.getMonth() - 3);
          startDate.value = formatDate(lastQuarterStart);
          endDate.value = formatDate(today);
          break;
        }
        case 'thisYear': {
          const thisYearStart = new Date(today.getFullYear(), 0, 1);
          startDate.value = formatDate(thisYearStart);
          endDate.value = formatDate(today);
          break;
        }
        case 'lastYear': {
          const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
          const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31);
          startDate.value = formatDate(lastYearStart);
          endDate.value = formatDate(lastYearEnd);
          break;
        }
      }
      search();
    };
    
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    const refreshData = (lineId) => {
      console.log(`Refreshing data for line: ${lineId}`);
    };
    
    onMounted(() => {
      currentTime.value = '2025-05-24 07:14:29';
      currentDate.value = 'Saturday, May 24, 2025';
    });
    
    return {
      username,
      
      currentTime,
      currentDate,
      
      startDate,
      endDate,
      search,
      selectTimeRange,
      
      chartViewMode,
      
      lineIds,
      productionData,
      
      getChartOptions,
      getChartSeries,
      refreshData
    };
  }
}
</script>

<style scoped>
.mtbf-mttr-dashboard {
  padding: 15px;
}
</style>
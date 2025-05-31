<template>
  <div class="realtime-pareto-container">
    <CCard class="search-card mb-4">
      <CCardHeader class="text-white">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <strong>Search</strong>
          </div>
        </div>
      </CCardHeader>
      <CCardBody>
        <CRow class="mb-3">
          <CCol :md="6" class="mb-3 mb-md-0">
            <CFormLabel for="start-date">Start Date</CFormLabel>
            <CInputGroup>
              <CInputGroupText>
                <Clock size="16" />
              </CInputGroupText>
              <CFormInput
                type="date"
                id="start-date"
                v-model="startDate"
              />
            </CInputGroup>
          </CCol>

          <CCol :md="6">
            <CFormLabel for="end-date">End Date</CFormLabel>
            <CInputGroup>
              <CInputGroupText>
                <Clock size="16" />
              </CInputGroupText>
              <CFormInput
                type="date"
                id="end-date"
                v-model="endDate"
              />
            </CInputGroup>
          </CCol>
        </CRow>
  
        <CRow class="mb-3">
          <CCol>
            <CFormLabel for="av-category">AV Category</CFormLabel>
            <CFormSelect
              id="av-category"
              v-model="selectedCategory"
              :options="avCategories"
            />
          </CCol>
        </CRow>

        <CRow>
          <CCol>
            <CButton color="primary" class="w-100 d-flex align-items-center justify-content-center" @click="search">
              <SearchIcon class="me-2" size="16" /> Search
            </CButton>
          </CCol>
        </CRow>
        
        <CRow class="mt-3">
          <CCol>
            <div class="quick-filter-section">
              <div class="quick-filter-title mb-2">Quick Filters</div>
              <div class="d-flex flex-wrap gap-2">
                <CBadge color="info" class="quick-filter-badge" @click="selectTimeRange('today')">Today</CBadge>
                <CBadge color="info" class="quick-filter-badge" @click="selectTimeRange('yesterdayAll')">Yesterday All</CBadge>
                <CBadge color="info" class="quick-filter-badge" @click="selectTimeRange('yesterdayDay')">Yesterday Day</CBadge>
                <CBadge color="info" class="quick-filter-badge" @click="selectTimeRange('yesterdayNight')">Yesterday Night</CBadge>
                <CBadge color="info" class="quick-filter-badge" @click="selectTimeRange('lastNight')">Last Night</CBadge>
                <CBadge color="info" class="quick-filter-badge" @click="selectTimeRange('thisMonth')">This Month</CBadge>
                <CBadge color="info" class="quick-filter-badge" @click="selectTimeRange('lastMonth')">Last Month</CBadge>
              </div>
            </div>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    <CCard class="pareto-card mb-4">
      <CCardHeader class="text-white">
        <div class="d-flex justify-content-between align-items-center">
          <h3 class="m-0">REALTIME PARETO</h3>
          <div class="d-flex align-items-center">
            <span class="me-3">{{ currentDate }}</span>
            <div class="live-indicator d-flex align-items-center">
              <span class="live-dot"></span>
              <span class="ms-1">{{ currentTime }}</span>
            </div>
          </div>
        </div>
      </CCardHeader>

      <CCardBody>
        <CRow class="mb-4">
          <CCol :md="6" class="mb-3 mb-md-0">
            <CCard class="h-100 control-card">
              <CCardBody>
                <h5 class="control-title">View Controls</h5>
                <div class="d-flex flex-wrap gap-2">
                  <CButtonGroup role="group" aria-label="Machine or Problem view">
                    <CButton 
                      :color="viewMode === 'machines' ? 'primary' : 'outline-primary'" 
                      @click="toggleViewMode('machines')"
                    >
                      <Tool size="16" class="me-1" /> Machine View
                    </CButton>
                    <CButton 
                      :color="viewMode === 'problems' ? 'primary' : 'outline-primary'" 
                      @click="toggleViewMode('problems')"
                    >
                      <AlertTriangle size="16" class="me-1" /> Problem View
                    </CButton>
                  </CButtonGroup>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol :md="6">
            <CCard class="h-100 control-card">
              <CCardBody>
                <h5 class="control-title">Metric Controls</h5>
                <div class="d-flex flex-wrap gap-2">
                  <CButtonGroup role="group" aria-label="Duration or Frequency view">
                    <CButton 
                      :color="metricMode === 'duration' ? 'primary' : 'outline-primary'" 
                      @click="toggleMetricMode('duration')"
                    >
                      <Clock size="16" class="me-1" /> Duration
                    </CButton>
                    <CButton 
                      :color="metricMode === 'frequency' ? 'primary' : 'outline-primary'" 
                      @click="toggleMetricMode('frequency')"
                    >
                      <BarChart2 size="16" class="me-1" /> Frequency
                    </CButton>
                  </CButtonGroup>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <div class="production-lines">
          <template v-for="(line, index) in productionLines" :key="index">
            <ProductionLineSection 
              :title="line.title" 
              :panelId="line.panelId"
              :chartData="getChartData(line)"
              :tableData="getTableData(line)"
              :viewMode="viewMode"
              :metricMode="metricMode"
              :minQuantity="line.minQuantity"
              @refresh="handleRefresh(line.panelId)"
              @view-item="viewItem"
              @edit-item="editItem"
              @delete-item="deleteItem"
            />
          </template>
        </div>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { 
  CCard, 
  CCardHeader, 
  CCardBody, 
  CRow, 
  CCol, 
  CFormInput, 
  CFormSelect, 
  CButton, 
  CInputGroup, 
  CInputGroupText,
  CBadge,
  CButtonGroup,
  CFormLabel
} from '@coreui/vue';
import { 
  Clock, 
  Search as SearchIcon, 
  Tool, 
  AlertTriangle, 
  BarChart2
} from 'lucide-vue-next';
import ProductionLineSection from './ProductionLineSection.vue';

export default {
  name: 'RealtimePareto',
  components: {
    CCard,
    CCardHeader,
    CCardBody,
    CRow,
    CCol,
    CFormInput,
    CFormSelect,
    CButton,
    CInputGroup,
    CInputGroupText,
    CBadge,
    CButtonGroup,
    CFormLabel,
    Clock,
    SearchIcon,
    Tool,
    AlertTriangle,
    BarChart2,
    ProductionLineSection
  },
  setup() {
    const startDate = ref('');
    const endDate = ref('');
    const selectedCategory = ref('');
    
    const avCategories = [
      { value: '', label: 'Select category' },
      { value: 'audio', label: 'Audio' },
      { value: 'video', label: 'Video' },
      { value: 'streaming', label: 'Streaming' },
      { value: 'recording', label: 'Recording' },
      { value: 'playback', label: 'Playback' }
    ];

    const currentTime = ref('');
    const currentDate = ref('');
    const viewMode = ref('machines');
    const metricMode = ref('duration');
    let clockInterval = null;

    onMounted(() => {
      const today = new Date();
      startDate.value = formatDate(today);
      endDate.value = formatDate(today);
      updateDateTime();
      clockInterval = setInterval(updateDateTime, 1000);
    });

    const productionLines = ref([
      {
        title: 'LPDC Line',
        panelId: 'PANELLP',
        minQuantity: 60,
        category: {
          problems: {
            duration: {
              items: [
                { name: 'fix die r', quantity: 103 },
                { name: 'Temperature', quantity: 80 },
                { name: 'Pasir ter', quantity: 65 },
                { name: 'shaft cyl', quantity: 60 },
                { name: 'Work basa', quantity: 57 },
              ],
            },
            frequency : {
              items: [
                { name: 'Pasir ter', quantity: 3 },
                { name: 'binder ti', quantity: 2 },
                { name: 'Work basa', quantity: 2 },
                { name: 'Lower tie', quantity: 1 },
                { name: 'Feeding h', quantity: 1 },
              ],
            }
          },
          machines: {
            duration: {
              items: [
              { name: 'IKDM-003', quantity: 118 },
              { name: 'IKCM-004', quantity: 104 },
              { name: 'IKDM-004', quantity: 90 },
              { name: 'IKMC-001', quantity: 77 },
              { name: 'IKDM-002', quantity: 70 },
              ],
            },
            frequency : {
              items: [
                { name: 'IKDM-004', quantity: 4 },
                { name: 'IKDM-003', quantity: 4 },
                { name: 'IKMC-001', quantity: 3 },
                { name: 'IKCM-005', quantity: 3 },
                { name: 'IKCM-001', quantity: 3 },
              ],
            }
          }
        }
      },
      {
        title: 'HPDC Line',
        panelId: 'PANELDC',
        minQuantity: 30,
        category: {
          problems: {
            duration: {
              items: [
                { name: 'Enterance', quantity: 58 },
                { name: 'Hing Pin', quantity: 30 },
                { name: 'Kabel Rob', quantity: 17 },
                { name: 'Work OK T', quantity: 15 },
                { name: 'Robot Sed', quantity: 15 },
              ],
            },
            frequency : {
              items: [
                { name: 'Enterance', quantity: 1 },
                { name: 'Enterance', quantity: 1 },
                { name: 'collision', quantity: 1 },
                { name: 'Work OK T', quantity: 1 },
                { name: 'Part Pass', quantity: 1 },
              ],
            }
          },
          machines: {
            duration: {
              items: [
              { name: 'IKFH-101', quantity: 89 },
              { name: 'IKZV-003', quantity: 33 },
              { name: 'IKZV-004', quantity: 25 },
              { name: 'IKZV-0006', quantity: 15 },
              { name: 'IKDM-102', quantity: 15 },
              ],
            },
            frequency : {
              items: [
                { name: 'IKFH-101', quantity: 4 },
                { name: 'IKZV-003', quantity: 2 },
                { name: 'IKZV-004', quantity: 2 },
                { name: 'IKFH-102', quantity: 1 },
                { name: 'IKZV-0006', quantity: 1 },
              ],
            }
          }
        }
      },
      {
        title: 'CAM SHAFT Line',
        panelId: 'PANELCAM',
        minQuantity: 50,
        category: {
          problems: {
            duration: {
              items: [
                { name: 'Alarm 447', quantity: 94 },
                { name: 'Part shor', quantity: 39 },
                { name: 'Tykma tid', quantity: 22 },
                { name: 'Area sens', quantity: 10 },
                { name: 'Start fau', quantity: 10 },
              ],
            },
            frequency : {
              items: [
                { name: 'Part shor', quantity: 2 },
                { name: 'Spindle n', quantity: 1 },
                { name: 'Area sens', quantity: 1 },
                { name: 'Spindle u', quantity: 1 },
                { name: 'Grinding', quantity: 1 },
              ],
            }
          },
          machines: {
            duration: {
              items: [
              { name: 'IMGR-0009', quantity: 95 },
              { name: 'IMGR-0016', quantity: 48 },
              { name: 'IMGR-0011', quantity: 38 },
              { name: 'RAW MATER', quantity: 21 },
              { name: 'IMSP-0110', quantity: 20 },
              ],
            },
            frequency : {
              items: [
                { name: 'IMSP-0110', quantity: 2 },
                { name: 'IMGR-0011', quantity: 2 },
                { name: 'IMMM-0019', quantity: 2 },
                { name: 'IMAT-0016', quantity: 2 },
                { name: 'IMMM-0020', quantity: 1 },
              ],
            }
          }
        }
      },
      {
        title: 'CYLINDER HEAD Line',
        panelId: 'PANELCH',
        minQuantity: 60,
        category: {
          problems: {
            duration: {
              items: [
                { name: 'Touch sen', quantity: 105 },
                { name: 'Touch sen', quantity: 39 },
                { name: 'Valve gui', quantity: 30 },
                { name: 'Overload', quantity: 30 },
                { name: 'Jig fault', quantity: 22 },
              ],
            },
            frequency : {
              items: [
                { name: 'Touch sen', quantity: 5 },
                { name: 'A2ax: V R', quantity: 3 },
                { name: 'Touch sen', quantity: 3 },
                { name: 'Dual chec', quantity: 2 },
                { name: 'Jig fault', quantity: 2 },
              ],
            }
          },
          machines: {
            duration: {
              items: [
              { name: 'IMSP-0014', quantity: 105 },
              { name: 'Loader fi', quantity: 96 },
              { name: 'IMAT-0001', quantity: 60 },
              { name: 'IMSP-0035', quantity: 30 },
              { name: 'IMSP-0026', quantity: 26 },
              ],
            },
            frequency : {
              items: [
                { name: 'IMSP-0014', quantity: 5 },
                { name: 'IMSP-0026', quantity: 4 },
                { name: 'IMSP-0035', quantity: 2 },
                { name: 'IMAT-0001', quantity: 2 },
                { name: 'IMSP-0052', quantity: 2 },
              ],
            }
          }
        }
      },
      {
        title: 'CYLINDER BLOCK Line',
        panelId: 'PANELCB',
        minQuantity: 40,
        category: {
          problems: {
            duration: {
              items: [
              { name: 'Touch sen', quantity: 73 },
              { name: 'Lifter ri', quantity: 65 },
              { name: 'CC det UL', quantity: 30 },
              { name: 'Low air p', quantity: 25 },
              { name: '3st Fr Io', quantity: 15 },
              ],
            },
            frequency : {
              items: [
                { name: 'Lifter ri', quantity: 3 },
                { name: 'Low air p', quantity: 2 },
                { name: 'CC det UL', quantity: 2 },
                { name: 'Touch sen', quantity: 2 },
                { name: 'ZM execes', quantity: 2 },
              ],
            }
          },
          machines: {
            duration: {
              items: [
              { name: 'IMSP-0056', quantity: 75 },
              { name: 'IMSP-0080', quantity: 50 },
              { name: 'IMWB-0011', quantity: 32 },
              { name: 'IMTS-0007', quantity: 20 },
              { name: 'IMZK-0003', quantity: 15 },
              ],
            },
            frequency : {
              items: [
                { name: 'IMWB-0011', quantity: 3 },
                { name: 'IMSP-0079', quantity: 2 },
                { name: 'IMSP-0056', quantity: 2 },
                { name: 'IMTS-0007', quantity: 2 },
                { name: 'IMMM-0027', quantity: 2 },
              ],
            }
          }
        }
      },
      {
        title: 'CRANK SHAFT Line',
        panelId: 'PANELCR',
        minQuantity: 15,
        category: {
          problems: {
            duration: {
              items: [
              { name: 'Servo X f', quantity: 30 },
              { name: 'Error 24', quantity: 30 },
              { name: 'Clamp cla', quantity: 20 },
              { name: 'Spindle u', quantity: 20 },
              { name: 'Diameter', quantity: 20 },
              ],
            },
            frequency : {
              items: [
                { name: 'Tool chan', quantity: 2 },
                { name: 'Clamp cla', quantity: 1 },
                { name: 'Longitudi', quantity: 1 },
                { name: 'Servo X f', quantity: 1 },
              ],
            }
          },
          machines: {
            duration: {
              items: [
              { name: 'IMLP-0002', quantity: 75 },
              { name: 'IMGR-0006', quantity: 50 },
              { name: 'AUTO LOAD', quantity: 50 },
              { name: 'IMWB-0018', quantity: 30 },
              { name: 'IMSP-0096', quantity: 20 },
              ],
            },
            frequency : {
              items: [
                { name: 'IMGR-0006', quantity: 4 },
                { name: 'AUTO LOAD', quantity: 3 },
                { name: 'IMCK-0001', quantity: 3 },
                { name: 'RAW MATER', quantity: 2 },
                { name: 'IMCK-0002', quantity: 2 },
              ],
            }
          }
        }
      },
      {
        title: 'ASSY LINE',
        panelId: 'PANELASSY',
        minQuantity: 5,
        category: {
          problems: {
            duration: {
              items: [
              { name: 'PLC link', quantity: 10 },
              { name: 'Loader En', quantity: 9 },
              { name: 'Cycle tim', quantity: 8 },
              { name: 'Plc bater', quantity: 5 },
              { name: 'Water lea', quantity: 5 },
              ],
            },
            frequency : {
              items: [
                { name: 'Cycle tim', quantity: 2 },
                { name: 'PLC link', quantity: 2 },
                { name: 'Loader En', quantity: 2 },
                { name: 'Plc bater', quantity: 1 },
                { name: 'Water kea', quantity: 1 },
              ],
            }
          },
          machines: {
            duration: {
              items: [
              { name: 'IMCK 5-1-', quantity: 15 },
              { name: 'Loader', quantity: 13 },
              { name: 'Not Runne', quantity: 10 },
              { name: 'IMTS-0038', quantity: 10 },
              { name: 'IMTS-0028', quantity: 10 },
              ],
            },
            frequency : {
              items: [
                { name: 'IMCK 5-1-', quantity: 3 },
                { name: 'Loader', quantity: 3 },
                { name: 'IMCK 5-2-', quantity: 2 },
                { name: 'IMAT-0011', quantity: 2 },
                { name: 'IMTS-0028', quantity: 2 },
              ],
            }
          }
        }
      }
    ]);

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const selectTimeRange = (range) => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      switch(range) {
        case 'today':
          startDate.value = formatDate(today);
          endDate.value = formatDate(now);
          break;
        case 'yesterdayAll':
          startDate.value = formatDate(yesterday);
          endDate.value = formatDate(yesterday);
          break;
        case 'yesterdayDay': {
          startDate.value = formatDate(yesterday);
          const yesterdayDay = new Date(yesterday);
          yesterdayDay.setHours(18, 0, 0, 0);
          endDate.value = formatDate(yesterdayDay);
          break;
        }
        case 'yesterdayNight': {
          const yesterdayEvening = new Date(yesterday);
          yesterdayEvening.setHours(18, 0, 0, 0);
          startDate.value = formatDate(yesterdayEvening);
          endDate.value = formatDate(yesterday);
          break;
        }
        case 'lastNight': {
          const lastNightStart = new Date(yesterday);
          lastNightStart.setHours(18, 0, 0, 0);
          startDate.value = formatDate(lastNightStart);
          const lastNightEnd = new Date(today);
          lastNightEnd.setHours(6, 0, 0, 0);
          endDate.value = formatDate(lastNightEnd);
          break;
        }
        case 'thisMonth':
          startDate.value = formatDate(new Date(now.getFullYear(), now.getMonth(), 1));
          endDate.value = formatDate(now);
          break;
        case 'lastMonth':
          startDate.value = formatDate(new Date(now.getFullYear(), now.getMonth() - 1, 1));
          endDate.value = formatDate(new Date(now.getFullYear(), now.getMonth(), 0));
          break;
      }
      search();
    };

    const search = () => {
      console.log('Searching with parameters:', {
        startDate: startDate.value,
        endDate: endDate.value,
        category: selectedCategory.value
      });
    };

    const updateDateTime = () => {
      const now = new Date();
      currentDate.value = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      currentTime.value = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
    };

    const toggleViewMode = (mode) => {
      viewMode.value = mode;
    };

    const toggleMetricMode = (mode) => {
      metricMode.value = mode;
    };

    const getChartData = (line) => {
      if (!line || !line.category) {
        return [];
      }
      
      const categoryKey = viewMode.value === 'machines' ? 'machines' : 'problems';
      if (!line.category[categoryKey]) {
        return [];
      }
      
      if (!line.category[categoryKey][metricMode.value]) {
        return [];
      }
      
      const items = line.category[categoryKey][metricMode.value].items;
      if (!items || !Array.isArray(items)) {
        return [];
      }
      
      try {
        return items.map(item => ({
          name: item.name || '',
          quantity: item.quantity || 0,
          value: item.quantity || 0,
          percentage: calculatePercentage(item.quantity || 0, getTotalQuantity(items))
        }));
      } catch (err) {
        console.error('Error mapping chart data:', err);
        return [];
      }
    };
    
    const getTotalQuantity = (items) => {
      try {
        return items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      } catch (err) {
        console.error('Error calculating total quantity:', err);
        return 0;
      }
    };
    
    const calculatePercentage = (value, total) => {
      return total > 0 ? Math.round((value / total) * 100) : 0;
    };

    const getTableData = (line) => {
      if (!line || !line.category) {
        return [];
      }
      
      const categoryKey = viewMode.value === 'machines' ? 'machines' : 'problems';
      
      if (!line.category[categoryKey]) {
        return [];
      }
      
      if (!line.category[categoryKey][metricMode.value]) {
        return [];
      }
      
      const items = line.category[categoryKey][metricMode.value].items;
      
      if (!items || !Array.isArray(items)) {
        return [];
      }
      
      try {
        return items.map((item, index) => ({
          no: index + 1,
          date: new Date().toLocaleDateString(),
          machine: viewMode.value === 'machines' ? item.name : `${line.title.split(' ')[0]}-M${index + 1}`,
          problem: viewMode.value === 'problems' ? item.name : `Problem ${index + 1}`,
          pic: `Operator ${index + 1}`,
          duration: metricMode.value === 'duration' ? `${item.quantity} min` : `${item.quantity} times`,
          quantity: item.quantity || 0,
          actions: ['view', 'edit', 'delete']
        }));
      } catch (err) {
        console.error('Error generating table data:', err);
        return [];
      }
    };
    
    const handleRefresh = (panelId) => {
      console.log(`Refreshing panel: ${panelId}`);
    };
    
    const viewItem = (item) => {
      console.log('View item:', item);
    };
    
    const editItem = (item) => {
      console.log('Edit item:', item);
    };
    
    const deleteItem = (item) => {
      console.log('Delete item:', item);
    };

    onUnmounted(() => {
      if (clockInterval) {
        clearInterval(clockInterval);
      }
    });

    return {
      startDate,
      endDate,
      selectedCategory,
      avCategories,
      selectTimeRange,
      search,
      
      currentTime,
      currentDate,
      viewMode,
      metricMode,
      productionLines,
      toggleViewMode,
      toggleMetricMode,
      
      getChartData,
      getTableData,
      
      handleRefresh,
      viewItem,
      editItem,
      deleteItem
    };
  }
}
</script>

<style scoped>
.realtime-pareto-container {
  padding: 15px;
}

.search-card, .pareto-card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  border: none;
}

.search-card .card-header, .pareto-card .card-header {
  background-color: #3c4b64;
  border-bottom: none;
}

.pareto-card .control-card {
  border: 1px solid #ebedef;
  box-shadow: none;
}

.control-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #3c4b64;
}

.live-indicator {
  display: flex;
  align-items: center;
}

.live-dot {
  width: 8px;
  height: 8px;
  background-color: #20c997;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

.production-lines {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Quick filters from original component */
.quick-filter-section {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;
}

.quick-filter-title {
  font-size: 0.875rem;
  font-weight: 600;
}

.quick-filter-badge {
  cursor: pointer;
  padding: 8px 12px;
  transition: all 0.2s ease;
}

.quick-filter-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(32, 201, 151, 0.7);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(32, 201, 151, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(32, 201, 151, 0);
  }
}

@media (max-width: 768px) {
  .quick-filter-section .d-flex {
    flex-wrap: wrap;
    gap: 8px;
  }

  .quick-filter-badge {
    margin-bottom: 5px;
  }

  .control-card {
    margin-bottom: 10px;
  }
}
</style>
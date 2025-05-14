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
  </div>
  
  <CButton style="width: 100%; font-size: 24px; font-weight: bold;" class="mb-3" color="primary" shape="rounded-pill" @click="onClickInput">Machine Stop Input</CButton>

  <div>
    <CModal 
      :visible="visibleLiveDemo"
      @close="() => { visibleLiveDemo = false }"
      aria-labelledby="LiveDemoExampleLabel"
    >
      <CModalHeader>
        <CModalTitle id="LiveDemoExampleLabel">Machine Stop Input</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm 
          class="row g-3 needs-validation" 
          novalidate 
          :validated="validatedCustom01" 
          @submit="handleSubmitCustom01"
        >
          <CCol md="8">
            <CFormInput
              feedbackValid="Looks good!"
              id="machineName"
              label="Machine Name"
              required
              v-model="submit.machineName"
            />
          </CCol>
          <CCol md="4">
            <CFormSelect
              aria-describedby="validationCustom04Feedback"
              feedbackInvalid="Please select the line."
              id="lineSelect"
              label="Line"
              required
              v-model="submit.line"
            >
              <option selected="" disabled="" value="">
                Choose Line...
              </option>
              <option value="LPDC">LPDC</option>
              <option value="HPDC">HPDC</option>
              <option value="CRANK SHAFT">CRANK SHAFT</option>
              <option value="CYLINDER HEAD">CYLINDER HEAD</option>
              <option value="CYLINDER BLOCK">CYLINDER BLOCK</option>
              <option value="CAM SHAFT">CAM SHAFT</option>
              <option value="ASSY LINE">ASSY LINE</option>
            </CFormSelect>
          </CCol>
          <CCol md="12">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Problems"
              required
              v-model="submit.problems"
            />
          </CCol>
          <CCol xs="12">
            <CFormCheck
              feedbackInvalid="You must agree before submitting."
              id="invalidCheck"
              label="Agree to terms and conditions"
              required
              type="checkbox"
              v-model="submit.agreeTerms"
            />
          </CCol>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="() => { visibleLiveDemo = false }">
          Close
        </CButton>

        <CButton color="primary" @click="saveSubmit">Submit</CButton>
      </CModalFooter>
    </CModal>
  </div>

  <CRow>
    <CCol class="mb-3">
      <CTable v-if="types.length" bordered hover responsive>
        <CTableHead>
          <CTableRow>
            <!-- <CTableHeaderCell>No</CTableHeaderCell> -->
            <CTableHeaderCell scope="col">Type ID</CTableHeaderCell>
            <CTableHeaderCell scope="col">Type Name</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow  v-for="type in types" :key="type.type_id">
            <CTableDataCell>{{ type.type_id }}</CTableDataCell>
            <CTableDataCell>{{ type.type_nm }}</CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
      <p v-else>Loading data...</p>
    </CCol>
  </CRow>

  <CRow>
    <CCol class="mb-3">
      <CTable v-if="types.length" bordered hover responsive>
        <CTableHead>
          <CTableRow>
            <!-- <CTableHeaderCell>No</CTableHeaderCell> -->
            <CTableHeaderCell scope="col">Type ID</CTableHeaderCell>
            <CTableHeaderCell scope="col">Type Name</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow  v-for="type in types" :key="type.type_id">
            <CTableDataCell>{{ type.type_id }}</CTableDataCell>
            <CTableDataCell>{{ type.type_nm }}</CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
      <p v-else>Loading data...</p>
    </CCol>
  </CRow>

  <CRow>
    <CCol>
      <CCard class="mb-3">
        <CCardBody>
          <CRow>
            <CCol>
              <CCard class="mb-3">
                <CCardBody>
                  <CCardTitle>LPDC</CCardTitle>
                  <CChart
                    height="100px"
                    type="line"
                    :wrapper="false"
                    :data="{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(220, 220, 220, 0.2)',
                          borderColor: 'rgba(220, 220, 220, 1)',
                          pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                          pointBorderColor: '#fff',
                          data: [40, 20, 12, 39, 10, 40, 39]
                        },
                        {
                          label: 'My Second dataset',
                          backgroundColor: 'rgba(151, 187, 205, 0.2)',
                          borderColor: 'rgba(151, 187, 205, 1)',
                          pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                          pointBorderColor: '#fff',
                          data: [50, 12, 28, 29, 7, 25, 12]
                        }
                      ]
                    }"
                  />

                  <ApexCharts type="line" height="350" :options="chartOptions" :series="series"></ApexCharts>

                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CCard class="mb-3">
                <CCardBody>
                  <CCardTitle>HPDC</CCardTitle>
                  <CChart
                    height="100px"
                    type="line"
                    :wrapper="false"
                    :data="{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(220, 220, 220, 0.2)',
                          borderColor: 'rgba(220, 220, 220, 1)',
                          pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                          pointBorderColor: '#fff',
                          data: [40, 20, 12, 39, 10, 40, 39]
                        },
                        {
                          label: 'My Second dataset',
                          backgroundColor: 'rgba(151, 187, 205, 0.2)',
                          borderColor: 'rgba(151, 187, 205, 1)',
                          pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                          pointBorderColor: '#fff',
                          data: [50, 12, 28, 29, 7, 25, 12]
                        }
                      ]
                    }"
                  />
                
                  <ApexCharts type="line" height="350" :options="chartOptions" :series="series"></ApexCharts>
                
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CCard class="mb-3">
                <CCardBody>
                  <CCardTitle>CAM SHAFT</CCardTitle>
                  <CChart
                    height="100px"
                    type="line"
                    :wrapper="false"
                    :data="{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(220, 220, 220, 0.2)',
                          borderColor: 'rgba(220, 220, 220, 1)',
                          pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                          pointBorderColor: '#fff',
                          data: [40, 20, 12, 39, 10, 40, 39]
                        },
                        {
                          label: 'My Second dataset',
                          backgroundColor: 'rgba(151, 187, 205, 0.2)',
                          borderColor: 'rgba(151, 187, 205, 1)',
                          pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                          pointBorderColor: '#fff',
                          data: [50, 12, 28, 29, 7, 25, 12]
                        }
                      ]
                    }"
                  />

                  <ApexCharts type="line" height="350" :options="chartOptions" :series="series"></ApexCharts>

                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CCard class="mb-3">
                <CCardBody>
                  <CCardTitle>CRANK SHAFT</CCardTitle>
                  <CChart
                    height="100px"
                    type="line"
                    :wrapper="false"
                    :data="{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(220, 220, 220, 0.2)',
                          borderColor: 'rgba(220, 220, 220, 1)',
                          pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                          pointBorderColor: '#fff',
                          data: [40, 20, 12, 39, 10, 40, 39]
                        },
                        {
                          label: 'My Second dataset',
                          backgroundColor: 'rgba(151, 187, 205, 0.2)',
                          borderColor: 'rgba(151, 187, 205, 1)',
                          pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                          pointBorderColor: '#fff',
                          data: [50, 12, 28, 29, 7, 25, 12]
                        }
                      ]
                    }"
                  />

                  <ApexCharts type="line" height="350" :options="chartOptions" :series="series"></ApexCharts>

                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CCard class="mb-3">
                <CCardBody>
                  <CCardTitle>CYLINDER HEAD</CCardTitle>
                  <CChart
                    height="100px"
                    type="line"
                    :wrapper="false"
                    :data="{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(220, 220, 220, 0.2)',
                          borderColor: 'rgba(220, 220, 220, 1)',
                          pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                          pointBorderColor: '#fff',
                          data: [40, 20, 12, 39, 10, 40, 39]
                        },
                        {
                          label: 'My Second dataset',
                          backgroundColor: 'rgba(151, 187, 205, 0.2)',
                          borderColor: 'rgba(151, 187, 205, 1)',
                          pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                          pointBorderColor: '#fff',
                          data: [50, 12, 28, 29, 7, 25, 12]
                        }
                      ]
                    }"
                  />

                  <ApexCharts type="line" height="350" :options="chartOptions" :series="series"></ApexCharts>

                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CCard class="mb-3">
                <CCardBody>
                  <CCardTitle>CYLINDER BLOCK</CCardTitle>
                  <CChart
                    height="100px"
                    type="line"
                    :wrapper="false"
                    :data="{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(220, 220, 220, 0.2)',
                          borderColor: 'rgba(220, 220, 220, 1)',
                          pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                          pointBorderColor: '#fff',
                          data: [40, 20, 12, 39, 10, 40, 39]
                        },
                        {
                          label: 'My Second dataset',
                          backgroundColor: 'rgba(151, 187, 205, 0.2)',
                          borderColor: 'rgba(151, 187, 205, 1)',
                          pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                          pointBorderColor: '#fff',
                          data: [50, 12, 28, 29, 7, 25, 12]
                        }
                      ]
                    }"
                  />
                  
                  <ApexCharts type="line" height="350" :options="chartOptions" :series="series"></ApexCharts>

                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <CCard class="mb-3">
                <CCardBody>
                  <CCardTitle>ASSY LINE</CCardTitle>
                  <CChart
                    height="100px"
                    type="line"
                    :wrapper="false"
                    :data="{
                      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(220, 220, 220, 0.2)',
                          borderColor: 'rgba(220, 220, 220, 1)',
                          pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                          pointBorderColor: '#fff',
                          data: [40, 20, 12, 39, 10, 40, 39]
                        },
                        {
                          label: 'My Second dataset',
                          backgroundColor: 'rgba(151, 187, 205, 0.2)',
                          borderColor: 'rgba(151, 187, 205, 1)',
                          pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                          pointBorderColor: '#fff',
                          data: [50, 12, 28, 29, 7, 25, 12]
                        }
                      ]
                    }"
                  />

                  <ApexCharts type="line" height="350" :options="chartOptions" :series="series"></ApexCharts>

                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>

</template>

<script>
import { ref } from 'vue'
import { CButton, CCard, CCardBody, CCardTitle, CContainer, CTable, CTableHead, CTableBody, CTableHeaderCell, CTableRow, CTableDataCell } from '@coreui/vue';
import axios from 'axios';
import { CChart } from '@coreui/vue-chartjs'
import ApexCharts from 'vue3-apexcharts'
import MainChartExample from './charts/MainChartExample'
import WidgetsStatsA from './widgets/WidgetsStatsTypeA.vue'
import WidgetsStatsD from './widgets/WidgetsStatsTypeD.vue'
import api from '../apis/CommonAPI'
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

const visibleStaticBackdropDemo = ref(false);


export default {
  name: 'Dashboard',
  data() {
    return {
      
      types: [],

      visibleLiveDemo: false,
      submit: {},

      series: [{
        name: 'Income',
        type: 'column',
        data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6]
      }, {
        name: 'Cashflow',
        type: 'column',
        data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5]
      }, {
        name: 'Revenue',
        type: 'line',
        data: [20, 29, 37, 36, 44, 45, 50, 58]
      }],
      chartOptions: {
        chart: {
          height: 350,
          type: 'line',
          stacked: false
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: [1, 1, 4]
        },
        title: {
          text: 'XYZ - Stock Analysis (2009 - 2016)',
          align: 'left',
          offsetX: 110
        },
        xaxis: {
          categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
        },
        yaxis: [
          {
            seriesName: 'Income',
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#008FFB'
            },
            labels: {
              style: {
                colors: '#008FFB',
              }
            },
            title: {
              text: "Income (thousand crores)",
              style: {
                color: '#008FFB',
              }
            },
            tooltip: {
              enabled: true
            }
          },
          {
            seriesName: 'Cashflow',
            opposite: true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#00E396'
            },
            labels: {
              style: {
                colors: '#00E396',
              }
            },
            title: {
              text: "Operating Cashflow (thousand crores)",
              style: {
                color: '#00E396',
              }
            },
          },
          {
            seriesName: 'Revenue',
            opposite: true,
          }
        ],
      },
    };
  },

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
    BookText,
    CChart,
    ApexCharts,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
  },
  setup() {
    const router = useRouter();
    
    const progressGroupExample1 = [
      { title: 'Monday', value1: 34, value2: 78 },
      { title: 'Tuesday', value1: 56, value2: 94 },
      { title: 'Wednesday', value1: 12, value2: 67 },
      { title: 'Thursday', value1: 43, value2: 91 },
      { title: 'Friday', value1: 22, value2: 73 },
      { title: 'Saturday', value1: 53, value2: 82 },
      { title: 'Sunday', value1: 9, value2: 69 },
    ]
    const progressGroupExample2 = [
      { title: 'Male', icon: 'cil-user', value: 53 },
      { title: 'Female', icon: 'cil-user-female', value: 43 },
    ]
    const progressGroupExample3 = [
      {
        title: 'Organic Search',
        icon: 'cib-google',
        percent: 56,
        value: '191,235',
      },
      { title: 'Facebook', icon: 'cib-facebook', percent: 15, value: '51,223' },
      { title: 'Twitter', icon: 'cib-twitter', percent: 11, value: '37,564' },
      { title: 'LinkedIn', icon: 'cib-linkedin', percent: 8, value: '27,319' },
    ]
    const tableExample = [
      
    ]

    const dashboardCards = [
      {
        title: 'Machine Stop Input',
        icon: 'AlertTriangle',
        description: 'Record and monitor machine stop events',
        color: 'danger',
        route: '/machine-stop'
      },
      {
        title: 'MTBF',
        icon: 'Clock',
        description: 'Mean Time Between Failures metrics',
        color: 'info',
        route: '/mtbf'
      },
      {
        title: 'MTTR',
        icon: 'Timer',
        description: 'Mean Time To Repair analytics',
        color: 'warning',
        route: '/mttr'
      },
      {
        title: 'Problem History',
        icon: 'History',
        description: 'Historical issues and resolutions',
        color: 'primary',
        route: '/app/ProblemHistory'
      },
      {
        title: 'Realtime Pareto',
        icon: 'BarChart2',
        description: 'Live Pareto analysis of issues',
        color: 'success',
        route: '/app/RealtimeParetto'
      },
      {
        title: 'LTB Report',
        icon: 'FileText',
        description: 'Last Time Buy reporting and analysis',
        color: 'secondary',
        route: '/ltb-report'
      }
    ]

    const navigateTo = (route) => {
      router.push(route);
    }

    return {
      tableExample,
      progressGroupExample1,
      progressGroupExample2,
      progressGroupExample3,
      dashboardCards,
      navigateTo
    }
    
  },

  methods: {
    onClickInput() {
      this.visibleLiveDemo = true
    },
  
    async saveSubmit() {
      if(!this.submit.machineName){
        alert("Please input machine name")
      } else if(!this.submit.line){
        alert("Please input line")
      } else if(!this.submit.problems){
        alert("Please input problems")
      } else if(!this.submit.agreeTerms){
        alert("You must agree to terms and conditions before submitting")
      } else {
        try {
          const payload = {
            machineName: this.submit.machineName,
            lineName: this.submit.line,
            problemDescription: this.submit.problems,
          };
          const response = await api.post('/smartandon/dashboard/new-machine-input', payload);
          if (response.data.status === 'success') {
            alert('Input saved successfully');
            this.visibleLiveDemo = false;
            this.submit = {};
          } else {
            alert('Failed to save input');
          }
        } catch (error) {
          console.log(error.message)
          alert('Error saving input: ' + error.message);
        }
      }
    }

  },

  async created() {
    try {
      const response = await axios.get('/api/smartandon/qcc-m-types');
      this.types = response.data;
    } catch (error) {
      console.error('Failed to fetch qcc_m_types:', error);
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

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.icon-container {
  padding: 15px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-description {
  color: rgba(255, 255, 255, 0.8);
  margin-top: 10px;
}




p {
  font-style: italic;
}





</style>
<template>
  
  <CRow class="mb-3">
    <CCol>
      <CCard>
        <CCardHeader>Search</CCardHeader>
        <CCardBody>
          <CRow class="mb-3">
            <CCol>
              <CFormLabel for="basic-url">Start</CFormLabel>
              <CInputGroup>
                <CInputGroupText id="basic-addon1"><Clock size="16" /></CInputGroupText>
                <CFormInput placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"/>
              </CInputGroup>
            </CCol>
            <CCol>
              <CFormLabel for="basic-url">Finish</CFormLabel>
              <CInputGroup>
                <CInputGroupText id="basic-addon1"><Clock size="16" /></CInputGroupText>
                <CFormInput placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"/>
              </CInputGroup>
            </CCol>
          </CRow>
          <CRow class="mb-3">
            <CCol>
              <CCol class="md-6">
                <label for="machineSelect" class="form-label">Line</label>
                <Treeselect
                  id="lineSelect"
                  v-model="submit.line"
                  :multiple="false"
                  :flat="true"
                  :options="lineOptions"
                  :searchable="true"
                  :clearable="true"
                  placeholder="Select or input line"
                  @input="onMachineInput"
                  :value-consists-of="['id']"
                  :value-key="'id'"
                  :label-key="'label'"
                />
              </CCol>
              <!-- <CFormLabel for="basic-url">Line</CFormLabel>
              <CInputGroup>
                <CInputGroupText as="label" for="inputGroupSelect01">Line</CInputGroupText>
                <CFormSelect
                  aria-describedby="validationCustom04Feedback"
                  feedbackInvalid="Please select the line."
                  id="inputGroupSelect01"
                  required
                  v-model="submit.line"
                >
                  <option selected disabled value="">Choose Line...</option>
                  <option v-for="line in lines" :key="line.fid" :value="line.fline">{{ line.fline }}</option>
                </CFormSelect>
              </CInputGroup> -->
            </CCol>
            <CCol md="6">
              <label for="machineSelect" class="form-label">Machine Name</label>
              <Treeselect
                id="machineSelect"
                v-model="submit.machineName"
                :options="machineOptions"
                :searchable="true"
                :clearable="true"
                :children="false"
                placeholder="Select or input machine"
                @input="onMachineInput"
                :value-consists-of="['id']"
                :value-key="'id'"
                :label-key="'label'"
              />
            </CCol>
            <!-- <CCol>
              <CFormLabel for="basic-url">Machine</CFormLabel>
              <CInputGroup>
                <CInputGroupText id="basic-addon1">Machine</CInputGroupText>
                <CFormInput placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"/>
              </CInputGroup>
            </CCol> -->
          </CRow>
          <CRow class="mb-3">
            <CFormLabel for="basic-url">Problem</CFormLabel>
            <CInputGroup>
                <CInputGroupText id="basic-addon1">Problem</CInputGroupText>
                <CFormInput placeholder="Username" aria-label="Username" aria-describedby="basic-addon1"/>
            </CInputGroup>
          </CRow>
          <hr></hr>
          <CRow>
            <CCol sm="2">
              <CButton style="width: 100%" color="dark" variant="outline" @click="reset">Reset</CButton>
            </CCol>
            <CCol sm="10">
              <CButton style="width: 100%" color="primary" @click="search">Search</CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>

  <CRow>
    <CCol>
      <CCard>
        <CCardHeader>Table History</CCardHeader>
        <CCardBody>
          <CRow>
            <CRow>
              <CCol>
                <CFormLabel style="font-weight: bold">Filters</CFormLabel>
                <CRow>
                  <CCol sm="3">
                    <CButton style="width: 100%; font-weight: bold; color: white" color="info" @click="freq">Frequency Problem</CButton>
                  </CCol>
                  <CCol sm="7">
                    <CButton style="width: 50%; font-weight: bold; color: white" color="info" @click="ltb">LTB</CButton>
                  </CCol>
                </CRow>
              </CCol>
            <CCol sm="2">
              <CFormLabel style="font-weight: bold;">Download Excel</CFormLabel>
              <CButton style="width: 100%; font-weight: bold; color: white" color="success" @click="download">Download</CButton>
            </CCol>
          </CRow>
          </CRow>

          <hr></hr>

          <CRow>
            <CCol>
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">No</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Machine</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Problem</CTableHeaderCell>
                    <CTableHeaderCell scope="col">PIC</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Duration</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    <CTableHeaderCell scope="col">LTB Reports</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell>1</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>2</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>3</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>4</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>5</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>6</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>7</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>8</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>9</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                    <CTableDataCell>Cell</CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
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
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'

const visibleStaticBackdropDemo = ref(false);


export default {
  name: 'Dashboard',
  data() {
    return {
      
      types: [],
      lines: [],
      lineOptions: [],
      machines: [],
      machineOptions: [],

      visibleLiveDemo: false,
      submit: {
        machineName: null, // initialize as null to avoid showing [object Object]
      },

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
    Treeselect
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
    try {
      const response = await axios.get('/api/smartandon/line');
      this.lines = response.data;
    } catch (error) {
      console.error('Failed to fetch qcc_m_types:', error);
    }
    try {
      const response = await axios.get('/api/smartandon/machine');
      this.machines = response.data;
      this.machineOptions = response.data.map(machine => ({
        id: machine.fid,
        label: machine.fmc_name
      }));
    } catch (error) {
      console.error('Failed to fetch machines:', error);
    }
    try {
      const response = await axios.get('/api/smartandon/line');
      this.lines = response.data;
      this.lineOptions = response.data.map(line => ({
        id: line.fid,
        label: line.fline
      }));
    } catch (error) {
      console.error('Failed to fetch lines:', error);
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
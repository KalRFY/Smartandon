<template>

  <CRow class="mb-3">
    <CCol sm="11" style="font-size: xx-large; font-weight: bold;">
      Smartandon
    </CCol>
    <CCol sm="1" style="font-size: xx-large; font-weight: bold;">

      <CButton color="dark" class="position-relative" style="font-weight: bold;" @click="() => { visibleEnd = !visibleEnd }">
        NEW
        <CBadge color="danger" position="top-end" shape="rounded-pill">
          99+ <span class="visually-hidden">unread messages</span>
        </CBadge>
      </CButton>
    </CCol>
  </CRow>

  
  <COffcanvas placement="end" :visible="visibleEnd" @hide="() => { visibleEnd = !visibleEnd }">
    <COffcanvasHeader>
      <COffcanvasTitle>Offcanvas</COffcanvasTitle>
      <CCloseButton class="text-reset" @click="() => { visibleEnd = false }"/>
    </COffcanvasHeader>
    <COffcanvasBody>
      Content for the offcanvas goes here. You can place just about any Bootstrap component or
      custom elements here.
    </COffcanvasBody>
  </COffcanvas>

  <CCol class="mb-3">
    <CButton variant="outline" style="width: 100%; font-weight: bold;" color="dark" @click="download">Search</CButton>
  </CCol>
  <div>
  <CRow>
    <CCol v-for="(card, index) in dashboardCards" :key="index" sm="6" lg="2" class="mb-4">
      <CCard class="dashboard-card h-100" :color="card.color">
        <CCardBody class="d-flex flex-column align-items-center justify-content-center text-center p-4">
          <div class="icon-container mb-3">
            <component :is="card.icon" :size="30" :stroke-width="1" />
          </div>
          <h4>{{ card.title }}</h4>
          <!-- <p class="card-description">{{ card.description }}</p> -->
          <CButton color="light" class="mt-2" @click="navigateTo(card.route)">View Details</CButton>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
  </div>

  <CButton
    style="width: 100%; font-size: 24px; font-weight: bold"
    class="mb-3"
    color="primary"
    shape="rounded-pill"
    @click="onClickInput"
    >Machine Stop Input</CButton
  >

  <CRow>
    <CCol>
      <CCard class="mb-3">
        <CCardHeader style="font-size: large; font-weight: bold;">
          <CRow>
            <CCol sm="8">
              <CCardTitle style="font-size: large; font-weight: bold;">
                OEE
              </CCardTitle>
            </CCol>
            <CCol sm="2">
              <CButton style="width: 100%; font-weight: bold; color: white" color="success" @click="download">High</CButton>
            </CCol>
            <CCol sm="2">
              <CButton style="width: 100%; font-weight: bold; color: white" color="danger" @click="download">Low</CButton>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol v-for="(chartData, index) in chartDataPerLine" :key="index">
              <CCard class="mb-3" color="dark" variant="outline">
                <CCardBody style="height: 200px;">
                  <CCardTitle style="font-size: small; height: 35px;">{{ chartData.label }}</CCardTitle>
                  <ApexCharts :options="chartData.options" :series="chartData.series" type="radialBar" height="250" width="100"/>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>

  <div>
    <CModal
      :visible="visibleLiveDemo"
      @close="
        () => {
          visibleLiveDemo = false
        }
      "
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
          <!-- <CCol md="8">
            <CFormInput
              feedbackValid="Looks good!"
              id="machineName"
              label="Machine Name"
              required
              v-model="submit.machineName"
            />
          </CCol> -->
          <CCol md="8">
            <label for="machineSelect" class="form-label">Machine Name</label>
            <Treeselect id="machineSelect" v-model="submit.machineName" :options="machineOptions" :searchable="true"
              :clearable="true" :children="false" placeholder="Select or input machine" @input="onMachineInput"
              :value-consists-of="['id']" :value-key="'id'" :label-key="'label'" />
          </CCol>
          <CCol md="4">
            <label for="machineSelect" class="form-label">Line</label>
            <Treeselect id="lineSelect" v-model="submit.line" :multiple="false" :flat="true" :options="lineOptions"
              :searchable="true" :clearable="true" placeholder="Select or input line" @input="onMachineInput"
              :value-consists-of="['id']" :value-key="'id'" :label-key="'label'" />
          </CCol>
          <!-- <CCol md="4">
              <CFormSelect
                aria-describedby="validationCustom04Feedback"
                feedbackInvalid="Please select the line."
                id="lineSelect"
                label="Line"
                required
                v-model="submit.line"
              >
                <option selected disabled value="">Choose Line...</option>
                <option v-for="line in lines" :key="line.fid" :value="line.fline">{{ line.fline }}</option>
              </CFormSelect>
          </CCol> -->
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
            <CFormCheck feedbackInvalid="You must agree before submitting." id="invalidCheck"
              label="Agree to terms and conditions" required type="checkbox" v-model="submit.agreeTerms" />
          </CCol>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton
          color="secondary"
          @click="
            () => {
              visibleLiveDemo = false
            }
          "
        >
          Close
        </CButton>

        <CButton color="primary" @click="saveSubmit">Submit</CButton>
      </CModalFooter>
    </CModal>
  </div>

  <CRow>
    <CCol>
      <CCard class="mb-3">
        <CCardHeader style="font-size: large; font-weight: bold;">Lines</CCardHeader>
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
                      labels: [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                      ],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(220, 220, 220, 0.2)',
                          borderColor: 'rgba(220, 220, 220, 1)',
                          pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                          pointBorderColor: '#fff',
                          data: [40, 20, 12, 39, 10, 40, 39],
                        },
                        {
                          label: 'My Second dataset',
                          backgroundColor: 'rgba(151, 187, 205, 0.2)',
                          borderColor: 'rgba(151, 187, 205, 1)',
                          pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                          pointBorderColor: '#fff',
                          data: [50, 12, 28, 29, 7, 25, 12],
                        },
                      ],
                    }"
                  />

                  <ApexCharts
                    type="line"
                    height="350"
                    :options="chartOptions"
                    :series="series"
                  ></ApexCharts>
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
                      labels: [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                      ],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(220, 220, 220, 0.2)',
                          borderColor: 'rgba(220, 220, 220, 1)',
                          pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                          pointBorderColor: '#fff',
                          data: [40, 20, 12, 39, 10, 40, 39],
                        },
                        {
                          label: 'My Second dataset',
                          backgroundColor: 'rgba(151, 187, 205, 0.2)',
                          borderColor: 'rgba(151, 187, 205, 1)',
                          pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                          pointBorderColor: '#fff',
                          data: [50, 12, 28, 29, 7, 25, 12],
                        },
                      ],
                    }"
                  />

                  <ApexCharts
                    type="line"
                    height="350"
                    :options="chartOptions"
                    :series="series"
                  ></ApexCharts>
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
                      labels: [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                      ],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(220, 220, 220, 0.2)',
                          borderColor: 'rgba(220, 220, 220, 1)',
                          pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                          pointBorderColor: '#fff',
                          data: [40, 20, 12, 39, 10, 40, 39],
                        },
                        {
                          label: 'My Second dataset',
                          backgroundColor: 'rgba(151, 187, 205, 0.2)',
                          borderColor: 'rgba(151, 187, 205, 1)',
                          pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                          pointBorderColor: '#fff',
                          data: [50, 12, 28, 29, 7, 25, 12],
                        },
                      ],
                    }"
                  />

                  <ApexCharts
                    type="line"
                    height="350"
                    :options="chartOptions"
                    :series="series"
                  ></ApexCharts>
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
                      labels: [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                      ],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(220, 220, 220, 0.2)',
                          borderColor: 'rgba(220, 220, 220, 1)',
                          pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                          pointBorderColor: '#fff',
                          data: [40, 20, 12, 39, 10, 40, 39],
                        },
                        {
                          label: 'My Second dataset',
                          backgroundColor: 'rgba(151, 187, 205, 0.2)',
                          borderColor: 'rgba(151, 187, 205, 1)',
                          pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                          pointBorderColor: '#fff',
                          data: [50, 12, 28, 29, 7, 25, 12],
                        },
                      ],
                    }"
                  />

                  <ApexCharts
                    type="line"
                    height="350"
                    :options="chartOptions"
                    :series="series"
                  ></ApexCharts>
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
                      labels: [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                      ],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(220, 220, 220, 0.2)',
                          borderColor: 'rgba(220, 220, 220, 1)',
                          pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                          pointBorderColor: '#fff',
                          data: [40, 20, 12, 39, 10, 40, 39],
                        },
                        {
                          label: 'My Second dataset',
                          backgroundColor: 'rgba(151, 187, 205, 0.2)',
                          borderColor: 'rgba(151, 187, 205, 1)',
                          pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                          pointBorderColor: '#fff',
                          data: [50, 12, 28, 29, 7, 25, 12],
                        },
                      ],
                    }"
                  />

                  <ApexCharts
                    type="line"
                    height="350"
                    :options="chartOptions"
                    :series="series"
                  ></ApexCharts>
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
                      labels: [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                      ],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(220, 220, 220, 0.2)',
                          borderColor: 'rgba(220, 220, 220, 1)',
                          pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                          pointBorderColor: '#fff',
                          data: [40, 20, 12, 39, 10, 40, 39],
                        },
                        {
                          label: 'My Second dataset',
                          backgroundColor: 'rgba(151, 187, 205, 0.2)',
                          borderColor: 'rgba(151, 187, 205, 1)',
                          pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                          pointBorderColor: '#fff',
                          data: [50, 12, 28, 29, 7, 25, 12],
                        },
                      ],
                    }"
                  />

                  <ApexCharts
                    type="line"
                    height="350"
                    :options="chartOptions"
                    :series="series"
                  ></ApexCharts>
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
                      labels: [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                      ],
                      datasets: [
                        {
                          label: 'My First dataset',
                          backgroundColor: 'rgba(220, 220, 220, 0.2)',
                          borderColor: 'rgba(220, 220, 220, 1)',
                          pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                          pointBorderColor: '#fff',
                          data: [40, 20, 12, 39, 10, 40, 39],
                        },
                        {
                          label: 'My Second dataset',
                          backgroundColor: 'rgba(151, 187, 205, 0.2)',
                          borderColor: 'rgba(151, 187, 205, 1)',
                          pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                          pointBorderColor: '#fff',
                          data: [50, 12, 28, 29, 7, 25, 12],
                        },
                      ],
                    }"
                  />

                  <ApexCharts
                    type="line"
                    height="350"
                    :options="chartOptions"
                    :series="series"
                  ></ApexCharts>
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
import { CButton, CCard, CCardBody, CCardTitle, CContainer, CTable, CTableHead, CTableBody, CTableHeaderCell, CTableRow, CTableDataCell, CCardHeader, CCardText, CoffCanvas } from '@coreui/vue';
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
      types: [],
      lines: [],
      linesOptions: [],
      machines: [],
      machineOptions: [],
      oee: [],
      oeeOption: [],
      chartDataPerLine: [],
      visibleEnd: false,
      

      visibleLiveDemo: false,
      submit: {
        machineName: null, // initialize as null to avoid showing [object Object]
      },

      // seriesChart: [95],
      //     chartRadialOptions: {
      //       chart: {
      //         height: 350,
      //         type: 'radialBar',
      //       },
      //       plotOptions: {
      //         radialBar: {
      //           hollow: {
      //             size: '100%',
      //           }
      //         },
      //       },
      //       labels: ['OEE'],
      //     },
          //   plotOptions: {
          //     radialBar: {
          //       startAngle: -135,
          //       endAngle: 225,
          //        hollow: {
          //         margin: 0,
          //         size: '90%',
          //         background: '#fff',
          //         image: undefined,
          //         imageOffsetX: 0,
          //         imageOffsetY: 0,
          //         position: 'front',
          //         dropShadow: {
          //           enabled: true,
          //           top: 3,
          //           left: 0,
          //           blur: 4,
          //           opacity: 0.5
          //         }
          //       },
          //       track: {
          //         background: '#fff',
          //         strokeWidth: '67%',
          //         margin: 0, // margin is in pixels
          //         dropShadow: {
          //           enabled: true,
          //           top: -3,
          //           left: 0,
          //           blur: 4,
          //           opacity: 0.7
          //         }
          //       },
            
          //       dataLabels: {
          //         show: true,
          //         name: {
          //           offsetY: -10,
          //           show: true,
          //           color: '#888',
          //           fontSize: '11px'
          //         },
          //         value: {
          //           formatter: function(val) {
          //             return parseInt(val);
          //           },
          //           color: '#111',
          //           fontSize: '20px',
          //           show: true,
          //         }
          //       }
          //     }
          //   },
          //   fill: {
          //     type: 'gradient',
          //     gradient: {
          //       shade: 'dark',
          //       type: 'horizontal',
          //       shadeIntensity: 0.5,
          //       gradientToColors: ['#ABE5A1'],
          //       inverseColors: true,
          //       opacityFrom: 1,
          //       opacityTo: 1,
          //       stops: [0, 100]
          //     }
          //   },
          //   stroke: {
          //     lineCap: 'round'
          //   },
          //   labels: ['Percent'],
          // },
      seriesChart: [],
      chartRadialOptions: {
      chart: {
        height: 350,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '70%',
          },
          dataLabels: {
            name: {
              fontSize: '22px',
            },
            value: {
              fontSize: '16px',
              formatter: function (val) {
                if (typeof val === 'string') {
                  if(val === '1000' || val === '100') {
                    return '99.9%';
                  }
                  const numVal = parseFloat(val);
                  if (!isNaN(numVal)) {
                    let displayVal = numVal;
                    if(displayVal >= 100) {
                      displayVal = 99.9;
                    }
                    return displayVal.toFixed(2) + '%';
                  }
                } else if (typeof val === 'number' && !isNaN(val)) {
                  if(val === 1000 || val === 100) {
                    return '99.9%';
                  }
                  let displayVal = val;
                  if(displayVal >= 100) {
                    displayVal = 99.9;
                  }
                  return displayVal.toFixed(2) + '%';
                }
                return val;
              }
            }
          }
        }
      },
      labels: [],
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
          stacked: false,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: [1, 1, 4],
        },
        title: {
          text: 'XYZ - Stock Analysis (2009 - 2016)',
          align: 'left',
          offsetX: 110,
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
              color: '#008FFB',
            },
            labels: {
              style: {
                colors: '#008FFB',
              },
            },
            title: {
              text: 'Income (thousand crores)',
              style: {
                color: '#008FFB',
              },
            },
            tooltip: {
              enabled: true,
            },
          },
          {
            seriesName: 'Cashflow',
            opposite: true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#00E396',
            },
            labels: {
              style: {
                colors: '#00E396',
              },
            },
            title: {
              text: 'Operating Cashflow (thousand crores)',
              style: {
                color: '#00E396',
              },
            },
          },
          {
            seriesName: 'Revenue',
            opposite: true,
          },
        ],
      },
    }
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
    CoffCanvas,
    Treeselect,
  },
  setup() {
    const router = useRouter()

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
    const tableExample = []

    const dashboardCards = [
      {
        title: 'Machine Stop Input',
        icon: 'AlertTriangle',
        description: 'Record and monitor machine stop events',
        color: 'danger',
        route: '/machine-stop',
      },
      {
        title: 'MTBF',
        icon: 'Clock',
        description: 'Mean Time Between Failures metrics',
        color: 'info',
        route: '/app/MTBFMTTR',
      },
      {
        title: 'MTTR',
        icon: 'Timer',
        description: 'Mean Time To Repair analytics',
        color: 'warning',
        route: '/app/MTBFMTTR',
      },
      {
        title: 'Problem History',
        icon: 'History',
        description: 'Historical issues and resolutions',
        color: 'primary',
        route: '/app/ProblemHistory',
      },
      {
        title: 'Realtime Pareto',
        icon: 'BarChart2',
        description: 'Live Pareto analysis of issues',
        color: 'success',
        route: '/app/RealtimeParetto',
      },
      {
        title: 'LTB Report Status',
        icon: 'FileText',
        description: 'Last Time Buy reporting and analysis',
        color: 'secondary',
        route: '/app/LtbSummary',
      },
    ]

    const navigateTo = (route) => {
      router.push(route)
    }

    return {
      tableExample,
      progressGroupExample1,
      progressGroupExample2,
      progressGroupExample3,
      dashboardCards,
      navigateTo,
    }
  },

  methods: {
    onClickInput() {
      this.visibleLiveDemo = true
    },

    async saveSubmit() {
      const machineNameToSubmit =
        this.submit.machineName && this.submit.machineName.id
          ? this.submit.machineName.id
          : null
      if (!machineNameToSubmit) {
        alert('Please input or select machine name')
      } else if (!this.submit.line) {
        alert('Please input line')
      } else if (!this.submit.problems) {
        alert('Please input problems')
      } else if (!this.submit.agreeTerms) {
        alert('You must agree to terms and conditions before submitting')
      } else {
        try {
          const payload = {
            machineName: machineNameToSubmit,
            lineName: this.submit.line,
            problemDescription: this.submit.problems,
          }
          const response = await api.post(
            '/smartandon/dashboard/new-machine-input',
            payload,
          )
          if (response.data.status === 'success') {
            alert('Input saved successfully')
            this.visibleLiveDemo = false
            this.submit = {}
          } else {
            alert('Failed to save input')
          }
        } catch (error) {
          console.log(error.message)
          alert('Error saving input: ' + error.message)
        }
      }
    },
    onMachineInput(value) {
      this.submit.machineName = value || {}
    },
  },

  async created() {
    try {
      const response = await axios.get('/api/smartandon/qcc-m-types')
      this.types = response.data
    } catch (error) {
      console.error('Failed to fetch qcc_m_types:', error)
    }
    try {
      const response = await axios.get('/api/smartandon/line')
      this.lines = response.data
    } catch (error) {
      console.error('Failed to fetch qcc_m_types:', error)
    }
    try {
      const response = await axios.get('/api/smartandon/machine')
      this.machines = response.data
      this.machineOptions = response.data.map((machine) => ({
        id: machine.fid,
        label: machine.fmc_name,
      }))
    } catch (error) {
      console.error('Failed to fetch machines:', error)
    }
    try {
      const response = await axios.get('/api/smartandon/line')
      this.lines = response.data
      this.lineOptions = response.data.map((line) => ({
        id: line.fid,
        label: line.fline,
      }))
    } catch (error) {
      console.error('Failed to fetch lines:', error)
    }
    try {
      const response = await axios.get('/api/smartandon/oee');
      this.oee = response.data;
      this.oeeOption = response.data.map(oeeValue => ({
        id: oeeValue.GROUP_NAME,
        label: oeeValue.TAG_NAME,
        labelOee: oeeValue.REG_VALUE
      }));
      // Group OEE data by DEV_NAME and prepare chart data per line
      const uniqueOee = {};
      this.oee.forEach(item => {
        if (!uniqueOee[item.DEV_NAME]) {
          uniqueOee[item.DEV_NAME] = parseFloat(item.REG_VALUE) * 10;
        }
      });
      this.chartDataPerLine = Object.entries(uniqueOee).map(([devName, value]) => ({
        label: devName,
        series: [value],
        options: {
          chart: {
            height: 250,
            type: 'radialBar',
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: '100%',
              },
              dataLabels: {
                name: {
                  fontSize: '12px',
                },
                value: {
                  fontSize: '16px',
                  formatter: function (val) {
                    if (typeof val === 'string') {
                      if(val === '10000') {
                        return '99.99%';
                      }
                      const numVal = parseFloat(val);
                      if (!isNaN(numVal)) {
                        return (numVal / 100).toFixed(2) + '%';
                      }
                    } else if (typeof val === 'number' && !isNaN(val)) {
                      if(val === 10000) {
                        return '99.99%';
                      }
                      return (val / 100).toFixed(2) + '%';
                    }
                    return val;
                  }
                }
              },
            }
          },
          labels: [devName],
        }
      }));
    } catch (error) {
      console.error('Failed to fetch or process OEE data:', error);
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

p {
  font-style: italic;
}
</style>

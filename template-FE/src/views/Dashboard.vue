<template>
  <CRow class="mb-3">
    <CCol lg="3" class="mb-3">
      <CCard style="width: 100%; height: 100%;">
        <CCardBody class="d-flex flex-column align-items-center justify-content-center">
          <CRow class="mb-3">
            <div style="text-align: center;">
              <img
              alt="Smartandon Image"
              src="../standalone/assets/images/icon.png"
              style="max-width: 50%; height: auto; display: inline-block;"
              />
            </div>
          </CRow>
          
          <CRow class="mb-3" style="font-size: x-large; font-weight: bold; font-family: 'Inter', sans-serif; text-align: center;">
            Smartandon
          </CRow>
        
          <CRow style="width: 100%;">
            <hr style="width: 100%;" />
          </CRow>
          
          <CRow>
            Welcome to Smartandon
          </CRow>

        </CCardBody>
      </CCard>
    </CCol>

    <CCol lg="9" style="height: 100%;">
      
      <div class="dashboard-cards-container" style="height: 100%;">
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
              <!-- <p class="card-description">{{ card.description }}</p> -->
              <CButton color="light" class="mt-2" @click="navigateTo(card.route)">View Details</CButton>
            </CCardBody>
          </CCard>
        </div>
      </div>
      <!-- <CCard>
        <CCardBody>
          <CCol class="mb-3">
             <CRow class="mb-3" style="font-size: x-large; font-weight: bold; font-family: 'Inter', sans-serif;">
              Smartandon
            </CRow>
          </CCol>
          <CRow>
            <CCol>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard> -->
    </CCol>
  </CRow>
  <CButton
    class="mb-3"
    style="width: 100%; font-size: 18px; font-weight: bold"
    color="primary"
    @click="onClickInput"
    shape="rounded-pill"
    >
    Machine Stop Input
  </CButton>

  <COffcanvas v-if="visibleEnd" placement="end" :visible="visibleEnd" @hide="() => { visibleEnd = !visibleEnd }">
    <COffcanvasHeader>
      <COffcanvasTitle>Offcanvas</COffcanvasTitle>
      <CCloseButton class="text-reset" @click="() => { visibleEnd = false }" />
    </COffcanvasHeader>
    <COffcanvasBody>
      Content for the offcanvas goes here. You can place just about any Bootstrap component or
      custom elements here.
    </COffcanvasBody>
  </COffcanvas>

  <CAccordion class="mb-3" :active-item-key="problemActive.length > 0 ? 1 : undefined" style="width: 100%;">
    <CAccordionItem :item-key="1">
      <CAccordionHeader>
        <CRow>
          <CCol>
            <CCardTitle style="font-size: large; font-weight: bold;">
              Current Problems
            </CCardTitle>
          </CCol>
        </CRow>
      </CAccordionHeader>
      <CAccordionBody>
        <CRow>
          <CCol>
          <div class="table-container" style="max-height: 465px; overflow-y: auto; border: 1px solid #dee2e6; border-radius: 0.375rem; box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);">
            <CTable class="table-sm table-hover mb-0">
              <CTableHead class="sticky-top" style="background-color: white; border-bottom: 1px solid #dee2e6;">
                <CTableRow>
                  <CTableHeaderCell scope="col" class="col-1 fw-semibold text-dark">No</CTableHeaderCell>
                  <CTableHeaderCell scope="col" class="col-2 fw-semibold text-dark">Machine</CTableHeaderCell>
                  <CTableHeaderCell scope="col" class="col-1 fw-semibold text-dark">Line</CTableHeaderCell>
                  <CTableHeaderCell scope="col" class="col-4 fw-semibold text-dark">Problem</CTableHeaderCell>
                  <CTableHeaderCell scope="col" class="col-2 fw-semibold text-dark">Duration</CTableHeaderCell>
                  <CTableHeaderCell scope="col" class="col-2 fw-semibold text-dark">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-if="loadingProblemActive">
                  <CTableDataCell colspan="6" class="text-center py-4">Loading...</CTableDataCell>
                </CTableRow>
                <CTableRow v-else-if="problemActive.length === 0">
                  <CTableDataCell colspan="6" class="text-center py-4 text-muted">No active problems</CTableDataCell>
                </CTableRow>
                <CTableRow v-for="(problem, idx) in problemActive" :key="problem.fid" class="align-middle">
                  <CTableDataCell>{{ idx + 1 }}</CTableDataCell>
                  <CTableDataCell class="fw-medium text-dark">{{ problem.fmc_name }}</CTableDataCell>
                  <CTableDataCell class="text-muted">{{ problem.fline }}</CTableDataCell>
                  <CTableDataCell class="text-truncate" style="max-width: 0;" :title="problem.ferror_name">{{ problem.ferror_name }}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge :color="Number(problem.fdur) > 30 ? 'danger' : 'warning'" class="w-100 text-center py-1" shape="rounded-pill">
                      <small class="fw-bold">{{ problem.fdur }} min</small>
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="primary" size="sm" class="rounded-pill shadow-sm w-100" @click="openEditModal(problem)">Edit</CButton>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </div>
          </CCol>
        </CRow>
      </CAccordionBody>
    </CAccordionItem>
  </CAccordion>

  <CRow v-if="(oee || []).length > 0">
    <CCol>
      <CCard class="mb-3">
        <CCardBody>
          <CRow lg="12">
            <CCol lg="6">
              <CRow>
                <CCol lg="3" class="mb-3" v-for="(chartData, index) in chartDataPerLine" :key="index">
                  <div
                    :class="getLineCardClass(chartData.label)"
                    style="border-radius: 9px; height: 100%; box-shadow: 5px 5px 5px rgba(0,0,0,0.2);
                    background-color: white;"
                  >
                    <CCardBody style="height: 100%;">
                      <CRow>
                        <CCardTitle style="font-size: small; height: 35px;">{{ chartData.label }}</CCardTitle>
                      </CRow>
                      <CRow>
                        <CCol>
                          Target:
                          {{
                            (oeeTarget || []).find(item => item.DEV_NAME === chartData.label)?.REG_VALUE ?? (oeeDataSmartandon || {}).ftarget
                          }}
                        </CCol>
                        <CCol>
                          Actual:
                          {{
                            (oeeActual || []).find(item => item.DEV_NAME === chartData.label)?.REG_VALUE ?? (oeeDataSmartandon || {}).factual
                          }}
                        </CCol>
                      </CRow>
                      <ApexCharts v-if="chartData.series && chartData.series.length > 0" :options="chartData.options" :series="chartData.series" type="radialBar" height="250" />
                      <div v-else class="text-center py-4">No data available</div>
                    </CCardBody>
                  </div>
                </CCol>
              </CRow>
            </CCol>
            <CCol lg="6">
              <div style="background-color: white; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); height: 100%;" color="dark" variant="outline">
                <CCardBody style="height: 100%;">
                  <CCardTitle style="font-size: medium; height: 35px; color: black;">Cumulative OEE per Line</CCardTitle>
                  <ApexCharts v-if="cumulativeOeeSeries.length > 0" :options="cumulativeOeeOptions" :series="cumulativeOeeSeries" type="polarArea" height="350" />
                  <div v-else class="text-center py-4">No OEE data available</div>
                </CCardBody>
              </div>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>

  <CRow>
    <CCol lg="12" class="mb-3">
      <CCard>
        <!-- <CCardHeader>Problem Frequency</CCardHeader> -->
        <CCardBody>
          <CRow class="mb-3">
            <CCol>
              <div style="border-radius: 9px; height: 100%; box-shadow: 2px 2px 5px rgba(0,0,0,0.2);">
                <CCardBody>
                  <CRow>
                    <CCol class="mb-3">
                      <CInputGroup>
                        <CInputGroupText id="basic-addon1">
                          <label>Start</label>
                        </CInputGroupText>
                        <CFormInput
                          id="startDate"
                          type="date"
                          v-model="filterStartDate"
                          aria-label="Start Date"
                          aria-describedby="basic-addon1"
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol class="mb-3">
                      <CInputGroup>
                        <CInputGroupText id="basic-addon2">
                          <label>Finish</label>
                        </CInputGroupText>
                        <CFormInput
                          id="finishDate"
                          type="date"
                          v-model="filterFinishDate"
                          aria-label="Finish Date"
                          aria-describedby="basic-addon2"
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol sm="3" class="mb-3">
                      <Treeselect
                        id="lineFilterSelect"
                        v-model="filterLine"
                        :multiple="false"
                        :flat="true"
                        :options="lineOptions"
                        :searchable="true"
                        :clearable="true"
                        placeholder="Line"
                        :value-consists-of="['id']"
                        :value-key="'id'"
                        :label-key="'label'"
                      />
                      <small v-if="lineOptions.length === 0" class="text-muted">Loading lines...</small>
                    </CCol>
                    <CCol class="mb-3">
                      <CButton
                        :disabled="loading"
                        style="width: 100%; font-weight: bold; font-size: x-small; color: white;"
                        color="info"
                        @click="onSearch"
                      >
                        <Search size="16" />
                      </CButton>
                    </CCol>
                  </CRow>
                </CCardBody>
              </div>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <ApexCharts
                v-if="problemFrequencySeries[0].data.length > 0"
                :key="formatKey"
                :options="problemFrequencyOptions"
                :series="problemFrequencySeries"
                type="line"
                height="350"
              />
              <div v-else class="text-center py-4">No data available</div>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
  
  <CRow>
    <CCol>
      <CCard>
        <!-- <CCardHeader>LTR</CCardHeader> -->
        <CCardBody>
          <CRow>
            <CCol lg="7" class="mb-3">
              <CRow class="mb-3">
                <CCol>
                  <div style="border-radius: 9px; height: 100%; box-shadow: 2px 2px 5px rgba(0,0,0,0.2);">
                    <CCardBody>
                      <CRow>
                        <CCol class="mb-3">
                          <CInputGroup>
                            <CInputGroupText id="ltr-start-addon">
                              <label>Start</label>
                            </CInputGroupText>
                            <CFormInput
                              id="ltrStartDate"
                              type="date"
                              v-model="ltrStartDate"
                              aria-label="LTR Start Date"
                              aria-describedby="ltr-start-addon"
                            />
                          </CInputGroup>
                        </CCol>
                        <CCol class="mb-3">
                          <CInputGroup>
                            <CInputGroupText id="ltr-finish-addon">
                              <label>Finish</label>
                            </CInputGroupText>
                            <CFormInput
                              id="ltrFinishDate"
                              type="date"
                              v-model="ltrFinishDate"
                              aria-label="LTR Finish Date"
                              aria-describedby="ltr-finish-addon"
                            />
                          </CInputGroup>
                        </CCol>
                        <CCol sm="3" class="mb-3">
                          <Treeselect
                            id="ltrLineFilterSelect"
                            v-model="ltrLine"
                            :multiple="false"
                            :flat="true"
                            :options="lineOptions"
                            :searchable="true"
                            :clearable="true"
                            placeholder="Line"
                            :value-consists-of="['id']"
                            :value-key="'id'"
                            :label-key="'label'"
                          />
                          <small v-if="lineOptions.length === 0" class="text-muted">Loading lines...</small>
                        </CCol>
                        <CCol class="mb-3">
                          <CButton
                            :disabled="loading"
                            style="width: 100%; font-weight: bold; font-size: x-small; color: white;"
                            color="info"
                            @click="onSearch"
                          >
                            <Search size="16" />
                          </CButton>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </div>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <ApexCharts
                    v-if="ltrSeries[0].data.length > 0"
                    :key="ltrFormatKey"
                    :options="ltrOptions"
                    :series="ltrSeries"
                    type="line"
                    height="400"
                  />
                  <div v-else class="text-center py-4">No data available</div>
                </CCol>
              </CRow>
            </CCol>
            <CCol lg="5">
              <div class="table-container" style="max-height: 500px; overflow-y: auto; border: 1px solid #dee2e6; border-radius: 0.375rem; box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);">
                <CTable class="table-sm table-hover table-striped mb-0">
                  <CTableHead class="table-dark sticky-top">
                    <CTableRow>
                      <CTableHeaderCell scope="col" class="col-2 fw-semibold">Machine</CTableHeaderCell>
                      <CTableHeaderCell scope="col" class="col-1 fw-semibold">Line</CTableHeaderCell>
                      <CTableHeaderCell scope="col" class="col-5 fw-semibold">Problem</CTableHeaderCell>
                      <CTableHeaderCell scope="col" class="col-2 fw-semibold">Duration</CTableHeaderCell>
                      <CTableHeaderCell scope="col" class="col-2 fw-semibold">Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow v-if="loadingFollowupLtr">
                      <CTableDataCell colspan="5" class="text-center py-4">Loading...</CTableDataCell>
                    </CTableRow>
                    <CTableRow v-else-if="followupLtrProblems.length === 0">
                      <CTableDataCell colspan="5" class="text-center py-4 text-muted">No LTR problems without reports</CTableDataCell>
                    </CTableRow>
                    <CTableRow v-for="(problem, idx) in followupLtrProblems" :key="problem.fid" class="align-middle">
                      <CTableDataCell class="fw-bold text-dark">{{ problem.fmc_name }}</CTableDataCell>
                      <CTableDataCell class="text-muted">{{ problem.fline }}</CTableDataCell>
                      <CTableDataCell class="text-truncate" style="max-width: 0;" :title="problem.ferror_name">{{ problem.ferror_name }}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="danger" class="w-100 text-center py-1" shape="rounded-pill">
                          <small class="fw-bold">{{ problem.fdur }} min</small>
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton color="primary" size="sm" class="rounded-pill shadow-sm w-100" @click="openEditModal(problem)">Edit</CButton>
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </div>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>

  <CRow class="mb-3">
  </CRow>

  <div>
  <CModal :visible="visibleLiveDemo" @close="
      () => {
        visibleLiveDemo = false;
        resetForm();
      }
    " aria-labelledby="LiveDemoExampleLabel">
      <CModalHeader>
        <CModalTitle id="LiveDemoExampleLabel">Machine Stop Input</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm class="row g-3 needs-validation" novalidate :validated="validatedCustom01"
          @submit="handleSubmitCustom01">
          <CCol md="8">
            <label for="machineSelect" class="form-label">Machine Name</label>
            <Treeselect id="machineSelect" v-model="submit.machineName" :options="machineOptions" :searchable="true"
              :clearable="true" :children="false" placeholder="Select or input machine" @input="onMachineInput"
              :value-consists-of="['id']" :value-key="'id'" :label-key="'label'" />
          </CCol>
          <CCol md="4">
            <label for="machineSelect" class="form-label">Line</label>
            <CFormInput
              id="lineDisplay"
              v-model="submit.lineName"
              readonly
              placeholder="Line will be auto-filled when machine is selected"
            />
          </CCol>
          <CCol md="12">
            <CFormInput
              feedbackInvalid="Please Login"
              id="User"
              label="Operator"
              required
              disabled
              :placeholder="loadingUser ? 'Loading user...' : 'Auto-filled from login'"
              v-model="submit.operatorName" />
          </CCol>
          
          <CCol md="12">
            <CRow>
              <CCol md="4">
                <label for="problemsSearchSelect" class="form-label">Problems</label>
              </CCol>
              <CCol md="8">
                <CTooltip
                  content="Check this box if you want to enter a new problem that is not in the existing list. Uncheck to select from the searchable list of existing problems."
                  placement="right"
                >
                  <template #toggler="{ id, on }">
                    <CFormCheck
                      :id="id"
                      label="New Problem"
                      v-model="isNewProblem"
                      v-on="on"
                    />
                  </template>
                </CTooltip>
              </CCol>
            </CRow>
  
            <!-- Manual Input for New Problems -->
            <CCol md="12" v-if="isNewProblem">
              <CFormInput
                feedbackInvalid="Please input the problems"
                id="Problems"
                required
                placeholder="Enter new problem description..."
                v-model="submit.problems" />
            </CCol>
  
            <!-- Search Select for Existing Problems -->
            <CCol md="12" v-else>
              <ModelSelect
                id="problemsSearchSelect"
                v-model="submit.problems"
                :options="problemSearchOptions"
                :disabled="problemSearchOptions.length <= 1 || problemSearchOptions[0].text === 'Select a machine first' || problemSearchOptions[0].text === 'Loading problems...'"
                placeholder="Type to search problems..."
                required
              />
            </CCol>
            <CRow class="mb-3">
    
            </CRow>
            <CCol xs="12">
              <CFormCheck feedbackInvalid="You must agree before submitting." id="invalidCheck"
                label="Sudah Benar" required type="checkbox" v-model="submit.agreeTerms" />
            </CCol>
          </CCol>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="
          () => {
            visibleLiveDemo = false;
            resetForm();
          }
        ">
          Close
        </CButton>

        <CButton color="primary" @click="saveSubmit">Submit</CButton>
      </CModalFooter>
    </CModal>

    <!-- Edit Problem Modal -->
    <EditProblemModal
      :visible="visibleEditModal"
      :submitData="editSubmit"
      :machineOptions="machineOptions"
      :lineOptions="lineOptions"
      :modalLoading="editModalLoading"
      @close="visibleEditModal = false"
      @submit="saveEditSubmit"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import moment from 'moment'
import { CButton, CCard, CCardBody, CCardTitle, CContainer, CTable, CTableHead, CTableBody, CTableHeaderCell, CTableRow, CTableDataCell, CCardHeader, CCardText, CoffCanvas, CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody, CTooltip } from '@coreui/vue';
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
  CalendarClock,
  ChartColumnIncreasing,
  BookText,
  Search,
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import { CFormSelect } from '@coreui/vue'
import { ModelSelect } from 'vue-search-select'
import "vue-search-select/dist/VueSearchSelect.css"
import EditProblemModal from './ProblemHistory/EditProblemModal.vue'
const visibleStaticBackdropDemo = ref(false);
const visibleEnd = ref(false)

export default {
  name: 'Dashboard',
  data() {
    return {
      filterStartDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
      filterFinishDate: moment().format('YYYY-MM-DD'),
      filterLine: null,
      // LTR Chart data properties
      ltrStartDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
      ltrFinishDate: moment().format('YYYY-MM-DD'),
      ltrLine: null,
      problemFrequencyData: {
        labels: [],
        datasets: [
          {
            label: 'Frequency Problem',
            backgroundColor: '#f87979',
            data: [],
          },
        ],
      },
      problemFrequencyOptions: {
        chart: {
          height: 350,
          type: 'line',
        },
        stroke: {
          width: [4]
        },
        title: {
          text: 'Frequency Problem'
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [0]
        },
        xaxis: {
          type: 'datetime',
          labels: {
            format: 'MMM dd',
          },
        },
        yaxis: [{
          title: {
            text: 'Frequency Problem',
          },
        }],
      },
      problemFrequencySeries: [{
        name: 'Frequency Problem',
        type: 'column',
        data: []
      }],
      // LTR Chart options and series
      ltrOptions: {
        chart: {
          height: 350,
          type: 'line',
        },
        colors: ['#E67A0E'],
        plotOptions: {
          bar: {
            borderRadius: 0,
          },
        },
        stroke: {
          width: [4]
        },
        title: {
          text: 'LTR - Long Time Repair'
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [0]
        },
        xaxis: {
          type: 'datetime',
          labels: {
            format: 'MMM dd',
          },
        },
        yaxis: [{
          title: {
            text: 'Jumlah LTR',
          },
        }],
      },
      ltrSeries: [{
        name: 'Jumlah LTR',
        type: 'column',
        data: []
      }],
      ltrFormatKey: 0,
      types: [],
      lines: [],
      linesOptions: [],
      lineOptions: [],
      machines: [],
      machineOptions: [],
      memberOption: [],
      problemSelectOptions: [
        { value: '', label: 'Select a machine first' }
      ],
      problemSearchOptions: [
        { value: '', text: 'Select a machine first' }
      ],
      oee: [],
      oeeOption: [],
      oeeTarget: [],
      oeeActual: [],
      oeePlan: [],
      oeeDataSmartandon: {
        ftarget: 0,
        factual: 0
      },
      chartDataPerLine: [],
      chartDataTargetPerLine: [],
      chartDataActualPerLine: [],
      cumulativeOeeSeries: [],
      cumulativeOeeOptions: {},
      visibleEnd: false,
      problemActive: [],
      loadingProblemActive: false,
      followupLtrProblems: [],
      loadingFollowupLtr: false,

      visibleEditModal: false,
      editModalLoading: false,
      editSubmit: {},

      visibleLiveDemo: false,
      loadingUser: false,
      isNewProblem: false,
      submit: {
        machineName: null,
        lineName: null,
        fline: '',
        operatorName: null,
        problems: null,
      },

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
                    if (val === '1000' || val === '100') {
                      return '99.9%';
                    }
                    const numVal = parseFloat(val);
                    if (!isNaN(numVal)) {
                      let displayVal = numVal;
                      if (displayVal >= 100) {
                        displayVal = 99.9;
                      }
                      return displayVal.toFixed(2) + '%';
                    }
                  } else if (typeof val === 'number' && !isNaN(val)) {
                    if (val === 1000 || val === 100) {
                      return '99.9%';
                    }
                    let displayVal = val;
                    if (displayVal >= 100) {
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
  watch: {
    // Add watcher for machineName changes
    'submit.machineName': function(newVal) {
      this.onMachineInput(newVal);
    },
    // Add watcher for new problem checkbox
    isNewProblem: function() {
      this.onNewProblemToggle();
    },
    // Add watcher for lineOptions to debug loading
    lineOptions: {
      handler(newVal) {
        console.log('[FE Debug] Line options updated:', newVal);
      },
      immediate: true
    },
    // Watchers for Frequency Problem chart filters
    filterStartDate: function() {
      this.fetchChartData();
    },
    filterFinishDate: function() {
      this.fetchChartData();
    },
    filterLine: function() {
      this.fetchChartData();
    },
    // Watchers for LTR chart filters
    ltrStartDate: function() {
      this.fetchLtrData();
    },
    ltrFinishDate: function() {
      this.fetchLtrData();
    },
    ltrLine: function() {
      this.fetchLtrData();
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
    CalendarClock,
    ChartColumnIncreasing,
    BookText,
    Search,
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
    CFormSelect,
    ModelSelect,
    CTooltip,
    ApexCharts,
    EditProblemModal,
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
        title: 'MTBF MTTR',
        icon: 'Clock',
        description: 'Mean Time Between Failures metrics',
        color: 'info',
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
        route: '/app/LTBSummary',
      },
      {
        title: 'CM Followup',
        icon: 'CalendarClock',
        description: 'Countermeasure tracking and follow-up monitoring',
        color: 'secondary',
        route: '/app/CMFollowup',
      },
      {
        title: 'TPM System',
        icon: 'FileText',
        description: 'TPM System',
        color: 'secondary',
        route: '/app/tpm-redirect',
      },
      {
        title: 'Order Spareparts',
        icon: 'BarChart2',
        description: 'Order Spareparts',
        color: 'secondary',
        route: '/app/order-spareparts-redirect',
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

  async created() {
    this.startAutoRefresh();
    // Initialize charts and LTR table data
    await this.fetchChartData();
    await this.fetchLtrData();
    await this.fetchFollowupLtrProblems();
  },
  beforeUnmount() {
    this.stopAutoRefresh();
  },
  methods: {
    async fetchDashboardData() {
      try {
        const responseMachines = await api.get('/smartandon/machine');
        this.machines = responseMachines.data;
        this.machineOptions = responseMachines.data.map((machine) => ({
          id: machine.fid,
          label: machine.fmc_name,
        }));
      } catch (error) {
        console.error('Failed to fetch machines:', error);
      }

      try {
        const responseLines = await api.get('/smartandon/line');
        console.log('[FE Debug] Line API response:', responseLines.data);
        this.lines = responseLines.data;
        this.lineOptions = responseLines.data.map((line) => ({
          id: line.fid,
          label: line.fline,
        }));
        console.log('[FE Debug] Line options created:', this.lineOptions);
      } catch (error) {
        console.error('Failed to fetch lines:', error);
        this.lineOptions = [];
      }
      try {
        this.loadingProblemActive = true;
        this.limitView = 0;
        console.log('[FE Debug] Dashboard params to send:', { limitView: 0 })

        const responseProblems = await api.get('/smartandon/problemView', { search: JSON.stringify({ limitView: 'Current' }) });
        this.problemActive = responseProblems.data.data;
        console.log('Filtered active problems:', this.problemActive);
      } catch (error) {
        console.error('Failed to fetch active problems:', error);
        this.problemActive = [];
      } finally {
        this.loadingProblemActive = false;
      }



      try {
        const responseOeeData = await api.get('/smartandon/oeeDataSmartandon');
        this.oeeDataSmartandon = responseOeeData.data;
        console.log('OEE Target: ' + this.oeeDataSmartandon);
      } catch (error) {
        console.log('Failed to fetch oee target:', error);
      }
      try {
        const responseOeeTarget = await api.get('/smartandon/oeeTarget');
        this.oeeTarget = responseOeeTarget.data;
        this.oeeOption = responseOeeTarget.data.map((oeeTargets) => ({
          id: oeeTargets.GROUP_NAME,
          label: oeeTargets.TAG_NAME,
          labelOeeTarget: oeeTargets.REG_VALUE,
        }));
        console.log('OEE Target: ' + this.oeeTarget);
      } catch (error) {
        console.log('Failed to fetch oee target:', error);
      }
      try {
        const responseOeeActual = await api.get('/smartandon/oeeActual');
        this.oeeActual = responseOeeActual.data;
      } catch (error) {
        console.log('Failed to fetch oee actual:', error);
      }
      try {
        const responseOeePlan = await api.get('/smartandon/oeePlan');
        this.oeePlan = responseOeePlan.data;
      } catch (error) {
        console.log('Failed to fetch oee plan:', error);
      }
      try {
        const responseOee = await api.get('/smartandon/oee');
        this.oee = responseOee.data;
        this.oeeOption = responseOee.data.map((oeeValue) => ({
          id: oeeValue.GROUP_NAME,
          label: oeeValue.TAG_NAME,
          labelOee: oeeValue.REG_VALUE,
        }));
        const uniqueOee = {};
        this.oee.forEach((item) => {
          if (!uniqueOee[item.DEV_NAME]) {
            uniqueOee[item.DEV_NAME] = parseFloat(item.REG_VALUE);
          }
        });
        const maxOeeValue = Math.max(...Object.values(uniqueOee));
        this.chartDataPerLine = Object.entries(uniqueOee).map(([devName, value]) => {
          const normalizedValue = (value / maxOeeValue) * 100;
          return {
            label: devName,
            series: [normalizedValue],
            options: {
              chart: {
                height: 250,
                type: 'radialBar',
                offsetY: 0,
                sparkline: {
                  enabled: true,
                },
              },
              plotOptions: {
                radialBar: {
                  startAngle: -90,
                  endAngle: 90,
                  track: {
                    background: '#e7e7e7',
                    strokeWidth: '150%',
                    margin: 5,
                    dropShadow: {
                      enabled: true,
                      top: 2,
                      left: 0,
                      color: '#999',
                      opacity: 1,
                      blur: 2,
                    },
                  },
                  hollow: {
                    size: '50%',
                  },
                  dataLabels: {
                    name: {
                      show: false,
                    },
                    value: {
                      offsetY: -2,
                      fontSize: '16px',
                      formatter: function (val) {
                        if (val >= 99.9) {
                          return '99.99%';
                        }
                        return val.toFixed(2) + '%';
                      },
                    },
                  },
                },
              },
              fill: {
                type: 'gradient',
                gradient: {
                  shade: 'light',
                  shadeIntensity: 0.4,
                  inverseColors: false,
                  opacityFrom: 1,
                  opacityTo: 1,
                  stops: [0, 50, 53, 91],
                },
              },
              labels: [devName],
              yaxis: {
                max: 100,
              },
            },
          };
        });
        const cumulativeOeeData = {};
        this.oee.forEach((item) => {
          if (!cumulativeOeeData[item.DEV_NAME]) {
            cumulativeOeeData[item.DEV_NAME] = parseFloat(item.REG_VALUE);
          }
        });
        this.cumulativeOeeSeries = Object.values(cumulativeOeeData);
        const maxValue = Object.values(cumulativeOeeData).length > 0 ? Math.max(...Object.values(cumulativeOeeData)) : 100;
        this.cumulativeOeeOptions = {
          chart: {
            type: 'polarArea',
            height: 275,
          },
          labels: Object.keys(cumulativeOeeData),
          fill: {
            opacity: 0.8,
          },
          stroke: {
            width: 1,
            colors: undefined,
          },
          yaxis: {
            show: true,
            min: 0,
            max: maxValue * 1.1,
          },
          legend: {
            position: 'right',
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  height: 300,
                },
                legend: {
                  position: 'bottom',
                },
              },
            },
          ],
        };
      } catch (error) {
        console.error('Failed to fetch or process OEE data:', error);
      }

      try {
        const memberResponse = await api.get('/smartandon/member')
        if (memberResponse.status !== 200) {
          throw new Error('Failed to fetch members, status: ' + memberResponse.status)
        }
        this.memberOption = memberResponse.data.map((member) => ({
          id: member.fid,
          label: member.fname,
        }))
      } catch (error) {
        console.error('Failed to fetch members:', error)
      }
    },
    async fetchChartData() {
      // Fetch historical data for the frequency chart
      try {
        const chartParams = {
            startDate: this.filterStartDate,
            finishDate: this.filterFinishDate,
            limitView: 'group',
        };

        // Add line filter if selected
        if (this.filterLine) {
          chartParams.line = this.filterLine;
        }

        console.log('[FE Debug] Sending chart request with params:', chartParams);
        console.log('[FE Debug] Start Date:', this.filterStartDate);
        console.log('[FE Debug] Finish Date:', this.filterFinishDate);

        const historyResponse = await api.get('/smartandon/problemView', { search: JSON.stringify(chartParams) });

        if (historyResponse.data && historyResponse.data.data) {
            const groupedData = historyResponse.data.data;
            console.log('[FE Debug] Raw chart data from API:', groupedData);
            console.log('[FE Debug] Number of data points received:', groupedData.length);

            const sortedData = groupedData.sort((a, b) => new Date(a.date) - new Date(b.date));
            console.log('[FE Debug] Sorted chart data:', sortedData);

            const websiteBlogData = sortedData.map(item => [new Date(item.date).getTime(), item.count]);
            console.log('[FE Debug] Website blog data for chart:', websiteBlogData);

            this.problemFrequencyData = {
                labels: sortedData.map(item => item.date),
                datasets: [
                    {
                        label: 'Frequency Problem',
                        backgroundColor: '#f87979',
                        data: sortedData.map(item => item.count),
                    },
                ],
            };

            this.problemFrequencySeries[0].data = websiteBlogData;
            console.log('[FE Debug] Updated problemFrequencySeries:', this.problemFrequencySeries);

            // Check if start date year is not current year
            const startYear = new Date(this.filterStartDate).getFullYear();
            const currentYear = new Date().getFullYear();
            const format = startYear !== currentYear ? 'MMM dd yyyy' : 'MMM dd';
            console.log('Filter year:', startYear, 'Current year:', currentYear, 'Format:', format);
            this.problemFrequencyOptions.xaxis.labels.format = format;
            this.formatKey += 1; // Force re-render of ApexCharts to update label format
        }
      } catch (error) {
        console.error('Failed to fetch problem history for chart:', error);
      }
    },
    async fetchLtrData() {
      // Fetch historical data for the LTR chart
      try {
        const ltrParams = {
            startDate: this.ltrStartDate,
            finishDate: this.ltrFinishDate,
            limitView: 'group',
            problemCategory: 3, // Filter for LTR category
        };

        // Add line filter if selected
        if (this.ltrLine) {
          ltrParams.line = this.ltrLine;
        }

        console.log('[FE Debug] Sending LTR request with params:', ltrParams);
        console.log('[FE Debug] LTR Start Date:', this.ltrStartDate);
        console.log('[FE Debug] LTR Finish Date:', this.ltrFinishDate);

        const ltrResponse = await api.get('/smartandon/problemView', { search: JSON.stringify(ltrParams) });

        if (ltrResponse.data && ltrResponse.data.data) {
            const ltrGroupedData = ltrResponse.data.data;
            console.log('[FE Debug] Raw LTR data from API:', ltrGroupedData);
            console.log('[FE Debug] Number of LTR data points received:', ltrGroupedData.length);

            const ltrSortedData = ltrGroupedData.sort((a, b) => new Date(a.date) - new Date(b.date));
            console.log('[FE Debug] Sorted LTR data:', ltrSortedData);

            const ltrWebsiteBlogData = ltrSortedData.map(item => [new Date(item.date).getTime(), item.count]);
            console.log('[FE Debug] LTR Website blog data for chart:', ltrWebsiteBlogData);

            this.ltrSeries[0].data = ltrWebsiteBlogData;
            console.log('[FE Debug] Updated ltrSeries:', this.ltrSeries);

            // Check if start date year is not current year
            const ltrStartYear = new Date(this.ltrStartDate).getFullYear();
            const ltrCurrentYear = new Date().getFullYear();
            const ltrFormat = ltrStartYear !== ltrCurrentYear ? 'MMM dd yyyy' : 'MMM dd';
            console.log('LTR Filter year:', ltrStartYear, 'Current year:', ltrCurrentYear, 'Format:', ltrFormat);
            this.ltrOptions.xaxis.labels.format = ltrFormat;
            this.ltrFormatKey += 1; // Force re-render of ApexCharts to update label format
        }
      } catch (error) {
        console.error('Failed to fetch LTR data for chart:', error);
      }
    },
    startAutoRefresh() {
      this.fetchDashboardData();
      this.autoRefreshInterval = setInterval(() => {
        this.fetchDashboardData();
      }, 30000); // 30 seconds
    },
    stopAutoRefresh() {
      if (this.autoRefreshInterval) {
        clearInterval(this.autoRefreshInterval);
        this.autoRefreshInterval = null;
      }
    },
    async onClickInput() {
      this.loadingUser = true;
      try {
        const response = await api.get('/user/user');

        if (response && response.data && response.data.user && response.data.user.name) {
          this.submit.operatorName = response.data.user.name;
          console.log("User fetched successfully:", this.submit.operatorName);
        } else {
          throw new Error('Invalid user data received from API');
        }
      } catch (error) {
        console.error('Failed to fetch current user info:', error);
        this.submit.operatorName = '';

        // Handle different error types
        if (error.response) {
          if (error.response.status === 401) {
            alert('Authentication failed. Please login again.');
          } else {
            alert(`Error loading user: ${error.response.statusText || 'API Error'}`);
          }
        } else if (error.message) {
          alert(`Error loading user: ${error.message}`);
        } else {
          alert('Error loading user: Unknown error occurred');
        }
      } finally {
        this.loadingUser = false;
      }
      this.visibleLiveDemo = true;
    },
    async saveSubmit() {
      console.log('Submitting data:', this.submit);
      let machineNameToSubmit = null;
      if (this.submit.machineName) {
        if (typeof this.submit.machineName === 'object' && this.submit.machineName.id) {
          machineNameToSubmit = this.submit.machineName.id;
        } else if (typeof this.submit.machineName === 'number') {
          machineNameToSubmit = this.submit.machineName;
        }
      }
      if (!machineNameToSubmit) {
        alert('Please input or select machine name');
      } else if (!this.submit.fline) {
        alert('Please input the line');
      } else if (!this.submit.operatorName) {
        alert('Please wait for operator name to be loaded');
      } else if (!this.submit.problems || this.submit.problems === '') {
        if (this.isNewProblem) {
          alert('Please enter a new problem description');
        } else {
          alert('Please select a problem');
        }
      } else if (!this.submit.agreeTerms) {
        alert('You must agree to terms and conditions before submitting');
      } else {
        try {
          // Generate current timestamp for fstart_time
          const currentTime = new Date();
          const formattedTime = currentTime.toISOString().slice(0, 19).replace('T', ' ');
          
          const payload = {
            fmc_id: machineNameToSubmit,
            lineName: this.submit.fline,
            ferror_name: this.submit.problems,
            foperator: this.submit.operatorName,
            fstart_time: formattedTime
          };
          
          console.log('Payload to send:', payload);
          const response = await api.put('/smartandon/problemMachine', null, payload);
          if (response && response.status >= 200 && response.status < 300) {
            alert('Input saved successfully');
            this.visibleLiveDemo = false;
            this.submit = {};
            // Refresh current problem list immediately after input
            this.fetchDashboardData();
            // Refresh charts and LTR table immediately after input
            this.fetchChartData();
            this.fetchLtrData();
            this.fetchFollowupLtrProblems();
          } else {
            alert('Failed to save input');
          }
        } catch (error) {
          console.log(error.message);
          alert('Error saving input: ' + error.message);
        }
      }
    },
    async fetchProblemsByMachine(machineId) {
      try {
        // Reset problem options while loading
        this.problemSelectOptions = [
          { value: '', label: 'Loading problems...' }
        ];
        this.problemSearchOptions = [
          { value: '', text: 'Loading problems...' }
        ];

        // Find the machine name from the selected machine ID
        const selectedMachine = this.machines.find(m => m.fid === machineId);
        const machineName = selectedMachine ? selectedMachine.fmc_name : '';

        console.log('Selected Machine ID:', machineId);
        console.log('Selected Machine Object:', selectedMachine);
        console.log('Machine Name to search:', machineName);

        const responseProblems = await api.get('/smartandon/problemView', { search: JSON.stringify({ machineName: machineName, limitView: 0 }) });

        console.log('API Response:', responseProblems.data);

        if (responseProblems.data && responseProblems.data.data && responseProblems.data.data.length > 0) {
          // Extract unique problem names and remove duplicates (case-insensitive)
          const problemNames = responseProblems.data.data
            .map(problem => problem.ferror_name)
            .filter(Boolean) // Remove null/undefined/empty values
            .map(problem => problem.trim()) // Remove leading/trailing whitespace
            .filter(problem => problem.length > 0) // Remove empty strings after trimming
            .map(problem => problem.toLowerCase()); // Convert to lowercase for comparison

          // Remove duplicates using case-insensitive comparison
          const uniqueProblems = [...new Set(problemNames)]
            .map(lowerCaseName => {
              // Find the original case version from the original data
              const original = responseProblems.data.data.find(problem =>
                problem.ferror_name && problem.ferror_name.trim().toLowerCase() === lowerCaseName
              );
              return original ? original.ferror_name.trim() : lowerCaseName;
            });

          // Sort problems alphabetically for better UX (case-insensitive)
          uniqueProblems.sort((a, b) => a.localeCompare(b, 'id', { sensitivity: 'base' }));

          console.log(`Removed duplicates: ${problemNames.length - uniqueProblems.length} duplicates found, ${uniqueProblems.length} unique problems remaining`);

          // Format for CFormSelect
          this.problemSelectOptions = [
            { value: '', label: 'Select a problem...' },
            ...uniqueProblems.map((problem, index) => ({
              value: problem,
              label: problem,
            }))
          ];

          // Format for ModelSelect
          this.problemSearchOptions = [
            { value: '', text: 'Select a problem...' },
            ...uniqueProblems.map((problem, index) => ({
              value: problem,
              text: problem,
            }))
          ];

          console.log(`Fetched ${uniqueProblems.length} unique problems for machine ${machineName}:`, uniqueProblems);
          console.log('Updated problemSearchOptions:', this.problemSearchOptions);
        } else {
          // No problems found for this machine, try loading all problems as fallback
          console.log('No problems found for this machine, trying to load all problems...');
          try {
            const fallbackResponse = await api.get('/smartandon/problemView', { search: JSON.stringify({ limitView: 0 }) });

            if (fallbackResponse.data && fallbackResponse.data.data && fallbackResponse.data.data.length > 0) {
              // Extract unique problem names and remove duplicates (case-insensitive)
              const problemNames = fallbackResponse.data.data
                .map(problem => problem.ferror_name)
                .filter(Boolean)
                .map(problem => problem.trim())
                .filter(problem => problem.length > 0)
                .map(problem => problem.toLowerCase());

              // Remove duplicates using case-insensitive comparison
              const uniqueProblems = [...new Set(problemNames)]
                .map(lowerCaseName => {
                  const original = fallbackResponse.data.data.find(problem =>
                    problem.ferror_name && problem.ferror_name.trim().toLowerCase() === lowerCaseName
                  );
                  return original ? original.ferror_name.trim() : lowerCaseName;
                });

              uniqueProblems.sort((a, b) => a.localeCompare(b, 'id', { sensitivity: 'base' }));

              console.log(`Fallback: Removed duplicates: ${problemNames.length - uniqueProblems.length} duplicates found, ${uniqueProblems.length} unique problems remaining`);

              this.problemSelectOptions = [
                { value: '', label: 'Select a problem (all machines)...' },
                ...uniqueProblems.map((problem, index) => ({
                  value: problem,
                  label: problem,
                }))
              ];

              // Format for VueSearchSelect
              this.problemSearchOptions = [
                { name: 'Select a problem (all machines)...' },
                ...uniqueProblems.map((problem, index) => ({
                  name: problem,
                }))
              ];

              console.log(`Fallback: Fetched ${uniqueProblems.length} problems from all machines:`, uniqueProblems);
            } else {
              this.problemSelectOptions = [
                { value: '', label: 'No problems found in database' }
              ];
              this.problemSearchOptions = [
                { name: 'No problems found in database' }
              ];
            }
          } catch (fallbackError) {
            console.error('Fallback API call also failed:', fallbackError);
            this.problemSelectOptions = [
              { value: '', label: 'Error loading problems' }
            ];
            this.problemSearchOptions = [
              { name: 'Error loading problems' }
            ];
          }
        }
      } catch (error) {
        console.error('Failed to fetch problems for machine:', error);
        this.problemSelectOptions = [
          { value: '', label: 'Error loading problems' }
        ];
        this.problemSearchOptions = [
          { name: 'Error loading problems' }
        ];
      }
    },
    onMachineInput(value) {
      this.submit.machineName = value || {}

      // Auto-populate line when machine is selected
      if (value && typeof value === 'object' && value.id) {
        const selectedMachine = this.machines.find(m => m.fid === value.id);
        if (selectedMachine) {
          this.submit.lineName = selectedMachine.fline;
          this.submit.line = selectedMachine.fline;
          this.submit.fline = selectedMachine.fline;

          // Fetch problems for this specific machine
          this.fetchProblemsByMachine(value.id);
        }
      } else if (value && typeof value === 'number') {
        const selectedMachine = this.machines.find(m => m.fid === value);
        if (selectedMachine) {
          this.submit.lineName = selectedMachine.fline;
          this.submit.line = selectedMachine.fline;
          this.submit.fline = selectedMachine.fline;

          // Fetch problems for this specific machine
          this.fetchProblemsByMachine(value);
        }
      } else {
        // Clear line when machine is cleared
        this.submit.lineName = '';
        this.submit.line = '';
        this.submit.fline = '';

        // Reset problem options when machine is cleared
        this.problemSelectOptions = [
          { value: '', label: 'Select a machine first' }
        ];
        this.problemSearchOptions = [
          { value: '', text: 'Select a machine first' }
        ];
      }
    },
    onNewProblemToggle() {
      // Clear the problems field when switching between new and existing
      this.submit.problems = null;
    },
    resetForm() {
      // Reset all form fields to initial state
      this.submit = {
        machineName: null,
        lineName: null,
        fline: '',
        operatorName: null,
        problems: null,
      };
      this.isNewProblem = false;
      this.problemSelectOptions = [
        { value: '', label: 'Select a machine first' }
      ];
      this.problemSearchOptions = [
        { value: '', text: 'Select a machine first' }
      ];
      // Reset chart filters
      this.filterLine = null;
    },
    onSearch() {
      console.log('[FE Debug] Search clicked with filters:', {
        startDate: this.filterStartDate,
        finishDate: this.filterFinishDate,
        line: this.filterLine
      });
      this.fetchChartData();
    },
    onLtrSearch() {
      console.log('[FE Debug] LTR Search clicked with filters:', {
        startDate: this.ltrStartDate,
        finishDate: this.ltrFinishDate,
        line: this.ltrLine
      });
      this.fetchLtrData();
    },
    getLineCardClass(lineLabel) {
      // Normalisasi nama line: lowercase dan trim spasi
      const normalize = str => (str || '').toString().trim().toLowerCase();
      const normalizedLabel = normalize(lineLabel);

      const problem = this.problemActive.find(
        p => normalize(p.fline) === normalizedLabel
      );
      if (problem) {
        if (Number(problem.fdur) > 30) {
          return "line-danger";
        }
        return 'line-warning';
      }
      return '';
    },

    async fetchFollowupLtrProblems() {
      this.loadingFollowupLtr = true;
      try {
        // Fetch LTR (problemCategory 3) and SLTR (problemCategory 4) separately using backend filter
        const ltrParams = { limitView: 0, problemCategory: 3 };
        const sltrParams = { limitView: 0, problemCategory: 4 };
        console.log('[Dashboard Debug] Fetching LTR with params:', ltrParams);
        const ltrResponse = await api.get('/smartandon/problemView', { search: JSON.stringify(ltrParams) });
        console.log('[Dashboard Debug] LTR response data length:', ltrResponse.data.data ? ltrResponse.data.data.length : 0);
        
        console.log('[Dashboard Debug] Fetching SLTR with params:', sltrParams);
        const sltrResponse = await api.get('/smartandon/problemView', { search: JSON.stringify(sltrParams) });
        console.log('[Dashboard Debug] SLTR response data length:', sltrResponse.data.data ? sltrResponse.data.data.length : 0);
        
        const allLtrSltrProblems = [...(ltrResponse.data.data || []), ...(sltrResponse.data.data || [])];
        console.log('[Dashboard Debug] Combined LTR/SLTR problems:', allLtrSltrProblems.length);
        if (allLtrSltrProblems.length > 0) {
          console.log('[Dashboard Debug] Sample LTR/SLTR problems:', allLtrSltrProblems.slice(0, 3));
          console.log('[Dashboard Debug] Sample file_report values:', allLtrSltrProblems.slice(0, 5).map(p => ({ fid: p.fid, file_report: p.file_report, problemCategory: p.problemCategory })));
        }
        
        // Filter for no file_report
        const noReportProblems = allLtrSltrProblems.filter(problem => {
          const hasNoReport = !problem.file_report || problem.file_report.trim() === '' || problem.file_report === null;
          return hasNoReport;
        });
        console.log('[Dashboard Debug] LTR/SLTR problems with no report:', noReportProblems.length);
        this.followupLtrProblems = noReportProblems;
        console.log('Fetched LTR/SLTR problems without reports:', this.followupLtrProblems);
      } catch (error) {
        console.error('Failed to fetch LTR/SLTR problems:', error);
        this.followupLtrProblems = [];
      } finally {
        this.loadingFollowupLtr = false;
      }
    },

    // isLTRorSLTR removed as backend now filters by problemCategory

    async openEditModal(problem) {
      try {
        this.editModalLoading = true
        const response = await api.get(`/smartandon/problemId/${problem.fid}`)
        if (response.status !== 200) {
          throw new Error('Failed to fetch problem, status: ' + response.status)
        }
        const problemData = response.data
        console.log('Problem data:', problemData)
        this.editSubmit = this.mapProblemDataToSubmit(problemData)
        console.log('Edit submit data sent to EditProblemModal:', JSON.stringify(this.editSubmit, null, 2))

        // Fetch tambahAnalysis if needed, but for simplicity, assume not needed for now
        this.visibleEditModal = true
      } catch (error) {
        alert('Failed to load problem data: ' + error.message)
        console.error(error)
      } finally {
        this.editModalLoading = false
      }
    },

    mapProblemDataToSubmit(problemData) {
      const formatDateToISO = (dateStr) => {
        if (!dateStr) return ''
        const date = new Date(dateStr)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}`
      }

      const terjadiRaw = problemData?.analysis?.TERJADI
      const lamaRaw = problemData?.analysis?.LAMA

      return {
        machineName: problemData?.fmc_name || '',
        line: problemData?.fline || '',
        fidProblem: problemData?.fid || '',
        maker: problemData?.fmaker || '',
        operationNo: problemData?.foperation_no || '',
        problems: problemData?.ferror_name || '',
        uraianKejadian: problemData?.descResult?.general || '',
        uploadImage: problemData?.uraianResult?.general || '',
        ilustrasiStandart: problemData?.descResult?.standard || '',
        standartImage: problemData?.uraianResult?.standard || '',
        ilustrasiActual: problemData?.descResult?.actual || '',
        actualImage: problemData?.uraianResult?.actual || '',
        gapBetweenStandarAndActual: problemData?.gapIlustrasi || '',
        pilihFocusThemaMember: problemData?.pilihFocusThemaMember || '',
        pilihTaskforce: problemData?.pilihTaskforce || '',
        operator: problemData?.foperator ? problemData.foperator.split(/,|&/) : [],
        avCategory: problemData?.fav_categoty || '',
        shift: problemData?.fshift || '',
        startDate: formatDateToISO(problemData?.fstart_time) || '',
        finishDate: formatDateToISO(problemData?.fend_time) || '',
        durationMin: problemData?.fdur || '',
        problemCategory: problemData?.problemCategory || '',
        itemTemporaryAction: problemData?.temporaryAction || '',
        rootcauses5Why: problemData?.freal_prob || '',
        tambahAnalysisTerjadi: (() => {
          if (Array.isArray(terjadiRaw)) return terjadiRaw
          if (typeof terjadiRaw === 'string') {
            try { const v = JSON.parse(terjadiRaw); return Array.isArray(v) ? v : [] } catch { return [] }
          }
          return []
        })(),
        tambahAnalisisLama: (() => {
          if (Array.isArray(lamaRaw)) return lamaRaw
          if (typeof lamaRaw === 'string') {
            try { const v = JSON.parse(lamaRaw); return Array.isArray(v) ? v : [] } catch { return [] }
          }
          return []
        })(),
        whyImage: problemData?.why1_img || '',
        pilihO6: problemData?.oCategory || '',
        stepRepair: problemData?.fstep_repair || '',
        stepRepairNew: problemData?.fstep_new || '',
        partChange: problemData?.fpart_change || '',
        countermeasureKenapaTerjadi: problemData?.fpermanet_cm || '',
        yokoten: problemData?.fyokoten || '',
        rootcause5WhyKenapaLama: problemData?.rootcause5WhyKenapaLama || '',
        pilihQ6: problemData?.qCategory || '',
        pilihPM6: problemData.pmCategory || '',
        whyLamaImage: problemData?.why2_img || '',
        countermeasureKenapaLama: problemData?.fpermanet_cm_lama || '',
        attachmentMeeting: problemData?.attachmentMeeting || '',
        comments5WhySH: problemData?.comments5WhySH || '',
        comments5WhyLH: problemData?.comments5WhyLH || '',
        commentsCountermeasure: problemData?.commentsCountermeasure || '',
        file_report: problemData?.file_report || '',
        uploadFile: problemData?.uploadFile || '',
        agreeTerms: false,
        fiveWhyLhApprove: problemData?.fiveWhyLhApprove || 0,
        fiveWhyShApprove: problemData?.fiveWhyShApprove || 0,
        fiveWhyLhFeedback: problemData?.fiveWhyLhFeedback,
        fiveWhyShFeedback: problemData?.fiveWhyShFeedback,
        cmLhApprove: problemData?.cmLhApprove || 0,
        cmShApprove: problemData?.cmShApprove || 0,
        cmTlApprove: problemData?.cmTlApprove || 0,
        cmDhApprove: problemData?.cmDhApprove || 0,
        cmLhFeedback: problemData?.cmLhFeedback,
        cmShFeedback: problemData?.cmShFeedback,
        cmTlFeedback: problemData?.cmTlFeedback,
        cmDhFeedback: problemData?.cmDhFeedback,
        fiveWhyTlApprove: problemData?.fiveWhyTlApprove || 0,
        sparepart_list: JSON.stringify(problemData?.sparepart_list ?? []),
      }
    },

    async saveEditSubmit(submitData) {
      console.log('Saving edit submit data: ', submitData)
      if (!submitData.machineName) {
        alert('Please input machine name')
        return
      }
      if (!submitData.line) {
        alert('Please input line')
        return
      }
      if (!submitData.problems) {
        alert('Please input problems')
        return
      }
      if (!submitData.agreeTerms) {
        alert('You must agree to terms and conditions before submitting')
        return
      }

      let machineId = submitData.machineName;
      let lineId = submitData.line;

      if (typeof machineId === 'string') {
        const machineObj = this.machineOptions.find(m => m.label === machineId);
        if (machineObj) machineId = machineObj.id;
      }
      if (typeof lineId === 'string') {
        const lineObj = this.lineOptions.find(l => l.label === lineId);
        if (lineObj) lineId = lineObj.id;
      }

      let operatorNames = Array.isArray(submitData.operator)
        ? submitData.operator.map(op => {
            if (typeof op === 'string') {
              return op;
            }
            const memberObj = this.memberOption.find(m => m.id === op);
            return memberObj ? memberObj.label : op;
          })
        : [];

      try {
        const payload = {
          machineName: submitData.machineName,
          lineName: submitData.line,
          problemDescription: submitData.problems,
          operator: operatorNames.join(','),
          fid: submitData.fidProblem,
          maker: submitData.maker,
          operationNo: submitData.operationNo,
          avCategory: submitData.avCategory,
          shift: submitData.shift,
          startDate: submitData.startDate,
          finishDate: submitData.finishDate,
          durationMin: submitData.durationMin,
          problemCategory: submitData.problemCategory,
          itemTemporaryAction: submitData.itemTemporaryAction,
          rootcauses5Why: submitData.rootcauses5Why,
          stepRepair: JSON.stringify(submitData.stepRepair),
          stepRepairNew: JSON.stringify(submitData.stepRepairNew),
          partChange: submitData.partChange,
          countermeasureKenapaTerjadi: JSON.stringify(submitData.cmKenapaTerjadi),
          countermeasureKenapaLama: JSON.stringify(submitData.cmKenapaLama),
          yokoten: JSON.stringify(submitData.yokoten),
          rootcause5WhyKenapaLama: submitData.rootcause5WhyKenapaLama,
          tambahAnalisisLama: JSON.stringify(submitData.tambahAnalisisLama || []),
          tambahAnalysisTerjadi: JSON.stringify(submitData.tambahAnalysisTerjadi || []),
          whyImage: submitData.whyImage,
          whyLamaImage: submitData.whyLamaImage,
          comments5WhySH: submitData.comments5WhySH,
          comments5WhyLH: submitData.comments5WhyLH,
          commentsCountermeasure: submitData.commentsCountermeasure,
          attachmentMeeting: submitData.attachmentMeeting,
          file_report: submitData.file_report,
          uploadFile: submitData.uploadFile,
          actualImage: submitData.actualImage,
          uploadImage: submitData.uploadImage,
          ilustrasiActual: submitData.ilustrasiActual,
          ilustrasiStandart: submitData.ilustrasiStandart,
          standartImage: submitData.standartImage,
          gapBetweenStandarAndActual: submitData.gapBetweenStandarAndActual,
          uraianKejadian: submitData.uraianKejadian,
          agreeTerms: submitData.agreeTerms,
          oCategory: submitData.oCategory,
          qCategory: submitData.qCategory,
          pmCategory: submitData.pmCategory,
          fiveWhyTlApprove: submitData.fiveWhyTlApprove,
          fiveWhyLhApprove: submitData.fiveWhyLhApprove,
          fiveWhyShApprove: submitData.fiveWhyShApprove,
          cmTlApprove: submitData.cmTlApprove,
          cmLhApprove: submitData.cmLhApprove,
          cmShApprove: submitData.cmShApprove,
          cmDhApprove: submitData.cmDhApprove,
          fiveWhyLhFeedback: submitData.fiveWhyLhFeedback,
          fiveWhyShFeedback: submitData.fiveWhyShFeedback,
          cmLhFeedback: submitData.cmLhFeedback,
          cmShFeedback: submitData.cmShFeedback,
          cmTlFeedback: submitData.cmTlFeedback,
          cmDhFeedback: submitData.cmDhFeedback,
          sparepart_list: JSON.stringify(submitData.sparepart_list ?? []),
        }
        const formData = new FormData()
        Object.keys(payload).forEach((key) => {
          const value = payload[key]
          const isFileField = [
            'actualImage',
            'uploadImage',
            'whyLamaImage',
            'whyImage',
            'attachmentMeeting',
            'standartImage',
          ].includes(key)

          if (isFileField && value instanceof File) {
            formData.append(key, value)
          } else if (isFileField && typeof value === 'string' && value) {
            formData.append(key, value)
          } else if (isFileField && !value) {
          } else {
            formData.append(key, value ?? '')
          }
        })

        const response = await api.put('/smartandon/update', null, formData)
        console.log('Update response:', response)
        if (response.status === 200) {
          alert('Problem updated successfully')
          this.visibleEditModal = false
          this.editSubmit = {}
          // Refresh the followup data, charts, and current problems
          this.fetchFollowupLtrProblems()
          this.fetchChartData()
          this.fetchLtrData()
          this.fetchDashboardData()
        } else {
          throw new Error('Failed to update problem, status: ' + response.status)
        }
      } catch (error) {
        console.error(error)
        alert('Error updating problem: ' + error.message)
      }
    },

    openLtrReport(problemId) {
      this.$router.push(`/app/ProblemHistory?fid=${problemId}`);
    },
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

@import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');
.dashboard-cards-container {
  display: flex;
  flex-wrap: nowrap;
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
  width: calc((100% - 40px) / 5); /* 5 cards visible with margins */
  margin-right: 10px;
}

.dashboard-card-wrapper:last-child {
  margin-right: 0;
}

.line-danger {
  background-color: white !important;
  border: 4px solid red !important;
}

.line-warning {
  background-color: white!important;
  border: 4px solid orange !important;
}

/* Mobile responsive layout for dashboard cards */
@media (max-width: 768px) {
  .dashboard-cards-container {
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 80vh; /* Adjust as needed */
  }

  .dashboard-card-wrapper {
    width: 100%;
    margin-right: 0;
    margin-bottom: 15px;
  }

  .dashboard-card {
    min-height: 150px; /* Ensure minimum height for better touch targets */
  }

  .icon-container {
    width: 80px;
    height: 80px;
    padding: 20px;
  }

  .dashboard-card h4 {
    font-size: 1.1rem;
  }

  .dashboard-card CButton {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }
}

@media (max-width: 480px) {
  .dashboard-card {
    min-height: 120px;
  }

  .icon-container {
    width: 60px;
    height: 60px;
    padding: 15px;
  }

  .dashboard-card h4 {
    font-size: 1rem;
  }
}

</style>

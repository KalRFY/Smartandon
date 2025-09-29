<template>
  <CRow class="mb-3">
    <CCol lg="3" class="mb-3">
      <WelcomeCard />
    </CCol>

    <CCol lg="9" style="height: 100%;">
      <DashboardCards @navigate="navigateTo" />
    </CCol>
  </CRow>
  
  <MachineStopButton @click="onClickInput" />

  <COffcanvas placement="end" :visible="visibleEnd" @hide="() => { visibleEnd = !visibleEnd }">
    <COffcanvasHeader>
      <COffcanvasTitle>Offcanvas</COffcanvasTitle>
      <CCloseButton class="text-reset" @click="() => { visibleEnd = false }" />
    </COffcanvasHeader>
    <COffcanvasBody>
      Content for the offcanvas goes here. You can place just about any Bootstrap component or
      custom elements here.
    </COffcanvasBody>
  </COffcanvas>

  <CurrentProblems 
    :problems="problemActive" 
    :loading="loadingProblemActive" 
  />

  <OEECharts 
    :chart-data-per-line="chartDataPerLine"
    :oee-target="oeeTarget"
    :oee-actual="oeeActual"
    :oee-data-smartandon="oeeDataSmartandon"
    :cumulative-oee-series="cumulativeOeeSeries"
    :cumulative-oee-options="cumulativeOeeOptions"
    :problem-active="problemActive"
  />

  <MachineStopModal 
    :visible="visibleLiveDemo"
    :form-data="submit"
    :machine-options="machineOptions"
    :line-options="lineOptions"
    @close="closeModal"
    @submit="saveSubmit"
    @update:machine-name="updateFormData('machineName', $event)"
    @update:line="updateFormData('line', $event)"
    @update:problems="updateFormData('problems', $event)"
    @update:agree-terms="updateFormData('agreeTerms', $event)"
  />
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import {
  COffcanvas,
  COffcanvasHeader,
  COffcanvasTitle,
  COffcanvasBody,
  CCloseButton,
  CRow,
  CCol
} from '@coreui/vue'
import { useRouter } from 'vue-router'
import api from '@/apis/CommonAPI'

import WelcomeCard from './components/WelcomeCard.vue'
import DashboardCards from './components/DashboardCards.vue'
import MachineStopButton from './components/MachineStopButton.vue'
import CurrentProblems from './components/CurrentProblems.vue'
import OEECharts from './components/OEECharts.vue'
import MachineStopModal from './components/MachineStopModal.vue'

const router = useRouter()

const visibleEnd = ref(false)
const visibleLiveDemo = ref(false)
const loadingProblemActive = ref(false)

const machines = ref([])
const machineOptions = ref([])
const lines = ref([])
const lineOptions = ref([])
const oee = ref([])
const oeeOption = ref([])
const oeeTarget = ref([])
const oeeActual = ref([])
const oeePlan = ref([])
const oeeDataSmartandon = ref({})
const chartDataPerLine = ref([])
const cumulativeOeeSeries = ref([])
const cumulativeOeeOptions = ref({})
const problemActive = ref([])

const submit = reactive({
  machineName: null,
  line: null,
  lineName: null,
  operatorName: null,
  problems: null,
  agreeTerms: false,
})

let autoRefreshInterval = null

const fetchDashboardData = async () => {
  try {
    const responseMachines = await api.get('/machine/machine')
    if (responseMachines.status !== 200) {
      throw new Error('Failed to fetch machines')
    }
    machines.value = responseMachines.data?.data || responseMachines.data || []
    machineOptions.value = machines.value.map((machine) => ({
      id: machine.fid,
      label: machine.fmc_name,
    }))
  } catch (error) {
    console.error('Failed to fetch machines:', error)
  }

  try {
    const responseLines = await api.get('/line/line')
    console.log('Fetched lines:', responseLines)
    if (responseLines.status !== 200) {
      throw new Error('Failed to fetch lines')
    }
    lines.value = responseLines.data?.data || responseLines.data || []
    lineOptions.value = lines.value.map((line) => ({
      id: line.fid,
      label: line.fline,
    }))
  } catch (error) {
    console.error('Failed to fetch lines:', error)
  }

  try {
    loadingProblemActive.value = true
    console.log('[FE Debug] Dashboard params to send:', { limitView: 0 })

    const responseProblems = await api.get('/problem/problemView', {
      search: JSON.stringify({ limitView: 0 }),
    })
    if (responseProblems.status !== 200) {
      throw new Error('Failed to fetch active problems')
    }
    problemActive.value = responseProblems.data.data || responseProblems.data || []
    console.log('Filtered active problems:', problemActive.value)
  } catch (error) {
    console.error('Failed to fetch active problems:', error)
    problemActive.value = []
  } finally {
    loadingProblemActive.value = false
  }

  try {
    const responseOeeData = await api.get('/oee/oeeDataSmartandon')
    if (responseOeeData.status !== 200) {
      throw new Error('Failed to fetch OEE data for Smartandon')
    }
    oeeDataSmartandon.value = responseOeeData.data?.data || responseOeeData.data || {}
    console.log('OEE Target: ' + oeeDataSmartandon.value)
  } catch (error) {
    console.log('Failed to fetch oee target:', error)
  }

  try {
    const responseOeeTarget = await api.get('/oee/oeeTarget')
    console.log('Fetched OEE Target:', responseOeeTarget)
    if (responseOeeTarget.status !== 200) {
      throw new Error('Failed to fetch OEE target')
    }
    oeeTarget.value = responseOeeTarget.data?.data || responseOeeTarget.data || []
    oeeOption.value = oeeTarget.value.map((oeeTargets) => ({
      id: oeeTargets.GROUP_NAME,
      label: oeeTargets.TAG_NAME,
      labelOeeTarget: oeeTargets.REG_VALUE,
    }))
    console.log('OEE Target: ' + oeeTarget.value)
  } catch (error) {
    console.log('Failed to fetch oee target:', error)
  }

  try {
    const responseOeeActual = await api.get('/oee/oeeActual')
    if (responseOeeActual.status !== 200) {
      throw new Error('Failed to fetch OEE actual')
    }
    oeeActual.value = responseOeeActual.data?.data || responseOeeActual.data || []
  } catch (error) {
    console.log('Failed to fetch oee actual:', error)
  }

  try {
    const responseOeePlan = await api.get('/oee/oeePlan')
    if (responseOeePlan.status !== 200) {
      throw new Error('Failed to fetch OEE plan')
    }
    oeePlan.value = responseOeePlan.data?.data || responseOeePlan.data || []
  } catch (error) {
    console.log('Failed to fetch oee plan:', error)
  }

  try {
    const responseOee = await api.get('/oee/oee')
    if (responseOee.status !== 200) {
      throw new Error('Failed to fetch OEE data')
    }
    console.log('Fetched OEE data:', responseOee)
    oee.value = responseOee.data?.data
    oeeOption.value = oee.value.map((oeeValue) => ({
      id: oeeValue.GROUP_NAME,
      label: oeeValue.TAG_NAME,
      labelOee: oeeValue.REG_VALUE,
    }))

    const uniqueOee = {}
    oee.value.forEach((item) => {
      if (!uniqueOee[item.DEV_NAME]) {
        uniqueOee[item.DEV_NAME] = parseFloat(item.REG_VALUE)
      }
    })

    const maxOeeValue = Math.max(...Object.values(uniqueOee))
    chartDataPerLine.value = Object.entries(uniqueOee).map(([devName, value]) => {
      const normalizedValue = (value / maxOeeValue) * 100
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
                      return '99.99%'
                    }
                    return val.toFixed(2) + '%'
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
      }
    })

    const cumulativeOeeData = {}
    oee.value.forEach((item) => {
      if (!cumulativeOeeData[item.DEV_NAME]) {
        cumulativeOeeData[item.DEV_NAME] = parseFloat(item.REG_VALUE)
      }
    })

    cumulativeOeeSeries.value = Object.values(cumulativeOeeData)
    cumulativeOeeOptions.value = {
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
        max: Math.max(...Object.values(cumulativeOeeData)) * 1.1,
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
    }
  } catch (error) {
    console.error('Failed to fetch or process OEE data:', error)
  }
}

const startAutoRefresh = () => {
  fetchDashboardData()
  autoRefreshInterval = setInterval(() => {
    fetchDashboardData()
  }, 30000)
}

const stopAutoRefresh = () => {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval)
    autoRefreshInterval = null
  }
}

const onClickInput = async () => {
  try {
    const response = await api.get('/user/user')
    if (response.status !== 200) {
      throw new Error('Failed to fetch user')
    }
    const data = response.data?.data || response.data || {}
    submit.operatorName = data.user.name || ''
  } catch (error) {
    console.error('Failed to fetch current user info:', error)
  }
  visibleLiveDemo.value = true
  console.log("User: " + submit.operatorName)
}

const saveSubmit = async () => {
  console.log('Submitting data:', submit)
  let machineNameToSubmit = null
  if (submit.machineName) {
    if (typeof submit.machineName === 'object' && submit.machineName.id) {
      machineNameToSubmit = submit.machineName.id
    } else if (typeof submit.machineName === 'number') {
      machineNameToSubmit = submit.machineName
    }
  }
  if (!machineNameToSubmit) {
    alert('Please input or select machine name')
  } else if (!submit.line) {
    alert('Please input line')
  } else if (!submit.problems) {
    alert('Please input problems')
  } else if (!submit.agreeTerms) {
    alert('You must agree to terms and conditions before submitting')
  } else {
    try {
      const currentTime = new Date()
      const formattedTime = currentTime.toISOString().slice(0, 19).replace('T', ' ')
      
      const payload = {
        fmc_id: machineNameToSubmit,
        lineName: submit.lineName,
        ferror_name: submit.problems,
        fstart_time: formattedTime
      }
      
      console.log('Payload to send:', payload)
      const response = await api.put('/problem/problemMachine', payload)
      if (response.data.status === 'success') {
        alert('Input saved successfully')
        closeModal()
        Object.assign(submit, {
          machineName: null,
          line: null,
          lineName: null,
          operatorName: null,
          problems: null,
          agreeTerms: false,
        })
      } else {
        alert('Failed to save input')
      }
    } catch (error) {
      console.log(error.message)
      alert('Error saving input: ' + error.message)
    }
  }
}

const closeModal = () => {
  visibleLiveDemo.value = false
}

const updateFormData = (field, value) => {
  submit[field] = value
}

const navigateTo = (route) => {
  router.push(route)
}

onMounted(() => {
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped>
</style>
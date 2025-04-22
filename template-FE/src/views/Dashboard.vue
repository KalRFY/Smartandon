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

  <CButton style="width: 100%;" class="mb-3" color="primary" shape="rounded-pill" @click="onClickInput">Machine Stop Input</CButton>

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
              id="validationCustom01"
              label="Machine Name"
              required
              v-model="saveMachine.machine_nm"
            />
          </CCol>
          <CCol md="4">
            <CFormSelect
              aria-describedby="validationCustom04Feedback"
              feedbackInvalid="Please select a valid state."
              id="validationCustom04"
              label="Line"
              required
            >
              <option selected="" disabled="" value="">
                Choose...
              </option>
              <option>LPDC</option>
              <option>HPDC</option>
              <option>CRANK SHAFT</option>
              <option>CYLINDER HEAD</option>
              <option>CYLINDER BLOCK</option>
              <option>CAM SHAFT</option>
              <option>ASSY LINE</option>
            </CFormSelect>
          </CCol>
          <CCol md="6">
            <CFormInput 
              feedbackInvalid="Please provide a valid city."
              id="validationCustom03"
              label="City"
              required
            />
          </CCol>
          <CCol xs="12">
            <CFormCheck
              feedbackInvalid="You must agree before submitting."
              id="invalidCheck"
              label="Agree to terms and conditions"
              required
              type="checkbox"
            />
          </CCol>
          <CCol xs="12">
            <CButton color="primary" type="submit">Submit form</CButton>
          </CCol>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="() => { visibleLiveDemo = false }">
          Close
        </CButton>
        <CButton color="primary">Save changes</CButton>
      </CModalFooter>
    </CModal>
  </div>

</template>

<script>
import { ref } from 'vue'
import { CButton, CCard, CCardBody, CContainer } from '@coreui/vue';
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

const visibleStaticBackdropDemo = ref(false);

export default {
  name: 'Dashboard',
  data() {
    return {
    
      visibleLiveDemo: false,

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
    BookText
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
        route: '/app/problem-history'
      },
      {
        title: 'Realtime Pareto',
        icon: 'BarChart2',
        description: 'Live Pareto analysis of issues',
        color: 'success',
        route: '/realtime-pareto'
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

    saveMachine() {
      
    }
  }

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
</style>

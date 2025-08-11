<template>
  <CContainer fuild>
    <CCol>Smartandon</CCol>
  </CContainer>
  <div>
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
    <CContainer fluid>
    </CContainer>
  </div>

  <CRow>
    <CCol class="mb-3">
      <CTable v-if="lines.length" bordered hover responsive>
        <CTableHead>
          <CTableRow>
            <!-- <CTableHeaderCell>No</CTableHeaderCell> -->
            <CTableHeaderCell scope="col">fid</CTableHeaderCell>
            <CTableHeaderCell scope="col">fline</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow v-for="line in lines" :key="line.fid">
            <CTableDataCell>{{ line.fid }}</CTableDataCell>
            <CTableDataCell>{{ line.fline }}</CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
      <p v-else>Loading data...</p>
    </CCol>
  </CRow>
  
  <CRow>
    <CCol class="mb-3">
      <CTable v-if="problems.length" bordered hover responsive>
        <CTableHead>
          <CTableRow>
            <!-- <CTableHeaderCell>No</CTableHeaderCell> -->
            <CTableHeaderCell scope="col">fid</CTableHeaderCell>
            <CTableHeaderCell scope="col">ferror_name</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow v-for="problem in problems" :key="problem.fid">
            <CTableDataCell>{{ problem.fid }}</CTableDataCell>
            <CTableDataCell>{{ problem.ferror_name }}</CTableDataCell>
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
            <CTableHeaderCell scope="col">fid</CTableHeaderCell>
            <CTableHeaderCell scope="col">fmc_name</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow v-for="machine in machines" :key="machine.fid">
            <CTableDataCell>{{ machine.fid }}</CTableDataCell>
            <CTableDataCell>{{ machine.fmc_name }}</CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
      <p v-else>Loading data...</p>
    </CCol>
  </CRow>
  <CRow>
    <CCol class="mb-3">
      <CTable v-if="oee.length" bordered hover responsive>
        <CTableHead>
          <CTableRow>
            <!-- <CTableHeaderCell>No</CTableHeaderCell> -->
             <CTableHeaderCell scope="col">Line</CTableHeaderCell>
            <CTableHeaderCell scope="col">OEE</CTableHeaderCell>
            <CTableHeaderCell scope="col">Value</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow v-for="oeeValue in oee" :key="oeeValue.CLIENT_HDL">

            <CTableDataCell>{{ oeeValue.GROUP_NAME }}</CTableDataCell>
            <CTableDataCell>{{ oeeValue.TAG_NAME }}</CTableDataCell>
            <CTableDataCell>{{ oeeValue.REG_VALUE }}</CTableDataCell>

          </CTableRow>
        </CTableBody>
      </CTable>
      <p v-else>Loading data...</p>
    </CCol>
  </CRow>

  <CRow>
    <CCol class="mb-3">
      <CTable v-if="members.length" bordered hover responsive>
        <CTableHead>
          <CTableRow>
            <!-- <CTableHeaderCell>No</CTableHeaderCell> -->
            <CTableHeaderCell scope="col">Member Id</CTableHeaderCell>
            <CTableHeaderCell scope="col">Member Name</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow v-for="member in members" :key="member.fid">
            <CTableDataCell>{{ member.fid }}</CTableDataCell>
            <CTableDataCell>{{ member.fname }}</CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
      <p v-else>Loading data...</p>
    </CCol>
  </CRow>

  <CRow class="mb-3">
    <CCol>
      <CCard>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">No</CTableHeaderCell>
              <CTableHeaderCell scope="col">Machine</CTableHeaderCell>
              <CTableHeaderCell scope="col">PIC</CTableHeaderCell>
              <CTableHeaderCell scope="col">Line</CTableHeaderCell>
              <CTableHeaderCell scope="col">Problem</CTableHeaderCell>
              <CTableHeaderCell scope="col">Duration</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <!-- <CTableRow v-if="loadingProblemActive">
              <CTableDataCell colspan="6" class="text-center">Loading...</CTableDataCell>
            </CTableRow>
            <CTableRow v-else-if="problemActive.length === 0">
              <CTableDataCell colspan="6" class="text-center">No active problems</CTableDataCell>
            </CTableRow> -->
            <CTableRow v-for="(problem, idx) in problemActive" :key="problem.fid">
              <CTableDataCell>{{ idx + 1 }}</CTableDataCell>
              <CTableDataCell>{{ problem.fmc_name }}</CTableDataCell>
              <CTableDataCell>{{ problem.foperator }}</CTableDataCell>
              <CTableDataCell>{{ problem.fline }}</CTableDataCell>
              <CTableDataCell>{{ problem.ferror_name }}</CTableDataCell>
              <CTableDataCell>{{ problem.fdur }}</CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </CCard>
    </CCol>
  </CRow>





</template>

<script>
import { ref } from 'vue'
import { CButton, CCard, CCardBody, CCardTitle, CContainer, CTable, CTableHead, CTableBody, CTableHeaderCell, CTableRow, CTableDataCell, CCardHeader, CCardText } from '@coreui/vue';
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

export default {
  name: 'DashboardDataDisplay',
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
    Treeselect,
  },
  data() {
    return {
      types: [],
      lines: [],
      linesOptions: [],
      machines: [],
      machineOptions: [],
      problems: [],
      problemOption: [],
      oee: [],
      oeeOption: [],
      members: [],
      memberOption: []
    };
  },
  async created() {
    try {
      this.loadingProblemActive = true;
      this.limitView = 0;
      const response = await axios.get('/api/smartandon/problemView', {
        params: { 
          limitView: 0,
        }
      });
      // Filter hanya problem yang fend_time null
      this.problemActive = response.data.data
      console.log('Filtered active problems:', this.problemActive);
    } catch (error) {
      console.error('Failed to fetch active problems:', error);
      this.problemActive = [];
    } finally {
      this.loadingProblemActive = false;
    }
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
    try {
      const response = await axios.get('/api/smartandon/problemId');
      this.problems = response.data;
      this.problemOption = response.data.map(problem => ({
        id: problem.fid,
        label: problem.ferror_name
      }));
    } catch (error) {
      console.error('Failed to fetch problems:', error);
    }
    try {
      const response = await axios.get('/api/smartandon/oee');
      this.oee = response.data;
      this.oeeOption = response.data.map(oeeValue => ({
        id: oeeValue.GROUP_NAME,
        label: oeeValue.TAG_NAME,
        labelOee: oeeValue.REG_VALUE
      }));
    } catch (error) {
      console.error('Failed to fetch oee:', error);
    }
    try {
      const response = await axios.get('/api/smartandon/member');
      this.members = response.data;
      this.memberOption = response.data.map(oeeValue => ({
        id: memberId.fid,
        label: memberName.fname,
      }));
    } catch (error) {
      console.error('Failed to fetch member:', error);
    }
  },
};
</script>

<style scoped>
p {
  font-style: italic;
}
</style>

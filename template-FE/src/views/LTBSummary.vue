<template>
  <CContainer fluid class="mt-4">
    <CRow>
      <CCol>
        <h3>LTB Report Status</h3>
        <p>Problem (>= 120 min)</p>
      </CCol>
    </CRow>
    <CCard class="mt-2 mb-3 px-0 custom-card">
      <CRow class="mt-3 mb-3 px-3">
        <CCol xs="12">
          <LegendStatus class="d-flex justify-content-between align-items-center w-100 mb-2" />
          <CInputGroup size="lg" class="mt-5 w-100">
            <CInputGroupText>Name</CInputGroupText>
            <CFormInput placeholder="name TL/GL" v-model="findLeader" />
          </CInputGroup>
        </CCol>
      </CRow>

      <CRow class="px-3">
        <CCol xs="12">
          <div class="tableFixHead w-100 custom-table">
            <table class="table table-bordered w-100">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Date</th>
                  <th>Mesin</th>
                  <th>Problem Description</th>
                  <th>Duration</th>
                  <th>TL</th>
                  <th>GL</th>
                  <th>TL<br />Check</th>
                  <th>GL<br />Check</th>
                  <th>SH<br />Check</th>
                  <th>Mgr<br />Check</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in tableProblemFup" :key="i">
                  <td>{{ i + 1 }}</td>
                  <td>{{ item.fstart_time }}</td>
                  <td>{{ item.fmc_name }}</td>
                  <td class="text-left">{{ item.ferror_name }}</td>
                  <td>{{ item.fdur }}</td>
                  <td>{{ item.tlName }}</td>
                  <td>{{ item.glName }}</td>
                  <td>
                    <div :class="item.tlCheck" />
                  </td>
                  <td>
                    <div :class="item.lhCheck" />
                  </td>
                  <td>
                    <div :class="item.shCheck" />
                  </td>
                  <td>
                    <div :class="item.dhCheck" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CCol>
      </CRow>
    </CCard>
  </CContainer>
</template>

<script>
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CInputGroup,
  CInputGroupText,
  CFormInput,
} from '@coreui/vue'
import LegendStatus from '@/components/LegendStatus.vue'
import axios from 'axios'

export default {
  name: 'LTBSummary',
  components: {
    CContainer,
    CRow,
    CCol,
    CCard,
    CInputGroup,
    CInputGroupText,
    CFormInput,
    LegendStatus,
  },
  data() {
    return {
      containerProblemFup: [],
      tableProblemFup: [],
      isLoading: false,
      findLeader: null,
      windowWidth: window.innerWidth,
      isMobile: false,
    }
  },
  watch: {
    findLeader(val) {
      if (!this.containerProblemFup || !Array.isArray(this.containerProblemFup)) return;

      const leader = val ? val.toUpperCase() : '';
      this.tableProblemFup = this.containerProblemFup.filter(
        (item) =>
          (item.glName || '').toUpperCase().includes(leader) ||
          (item.tlName || '').toUpperCase().includes(leader),
      );
    },
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth
      this.isMobile = this.windowWidth < 650
    },
    checkStatus(state) {
      if (state === 1) return 'dotApprove'
      if (state === 2) return 'dotDelay'
      if (state === 3) return 'dotComment'
      return 'dot'
    },
  },
  async mounted() {
    window.addEventListener('resize', this.onResize)
    this.onResize()
    this.isLoading = true
    try {
      const res = await axios.get(`${process.env.VUE_APP_HOST}/api/summary/ltb-summary`)
      console.log('Fetched data:', res.data)

      const rawDelayProblems = res.data?.data?.delayProblems
      if (!rawDelayProblems || !Array.isArray(rawDelayProblems)) {
        console.warn('delayProblems is empty or invalid format')
        this.containerProblemFup = []
        this.tableProblemFup = []
        return
      }

      const flattened = Array.isArray(rawDelayProblems[0])
        ? rawDelayProblems[0]
        : rawDelayProblems

      const sorted = flattened.sort(
        (a, b) => new Date(a.fstart_time) - new Date(b.fstart_time)
      )

      const mapped = sorted.map(item => {
        item.tlName = ''
        item.glName = ''

        item.tlCheck = this.checkStatus(
          item.fpermanet_cm === '[]' && item.fpermanet_cm_lama === '[]' ? 2 : 1
        )

        const daysSince = (d) =>
          (Date.now() - new Date(d).getTime()) / (1000 * 3600 * 24)

        if (item.cmLhApprove === 0) {
          item.lhCheck =
            daysSince(item.fstart_time) >= 1 && !item.cmLhFeedback
              ? this.checkStatus(2)
              : item.cmLhFeedback
                ? this.checkStatus(3)
                : this.checkStatus(4)
        } else {
          item.lhCheck = this.checkStatus(1)
        }

        if (item.cmShApprove === 0) {
          item.shCheck =
            daysSince(item.fstart_time) >= 2 && !item.cmShFeedback
              ? this.checkStatus(2)
              : item.cmShFeedback
                ? this.checkStatus(3)
                : this.checkStatus(4)
        } else {
          item.shCheck = this.checkStatus(1)
        }

        if (item.cmDhApprove === 'null') item.cmDhApprove = 0
        if (item.cmDhApprove === 0) {
          item.dhCheck =
            daysSince(item.fstart_time) >= 3 && !item.cmDhFeedback
              ? this.checkStatus(2)
              : item.cmDhFeedback
                ? this.checkStatus(3)
                : this.checkStatus(4)
        } else {
          item.dhCheck = this.checkStatus(1)
        }

        return item
      })

      this.containerProblemFup = mapped
      this.tableProblemFup = mapped
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      this.isLoading = false
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize)
  },
}
</script>

<style scoped>
.custom-card {
  border-radius: 12px;
}

.custom-table {
  border-radius: 12px;
}

.tableFixHead {
  overflow: auto;
  max-height: 70vh;
}

.tableFixHead thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: white;
}

.table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  font-size: 12px;
  text-align: center;
  white-space: nowrap;
}
</style>
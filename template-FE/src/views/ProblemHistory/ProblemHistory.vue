<template>
  <div style="position: relative">
    <EditProblemModal
      :visible="visibleLiveDemo"
      :submitData="submit"
      :machineOptions="machineOptions"
      :lineOptions="lineOptions"
      :modalLoading="modalLoading"
      @close="visibleLiveDemo = false"
      @submit="saveSubmit"
    />

    <SearchFilters
      :filterStartDate="filterStartDate"
      :filterFinishDate="filterFinishDate"
      :selectedLine="selectedLine"
      :selectedMachineName="selectedMachineName"
      :selectedProblem="selectedProblem"
      :lineOptions="lineOptions"
      :machineOptions="machineOptions"
      :loading="loading"
      @update:filterStartDate="filterStartDate = $event"
      @update:filterFinishDate="filterFinishDate = $event"
      @update:selectedLine="selectedLine = $event"
      @update:selectedMachineName="selectedMachineName = $event"
      @update:selectedProblem="selectedProblem = $event"
      @search="fetchProblems"
      @reset="resetFilters"
      @machineInput="onMachineInput"
    />

    <div style="position: relative">
      <div v-if="tableLoading" class="table-loading-overlay">
        <CSpinner color="primary" style="width: 3rem; height: 3rem" />
        <div style="margin-top: 10px; font-size: 1.2rem; color: #333">
          Loading...
        </div>
      </div>
      <div :class="{ 'table-blur': tableLoading }">
        <ProblemsTable
          :problems="problemsView"
          :loading="loading"
          :currentPage="currentPage"
          :pageSize="pageSize"
          :totalPages="totalPages"
          :visiblePages="visiblePages"
          @editProblem="onClickInput"
          @viewLtbReport="onClickLtbReport"
          @goToPage="goToPage"
          @freq="freq"
          @ltb="ltb"
          @download="download"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import api from '../../apis/CommonAPI'
import { useRouter } from 'vue-router'
import EditProblemModal from './EditProblemModal.vue'
import SearchFilters from './components/SearchFilters.vue'
import ProblemsTable from './components/ProblemsTable.vue'

export default {
  name: 'ProblemDashboard',
  components: {
    EditProblemModal,
    SearchFilters,
    ProblemsTable,
  },

  setup() {
    const router = useRouter()
    const navigateTo = (route) => {
      router.push(route)
    }
    return { navigateTo }
  },

  data() {
    return {
      lineOptions: [],
      machineOptions: [],
      memberOption: [],

      filterStartDate: '',
      filterFinishDate: '',
      selectedLine: null,
      selectedMachineName: null,
      selectedProblem: '',

      problemsView: [],

      currentPage: 1,
      pageSize: 50,
      pages: 5,
      totalRecords: 0,
      totalPages: 0,

      loading: false,
      error: null,
      visibleLiveDemo: false,
      modalLoading: false,
      tableLoading: false,

      submit: this.getInitialSubmitData(),
    }
  },

  computed: {
    visiblePages() {
      const total = this.totalPages
      const current = this.currentPage
      const maxVisible = this.pages || 5
      let start = Math.max(1, current - Math.floor(maxVisible / 2))
      let end = start + maxVisible - 1
      if (end > total) {
        end = total
        start = Math.max(1, end - maxVisible + 1)
      }
      const pages = []
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    },
  },

  methods: {
    getInitialSubmitData() {
      return {
        machineName: '',
        line: '',
        operationNo: '',
        maker: '',
        fmaker: '',
        problems: '',
        uraianKejadian: '',
        uploadImage: '',
        ilustrasiStandart: '',
        standartImage: '',
        ilustrasiActual: '',
        actualImage: '',
        gapBetweenStandarAndActual: '',
        pilihFocusThemaMember: '',
        pilihTaskforce: '',
        operator: [],
        avCategory: '',
        shift: '',
        startDate: '',
        finishDate: '',
        durationMin: '',
        problemCategory: '',
        itemTemporaryAction: '',
        rootcauses5Why: '',
        tambahAnalysisTerjadi: '',
        whyImage: '',
        pilihO6: '',
        stepRepair: '',
        partChange: '',
        countermeasureKenapaTerjadi: '',
        yokoten: '',
        rootcause5WhyKenapaLama: '',
        tambahAnalisisLama: '',
        pilihQ6: '',
        whyLamaImage: '',
        countermeasureKenapaLama: '',
        attachmentMeeting: '',
        comments5Why: '',
        commentsCountermeasure: '',
        lastReportFile: '',
        uploadFile: '',
        agreeTerms: false,
      }
    },

    async fetchProblems(page = 1) {
      this.loading = true
      this.error = null

      try {
        const limit = this.pageSize || 50
        let machineLabel = undefined

        if (this.selectedMachineName) {
          const machine = this.machineOptions.find(
            (m) => m.id === this.selectedMachineName,
          )
          if (machine) {
            machineLabel = machine.label
          }
        }

        const params = {
          page,
          limit,
          startDate: this.filterStartDate || undefined,
          finishDate: this.filterFinishDate || undefined,
          line: this.selectedLine || undefined,
          machineName: machineLabel || undefined,
          problem: this.selectedProblem || undefined,
        }

        const response = await axios.get('/api/smartandon/problemView', {
          params,
        })

        this.problemsView = response.data.data
        this.totalRecords = response.data.total
        this.currentPage = response.data.page
        this.pageSize = response.data.limit
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize)
      } catch (error) {
        this.error = 'Failed to fetch problems: ' + error.message
        console.error(this.error)
      } finally {
        this.loading = false
      }
    },

    resetFilters() {
      this.filterStartDate = ''
      this.filterFinishDate = ''
      this.selectedMachineName = null
      this.selectedLine = null
      this.selectedProblem = ''
    },

    async onClickInput(problem) {
      try {
        this.tableLoading = true
        this.modalLoading = true
        const response = await axios.get(
          `/api/smartandon/problemId/${problem.fid}`,
        )
        const problemData = response.data
        console.log('Problem data:', problemData)
        this.submit = this.mapProblemDataToSubmit(problemData)
        this.visibleLiveDemo = true
      } catch (error) {
        alert('Failed to load problem data: ' + error.message)
        console.error(error)
      } finally {
        this.modalLoading = false
        this.tableLoading = false
      }
    },

    mapProblemDataToSubmit(problemData) {
      const formatDateToISO = (dateStr) => {
        if (!dateStr) return ''
        const date = new Date(dateStr)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }

      return {
        machineName: problemData.fmc_name || '',
        line: problemData.fline || '',
        fidProblem: problemData.fid || '',
        maker: problemData.fmaker || '',
        operationNo: problemData.foperation_no || '',
        problems: problemData.ferror_name || '',
        uraianKejadian: problemData.freal_prob || '',
        uploadImage: problemData.uploadImage || '',
        ilustrasiStandart: problemData.ilustrasiStandart || '',
        standartImage: problemData.fDescImage || '',
        ilustrasiActual: problemData.ilustrasiActual || '',
        actualImage: problemData.fimage || '',
        gapBetweenStandarAndActual:
          problemData.gapBetweenStandarAndActual || '',
        pilihFocusThemaMember: problemData.pilihFocusThemaMember || '',
        pilihTaskforce: problemData.pilihTaskforce || '',
        operator: problemData.foperator
          ? problemData.foperator.split(/,|&/)
          : [],
        avCategory: problemData.fav_categoty || '',
        shift: problemData.fshift || '',
        startDate: formatDateToISO(problemData.fstart_time) || '',
        finishDate: formatDateToISO(problemData.fend_time) || '',
        durationMin: problemData.fdur || '',
        problemCategory: problemData.problemCategory || '',
        itemTemporaryAction: problemData.temporaryAction || '',
        rootcauses5Why: problemData.froot_cause || '',
        tambahAnalysisTerjadi: problemData.tambahAnalysisTerjadi || '',
        whyImage: problemData.why1_img || '',
        pilihO6: problemData.pilihO6 || '',
        stepRepair: problemData.fstep_repair || '',
        partChange: problemData.fpart_change || '',
        countermeasureKenapaTerjadi:
          problemData.countermeasureKenapaTerjadi || '',
        yokoten: problemData.fyokoten || '',
        rootcause5WhyKenapaLama: problemData.rootcause5WhyKenapaLama || '',
        tambahAnalisisLama: problemData.tambahAnalisisLama || '',
        pilihQ6: problemData.pilihQ6 || '',
        whyLamaImage: problemData.why2_img || '',
        countermeasureKenapaLama: problemData.countermeasureKenapaLama || '',
        attachmentMeeting: problemData.attachmentMeeting || '',
        comments5Why: problemData.comments5Why || '',
        commentsCountermeasure: problemData.commentsCountermeasure || '',
        lastReportFile: problemData.lastReportFile || '',
        uploadFile: problemData.uploadFile || '',
        agreeTerms: false,
      }
    },

    onClickLtbReport(problem) {
      alert(`LTB Report clicked for problem ID: ${problem.fid}`)
    },

    async saveSubmit(submitData) {
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

      try {
        const payload = {
          machineName: submitData.machineName,
          lineName: submitData.line,
          problemDescription: submitData.problems,
          operator: submitData.operator.join(','),
          fid: submitData.fidProblem,
        }

        const response = await api.put('/smartandon/problem/update', payload)

        if (response.data.status === 'success') {
          alert('Input updated successfully')
          this.visibleLiveDemo = false
          this.submit = this.getInitialSubmitData()
          this.fetchProblems(this.currentPage)
        } else {
          alert('Failed to update input')
        }
      } catch (error) {
        console.error(error)
        alert('Error updating input: ' + error.message)
      }
    },

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.fetchProblems(page)
      }
    },

    onMachineInput() {
      console.log('Machine input changed:', this.selectedMachineName)
    },

    freq() {
      alert('Frequency filter clicked')
    },

    ltb() {
      alert('LTB filter clicked')
    },

    download() {
      alert('Download')
    },

    async loadInitialData() {
      this.loading = true
      this.error = null

      try {
        const machineResponse = await axios.get('/api/smartandon/machine')
        this.machineOptions = machineResponse.data.map((machine) => ({
          id: machine.fid,
          label: machine.fmc_name,
        }))

        const lineResponse = await axios.get('/api/smartandon/line')
        this.lineOptions = lineResponse.data.map((line) => ({
          id: line.fid,
          label: line.fline,
        }))

        const memberResponse = await axios.get('/api/smartandon/member')
        this.memberOption = memberResponse.data.map((member) => ({
          id: member.fid,
          label: member.fname,
        }))

        await this.fetchProblems(this.currentPage)
      } catch (error) {
        this.error = 'Failed to load initial data: ' + error.message
        console.error(error)
      } finally {
        this.loading = false
      }
    },
  },

  async created() {
    await this.loadInitialData()
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

.table-blur {
  filter: blur(3px);
  pointer-events: none;
  user-select: none;
  opacity: 0.6;
}
.table-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.5);
  z-index: 10;
}
</style>

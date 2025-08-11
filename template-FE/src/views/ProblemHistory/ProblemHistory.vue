<template>
  <div style="position: relative">
    <EditProblemModal
      :visible="visibleLiveDemo"
      :submitData="submit"
      :machineOptions="machineOptions"
      :lineOptions="lineOptions"
      :modalLoading="modalLoading"
      :memberOption="memberOption"
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
      @search="
        () =>
          fetchProblems(currentPage, {
            filterStartDate,
            filterFinishDate,
            selectedLine,
            selectedMachineName,
            selectedProblem,
            problemCategory: selectedProblemCategory,
          })
      "
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
          :filteredTambahAnalisis="filteredTambahAnalisis"
          :filteredTambahAnalisisLama="filteredTambahAnalisisLama"
          @editProblem="onClickInput"
          @viewLtbReport="onClickLtbReport"
          @goToPage="goToPage"
          @freq="freq"
          @ltb="ltb"
          @download="download"
          @filterCategory="onFilterCategory"
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
import PaginationControls from './components/PaginationControls.vue'
import TableActions from './components/TableActions.vue'

export default {
  name: 'ProblemDashboard',
  components: {
    EditProblemModal,
    SearchFilters,
    ProblemsTable,
    PaginationControls,
    TableActions,
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
      allProblems: [],
      selectedProblemCategory: null,
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
      qCategoryName: '',
      filteredTambahAnalisis: [],
      filteredTambahAnalisisLama: [],
      terjadiAnalysis: [],
      lamaAnalysis: [],
      selectedFiltered: '',

      o6Options: [
        {
          id: 1,
          label:
            'O1: Design & Installation (Design / Installation Not Good (Refers to Function Check / Eng. Memo))',
        },
        {
          id: 2,
          label:
            'O2: Henkaten Issue (No Enough Trial, No Confirm (others team))',
        },
        {
          id: 3,
          label:
            'O3: PM Issue (No Have/Unclear, Unclear Methode, Confine/Invisible, Out of Periode, No Have Time, Lack of Skill)',
        },
        {
          id: 4,
          label:
            'O4: Symptom (No Have Symptom, Have Symptom but Unfollow Activity)',
        },
        {
          id: 5,
          label:
            'O5: Environment & 3rd Factor (Dirty, Confine Space, Invisible Area, Unpredictable (water leak / crush))',
        },
        {
          id: 6,
          label: 'O6: Lifetime Issue (Out of Standard Running, Over Capacity)',
        },
      ],

      shiftOptions: [
        { id: 'r', label: 'Red' },
        { id: 'w', label: 'White' },
        { id: '', label: 'No Shift' },
      ],

      problemCategoryOptions: [
        { id: 1, label: 'Small' },
        { id: 2, label: 'Chokotei' },
        { id: 3, label: 'LTB' },
      ],

      q6Options: [
        {
          id: 1,
          label:
            'Q1: Diagnose (Meeting, accuracy check (run-out, backlash, etc))',
        },
        {
          id: 2,
          label:
            'Q2: Sparepart (Part preparation, fabrication of part, repair of damage part due to unavailability at SPW)',
        },
        {
          id: 3,
          label:
            'Q3: Tool (Special tools preparation, change of tools, personal tool, change dresser, safety tool)',
        },
        {
          id: 4,
          label:
            'Q4: Maint. Ability (Repair, overhaul, part replace, tomoken, 5S)',
        },
        {
          id: 5,
          label:
            'Q5: Setting Ability (Quality checking, program adjustment, program zeroing, position memory set, autosizer setting & amp, PSW set, backlash adjustment (slide gib / kamisori, parameter set, centering, etc))',
        },
        {
          id: 6,
          label: "Q6: Back-Up (Back-Up MC's Preparation, Back-Up MC's dandori)",
        },
      ],
    }
  },

  computed: {
    visiblePages() {
      const total = this.totalPages
      const current = this.currentPage
      const maxVisible = 5
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
        standardImage: '',
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
        problemCategory: null,
        itemTemporaryAction: '',
        rootcauses5Why: '',
        tambahAnalysisTerjadi: '',
        whyImage: '',
        oCategory: '',
        stepRepair: '',
        partChange: '',
        countermeasureKenapaTerjadi: '',
        yokoten: '',
        rootcause5WhyKenapaLama: '',
        tambahAnalisisLama: '',
        qCategory: '',
        whyLamaImage: '',
        countermeasureKenapaLama: '',
        attachmentMeeting: '',
        comments5Why: '',
        commentsCountermeasure: '',
        lastReportFile: '',
        uploadFile: '',
        agreeTerms: false,
        fiveWhyLhApprove: 0,
        fiveWhyShApprove: 0,
        fiveWhyLhFeedback: 0,
        fiveWhyShFeedback: 0,
        cmLhApprove: 0,
        cmShApprove: 0,
        cmTlApprove: 0,
        cmDhApprove: 0,
        cmLhFeedback: 0,
        cmShFeedback: 0,
        cmTlFeedback: 0,
        cmDhFeedback: 0,
      }
    },

    async fetchProblems(page = 1, filters = {}) {
      this.loading = true
      this.error = null

      try {
        // Check if all filter data is empty or null
        const {
          filterStartDate = this.filterStartDate,
          filterFinishDate = this.filterFinishDate,
          selectedLine = this.selectedLine,
          selectedMachineName = this.selectedMachineName,
          selectedProblem = this.selectedProblem,
          problemCategory = this.selectedProblemCategory,
        } = filters

        const allFiltersEmpty =
          (!filterStartDate || filterStartDate === '') &&
          (!filterFinishDate || filterFinishDate === '') &&
          (!selectedLine || selectedLine === null) &&
          (!selectedMachineName || selectedMachineName === null) &&
          (!selectedProblem || selectedProblem === '') &&
          (!problemCategory || problemCategory === null)

        if (allFiltersEmpty) {
          console.log(
            '[RepeatFlowChecker] All filters empty, calling resetFilters',
          )
          this.resetFilters()
          // After resetFilters, update filters to cleared state
          filters = {
            filterStartDate: this.filterStartDate,
            filterFinishDate: this.filterFinishDate,
            selectedLine: this.selectedLine,
            selectedMachineName: this.selectedMachineName,
            selectedProblem: this.selectedProblem,
            problemCategory: this.selectedProblemCategory,
          }
        }

        const limit = this.pageSize || 50
        let machineLabel = undefined

        // Add checking logs for filterStartDate and filterFinishDate
        console.log('[FilterCheck] filterStartDate:', filters.filterStartDate)
        console.log('[FilterCheck] filterFinishDate:', filters.filterFinishDate)

        if (filters.selectedMachineName) {
          const machine = this.machineOptions.find(
            (m) => m.id === filters.selectedMachineName,
          )
          if (machine) {
            machineLabel = machine.label
          }
        }

        if (
          filters.problemCategory !== undefined &&
          filters.problemCategory !== ''
        ) {
          console.log(
            'ProblemHistory received filterCategory with category 1:',
            filters.problemCategory,
          )
        }

        const params = {
          page,
          limit,
          startDate: filters.filterStartDate || undefined,
          finishDate: filters.filterFinishDate || undefined,
          line: filters.selectedLine || undefined,
          machineName: machineLabel || undefined,
          problem: filters.selectedProblem || undefined,
          problemCategory: filters.problemCategory || undefined,
        }

        console.log(
          '[RepeatFlowChecker] ProblemHistory sending request to backend with params:',
          params,
        )

        const response = await axios.get('/api/smartandon/problemView', {
          params,
        })

        console.log(
          '[RepeatFlowChecker] ProblemHistory received data from backend:',
          response.data.data,
        )

        this.allProblems = response.data.data
        this.problemsView = response.data.data
        this.totalRecords = response.data.total
        this.currentPage = response.data.page
        this.pageSize = response.data.limit
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize)

        // Fetch tambahAnalysis data and store it
        const analysisResponse = await axios.get('/api/smartandon/tambahAnalysis')
        this.tambahAnalysisData = analysisResponse.data

        const allAnalysis = analysisResponse.data
        console.log('Filtered Analysis:', allAnalysis);
        // console.log('Filter Analysis All:', this.filteredAnalysis);

        // Mapping berdasarkan analisys_category "TERJADI" dan "LAMA"
        this.terjadiAnalysis = allAnalysis.filter(
          (item) => item.analisys_category === 'TERJADI',
        )
        this.lamaAnalysis = allAnalysis.filter(
          (item) => item.analisys_category === 'LAMA',
        )

        // Merge terjadiAnalysis and lamaAnalysis into each problem in problemsView
        this.problemsView = this.problemsView.map(problem => {
          return {
            ...problem,
            terjadiAnalysis: this.terjadiAnalysis.filter(item => item.id_problem === problem.fid),
            lamaAnalysis: this.lamaAnalysis.filter(item => item.id_problem === problem.fid),
          }
        })

        console.log('Problems with merged analysis:', this.problemsView);

        this.tambahAnalysisData = {
          terjadi: this.terjadiAnalysis,
          lama: this.lamaAnalysis,
        }

        // Update local filter states to keep them consistent
        this.filterStartDate = filters.filterStartDate
        this.filterFinishDate = filters.filterFinishDate
        this.selectedLine = filters.selectedLine
        this.selectedMachineName = filters.selectedMachineName
        this.selectedProblem = filters.selectedProblem
        this.selectedProblemCategory = filters.problemCategory
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
      this.selectedProblemCategory = null
      // Reset currentPage explicitly on filter reset
      this.currentPage = 1
      // Removed fetchProblems call here to prevent infinite recursion
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
        console.log(
          'Submit data sent to EditProblemModal:',
          JSON.stringify(this.submit, null, 2),
        )

        const analysisResponse = await axios.get(
          '/api/smartandon/tambahAnalysis',
        )

        const allAnalysis = analysisResponse.data
        const filteredAnalysis = allAnalysis.filter(
          (item) => item.id_problem === problem.fid,
        )
        const terjadiAnalysis = filteredAnalysis.filter(
          (item) => item.analisys_category === 'TERJADI',
        )
        const lamaAnalysis = filteredAnalysis.filter(
          (item) => item.analisys_category === 'LAMA',
        )

        this.tambahAnalysisData = {
          terjadi: terjadiAnalysis,
          lama: lamaAnalysis,
        }
        
        console.log('Mapped tambahAnalysis data:', this.tambahAnalysisData)
        console.log('Tambah Analisis Terjadi:', terjadiAnalysis)
        console.log('Tambah Analisis Lama:', lamaAnalysis)

        this.tambahAnalysisTerjadi = terjadiAnalysis
        this.tambahAnalysisLama = lamaAnalysis
        
        this.filteredTambahAnalisis = terjadiAnalysis
        this.filteredTambahAnalisisLama = lamaAnalysis

        const o6Option = this.o6Options.find(
          (opt) => opt.id === this.submit.pilihO6,
        )
        this.oCategoryName = o6Option ? o6Option.label : ''

        const shiftOption = this.shiftOptions.find(
          (opt) => opt.id === this.submit.shift,
        )
        this.shiftName = shiftOption ? shiftOption.label : ''

        const problemCategoryOption = this.problemCategoryOptions.find(
          (opt) => opt.id === this.submit.problemCategory,
        )
        this.problemCategoryName = problemCategoryOption
          ? problemCategoryOption.label
          : ''

        const q6Option = this.q6Options.find(
          (opt) => opt.id === this.submit.qCategory,
        )
        this.qCategoryName = q6Option ? q6Option.label : ''

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
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}`
      }

      return {
        machineName: problemData.fmc_name || '',
        line: problemData.fline || '',
        fidProblem: problemData.fid || '',
        maker: problemData.fmaker || '',
        operationNo: problemData.foperation_no || '',
        problems: problemData.ferror_name || '',
        uraianKejadian: problemData.descResult.general || '',
        uploadImage: problemData.uraianResult.general || '',
        ilustrasiStandart: problemData.descResult.standard || '',
        standardImage: problemData.uraianResult.standard || '',
        ilustrasiActual: problemData.descResult.actual || '',
        actualImage: problemData.uraianResult.actual || '',
        gapBetweenStandarAndActual:
          problemData.gapIlustrasi || '',
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
        rootcauses5Why: problemData.freal_prob || '',
        tambahAnalysisTerjadi: problemData.o_analisys || '',
        whyImage: problemData.why1_img || '',
        pilihO6: problemData.oCategory || '',
        stepRepair: problemData.fstep_repair || '',
        partChange: problemData.fpart_change || '',
        countermeasureKenapaTerjadi:
          problemData.fpermanet_cm || '',
        yokoten: problemData.fyokoten || '',
        rootcause5WhyKenapaLama: problemData.rootcause5WhyKenapaLama || '',
        tambahAnalisisLama: problemData.tambahAnalisisLama || '',
        pilihQ6: problemData.qCategory || '',
        whyLamaImage: problemData.why2_img || '',
        countermeasureKenapaLama: problemData.fpermanet_cm_lama || '',
        attachmentMeeting: problemData.attachmentMeeting || '',
        comments5WhySH: problemData.fiveWhyShFeedback || '',
        comments5WhyLH: problemData.fiveWhyLhFeedback || '',
        commentsCountermeasure: problemData.commentsCountermeasure || '',
        file_report: problemData.file_report || '',
        uploadFile: problemData.uploadFile || '',
        agreeTerms: false,
        fiveWhyLhApprove: problemData.fiveWhyLhApprove || 0,
        fiveWhyShApprove: problemData.fiveWhyShApprove || 0,
        fiveWhyLhFeedback: problemData.fiveWhyLhFeedback || 0,
        fiveWhyShFeedback: problemData.fiveWhyShFeedback || 0,
        cmLhApprove: problemData.cmLhApprove || 0,
        cmShApprove: problemData.cmShApprove || 0,
        cmTlApprove: problemData.cmTlApprove || 0,
        cmDhApprove: problemData.cmDhApprove || 0,
        cmLhFeedback: problemData.cmLhFeedback || 0,
        cmShFeedback: problemData.cmShFeedback || 0,
        cmTlFeedback: problemData.cmTlFeedback || 0,
        cmDhFeedback: problemData.cmDhFeedback || 0,
      }
    },

    onClickLtbReport(problem) {
      alert(`LTB Report clicked for problem ID: ${problem.fid}`)
    },

    async saveSubmit(submitData) {
      console.log('Saving submit data: ', submitData)
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
      // Jika line berupa label, cari id-nya dari lineOptions
      if (typeof lineId === 'string') {
        const lineObj = this.lineOptions.find(l => l.label === lineId);
        if (lineObj) lineId = lineObj.id;
      }

      let operatorNames = Array.isArray(submitData.operator)
        ? submitData.operator.map(op => {
            if (typeof op === 'string') {
              // Jika sudah nama, langsung pakai
              return op;
            }
            // Jika id, cari labelnya
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
          partChange: submitData.partChange,
          countermeasureKenapaTerjadi: JSON.stringify(
            submitData.cmKenapaTerjadi,
          ),
          countermeasureKenapaLama: JSON.stringify(submitData.cmKenapaLama),
          yokoten: JSON.stringify(submitData.yokoten),
          rootcause5WhyKenapaLama: submitData.rootcause5WhyKenapaLama,
          tambahAnalisisLama: submitData.tambahAnalisisLama,
          tambahAnalysisTerjadi: submitData.tambahAnalysisTerjadi,
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
            // Kirim path lama sebagai field biasa, bukan file
            formData.append(key, value)
          } else if (isFileField && !value) {
            // Jangan append jika file kosong/null
          } else {
            formData.append(key, value ?? '')
          }
        })

        const response = await axios.put('/api/smartandon/update', formData)

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
        this.fetchProblems(page, {
          filterStartDate: this.filterStartDate,
          filterFinishDate: this.filterFinishDate,
          selectedLine: this.selectedLine,
          selectedMachineName: this.selectedMachineName,
          selectedProblem: this.selectedProblem,
          problemCategory: this.selectedProblemCategory,
        })
      }
    },

    onMachineInput() {
      console.log('Machine input changed:', this.selectedMachineName)
    },

    onFilterCategoryWhyCm(filtered) {
      if (filtered === 0) {
        this.selectedFiltered = null
      } else {
        this.selectedFiltered = filtered
      }

      this.fetchProblems(this.currentPage, {
        filterStartDate: this.filterStartDate,
        filterFinishDate: this.filterFinishDate,
        selectedLine: this.selectedLine,
        selectedMachineName: this.selectedMachineName,
        selectedProblem: this.selectedProblem,
        problemCategory: this.selectedProblemCategory,
      })
    },

    onClickFilterWhyCm(filtered) {
      this.selectedFiltered = filtered
      if (filtered === 1) {
        // Filter for "5 Why Belum di isi"
        this.onFilterCategory(5)
      } else if (filtered === 2) {
        // Filter for "C/M Belum di isi"
        this.onFilterCategory(6)
      }
    },

    onFilterCategory(category) {
      if (category === 0) {
        this.selectedProblemCategory = null
      } else if (category === 5) {
        // Filter problems where "5 Why" belum diisi (empty terjadiAnalysis or lamaAnalysis)
        this.problemsView = this.allProblems.filter(problem => {
          const analysisArray = Array.isArray(problem.terjadiAnalysis) ? problem.terjadiAnalysis : []
          const hasTerjadi = analysisArray.some(item => item.id_problem === problem.fid)
          const analysisArrayLama = Array.isArray(problem.lamaAnalysis) ? problem.lamaAnalysis : []
          const hasLama = analysisArrayLama.some(item => item.id_problem === problem.fid)
          return !hasTerjadi && !hasLama
        })
        this.selectedProblemCategory = category
        this.totalRecords = this.problemsView.length
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize)
        this.currentPage = 1
        return
      } else if (category === 6) {
        // Filter problems where "cm" belum diisi (empty fpermanet_cm and fpermanet_cm_lama)
        this.problemsView = this.allProblems.filter(problem => {
          const cm = problem.fpermanet_cm
          const cmLama = problem.fpermanet_cm_lama
          const isCmEmpty = !cm || (Array.isArray(cm) && cm.length === 0)
          const isCmLamaEmpty = !cmLama || (Array.isArray(cmLama) && cmLama.length === 0)
          return isCmEmpty && isCmLamaEmpty
        })
        this.selectedProblemCategory = category
        this.totalRecords = this.problemsView.length
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize)
        this.currentPage = 1
        return
      } else {
        this.selectedProblemCategory = category
      }
      console.log(
        '[RepeatFlowChecker] ProblemHistory onFilterCategory received category:',
        category,
      )
      console.log(
        '[RepeatFlowChecker] ProblemHistory onFilterCategory received selectedProblemCategory:',
        this.selectedProblemCategory,
      )
      // console.log('Filter time: ', filterStartDate, filterFinishDate, selectedLine, selectedMachineName, selectedProblem, problemCategory);
      // Pass current filters explicitly to fetchProblems
      this.fetchProblems(this.currentPage, {
        filterStartDate: this.filterStartDate,
        filterFinishDate: this.filterFinishDate,
        selectedLine: this.selectedLine,
        selectedMachineName: this.selectedMachineName,
        selectedProblem: this.selectedProblem,
        problemCategory: this.selectedProblemCategory,
      })

      // console.log('Filter time1: ', filterStartDate, filterFinishDate, selectedLine, selectedMachineName, selectedProblem, problemCategory);
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

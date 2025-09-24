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
          @download="downloadExcel"
          @filterCategory="onFilterCategory"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { CSpinner } from '@coreui/vue'
import api from '../../apis/CommonAPI'
import EditProblemModal from './EditProblemModal.vue'
import SearchFilters from './components/SearchFilters.vue'
import ProblemsTable from './components/ProblemsTable.vue'
import PaginationControls from './components/PaginationControls.vue'
import TableActions from './components/TableActions.vue'

// Router setup
const router = useRouter()
const navigateTo = (route) => {
  router.push(route)
}

// Reactive data
const lineOptions = ref([])
const machineOptions = ref([])
const memberOption = ref([])
const filterStartDate = ref('')
const filterFinishDate = ref('')
const selectedLine = ref(null)
const selectedMachineName = ref(null)
const selectedProblem = ref('')
const problemsView = ref([])
const allProblems = ref([])
const selectedProblemCategory = ref(null)
const currentPage = ref(1)
const pageSize = ref(50)
const pages = ref(5)
const totalRecords = ref(0)
const totalPages = ref(0)
const loading = ref(false)
const error = ref(null)
const visibleLiveDemo = ref(false)
const modalLoading = ref(false)
const tableLoading = ref(false)
const qCategoryName = ref('')
const filteredTambahAnalisis = ref([])
const filteredTambahAnalisisLama = ref([])
const terjadiAnalysis = ref([])
const lamaAnalysis = ref([])
const selectedFiltered = ref('')
const sparepartsOption = ref([])
const tambahAnalysisData = ref({})

// Submit data
const submit = ref({
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
})

// Options data
const o6Options = ref([
  {
    id: 1,
    label: 'O1: Design & Installation (Design / Installation Not Good (Refers to Function Check / Eng. Memo))',
  },
  {
    id: 2,
    label: 'O2: Henkaten Issue (No Enough Trial, No Confirm (others team))',
  },
  {
    id: 3,
    label: 'O3: PM Issue (No Have/Unclear, Unclear Methode, Confine/Invisible, Out of Periode, No Have Time, Lack of Skill)',
  },
  {
    id: 4,
    label: 'O4: Symptom (No Have Symptom, Have Symptom but Unfollow Activity)',
  },
  {
    id: 5,
    label: 'O5: Environment & 3rd Factor (Dirty, Confine Space, Invisible Area, Unpredictable (water leak / crush))',
  },
  {
    id: 6,
    label: 'O6: Lifetime Issue (Out of Standard Running, Over Capacity)',
  },
])

const shiftOptions = ref([
  { id: 'r', label: 'Red' },
  { id: 'w', label: 'White' },
  { id: '', label: 'No Shift' },
])

const problemCategoryOptions = ref([
  { id: 1, label: 'Small' },
  { id: 2, label: 'Chokotei' },
  { id: 3, label: 'LTB' },
])

const q6Options = ref([
  {
    id: 1,
    label: 'Q1: Diagnose (Meeting, accuracy check (run-out, backlash, etc))',
  },
  {
    id: 2,
    label: 'Q2: Sparepart (Part preparation, fabrication of part, repair of damage part due to unavailability at SPW)',
  },
  {
    id: 3,
    label: 'Q3: Tool (Special tools preparation, change of tools, personal tool, change dresser, safety tool)',
  },
  {
    id: 4,
    label: 'Q4: Maint. Ability (Repair, overhaul, part replace, tomoken, 5S)',
  },
  {
    id: 5,
    label: 'Q5: Setting Ability (Quality checking, program adjustment, program zeroing, position memory set, autosizer setting & amp, PSW set, backlash adjustment (slide gib / kamisori, parameter set, centering, etc))',
  },
  {
    id: 6,
    label: "Q6: Back-Up (Back-Up MC's Preparation, Back-Up MC's dandori)",
  },
])

// Computed properties
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
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
})

// Methods
const getInitialSubmitData = () => ({
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
})

const fetchProblems = async (page = 1, filters = {}) => {
  loading.value = true
  error.value = null

  try {
    const {
      filterStartDate: fStartDate = filterStartDate.value,
      filterFinishDate: fFinishDate = filterFinishDate.value,
      selectedLine: sLine = selectedLine.value,
      selectedMachineName: sMachineName = selectedMachineName.value,
      selectedProblem: sProblem = selectedProblem.value,
      problemCategory = selectedProblemCategory.value,
    } = filters

    const allFiltersEmpty =
      (!fStartDate || fStartDate === '') &&
      (!fFinishDate || fFinishDate === '') &&
      (!sLine || sLine === null) &&
      (!sMachineName || sMachineName === null) &&
      (!sProblem || sProblem === '') &&
      (!problemCategory || problemCategory === null)

    if (allFiltersEmpty) {
      console.log(
        '[RepeatFlowChecker] All filters empty, setting default start date to first day of month',
      )
      const now = new Date()
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      const yyyy = firstDay.getFullYear()
      const mm = String(firstDay.getMonth() + 1).padStart(2, '0')
      const dd = String(firstDay.getDate()).padStart(2, '0')
      filters.filterStartDate = `${yyyy}-${mm}-${dd}`
      filterStartDate.value = filters.filterStartDate

      resetFilters()
      filters = {
        filterStartDate: filterStartDate.value,
        filterFinishDate: filterFinishDate.value,
        selectedLine: selectedLine.value,
        selectedMachineName: selectedMachineName.value,
        selectedProblem: selectedProblem.value,
        problemCategory: selectedProblemCategory.value,
      }
    }

    const limit = pageSize.value || 50
    let machineLabel = undefined

    console.log('[FilterCheck] filterStartDate:', filters.filterStartDate)
    console.log('[FilterCheck] filterFinishDate:', filters.filterFinishDate)

    if (filters.selectedMachineName) {
      const machine = machineOptions.value.find(
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
      startDate: filters.filterStartDate && filters.filterStartDate !== '' ? filters.filterStartDate : undefined,
      finishDate: filters.filterFinishDate && filters.filterFinishDate !== '' ? filters.filterFinishDate : undefined,
      line: filters.selectedLine && filters.selectedLine !== null ? filters.selectedLine : undefined,
      machineName: machineLabel || undefined,
      problem: filters.selectedProblem && filters.selectedProblem !== '' ? filters.selectedProblem : undefined,
      problemCategory: filters.problemCategory !== null ? filters.problemCategory : undefined,
    }

    console.log(
      '[RepeatFlowChecker] ProblemHistory sending request to backend with params:',
      params,
    )

    const response = await api.get('/problem/problemView', {
      search: JSON.stringify(params),
    })
    if (response.status !== 200) {
      throw new Error('Failed to fetch problems, status: ' + response.status)
    }
    console.log('[RepeatFlowChecker] API response:', response)

    allProblems.value = response.data.data
    problemsView.value = response.data.data
    totalRecords.value = response.data.total
    currentPage.value = response.data.page
    pageSize.value = response.data.limit
    totalPages.value = Math.ceil(totalRecords.value / pageSize.value)

    const analysisResponse = await api.get('/tambahAnalysis/tambahAnalysis')
    if (analysisResponse.status !== 200) {
      throw new Error(
        'Failed to fetch tambahAnalysis, status: ' +
          analysisResponse.status,
      )
    }

    tambahAnalysisData.value = analysisResponse.data
    const allAnalysis = analysisResponse.data
    console.log('Filtered Analysis:', allAnalysis);

    terjadiAnalysis.value = allAnalysis.filter(
      (item) => item.analisys_category === 'TERJADI',
    )
    lamaAnalysis.value = allAnalysis.filter(
      (item) => item.analisys_category === 'LAMA',
    )

    problemsView.value = problemsView.value.map(problem => {
      return {
        ...problem,
        terjadiAnalysis: terjadiAnalysis.value.filter(item => item.id_problem === problem.fid),
        lamaAnalysis: lamaAnalysis.value.filter(item => item.id_problem === problem.fid),
      }
    })

    console.log('Problems with merged analysis:', problemsView.value);

    tambahAnalysisData.value = {
      terjadi: terjadiAnalysis.value,
      lama: lamaAnalysis.value,
    }

    filterStartDate.value = filters.filterStartDate
    filterFinishDate.value = filters.filterFinishDate
    selectedLine.value = filters.selectedLine
    selectedMachineName.value = filters.selectedMachineName
    selectedProblem.value = filters.selectedProblem
    selectedProblemCategory.value = filters.problemCategory
    saveFiltersToStorage()
  } catch (error) {
    error.value = 'Failed to fetch problems: ' + error.message
    console.error(error.value)
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  filterStartDate.value = ''
  filterFinishDate.value = ''
  selectedMachineName.value = null
  selectedLine.value = null
  selectedProblem.value = ''
  selectedProblemCategory.value = null
  currentPage.value = 1
  localStorage.removeItem('problemHistoryFilters')
}

const loadFiltersFromStorage = () => {
  const stored = localStorage.getItem('problemHistoryFilters')
  if (stored) {
    const filters = JSON.parse(stored)
    console.log('[Filter Persistence] Loaded filters from storage:', filters)
    filterStartDate.value = filters.filterStartDate || ''
    filterFinishDate.value = filters.filterFinishDate || ''
    selectedLine.value = filters.selectedLine || null
    selectedMachineName.value = filters.selectedMachineName || null
    selectedProblem.value = filters.selectedProblem || ''
    selectedProblemCategory.value = filters.selectedProblemCategory || null
  } else {
    console.log('[Filter Persistence] No filters found in storage')
  }
}

const saveFiltersToStorage = () => {
  const filters = {
    filterStartDate: filterStartDate.value,
    filterFinishDate: filterFinishDate.value,
    selectedLine: selectedLine.value,
    selectedMachineName: selectedMachineName.value,
    selectedProblem: selectedProblem.value,
    selectedProblemCategory: selectedProblemCategory.value,
  }
  console.log('[Filter Persistence] Saving filters to storage:', filters)
  localStorage.setItem('problemHistoryFilters', JSON.stringify(filters))
}

const onClickInput = async (problem) => {
  try {
    tableLoading.value = true
    modalLoading.value = true
    const response = await api.get(
      `/problem/problemId/${problem.fid}`,
    )
    if (response.status !== 200) {
      throw new Error('Failed to fetch problem, status: ' + response.status)
    }
    const problemData = response.data
    console.log('Problem data:', problemData)
    submit.value = mapProblemDataToSubmit(problemData)
    console.log(
      'Submit data sent to EditProblemModal:',
      JSON.stringify(submit.value, null, 2),
    )

    const analysisResponse = await api.get(
      '/tambahAnalysis/tambahAnalysis',
    )
    if (analysisResponse.status !== 200) {
      throw new Error(
        'Failed to fetch tambahAnalysis, status: ' +
          analysisResponse.status,
      )
    }

    const allAnalysis = analysisResponse.data
    const filteredAnalysis = allAnalysis.filter(
      (item) => item.id_problem === problem.fid,
    )
    const terjadiAnalysisFiltered = filteredAnalysis.filter(
      (item) => item.analisys_category === 'TERJADI',
    )
    const lamaAnalysisFiltered = filteredAnalysis.filter(
      (item) => item.analisys_category === 'LAMA',
    )

    tambahAnalysisData.value = {
      terjadi: terjadiAnalysisFiltered,
      lama: lamaAnalysisFiltered,
    }
    
    console.log('Mapped tambahAnalysis data:', tambahAnalysisData.value)
    console.log('Tambah Analisis Terjadi:', terjadiAnalysisFiltered)
    console.log('Tambah Analisis Lama:', lamaAnalysisFiltered)

    filteredTambahAnalisis.value = terjadiAnalysisFiltered
    filteredTambahAnalisisLama.value = lamaAnalysisFiltered

    submit.value.tambahAnalysisTerjadi = terjadiAnalysisFiltered
    submit.value.tambahAnalisisLama = lamaAnalysisFiltered

    const o6Option = o6Options.value.find(
      (opt) => opt.id === submit.value.pilihO6,
    )
    // oCategoryName = o6Option ? o6Option.label : ''

    const shiftOption = shiftOptions.value.find(
      (opt) => opt.id === submit.value.shift,
    )
    // shiftName = shiftOption ? shiftOption.label : ''

    const problemCategoryOption = problemCategoryOptions.value.find(
      (opt) => opt.id === submit.value.problemCategory,
    )
    // problemCategoryName = problemCategoryOption ? problemCategoryOption.label : ''

    const q6Option = q6Options.value.find(
      (opt) => opt.id === submit.value.qCategory,
    )
    qCategoryName.value = q6Option ? q6Option.label : ''

    visibleLiveDemo.value = true
  } catch (error) {
    alert('Failed to load problem data: ' + error.message)
    console.error(error)
  } finally {
    modalLoading.value = false
    tableLoading.value = false
  }
}

// Event handlers
const onClickLtbReport = (problem) => {
  alert(`LTB Report clicked for problem ID: ${problem.fid}`)
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchProblems(page, {
      filterStartDate: filterStartDate.value,
      filterFinishDate: filterFinishDate.value,
      selectedLine: selectedLine.value,
      selectedMachineName: selectedMachineName.value,
      selectedProblem: selectedProblem.value,
      problemCategory: selectedProblemCategory.value,
    })
  }
}

const onMachineInput = () => {
  console.log('Machine input changed:', selectedMachineName.value)
}

const onFilterCategory = (category) => {
  if (category === 0) {
    selectedProblemCategory.value = null
  } else if (category === 5) {
    problemsView.value = allProblems.value.filter(problem => {
      const analysisArray = Array.isArray(problem.terjadiAnalysis) ? problem.terjadiAnalysis : []
      const hasTerjadi = analysisArray.some(item => item.id_problem === problem.fid)
      const analysisArrayLama = Array.isArray(problem.lamaAnalysis) ? problem.lamaAnalysis : []
      const hasLama = analysisArrayLama.some(item => item.id_problem === problem.fid)
      return !hasTerjadi && !hasLama
    })
    selectedProblemCategory.value = category
    totalRecords.value = problemsView.value.length
    totalPages.value = Math.ceil(totalRecords.value / pageSize.value)
    currentPage.value = 1
    return
  } else if (category === 6) {
    problemsView.value = allProblems.value.filter(problem => {
      const cm = problem.fpermanet_cm
      const cmLama = problem.fpermanet_cm_lama
      const isCmEmpty = !cm || (Array.isArray(cm) && cm.length === 0)
      const isCmLamaEmpty = !cmLama || (Array.isArray(cmLama) && cmLama.length === 0)
      return isCmEmpty && isCmLamaEmpty
    })
    selectedProblemCategory.value = category
    totalRecords.value = problemsView.value.length
    totalPages.value = Math.ceil(totalRecords.value / pageSize.value)
    currentPage.value = 1
    return
  } else {
    selectedProblemCategory.value = category
  }
  
  console.log('[RepeatFlowChecker] ProblemHistory onFilterCategory received category:', category)
  fetchProblems(currentPage.value, {
    filterStartDate: filterStartDate.value,
    filterFinishDate: filterFinishDate.value,
    selectedLine: selectedLine.value,
    selectedMachineName: selectedMachineName.value,
    selectedProblem: selectedProblem.value,
    problemCategory: selectedProblemCategory.value,
  })
}

const loadInitialData = async () => {
  loading.value = true
  error.value = null

  try {
    const machineResponse = await api.get('/machine/machine')
    if (machineResponse.status !== 200) {
      throw new Error('Failed to fetch machines, status: ' + machineResponse.status)
    }
    machineOptions.value = machineResponse.data.map((machine) => ({
      id: machine.fid,
      label: machine.fmc_name,
    }))

    const lineResponse = await api.get('/line/line')
    if (lineResponse.status !== 200) {
      throw new Error('Failed to fetch lines, status: ' + lineResponse.status)
    }
    lineOptions.value = lineResponse.data.map((line) => ({
      id: line.fid,
      label: line.fline,
    }))

    const memberResponse = await api.get('/member/member')
    if (memberResponse.status !== 200) {
      throw new Error('Failed to fetch members, status: ' + memberResponse.status)
    }
    
    console.log('RAW machineResponse:', machineResponse.data)
    console.log('RAW lineResponse:', lineResponse.data)

    memberOption.value = memberResponse.data.map((member) => ({
      id: member.fid,
      label: member.fname,
    }))
  } catch (error) {
    error.value = 'Failed to load initial data: ' + error.message
    console.error(error)
  } finally {
    loading.value = false
  }
}

// Helper function for problem data mapping
const mapProblemDataToSubmit = (problemData) => {
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
    machineName: problemData.fmc_name || '',
    line: problemData.fline || '',
    fidProblem: problemData.fid || '',
    maker: problemData.fmaker || '',
    operationNo: problemData.foperation_no || '',
    problems: problemData.ferror_name || '',
    uraianKejadian: problemData.descResult.general || '',
    uploadImage: problemData.uraianResult.general || '',
    ilustrasiStandart: problemData.descResult.standard || '',
    standartImage: problemData.uraianResult.standard || '',
    ilustrasiActual: problemData.descResult.actual || '',
    actualImage: problemData.uraianResult.actual || '',
    gapBetweenStandarAndActual: problemData.gapIlustrasi || '',
    pilihFocusThemaMember: problemData.pilihFocusThemaMember || '',
    pilihTaskforce: problemData.pilihTaskforce || '',
    operator: problemData.foperator ? problemData.foperator.split(/,|&/) : [],
    avCategory: problemData.fav_categoty || '',
    shift: problemData.fshift || '',
    startDate: formatDateToISO(problemData.fstart_time) || '',
    finishDate: formatDateToISO(problemData.fend_time) || '',
    durationMin: problemData.fdur || '',
    problemCategory: problemData.problemCategory || '',
    itemTemporaryAction: problemData.itemTemporaryAction || '',
    rootcauses5Why: problemData.freal_prob || '',
    tambahAnalysisTerjadi: (() => {
      if (Array.isArray(terjadiRaw)) return terjadiRaw
      if (typeof terjadiRaw === 'string') {
        try { 
          const v = JSON.parse(terjadiRaw)
          return Array.isArray(v) ? v : [] 
        } catch { 
          return [] 
        }
      }
      return []
    })(),
    tambahAnalisisLama: (() => {
      if (Array.isArray(lamaRaw)) return lamaRaw
      if (typeof lamaRaw === 'string') {
        try { 
          const v = JSON.parse(lamaRaw)
          return Array.isArray(v) ? v : [] 
        } catch { 
          return [] 
        }
      }
      return []
    })(),
    whyImage: problemData.why1_img || '',
    pilihO6: problemData.oCategory || '',
    stepRepair: problemData.fstep_repair || '',
    partChange: problemData.fpart_change || '',
    countermeasureKenapaTerjadi: problemData.fpermanet_cm || '',
    yokoten: problemData.fyokoten || '',
    rootcause5WhyKenapaLama: problemData.rootcause5WhyKenapaLama || '',
    pilihQ6: problemData.qCategory || '',
    whyLamaImage: problemData.why2_img || '',
    countermeasureKenapaLama: problemData.fpermanet_cm_lama || '',
    attachmentMeeting: problemData.attachmentMeeting || '',
    comments5WhySH: problemData.comments5WhySH || '',
    comments5WhyLH: problemData.comments5WhyLH || '',
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
}

const saveSubmit = async (submitData) => {
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

  let machineId = submitData.machineName
  let lineId = submitData.line

  if (typeof machineId === 'string') {
    const machineObj = machineOptions.value.find(m => m.label === machineId)
    if (machineObj) machineId = machineObj.id
  }
  
  if (typeof lineId === 'string') {
    const lineObj = lineOptions.value.find(l => l.label === lineId)
    if (lineObj) lineId = lineObj.id
  }

  let operatorNames = Array.isArray(submitData.operator)
    ? submitData.operator.map(op => {
        if (typeof op === 'string') {
          return op
        }
        const memberObj = memberOption.value.find(m => m.id === op)
        return memberObj ? memberObj.label : op
      })
    : []

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
        // Don't append empty file fields
      } else {
        formData.append(key, value ?? '')
      }
    })

    const response = await api.put('/problem/update', null, formData)
    console.log('Update response:', response)
    if (response.status === 200) {
      alert('Input updated successfully')
      visibleLiveDemo.value = false
      submit.value = getInitialSubmitData()
      fetchProblems(currentPage.value)
    } else {
      throw new Error('Failed to update input, status: ' + response.status)
    }
  } catch (error) {
    console.error(error)
    alert('Error updating input: ' + error.message)
  }
}

// Other utility functions
const freq = () => {
  navigateTo('/problem-frequency')
}

const ltb = () => {
  navigateTo('/ltb-summary')
}

const downloadExcel = async () => {
  try {
    const XLSX = await import('xlsx')
    console.log('XLSX object:', XLSX)

    // Get all problems for export
    tableLoading.value = true
    const params = {
      limit: 0,
      startDate: filterStartDate.value || undefined,
      finishDate: filterFinishDate.value || undefined,
      line: selectedLine.value || undefined,
      machineName: selectedMachineName.value ? machineOptions.value.find(m => m.id === selectedMachineName.value)?.label : undefined,
      problem: selectedProblem.value || undefined,
      problemCategory: selectedProblemCategory.value || undefined,
    }

    console.log('[Export] Fetching all problems with params:', params)
    const response = await api.get('/problem/problemView', {...params})
    if (response.status !== 200) {
      throw new Error('Failed to fetch problems for export, status: ' + response.status)
    }

    const problemsToExport = response.data.data

    if (problemsToExport.length === 0) {
      alert('Tidak ada data untuk diunduh')
      return
    }

    const formattedData = problemsToExport.map(problem => ({
      Date: problem.fend_time ? new Date(problem.fend_time).toLocaleDateString() : '',
      Machine: problem.fmc_name || '',
      Problem: problem.ferror_name || '',
      PIC: problem.foperator || '',
      Line: problem.fline || '',
      Duration: problem.fdur || '',
      ProblemCategory: getProblemCategoryLabel(problem.problemCategory)
    }))

    const worksheet = XLSX.utils.json_to_sheet(formattedData)
    const columnWidths = [
      { wch: 15 }, { wch: 20 }, { wch: 30 }, 
      { wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 15 }
    ]
    worksheet['!cols'] = columnWidths

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Problems Data')

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `problems_export_${new Date().toISOString().split('T')[0]}.xlsx`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error generating Excel file:', error)
    alert('Error generating Excel file: ' + error.message)
  } finally {
    tableLoading.value = false
  }
}

const getProblemCategoryLabel = (categoryId) => {
  const categories = {
    1: 'Small',
    2: 'Chokotei', 
    3: 'LTB',
    4: 'SLTR',
  }
  return categories[categoryId] || 'Unknown'
}

// Lifecycle hooks
onMounted(async () => {
  await loadInitialData()
  loadFiltersFromStorage()
  await nextTick(async () => {
    await fetchProblems(currentPage.value, {
      filterStartDate: filterStartDate.value,
      filterFinishDate: filterFinishDate.value,
      selectedLine: selectedLine.value,
      selectedMachineName: selectedMachineName.value,
      selectedProblem: selectedProblem.value,
      problemCategory: selectedProblemCategory.value,
    })
  })
})
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
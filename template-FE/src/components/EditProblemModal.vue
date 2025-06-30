<template>
  <CModal
      @close="() => { visibleLiveDemo = false }"
      fullscreen
      aria-labelledby="LiveDemoExampleLabel"
    >
    
      <CModalHeader>
        <CModalTitle id="LiveDemoExampleLabel">Edit Problem</CModalTitle>
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
          <CCol md="6">
            <label for="machineSelect" class="form-label">Machine Name</label>
            <Treeselect
              id="machineSelect"
              v-model="machineName"
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
          <CCol md="6">
            <label for="lineSelect" class="form-label">Line</label>
            <Treeselect
              id="lineSelect"
              v-model="line"
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
          <CCol md="6">
            <CFormInput 
              feedbackInvalid="Operation No."
              id="Problems"
              label="Operation No."
              required
              v-model="fidProblem"
            />
          </CCol>
          <CCol md="6">
            <CFormInput 
              feedbackInvalid="Maker"
              id="Problems"
              label="Maker"
              required
              v-model="maker"
            />
          </CCol>
          <CCol md="12">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Problems"
              required
              v-model="problems"
            />
          </CCol>
          <CCol md="8">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Uraian Kejadian"
              required
              v-model="uraianKejadian"
            />
          </CCol>
          <CCol md="4">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Upload Image"
              required
              v-model="uploadImage"
            />
          </CCol>
          <CCol md="8">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Ilustrasi Standart"
              required
              v-model="ilustrasiStandart"
            />
          </CCol>
          <CCol md="4">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Standart Image"
              required
              v-model="standartImage"
            />
          </CCol>
          <CCol md="8">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Ilustrasi Actual"
              required
              v-model="ilustrasiActual"
            />
          </CCol>
          <CCol md="4">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Actual Image"
              required
              v-model="actualImage"
            />
          </CCol>
          <CCol md="12">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Gap Between Standar and Actual"
              required
              v-model="gapBetweenStandarAndActual"
            />
          </CCol>
          <CCol md="8">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Pilih Focus Thema Member"
              required
              v-model="pilihFocusThemaMember"
            />
          </CCol>
          <CCol md="4">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Pilih Taskforce"
              required
              v-model="pilihTaskforce"
            />
          </CCol>
          <CCol md="12">
            <label for="operatorSelect" class="form-label">Operator</label>
            <Treeselect
              id="operatorSelect"
              v-model="submit.operator"
              :multiple="true"
              :flat="true"
              :options="memberOption"
              :searchable="true"
              :clearable="true"
              placeholder="Select or input member"
              @input="onMachineInput"
              :value-consists-of="['id']"
              :value-key="'id'"
              :label-key="'label'"
            />
          </CCol>
          <CCol md="6">
            <CFormSelect
                aria-describedby="avCategory"
                feedbackInvalid="Please select the AV Category."
                id="avCategorySelect"
                label="AV Category"
                required
                v-model="avCategory"
              >
                <option :value="avCategory" selected>{{ avCategory }}</option>
                <option disabled value="">Choose AV Category...</option>
                <option value="1">MESIN</option>
                <option value="2">DIES</option>
                <option value="3">TOOL</option>
                <option value="4">COOLANT</option>
            </CFormSelect>
          </CCol>
          <CCol md="6">
            <CFormSelect
                aria-describedby="shift"
                feedbackInvalid="Please select the shift."
                id="shiftSelect"
                label="O6 Category:"
                required
                v-model="fshift"
              >
                <option :value="shift" selected>{{ shiftName }}</option>
                <option disabled value="">Choose shift</option>
                <option value="r">Red</option>
                <option value="w">White</option>
                <option value="">No Shift</option>
            </CFormSelect>
          </CCol>
          <CCol md="6">
            <label for="startDateModal" class="form-label">Start Date</label>
            <CInputGroup>
              <CInputGroupText id="basic-addon1"><Clock size="16" /></CInputGroupText>
              <CFormInput
                id="startDateModal"
                type="date"
                required
                v-model="startDateProblem"
                aria-label="Start Date"
                aria-describedby="basic-addon1"
              />
            </CInputGroup>
          </CCol>
          <CCol md="6">
            <label for="finishDateModal" class="form-label">Finish Date</label>
            <CInputGroup>
              <CInputGroupText id="basic-addon2"><Clock size="16" /></CInputGroupText>
              <CFormInput
                id="finishDateModal"
                type="date"
                required
                v-model="finishDateProblem"
                aria-label="Finish Date"
                aria-describedby="basic-addon2"
              />
            </CInputGroup>
          </CCol>
          <CCol md="12">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Duration (min)"
              required
              v-model="durationMin"
            />
          </CCol>

          <CCol md="12">
            <CFormSelect
                aria-describedby="problemCategory"
                feedbackInvalid="Please select the problem category."
                id="problemCategorySelect"
                label="Problem Category:"
                required
                v-model="problemCategory"
              >
                <option :value="problemCategory" selected>{{ problemCategoryName }}</option>
                <option disabled value="">Choose problem Category...</option>
                <option :value="1">Small</option>
                <option :value="2">Chokotei</option>
                <option :value="3">LTB</option>
            </CFormSelect>
          </CCol>

          <CCol md="12">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Item Temporary Action"
              required
              v-model="itemTemporaryAction"
            />
          </CCol>
          <CCol md="12">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Rootcauses 5 Why (Kenapa Terjadi)"
              required
              v-model="rootcauses5Why"
            />
          </CCol>
          <CCol md="12">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Tambah Analysis TERJADI"
              required
              v-model="tambahAnalysisTerjadi"
            />
          </CCol>
          <CCol md="12">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="5 Why (Kenapa Terjadi) Image"
              required
              v-model="whyImage"
            />
          </CCol>
          <CCol md="12">
            <CFormSelect
                aria-describedby="O6 Category"
                feedbackInvalid="Please select the O6 Category."
                id="o6CategorySelect"
                label="O6 Category:"
                required
                v-model="oCategory"
              >
                <option :value="oCategory" selected>{{ oCategoryName }}</option>
                <option disabled value="">Choose problem 06 Category...</option>
                <option :value="1">O1: Design & Installation (Design / Installation Not Good (Refers to Function Check / Eng. Memo))</option>
                <option :value="2">O2: Henkaten Issue (No Enough Trial, No Confirm (others team))</option>
                <option :value="3">O3: PM Issue (No Have/Unclear, Unclear Methode, Confine/Invisible, Out of Periode, No Have Time, Lack of Skill)</option>
                <option :value="4">O4: Symptom (No Have Symptom, Have Symptom but Unfollow Activity)</option>
                <option :value="5">O5: Environment & 3rd Factor (Dirty, Confine Space, Invisible Area, Unpredictable (water leak / crush))</option>
                <option :value="6">O6: Lifetime Issue (Out of Standard Running, Over Capacity)</option>
            </CFormSelect>
          </CCol>
          <CCol md="12">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Step Repair"
              required
              v-model="stepRepair"
            />
          </CCol>
          <CCol md="12">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Part Change"
              required
              v-model="partChange"
            />
          </CCol>
          <CCol md="12">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Countermeasure (kenapa terjadi)"
              required
              v-model="countermeasureKenapaTerjadi"
            />
          </CCol>
          <CCol md="12">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Yokoten"
              required
              v-model="yokoten"
            />
          </CCol>
          <CCol md="12">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Rootcause 5 Why (kenapa lama)"
              required
              v-model="rootcause5WhyKenapaLama"
            />
          </CCol>
          <CCol md="12">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Tambah Analisis LAMA"
              required
              v-model="tambahAnalisisLama"
            />
          </CCol>
          <CCol md="12">
            <CFormSelect
                aria-describedby="Q6 Category"
                feedbackInvalid="Please select the Q6 Category."
                id="q6CategorySelect"
                label="Q6 Category:"
                required
                v-model="qCategory"
              >
                <option :value="qCategory" selected>{{ qCategoryName }}</option>
                <option disabled value="">Choose problem Q6 Category...</option>
                <option :value="1">Q1: Diagnose (Meeting, accuracy check (run-out, backlash, etc))</option>
                <option :value="2">Q2: Sparepart (Part preparation, fabrication of part, repair of damage part due to unavailability at SPW)</option>
                <option :value="3">Q3: Tool (Special tools preparation, change of tools, personal tool, change dresser, safety tool)</option>
                <option :value="4">Q4: Maint. Ability (Repair, overhaul, part replace, tomoken, 5S)</option>
                <option :value="5">Q5: Setting Ability (Quality checking, program adjustment, program zeroing, position memory set, autosizer setting & amp, PSW set, backlash adjustment (slide gib / kamisori, parameter set, centering, etc))</option>
                <option :value="6">Q6: Back-Up (Back-Up MC's Preparation, Back-Up MC's dandori)</option>
            </CFormSelect>
          </CCol>
          <CCol md="12">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="5 Why (Kenapa Lama) Image"
              required
              v-model="whyLamaImage"
            />
          </CCol>
          <CCol md="12">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Countermeasure (kenapa Lama)"
              required
              v-model="countermeasureKenapaLama"
            />
          </CCol>
          <CCol md="12">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Attachment Meeting"
              required
              v-model="attachmentMeeting"
            />
          </CCol>
          <CCol md="12">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Comments 5 Why"
              required
              v-model="comments5Why"
            />
          </CCol>
          <CCol md="12">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Comments Countermeasure"
              required
              v-model="commentsCountermeasure"
            />
          </CCol>
          <CCol md="12">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Last Report File"
              required
              v-model="lastReportFile"
            />
          </CCol>
          <CCol md="12">
            <CFormInput 
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Upload File"
              required
              v-model="uploadFile"
            />
          </CCol>
          <CCol xs="12">
            <CFormCheck
              feedbackInvalid="You must agree before submitting."
              id="invalidCheck"
              label="Agree to terms and conditions"
              required
              type="checkbox"
              v-model="agreeTerms"
            />
          </CCol>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="() => { visibleLiveDemo = false }">
          Close
        </CButton>
  
        <CButton color="primary" @click="saveSubmit">Submit</CButton>
      </CModalFooter>
    </CModal>
</template>

<script>
import { ref } from 'vue'
import { CButton, CCard, CCardBody, CCardTitle, CContainer, CTable, CTableHead, CTableBody, CTableHeaderCell, CTableRow, CTableDataCell, CPagination, CPaginationItem, CFormLabel } from '@coreui/vue';
import axios from 'axios';
import { CChart } from '@coreui/vue-chartjs'
import ApexCharts from 'vue3-apexcharts'
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

import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CForm, CCol, CFormInput, CFormCheck } from '@coreui/vue'

export default {
  name: 'EditProblemModal',
  components: {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CForm,
    CCol,
    CFormInput,
    CFormCheck,
    Treeselect
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    machineOptions: {
      type: Array,
      default: () => []
    },
    lineOptions: {
      type: Array,
      default: () => []
    },
    submitData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:visible', 'submit'],
  data() {
    return {
      submit: { ...this.submitData },
      validatedCustom01: false
    }
  },
  watch: {
    submitData(newVal) {
      this.submit = { ...newVal }
    }
  },
  methods: {
    closeModal() {
      this.$emit('update:visible', false)
    },
    async onClickInput(problem) {
      try {
        console.log("1=================================================================");
        this.modalLoading = true;
        this.visibleLiveDemo = true;
        // Fetch full problem data from backend API by problem ID
        const response = await axios.get(`/api/smartandon/problemId/${problem.fid}`);
        console.log("=================================================================");
        const problemData = response.data;

        // Helper function to convert date to yyyy-mm-dd format for input type date
        function formatDateToISO(dateStr) {
          if (!dateStr) return '';
          const date = new Date(dateStr);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }

        // Populate submit object with fetched data based on modal labels
        // Find machine object in machineOptions matching problemData.fmc_name
        const selectedMachine = this.machineOptions.find(
          (machine) => machine.label === problemData.fmc_name
        ) || null;

        this.submit = {
          machineName: problemData.fmc_name || null,
          line: problemData.fline || null,
          fidProblem: problemData.fid || '',
          fmaker: problemData.fmaker || '',
          problems: problemData.ferror_name || '',
          uraianKejadian: problemData.uraian_kejadian || '',
          uploadImage: problemData.upload_image || '',
          standartImage: problemData.standart_image || '',
          ilustrasiStandart: problemData.ilustrasi_standart || '',
          ilustrasiActual: problemData.ilustrasi_actual || '',
          actualImage: problemData.actual_image || '',
          gapBetweenStandarAndActual: problemData.gap_between_standar_and_actual || '',
          pilihFocusThemaMember: problemData.pilih_focus_thema_member || '',
          pilihTaskforce: problemData.pilih_taskforce || '',
          operator: problemData.foperator ? problemData.foperator.split(',') : [],
          avCategory: problemData.fav_categoty || '',
          shift: problemData.shift || '',
          startDate: formatDateToISO(problemData.start_date) || '',
          finishDate: formatDateToISO(problemData.finish_date) || '',
          durationMin: problemData.duration_min || '',
          problemCategory: problemData.problemCategory || null,
          itemTemporaryAction: problemData.item_temporary_action || '',
          rootcauses5Why: problemData.rootcauses_5_why || '',
          tambahAnalysisTerjadi: problemData.tambah_analysis_terjadi || '',
          whyImage: problemData.why_image || '',
          pilihO6: problemData.pilih_o6 || '',
          stepRepair: problemData.step_repair || '',
          partChange: problemData.part_change || '',
          countermeasureKenapaTerjadi: problemData.countermeasure_kenapa_terjadi || '',
          yokoten: problemData.yokoten || '',
          rootcause5WhyKenkaLama: problemData.rootcause_5_why_kenka_lama || '',
          tambahAnalisisLama: problemData.tambah_analisis_lama || '',
          pilihQ6: problemData.pilih_q6 || '',
          whyLamaImage: problemData.why_lama_image || '',
          countermeasureKenkaLama: problemData.countermeasure_kenka_lama || '',
          attachmentMeeting: problemData.attachment_meeting || '',
          comments5Why: problemData.comments_5_why || '',
          commentsCountermeasure: problemData.comments_countermeasure || '',
          lastReportFile: problemData.last_report_file || '',
          uploadFile: problemData.upload_file || '',
          agreeTerms: false,
        };

        this.machineName = problemData.fmc_name || null,
        this.line = problemData.fline || null,
        this.fidProblem = problemData.fid || '';
        this.fmaker = problemData.fmaker || '';
        this.problems = problemData.ferror_name || '';
        this.uraianKejadian = problemData.ferror_detail || '';
        this.uploadImage = problemData.upload_image || '';
        this.standartImage = problemData.standart_image || '';
        this.ilustrasiStandart = problemData.ilustrasi_standart || '';
        this.ilustrasiActual = problemData.ilustrasi_actual || '';
        this.actualImage = problemData.actual_image || '';
        this.gapBetweenStandarAndActual = problemData.gap_between_standar_and_actual || "No data for gap between standar and actual";
        this.pilihFocusThemaMember = problemData.pilih_focus_thema_member || '';
        this.pilihTaskforce = problemData.pilih_taskforce || '';
        this.operator = problemData.foperator || '';
        this.avCategory = problemData.fav_categoty || '';
        this.shift = problemData.fshift || '';

        if(this.shift == "r"){
          this.shiftName = "Red";
        } else if (this.shift == "w"){
          this.shiftName = "White";
        } else {
          this.shiftName = "Not yet inputted"
        }

        this.startDate = formatDateToISO(problemData.fstart_time || '');
        this.finishDate = formatDateToISO(problemData.fend_time || '');
        console.log("YESS");
        console.log("Start Date: " + this.startDate);
        console.log("Finish Date: " + this.finishDate);

        console.log("Start Date1: " + problemData.fstart_time);
        console.log("Finish Date1: " + problemData.fend_time);

        this.startDateProblem = formatDateToISO(problemData.fstart_time || '');
        this.finishDateProblem = formatDateToISO(problemData.fend_time || '');

        // this.startDate = this.formatDate(problemData.fstart_time || '');
        // this.finishDate = this.formatDate(problemData.fend_time || '');
        
        console.log("YESSS");
        console.log("Start Date: " + this.startDateProblem);
        console.log("Finish Date: " + this.finishDateProblem);

        console.log("Start Date2: " + problemData.fstart_time);
        console.log("Finish Date2: " + problemData.fend_time);

        this.durationMin = problemData.fdur || '';
        this.problemCategory = problemData.problemCategory || null;

        if (this.problemCategory == 1) {
          this.problemCategoryName = "Small";
        } else if (this.problemCategory == 2) {
          this.problemCategoryName = "Chokotei";
        } else if (this.problemCategory == 3) {
          this.problemCategoryName = "LTB";
        } else {
          this.problemCategoryName = "";
        }

        this.itemTemporaryAction = problemData.temporaryAction || "No item temporary action";
        this.rootcauses5Why = problemData.froot_cause || "No root cause 5 why";
        this.tambahAnalysisTerjadi = problemData.tambah_analysis_terjadi || "No analysis terjadi";
        this.whyImage = problemData.why_image || '';

        this.pilihO6 = problemData.oCategory || '';
        if (this.pilihO6 == 1) {
          this.oCategoryName = "O1: Design & Installation (Design / Installation Not Good (Refers to Function Check / Eng. Memo))";
        } else if (this.pilihO6 == 2) {
          this.oCategoryName = "O2: Henkaten Issue (No Enough Trial, No Confirm (others team))";
        } else if (this.pilihO6 == 3) {
          this.oCategoryName = "O3: PM Issue (No Have/Unclear, Unclear Methode, Confine/Invisible, Out of Periode, No Have Time, Lack of Skill)";
        } else if (this.pilihO6 == 4) {
          this.oCategoryName = "O4: Symptom (No Have Symptom, Have Symptom but Unfollow Activity)";
        } else if (this.pilihO6 == 5) {
          this.oCategoryName = "O5: Environment & 3rd Factor (Dirty, Confine Space, Invisible Area, Unpredictable (water leak / crush))";
        } else if (this.pilihO6 == 6) {
          this.oCategoryName = "o6: Lifetime Issue (Out of Standard Running, Over Capacity)";
        } else {
          this.oCategoryName = "";
        }

        this.stepRepair = problemData.fstep_repair || '';
        this.partChange = problemData.fpart_change || '';
        this.countermeasureKenapaTerjadi = problemData.countermeasure_kenapa_terjadi || '';
        this.yokoten = problemData.fyokoten || '';
        this.rootcause5WhyKenapaLama = problemData.rootcause_5_why_kenapa_lama || '';
        this.tambahAnalisisLama = problemData.tambah_analisis_lama || '';

        this.pilihQ6 = problemData.qCategory || '';
        if (this.pilihQ6 == 1) {
          this.qCategoryName = "Q1: Diagnose (Meeting, accuracy check (run-out, backlash, etc))";
        } else if (this.pilihQ6 == 2) {
          this.qCategoryName = "Q2: Sparepart (Part preparation, fabrication of part, repair of damage part due to unavailability at SPW)";
        } else if (this.pilihQ6 == 3) {
          this.qCategoryName = "Q3: Tool (Special tools preparation, change of tools, personal tool, change dresser, safety tool)";
        } else if (this.pilihQ6 == 4) {
          this.qCategoryName = "Q4: Maint. Ability (Repair, overhaul, part replace, tomoken, 5S)";
        } else if (this.pilihQ6 == 5) {
          this.qCategoryName = "Q5: Setting Ability (Quality checking, program adjustment, program zeroing, position memory set, autosizer setting & amp, PSW set, backlash adjustment (slide gib / kamisori, parameter set, centering, etc))";
        } else if (this.pilihQ6 == 6) {
          this.qCategoryName = "Q6: Back-Up (Back-Up MC's Preparation, Back-Up MC's dandori)";
        } else {
          this.qCategoryName = " ";
        }

        console.log("YES");
        console.log("================================================" + this.qCategoryName + "====================================================");

        this.whyLamaImage = problemData.why_lama_image || '';
        this.countermeasureKenapaLama = problemData.countermeasure_kenapa_lama || '';
        this.attachmentMeeting = problemData.attachment_meeting || '';
        this.comments5Why = problemData.fiveWhyLhFeedback || problemData.fiveWhyShFeedback || '';
        this.commentsCountermeasure = problemData.comments_countermeasure || '';
        this.lastReportFile = problemData.last_report_file || '';
        this.uploadFile = problemData.upload_file || '';
        this.agreeTerms = false,
        this.fidProblem = problem.fid; // store problem id if needed
        this.maker = problem.fmaker;
        this.visibleLiveDemo = true;
      } catch (error) {
        alert('Failed to load problem data: ' + error.message);
        this.modalLoading = false;
        console.error(error);
      }
    },
    
    saveSubmit() {
      this.validatedCustom01 = true
      if (!this.submit.machineName || !this.submit.line || !this.submit.problems || !this.submit.agreeTerms) {
        alert('Please fill all required fields and agree to terms.')
        return
      }
      this.$emit('submit', this.submit)
      this.closeModal()
    },
    handleSubmitCustom01() {
      this.saveSubmit()
    }
  }
}
</script>

<style scoped>
/* Add any modal-specific styles here */
</style>

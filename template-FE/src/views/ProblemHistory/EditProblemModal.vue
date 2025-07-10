<template>
  <CModal
    :visible="visible"
    @close="$emit('close')"
    fullscreen
    aria-labelledby="LiveDemoExampleLabel"
  >
    <CModalHeader>
      <CModalTitle id="LiveDemoExampleLabel">Edit Problem</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <div v-if="modalLoading" style="text-align: center; padding: 40px 0">
        <CSpinner color="primary" style="width: 3rem; height: 3rem" />
        <div style="margin-top: 10px">Loading data...</div>
      </div>
      
      <CForm
        v-else
        class="row g-3 needs-validation"
        novalidate
        :validated="validatedCustom01"
        @submit="handleSubmitCustom01"
      >
        <CCol md="6">
          <label for="machineSelect" class="form-label">Machine Name</label>
          <Treeselect
            id="machineSelect"
            v-model="localSubmit.machineName"
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
            v-model="localSubmit.line"
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
        <CCol md="6">
          <CFormInput
            feedbackInvalid="Operation No."
            id="Problems"
            label="Operation No."
            required
            v-model="localSubmit.fidProblem"
          />
        </CCol>
        <CCol md="6">
          <CFormInput
            feedbackInvalid="Maker"
            id="Problems"
            label="Maker"
            required
            v-model="localSubmit.maker"
          />
        </CCol>
        <CCol md="12">
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Problems"
            required
            v-model="localSubmit.problems"
          />
        </CCol>
        <CCol md="8">
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Uraian Kejadian"
            required
            v-model="localSubmit.uraianKejadian"
          />
        </CCol>
        <CCol md="4">
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Upload Image"
            required
            v-model="localSubmit.uploadImage"
          />
        </CCol>
        <CCol md="8">
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Ilustrasi Standart"
            required
            v-model="localSubmit.ilustrasiStandart"
          />
        </CCol>
        <CCol md="4">
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Standart Image"
            required
            v-model="localSubmit.standartImage"
          />
        </CCol>
        <CCol md="8">
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Ilustrasi Actual"
            required
            v-model="localSubmit.ilustrasiActual"
          />
        </CCol>
        <CCol md="4">
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Actual Image"
            required
            v-model="localSubmit.actualImage"
          />
        </CCol>
        <CCol md="12">
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Gap Between Standar and Actual"
            required
            v-model="localSubmit.gapBetweenStandarAndActual"
          />
        </CCol>
        <CCol md="8">
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Pilih Focus Thema Member"
            required
            v-model="localSubmit.pilihFocusThemaMember"
          />
        </CCol>
        <CCol md="4">
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Pilih Taskforce"
            required
            v-model="localSubmit.pilihTaskforce"
          />
        </CCol>
        <CCol md="12">
          <label for="operatorSelect" class="form-label">Operator</label>
          <Treeselect
            id="operatorSelect"
            v-model="localSubmit.operator"
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
            v-model="localSubmit.avCategory"
          >
            <option :value="localSubmit.avCategory" selected>
              {{ localSubmit.avCategory }}
            </option>
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
            label="Shift"
            required
            v-model="localSubmit.shift"
          >
            <option :value="localSubmit.shift" selected>{{ shiftName }}</option>
            <option disabled value="">Choose shift</option>
            <option value="r">Red</option>
            <option value="w">White</option>
            <option value="">No Shift</option>
          </CFormSelect>
        </CCol>
        <CCol md="6">
          <label for="startDateModal" class="form-label">Start Date</label>
          <CInputGroup>
            <CInputGroupText id="basic-addon1"><CIcon icon="cilClock" size="l"/></CInputGroupText>
            <CFormInput
              id="startDateModal"
              type="datetime-local"
              required
              v-model="localSubmit.startDate"
              aria-label="Start Date"
              aria-describedby="basic-addon1"
            />
          </CInputGroup>
        </CCol>
        <CCol md="6">
          <label for="finishDateModal" class="form-label">Finish Date</label>
          <CInputGroup>
            <CInputGroupText id="basic-addon2"><CIcon icon="cilClock" size="l"/></CInputGroupText>
            <CFormInput
              id="finishDateModal"
              type="datetime-local"
              required
              v-model="localSubmit.finishDate"
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
            v-model="localSubmit.durationMin"
          />
        </CCol>

        <CCol md="12">
          <CFormSelect
            aria-describedby="problemCategory"
            feedbackInvalid="Please select the problem category."
            id="problemCategorySelect"
            label="Problem Category:"
            required
            v-model="localSubmit.problemCategory"
          >
            <option :value="localSubmit.problemCategory" selected>
              {{ problemCategoryName }}
            </option>
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
            v-model="localSubmit.itemTemporaryAction"
          />
        </CCol>
        <CCol md="12">
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Rootcauses 5 Why (Kenapa Terjadi)"
            required
            v-model="localSubmit.rootcauses5Why"
          />
        </CCol>
        <CCol md="12">
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Tambah Analysis TERJADI"
            required
            v-model="localSubmit.tambahAnalysisTerjadi"
          />
        </CCol>
        <CCol md="12">
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="5 Why (Kenapa Terjadi) Image"
            required
            v-model="localSubmit.whyImage"
          />
        </CCol>
        <CCol md="12">
          <CFormSelect
            aria-describedby="O6 Category"
            feedbackInvalid="Please select the O6 Category."
            id="o6CategorySelect"
            label="O6 Category:"
            required
            v-model="localSubmit.oCategory"
          >
            <option :value="localSubmit.oCategory" selected>
              {{ oCategoryName }}
            </option>
            <option disabled value="">Choose problem 06 Category...</option>
            <option :value="1">
              O1: Design & Installation (Design / Installation Not Good (Refers
              to Function Check / Eng. Memo))
            </option>
            <option :value="2">
              O2: Henkaten Issue (No Enough Trial, No Confirm (others team))
            </option>
            <option :value="3">
              O3: PM Issue (No Have/Unclear, Unclear Methode, Confine/Invisible,
              Out of Periode, No Have Time, Lack of Skill)
            </option>
            <option :value="4">
              O4: Symptom (No Have Symptom, Have Symptom but Unfollow Activity)
            </option>
            <option :value="5">
              O5: Environment & 3rd Factor (Dirty, Confine Space, Invisible
              Area, Unpredictable (water leak / crush))
            </option>
            <option :value="6">
              O6: Lifetime Issue (Out of Standard Running, Over Capacity)
            </option>
          </CFormSelect>
        </CCol>
        <CCol md="12">
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Step Repair"
            required
            v-model="localSubmit.stepRepair"
          />
        </CCol>
        <CCol md="12">
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Part Change"
            required
            v-model="localSubmit.partChange"
          />
        </CCol>
        <CCol md="12">
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Countermeasure (kenapa terjadi)"
            required
            v-model="localSubmit.countermeasureKenapaTerjadi"
          />
        </CCol>
        <CCol md="12">
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Yokoten"
            required
            v-model="localSubmit.yokoten"
          />
        </CCol>
        <CCol md="12">
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Rootcause 5 Why (kenapa lama)"
            required
            v-model="localSubmit.rootcause5WhyKenapaLama"
          />
        </CCol>
        <CCol md="12">
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Tambah Analisis LAMA"
            required
            v-model="localSubmit.tambahAnalisisLama"
          />
        </CCol>
        <CCol md="12">
          <CFormSelect
            aria-describedby="Q6 Category"
            feedbackInvalid="Please select the Q6 Category."
            id="q6CategorySelect"
            label="Q6 Category:"
            required
            v-model="localSubmit.qCategory"
          >
            <option :value="localSubmit.qCategory" selected>
              {{ qCategoryName }}
            </option>
            <option disabled value="">Choose problem Q6 Category...</option>
            <option :value="1">
              Q1: Diagnose (Meeting, accuracy check (run-out, backlash, etc))
            </option>
            <option :value="2">
              Q2: Sparepart (Part preparation, fabrication of part, repair of
              damage part due to unavailability at SPW)
            </option>
            <option :value="3">
              Q3: Tool (Special tools preparation, change of tools, personal
              tool, change dresser, safety tool)
            </option>
            <option :value="4">
              Q4: Maint. Ability (Repair, overhaul, part replace, tomoken, 5S)
            </option>
            <option :value="5">
              Q5: Setting Ability (Quality checking, program adjustment, program
              zeroing, position memory set, autosizer setting & amp, PSW set,
              backlash adjustment (slide gib / kamisori, parameter set,
              centering, etc))
            </option>
            <option :value="6">
              Q6: Back-Up (Back-Up MC's Preparation, Back-Up MC's dandori)
            </option>
          </CFormSelect>
        </CCol>
        <CCol md="12">
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="5 Why (Kenapa Lama) Image"
            required
            v-model="localSubmit.whyLamaImage"
          />
        </CCol>
        <CCol md="12">
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Countermeasure (kenapa Lama)"
            required
            v-model="localSubmit.countermeasureKenapaLama"
          />
        </CCol>
        <CCol md="12">
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Attachment Meeting"
            required
            v-model="localSubmit.attachmentMeeting"
          />
        </CCol>
        <CCol md="12">
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Comments 5 Why"
            required
            v-model="localSubmit.comments5Why"
          />
        </CCol>
        <CCol md="12">
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Comments Countermeasure"
            required
            v-model="localSubmit.commentsCountermeasure"
          />
        </CCol>
        <CCol md="12">
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Last Report File"
            required
            v-model="localSubmit.lastReportFile"
          />
        </CCol>
        <CCol md="12">
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Upload File"
            required
            v-model="localSubmit.uploadFile"
          />
        </CCol>
        <CCol xs="12">
          <CFormCheck
            feedbackInvalid="You must agree before submitting."
            id="invalidCheck"
            label="Agree to terms and conditions"
            required
            type="checkbox"
            v-model="localSubmit.agreeTerms"
          />
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
</template>

<script>
import { ref, watch, toRefs } from 'vue'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CCol,
  CFormInput,
  CFormCheck,
  CButton,
  CSpinner,
} from '@coreui/vue'
import Treeselect from 'vue3-treeselect'
import { cilClock } from '@coreui/icons'
import { CIcon } from '@coreui/icons-vue'

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
    CButton,
    CSpinner,
    Treeselect,
    cilClock,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    submitData: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    machineOptions: {
      type: Array,
      default: () => [],
    },
    lineOptions: {
      type: Array,
      default: () => [],
    },
    modalLoading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { submitData } = toRefs(props);
    console.log('EditProblemModal props:', JSON.stringify(props, null, 2));
    
    const localSubmit = ref({ ...(submitData.value || {}) });

    console.log('Local submit data 1:', JSON.stringify(localSubmit.value, null, 2));

    console.log('Check fstart_time: ', localSubmit.value.startDate);
    console.log('Check fend_time: ', localSubmit.value.finishDate);

    console.log("ANJING:", localSubmit.value);

    watch(submitData, (newVal) => {
      localSubmit.value = { ...(newVal || {}) }
    })

    const validatedCustom01 = ref(false)

    const onMachineInput = () => {
      console.log('Machine input changed:', localSubmit.value.machineName)
    }
    console.log("ANJING 1: " + localSubmit.value);
    const handleSubmit = () => {
      validatedCustom01.value = true
      saveSubmit()
    }

    const saveSubmit = () => {
      if (!localSubmit.value || !localSubmit.value.machineName) {
        alert('Please input machine name')
        return
      }
      if (!localSubmit.value.line) {
        alert('Please input line')
        return
      }
      if (!localSubmit.value.problems) {
        alert('Please input problems')
        return
      }
      if (!localSubmit.value.agreeTerms) {
        alert('You must agree to terms and conditions before submitting')
        return
      }
      emit('submit', localSubmit.value)
    }

    // Add reactive state for option labels
    const shiftName = ref('')
    const oCategoryName = ref('')
    const qCategoryName = ref('')
    const problemCategoryName = ref('')

    // Watch localSubmit to update option labels accordingly
    watch(
      () => localSubmit.value.shift,
      (newShift) => {
        if (newShift === 'r') shiftName.value = 'Red'
        else if (newShift === 'w') shiftName.value = 'White'
        else shiftName.value = 'Not yet inputted'
      },
      { immediate: true }
    )

    watch(
      () => localSubmit.value.pilihO6,
      (newO6) => {
        console.log('O6 ini:', localSubmit.value.pilihO6);
        const o6Map = {
          1: 'O1: Design & Installation (Design / Installation Not Good (Refers to Function Check / Eng. Memo))',
          2: 'O2: Henkaten Issue (No Enough Trial, No Confirm (others team))',
          3: 'O3: PM Issue (No Have/Unclear, Unclear Methode, Confine/Invisible, Out of Periode, No Have Time, Lack of Skill)',
          4: 'O4: Symptom (No Have Symptom, Have Symptom but Unfollow Activity)',
          5: 'O5: Environment & 3rd Factor (Dirty, Confine Space, Invisible Area, Unpredictable (water leak / crush))',
          6: 'O6: Lifetime Issue (Out of Standard Running, Over Capacity)',
        }
        oCategoryName.value = o6Map[newO6] || ''
        console.log('O6 ini 1:', localSubmit.value.pilihO6);
      },
      { immediate: true }
    )

    watch(
      () => localSubmit.value.problemCategory,
      (newCategory) => {
        console.log('Problem Category changed:', localSubmit.value.problemCategory);
        const categoryMap = {
          1: 'Small',
          2: 'Chokotei',
          3: 'LTB',
        }
        problemCategoryName.value = categoryMap[newCategory] || '';
        console.log('Problem Category changed 1:', localSubmit.value.problemCategory)
      },
      { immediate: true }
    )

    watch(
      () => localSubmit.value.pilihQ6,
      (newQ6) => {
        console.log('Q6 ini:', localSubmit.value.pilihQ6);
        const q6Map = {
          1: "Q1: Diagnose (Meeting, accuracy check (run-out, backlash, etc))",
          2: "Q2: Sparepart (Part preparation, fabrication of part, repair of damage part due to unavailability at SPW)",
          3: "Q3: Tool (Special tools preparation, change of tools, personal tool, change dresser, safety tool)",
          4: "Q4: Maint. Ability (Repair, overhaul, part replace, tomoken, 5S)",
          5: "Q5: Setting Ability (Quality checking, program adjustment, program zeroing, position memory set, autosizer setting & amp, PSW set, backlash adjustment (slide gib / kamisori, parameter set, centering, etc))",
          6: "Q6: Back-Up (Back-Up MC's Preparation, Back-Up MC's dandori)",
        }
        qCategoryName.value = q6Map[newQ6] || ' '
        console.log('Q6 ini 1:', localSubmit.value.pilihQ6);
      },
      { immediate: true }
    )
    console.log("ANJING 2: " + localSubmit.value);
    console.log('Local submit data 2:', JSON.stringify(localSubmit.value, null, 2));





    
    return {
      localSubmit,
      validatedCustom01,
      onMachineInput,
      handleSubmit,
      saveSubmit,
      shiftName,
      oCategoryName,
      qCategoryName,
      problemCategoryName,
    }
  },
}
</script>

<template>
  <CModal
    :visible="visible"
    @close="$emit('close')"
    fullscreen
    aria-labelledby="LiveDemoExampleLabel"
  >
    <CModalHeader class="mb-3">
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
        <CRow class="mb-3">
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
        </CRow>
        <CRow class="mb-3">
          <CCol md="6">
            <CFormInput
              feedbackInvalid="Operation No."
              id="Problems"
              label="Operation No."
              placeholder="Not yet inputted"
              required
              disabled
              v-model="localSubmit.operationNo"
            />
          </CCol>
          <CCol md="6">
            <CFormInput
              feedbackInvalid="Maker"
              id="Problems"
              label="Maker"
              placeholder="Not yet inputted"
              required
              disabled
              v-model="localSubmit.maker"
            />
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CFormInput
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Problems"
              placeholder="Not yet inputted"
              required
              v-model="localSubmit.problems"
            />
          </CCol>
        </CRow>
        <CRow class="mb-3">
          <CCol md="8">
            <CFormInput
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Uraian Kejadian"
              placeholder="Not yet inputted"
              required
              v-model="localSubmit.uraianKejadian"
            />
          </CCol>
          <CCol md="4">
            <CFormInput
              type="file"
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Upload Image"
              required
              @change="onFileChange($event, 'uploadImage')"
            />
          </CCol>
        </CRow>
        <CRow class="mb-3">
          <CCol md="8">
            <CFormInput
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Ilustrasi Standart"
              placeholder="Not yet inputted"
              required
              v-model="localSubmit.ilustrasiStandart"
            />
          </CCol>
          <CCol md="4">
            <CFormInput
              type="file"
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Standart Image"
              required
              @change="onFileChange($event, 'standartImage')"
            />
          </CCol>
        </CRow>
        <CRow class="mb-3">
          <CCol md="8">
            <CFormInput
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Ilustrasi Actual"
              placeholder="Not yet inputted"
              required
              v-model="localSubmit.ilustrasiActual"
            />
          </CCol>
          <CCol md="4">
            <CFormInput
              type="file"
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Actual Image"
              required
              @change="onFileChange($event, 'actualImage')"
            />
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CFormInput
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Gap Between Standar and Actual"
              placeholder="Not yet inputted"
              required
              v-model="localSubmit.gapBetweenStandarAndActual"
            />
          </CCol>
        </CRow>
        <CRow class="mb-3">
          <CCol md="8">
            <CFormInput
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Pilih Focus Thema Member"
              placeholder="Not yet inputted"
              required
              v-model="localSubmit.pilihFocusThemaMember"
            />
          </CCol>
          <CCol md="4">
            <CFormInput
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Pilih Taskforce"
              placeholder="Not yet inputted"
              required
              v-model="localSubmit.pilihTaskforce"
            />
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
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
        </CRow>
        <CRow class="mb-3">
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
              <option :value="localSubmit.shift" selected>
                {{ shiftName }}
              </option>
              <option disabled value="">Choose shift</option>
              <option value="r">Red</option>
              <option value="w">White</option>
              <option value="">No Shift</option>
            </CFormSelect>
          </CCol>
        </CRow>
        <CRow class="mb-3">
          <CCol md="6">
            <label for="startDateModal" class="form-label">Start Date</label>
            <CInputGroup>
              <CInputGroupText id="basic-addon1"
                ><CIcon icon="cilClock" size="l"
              /></CInputGroupText>
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
              <CInputGroupText id="basic-addon2"
                ><CIcon icon="cilClock" size="l"
              /></CInputGroupText>
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
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CFormInput
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Duration (min)"
              placeholder="Not yet inputted"
              required
              v-model="localSubmit.durationMin"
            />
          </CCol>
        </CRow>

        <CRow md="12" class="mb-3">
          <CCol>
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
              <option :value="2">Repeat</option>
              <option :value="3">LTR</option>
              <option :value="4">SLTR</option>
            </CFormSelect>
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CFormInput
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Item Temporary Action"
              placeholder="Not yet inputted"
              required
              v-model="localSubmit.itemTemporaryAction"
            />
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <label class="form-label">Rootcause 5 Why (Kenapa Terjadi)</label>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell style="width: 50px">No</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell style="width: 120px"
                    >Actions</CTableHeaderCell
                  >
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow
                  v-for="(item, index) in localSubmit.rootcauses5Why"
                  :key="item.id"
                >
                  <CTableDataCell>{{ index + 1 }}</CTableDataCell>
                  <CTableDataCell>
                    <CFormInput
                      type="text"
                      v-model="item.description"
                      placeholder="Enter description"
                      :disabled="
                        editingRootcauses?.[item.id] === 'locked' ||
                        !editingRootcauses?.[item.id]
                      "
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="primary"
                      size="sm"
                      class="me-2"
                      @click="editRootcause(index)"
                    >
                      <CIcon
                        :icon="
                          editingRootcauses?.[item.id]
                            ? 'cil-paper-plane'
                            : 'cil-pencil'
                        "
                      />
                    </CButton>
                    <CButton
                      color="danger"
                      size="sm"
                      @click="deleteRootcause(index)"
                    >
                      <CIcon icon="cil-trash" />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
            <CButton
              color="success"
              size="sm"
              class="mt-2"
              style="color: white"
              @click="addRootcause"
              v-if="localSubmit.rootcauses5Why.length < 5"
            >
              Add Rootcause
            </CButton>
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <label class="form-label">Tambah Analysis TERJADI</label>
            <CButton
              color="primary"
              sm="12"
              class="mb-3"
              style="color: white; width: 100%"
              @click="toggleTambahAnalysis"
            >
              Tambah Analysis TERJADI
            </CButton>
            <div v-if="showTambahAnalysis" class="analysis-list">
              <TreeList
                :model="treeModel || { id: 1, description: '', subItems: [] }"
                @update:model="(val) => (treeModel = val)"
              />
            </div>
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CFormInput
              type="file"
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="5 Why (Kenapa Terjadi) Image"
              required
              @change="onFileChange($event, 'whyImage')"
            />
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
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
                O1: Design & Installation (Design / Installation Not Good
                (Refers to Function Check / Eng. Memo))
              </option>
              <option :value="2">
                O2: Henkaten Issue (No Enough Trial, No Confirm (others team))
              </option>
              <option :value="3">
                O3: PM Issue (No Have/Unclear, Unclear Methode,
                Confine/Invisible, Out of Periode, No Have Time, Lack of Skill)
              </option>
              <option :value="4">
                O4: Symptom (No Have Symptom, Have Symptom but Unfollow
                Activity)
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
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <label class="form-label">Step Repair</label>
            <CTable bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell style="width: 50px">No</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell style="width: 120px"
                    >Actions</CTableHeaderCell
                  >
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow
                  v-for="(item, index) in localSubmit.stepRepair"
                  :key="item.id"
                >
                  <CTableDataCell>{{ index + 1 }}</CTableDataCell>
                  <CTableDataCell>
                    <CFormInput
                      type="text"
                      v-model="item.description"
                      placeholder="Enter description"
                      :disabled="
                        editingStepRepair?.[item.id] === 'locked' ||
                        !editingStepRepair?.[item.id]
                      "
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="primary"
                      size="sm"
                      class="me-2"
                      @click="editStepRepair(index)"
                    >
                      <CIcon
                        :icon="
                          editingStepRepair?.[item.id]
                            ? 'cil-paper-plane'
                            : 'cil-pencil'
                        "
                      />
                    </CButton>
                    <CButton
                      color="danger"
                      size="sm"
                      @click="deleteStepRepair(index)"
                    >
                      <CIcon icon="cil-trash" />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
            <CButton
              color="success"
              size="sm"
              class="mt-2"
              style="color: white"
              @click="addStepRepair"
              v-if="localSubmit.stepRepair.length < 5"
            >
              Add Step Repair
            </CButton>
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CFormInput
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Part Change"
              placeholder="Not yet inputted"
              required
              v-model="localSubmit.partChange"
            />
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CFormInput
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Countermeasure (kenapa terjadi)"
              placeholder="Not yet inputted"
              required
              v-model="localSubmit.countermeasureKenapaTerjadi"
            />
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CFormInput
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Yokoten"
              placeholder="Not yet inputted"
              required
              v-model="localSubmit.yokoten"
            />
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CFormInput
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Rootcause 5 Why (kenapa lama)"
              placeholder="Not yet inputted"
              required
              v-model="localSubmit.rootcause5WhyKenapaLama"
            />
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CFormInput
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Tambah Analisis LAMA"
              placeholder="Not yet inputted"
              required
              v-model="localSubmit.tambahAnalisisLama"
            />
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
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
                Q5: Setting Ability (Quality checking, program adjustment,
                program zeroing, position memory set, autosizer setting & amp,
                PSW set, backlash adjustment (slide gib / kamisori, parameter
                set, centering, etc))
              </option>
              <option :value="6">
                Q6: Back-Up (Back-Up MC's Preparation, Back-Up MC's dandori)
              </option>
            </CFormSelect>
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CFormInput
              type="file"
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="5 Why (Kenapa Lama) Image"
              required
              @change="onFileChange($event, 'whyLamaImage')"
            />
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CFormInput
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Countermeasure (kenapa Lama)"
              required
              v-model="localSubmit.countermeasureKenapaLama"
            />
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CFormInput
              type="file"
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Attachment Meeting"
              required
              @change="onFileChange($event, 'attachmentMeeting')"
            />
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CFormInput label="No Comments" />
            <CFormInput
              feedbackInvalid="Please input the problems"
              id="ProblemsSH"
              label="Comments 5 Why SH"
              required
              v-model="localSubmit.comments5WhySH"
              :placeholder="
                localSubmit.comments5WhySH ? 'SH: isi comment' : 'kosong'
              "
            />
            <CFormInput
              feedbackInvalid="Please input the problems"
              id="ProblemsLH"
              label="Comments 5 Why LH"
              required
              v-model="localSubmit.comments5WhyLH"
              :placeholder="
                localSubmit.comments5WhyLH ? 'LH: isi comment' : 'kosong'
              "
            />
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CFormInput
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Comments Countermeasure"
              required
              v-model="localSubmit.commentsCountermeasure"
            />
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CCol md="12">
              <label class="form-label">Last Report File</label>
            </CCol>
            <CCol md="12">
              <CButton
                style="width: 100%"
                :color="localSubmit.file_report ? 'primary' : 'secondary'"
                @click="downloadLastReportFile"
                :disabled="!localSubmit.file_report"
                v-if="localSubmit.file_report"
              >
                Download Last Report File
              </CButton>
              <CButton style="width: 100%" color="warning" disabled v-else>
                Belum Ada Report di Upload
              </CButton>
            </CCol>
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CCol md="12">
              <CButton
                style="width: 100%"
                :color="'secondary'"
                @click="downloadTemplateFile"
                :disabled="!localSubmit.file_report"
              >
                Download Template
              </CButton>
            </CCol>
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CFormInput
              type="file"
              feedbackInvalid="Please input the problems"
              id="Problems"
              label="Upload Report"
              required
              @change="onFileChange($event, 'uploadFile')"
            />
          </CCol>
        </CRow>
        <CRow xs="12" class="mb-3">
          <CCol>
            <CFormCheck
              feedbackInvalid="You must agree before submitting."
              id="invalidCheck"
              label="Agree to terms and conditions"
              required
              type="checkbox"
              v-model="localSubmit.agreeTerms"
            />
          </CCol>
        </CRow>
      </CForm>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="$emit('close')"> Close </CButton>

      <CButton color="primary" @click="saveSubmit" :disabled="isSaving">
        <span v-if="isSaving"> <CSpinner size="sm" /> Saving... </span>
        <span v-else> Submit </span>
      </CButton>
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
  CRow,
  CFormInput,
  CFormCheck,
  CButton,
  CSpinner,
} from '@coreui/vue'
import Treeselect from 'vue3-treeselect'
import { cilClock } from '@coreui/icons'
import { CIcon } from '@coreui/icons-vue'
import TreeList from 'vue-tree-list'

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
    CRow,
    CFormInput,
    CFormCheck,
    CButton,
    CSpinner,
    Treeselect,
    TreeList,
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
    memberOption: {
      type: Array,
      default: () => [],
    },
    modalLoading: {
      type: Boolean,
      default: false,
    },
    saving: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    const { submitData } = toRefs(props)
    console.log('EditProblemModal props:', JSON.stringify(props, null, 2))

    const parseFrealProb = (frealProb) => {
      if (!frealProb) return [{ id: 1, description: '' }]
      if (typeof frealProb === 'string') {
        const cleaned = frealProb.trim()
        const lines = cleaned.split('\\n').filter((line) => line.trim() !== '')
        if (lines.length === 0) return [{ id: 1, description: '' }]
        const result = lines.map((line, index) => ({
          id: index + 1,
          description: line.trim(),
        }))
        console.log('parseFrealProb result:', result)
        return result
      } else if (Array.isArray(frealProb)) {
        return frealProb.map((item, index) => {
          if (typeof item === 'string') {
            return { id: index + 1, description: item }
          } else if (item && typeof item.description === 'string') {
            return { id: index + 1, description: item.description }
          } else {
            return { id: index + 1, description: '' }
          }
        })
      } else {
        return [{ id: 1, description: '' }]
      }
    }

    const parseStepRepair = (stepRepair) => {
      if (!stepRepair || typeof stepRepair !== 'string')
        return [{ id: 1, description: '' }]
      const cleaned = stepRepair.trim()
      const lines = cleaned.split(/\r?\n/).filter((line) => line.trim() !== '')
      if (lines.length === 0) return [{ id: 1, description: '' }]
      return lines.map((line, index) => ({
        id: index + 1,
        description: line.trim(),
      }))
    }

    const localSubmit = ref({
      ...(submitData.value || {}),
      rootcauses5Why: parseFrealProb(submitData.value?.freal_prob),
      stepRepairArray: parseStepRepair(submitData.value?.stepRepair),
      comments5WhySH: submitData.value?.fiveWhyShFeedback || '',
      comments5WhyLH: submitData.value?.fiveWhyLhFeedback || '',
    })

    const validatedCustom01 = ref(false)
    const isSaving = ref(false)
    const editingRootcauses = ref({})
    const editingStepRepair = ref({})

    const initializeEditingRootcauses = (rootcausesArray) => {
      const editingState = {}
      rootcausesArray.forEach((item) => {
        editingState[item.id] = item.description.trim() === '' ? true : false
      })
      editingRootcauses.value = editingState
    }

    // async onClickInput(problem) {
    //   try {
    //     this.tableLoading = true
    //     this.modalLoading = true
    //     const response = await axios.get(`/api/smartandon/problemId/${problem.fid}`);
    //     const problemData = response.data
    //     console.log('Problem data:', problemData);
    //     this.submit = this.mapProblemDataToSubmit(problemData)
    //     console.log('Submit data sent to EditProblemModal:', JSON.stringify(this.submit, null, 2))

    //     // Fetch tambahAnalysis data and filter by id_problem matching fid
    //     const analysisResponse = await axios.get('/api/smartandon/tambahAnalysis');
    //     const allAnalysis = analysisResponse.data;
    //     const filteredAnalysis = allAnalysis.filter(item => item.id_problem === problem.fid);

    //     // Mapping berdasarkan analisys_category "TERJADI" dan "LAMA"
    //     const terjadiAnalysis = filteredAnalysis.filter(item => item.analisys_category === 'TERJADI');
    //     const lamaAnalysis = filteredAnalysis.filter(item => item.analisys_category === 'LAMA');

    //     this.tambahAnalysisData = {
    //       terjadi: terjadiAnalysis,
    //       lama: lamaAnalysis,
    //     };
    //     console.log('Mapped tambahAnalysis data:', this.tambahAnalysisData);

    //     this.tambahAnalysisTerjadi = terjadiAnalysis;
    //     this.tambahAnalysisLama = lamaAnalysis;

    //     // Map option labels for O6, Shift, Problem Category, and Q6
    //     const o6Option = this.o6Options.find(opt => opt.id === this.submit.pilihO6)
    //     this.oCategoryName = o6Option ? o6Option.label : ''

    //     const shiftOption = this.shiftOptions.find(opt => opt.id === this.submit.shift)
    //     this.shiftName = shiftOption ? shiftOption.label : ''

    //     const problemCategoryOption = this.problemCategoryOptions.find(
    //       opt => opt.id === this.submit.problemCategory,
    //     )
    //     this.problemCategoryName = problemCategoryOption ? problemCategoryOption.label : ''

    //     const q6Option = this.q6Options.find(opt => opt.id === this.submit.qCategory)
    //     this.qCategoryName = q6Option ? q6Option.label : ''

    //     this.visibleLiveDemo = true
    //   } catch (error) {
    //     alert('Failed to load problem data: ' + error.message)
    //     console.error(error)
    //   } finally {
    //     this.modalLoading = false
    //     this.tableLoading = false
    //   }
    // },

    const initializeEditingStepRepair = (stepRepairArray) => {
      const editingState = {}
      stepRepairArray.forEach((item) => {
        editingState[item.id] = item.description.trim() === '' ? true : false
      })
      editingStepRepair.value = editingState
    }

    const tambahAnalysisList = ref([
      {
        id: 1,
        description: '',
        subItems: [],
      },
    ])

    const showTambahAnalysis = ref(false)

    const generateUniqueId = () => {
      const allIds = []
      const collectIds = (items) => {
        items.forEach((item) => {
          allIds.push(item.id)
          if (item.subItems && item.subItems.length > 0) {
            collectIds(item.subItems)
          }
        })
      }
      collectIds(tambahAnalysisList.value)
      return allIds.length > 0 ? Math.max(...allIds) + 1 : 1
    }

    const toggleTambahAnalysis = () => {
      showTambahAnalysis.value = !showTambahAnalysis.value
    }

    const addNewAnalysis = () => {
      const newId = generateUniqueId()
      tambahAnalysisList.value.push({
        id: newId,
        description: '',
        subItems: [],
      })
    }

    const addSubItem = (parentIndex) => {
      const newId = generateUniqueId()
      tambahAnalysisList.value[parentIndex].subItems.push({
        id: newId,
        description: '',
        subItems: [],
      })
    }

    const deleteItem = (index) => {
      tambahAnalysisList.value.splice(index, 1)
    }

    const treeModel = ref({
      id: 1,
      description: '',
      subItems: [],
    })

    watch(submitData, (newVal) => {
      if (
        newVal?.tambahAnalysisTerjadi &&
        typeof newVal.tambahAnalysisTerjadi === 'object'
      ) {
        treeModel.value = newVal.tambahAnalysisTerjadi
      } else {
        treeModel.value = {
          id: 1,
          description: '',
          subItems: [],
        }
      }

      let rootcausesArray = []
      if (
        Array.isArray(newVal?.rootcauses5Why) &&
        newVal.rootcauses5Why.length > 0
      ) {
        rootcausesArray = newVal.rootcauses5Why.map((item, index) => {
          if (typeof item === 'string') {
            console.log(`rootcauses5Why1[${index}] description:`, item)
            return { id: index + 1, description: item }
          } else if (item && typeof item.description === 'string') {
            console.log(
              `rootcauses5Why2[${index}] description:`,
              item.description,
            )
            return { id: index + 1, description: item.description }
          } else {
            console.log(`rootcauses5Why3[${index}] description: empty`)
            return { id: index + 1, description: '' }
          }
        })
      } else if (typeof newVal?.rootcauses5Why === 'string') {
        rootcausesArray = parseFrealProb(newVal.rootcauses5Why)
        rootcausesArray.forEach((item, index) => {
          console.log(
            `Parsed rootcauses5Why string[${index}] description:`,
            item.description,
          )
        })
      } else if (typeof newVal?.freal_prob === 'string') {
        rootcausesArray = parseFrealProb(newVal.freal_prob)
        rootcausesArray.forEach((item, index) => {
          console.log(
            `Parsed freal_prob[${index}] description:`,
            item.description,
          )
        })
      } else {
        rootcausesArray = [{ id: 1, description: '' }]
        console.log('rootcauses5Why empty: default empty')
      }

      let stepRepairArray = []
      if (Array.isArray(newVal?.stepRepair) && newVal.stepRepair.length > 0) {
        stepRepairArray = newVal.stepRepair.map((item, index) => {
          if (typeof item === 'string') {
            return { id: index + 1, description: item }
          } else if (item && typeof item.description === 'string') {
            return { id: index + 1, description: item.description }
          } else {
            return { id: index + 1, description: '' }
          }
        })
      } else if (typeof newVal?.stepRepair === 'string') {
        stepRepairArray = parseStepRepair(newVal.stepRepair)
      } else if (typeof newVal?.freal_prob === 'string') {
        stepRepairArray = parseStepRepair(newVal.fstep_repair)
      } else {
        stepRepairArray = [{ id: 1, description: '' }]
      }
      localSubmit.value = {
        ...(newVal || {}),
        rootcauses5Why: rootcausesArray,
        stepRepair: stepRepairArray,
      }
      initializeEditingRootcauses(rootcausesArray)
      initializeEditingStepRepair(stepRepairArray)
    })
    const onMachineInput = () => {
      console.log('Machine input changed:', localSubmit.value.machineName)
    }
    const handleSubmit = () => {
      validatedCustom01.value = true
      saveSubmit()
    }
    const formatDateTime = (dateTimeStr) => {
      if (!dateTimeStr) return ''
      const date = new Date(dateTimeStr)
      const pad = (n) => (n < 10 ? '0' + n : n)
      return (
        date.getFullYear() +
        '-' +
        pad(date.getMonth() + 1) +
        '-' +
        pad(date.getDate()) +
        ' ' +
        pad(date.getHours()) +
        ':' +
        pad(date.getMinutes()) +
        ':' +
        pad(date.getSeconds())
      )
    }
    const saveSubmit = () => {
      try {
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
        if (
          !localSubmit.value.operator ||
          localSubmit.value.operator.length === 0
        ) {
          alert('Please select at least one operator')
          return
        }
        if (!localSubmit.value.fidProblem) {
          alert('Please input fid')
          return
        }
        if (!localSubmit.value.agreeTerms) {
          alert('You must agree to terms and conditions before submitting')
          return
        }
        isSaving.value = true

        // Format date/time fields before submit
        const submitDataFormatted = {
          machineName: localSubmit.value.machineName ?? '',
          line: localSubmit.value.line ?? '',
          operationNo: localSubmit.value.operationNo ?? '',
          maker: localSubmit.value.maker ?? '',
          problems: localSubmit.value.problems ?? '',
          uraianKejadian: localSubmit.value.uraianKejadian ?? '',
          uploadImage: localSubmit.value.uploadImage ?? '',
          ilustrasiStandart: localSubmit.value.ilustrasiStandart ?? '',
          standartImage: localSubmit.value.standartImage ?? '',
          ilustrasiActual: localSubmit.value.ilustrasiActual ?? '',
          actualImage: localSubmit.value.actualImage ?? '',
          gapBetweenStandarAndActual:
            localSubmit.value.gapBetweenStandarAndActual ?? '',
          pilihFocusThemaMember: localSubmit.value.pilihFocusThemaMember ?? '',
          pilihTaskforce: localSubmit.value.pilihTaskforce ?? '',
          operator: localSubmit.value.operator ?? [],
          avCategory: localSubmit.value.avCategory ?? '',
          shift: localSubmit.value.shift ?? '',
          startDate: formatDateTime(localSubmit.value.startDate) ?? '',
          finishDate: formatDateTime(localSubmit.value.finishDate) ?? '',
          durationMin: localSubmit.value.durationMin ?? '',
          problemCategory: localSubmit.value.problemCategory ?? '',
          itemTemporaryAction: localSubmit.value.itemTemporaryAction ?? '',
          rootcauses5Why: localSubmit.value.rootcauses5Why ?? [],
          stepRepair: localSubmit.value.stepRepair ?? [],
          partChange: localSubmit.value.partChange ?? '',
          countermeasureKenapaTerjadi:
            localSubmit.value.countermeasureKenapaTerjadi ?? '',
          yokoten: localSubmit.value.yokoten ?? [],
          rootcause5WhyKenapaLama:
            localSubmit.value.rootcause5WhyKenapaLama ?? '',
          tambahAnalisisLama: localSubmit.value.tambahAnalisisLama ?? '',
          tambahAnalysisTerjadi: localSubmit.value.tambahAnalysisTerjadi ?? '',
          whyImage: localSubmit.value.whyImage ?? '',
          whyLamaImage: localSubmit.value.whyLamaImage ?? '',
          comments5WhySH: localSubmit.value.comments5WhySH ?? '',
          comments5WhyLH: localSubmit.value.comments5WhyLH ?? '',
          commentsCountermeasure:
            localSubmit.value.commentsCountermeasure ?? '',
          attachmentMeeting: localSubmit.value.attachmentMeeting ?? '',
          file_report: localSubmit.value.file_report ?? '',
          uploadFile: localSubmit.value.uploadFile ?? '',
          fidProblem: localSubmit.value.fidProblem ?? '',
          agreeTerms: localSubmit.value.agreeTerms ?? false,
          oCategory: localSubmit.value.oCategory ?? '',
          qCategory: localSubmit.value.qCategory ?? '',
        }

        console.log('Submit data:', submitDataFormatted)
        emit('submit', submitDataFormatted)
      } catch (error) {
        alert('Error during submit: ' + error.message)
        isSaving.value = false
      }
    }
    const shiftName = ref('')
    const oCategoryName = ref('')
    const qCategoryName = ref('')
    const problemCategoryName = ref('')
    watch(
      () => localSubmit.value.shift,
      (newShift) => {
        if (newShift === 'r') shiftName.value = 'Red'
        else if (newShift === 'w') shiftName.value = 'White'
        else shiftName.value = ''
      },
      { immediate: true },
    )
    watch(
      () => localSubmit.value.pilihO6,
      (newO6) => {
        console.log('O6 ini:', localSubmit.value.pilihO6)
        const o6Map = {
          1: 'O1: Design & Installation (Design / Installation Not Good (Refers to Function Check / Eng. Memo))',
          2: 'O2: Henkaten Issue (No Enough Trial, No Confirm (others team))',
          3: 'O3: PM Issue (No Have/Unclear, Unclear Methode, Confine/Invisible, Out of Periode, No Have Time, Lack of Skill)',
          4: 'O4: Symptom (No Have Symptom, Have Symptom but Unfollow Activity)',
          5: 'O5: Environment & 3rd Factor (Dirty, Confine Space, Invisible Area, Unpredictable (water leak / crush))',
          6: 'O6: Lifetime Issue (Out of Standard Running, Over Capacity)',
        }
        oCategoryName.value = o6Map[newO6] || ''
        console.log('O6 ini 1:', localSubmit.value.pilihO6)
      },
      { immediate: true },
    )
    watch(
      () => localSubmit.value.problemCategory,
      (newCategory) => {
        console.log(
          'Problem Category changed:',
          localSubmit.value.problemCategory,
        )
        const categoryMap = {
          1: 'Small',
          2: 'Chokotei',
          3: 'LTB',
        }
        problemCategoryName.value = categoryMap[newCategory] || ''
        console.log(
          'Problem Category changed 1:',
          localSubmit.value.problemCategory,
        )
      },
      { immediate: true },
    )
    watch(
      () => localSubmit.value.pilihQ6,
      (newQ6) => {
        console.log('Q6 ini:', localSubmit.value.pilihQ6)
        const q6Map = {
          1: 'Q1: Diagnose (Meeting, accuracy check (run-out, backlash, etc))',
          2: 'Q2: Sparepart (Part preparation, fabrication of part, repair of damage part due to unavailability at SPW)',
          3: 'Q3: Tool (Special tools preparation, change of tools, personal tool, change dresser, safety tool)',
          4: 'Q4: Maint. Ability (Repair, overhaul, part replace, tomoken, 5S)',
          5: 'Q5: Setting Ability (Quality checking, program adjustment, program zeroing, position memory set, autosizer setting & amp, PSW set, backlash adjustment (slide gib / kamisori, parameter set, centering, etc))',
          6: "Q6: Back-Up (Back-Up MC's Preparation, Back-Up MC's dandori)",
        }
        qCategoryName.value = q6Map[newQ6] || ' '
        console.log('Q6 ini 1:', localSubmit.value.pilihQ6)
      },
      { immediate: true },
    )
    console.log('ANJING 2: ' + localSubmit.value)
    console.log(
      'Local submit data 2:',
      JSON.stringify(localSubmit.value, null, 2),
    )
    const stopSaving = () => {
      isSaving.value = false
    }
    const editRootcause = (index) => {
      if (!Array.isArray(localSubmit.value.rootcauses5Why)) {
        console.error('editRootcause1: rootcauses5Why is not an array')
        return
      }
      const id = localSubmit.value.rootcauses5Why[index]?.id
      if (id === undefined) {
        console.error('editRootcause1: id is undefined for index', index)
        return
      }
      const currentState = editingRootcauses.value[id]
      if (!currentState || currentState === false) {
        // Enable edit mode
        editingRootcauses.value = {
          ...editingRootcauses.value,
          [id]: true,
        }
      } else if (currentState === true) {
        // Disable edit mode
        editingRootcauses.value = {
          ...editingRootcauses.value,
          [id]: false,
        }
      }
    }

    // Reset isSaving when modal is closed
    watch(
      () => props.visible,
      (newVal) => {
        if (!newVal) {
          isSaving.value = false
        }
      },
    )

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
      isSaving,
      stopSaving,
      editRootcause,
      tambahAnalysisList,
      showTambahAnalysis,
      toggleTambahAnalysis,
      addNewAnalysis,
      addSubItem,
      deleteItem,
      treeModel,
    }
  },
  methods: {
    onFileChange(event, field) {
      const file = event.target.files[0]
      if (file) {
        this.localSubmit[field] = file
      } else {
        this.localSubmit[field] = null
      }
    },
    downloadLastReportFile() {
      if (
        this.localSubmit.file_report &&
        this.localSubmit.fidProblem &&
        this.localSubmit.problems
      ) {
        let url = `${
          window.location.origin
        }/api/smartandon/download-report?fid=${encodeURIComponent(
          this.localSubmit.fidProblem,
        )}&problem=${encodeURIComponent(this.localSubmit.problems)}`
        console.log('Download URL:', url)
        const link = document.createElement('a')
        link.href = url

        const filename = this.localSubmit.file_report
          .substring(this.localSubmit.file_report.lastIndexOf('/') + 1)
          .split('?')[0]
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        alert(
          'No last report file or required parameters available to download.',
        )
      }
    },
    downloadTemplateFile() {
      if (this.localSubmit.fidProblem) {
        const url = `api/smartandon/download-template?fid=${encodeURIComponent(
          this.localSubmit.fidProblem,
        )}`
        window.open(url, '_blank')
      } else {
        alert(
          'No last report file or required parameters available to download.',
        )
      }
    },
    addRootcause() {
      if (!this.localSubmit.rootcauses5Why) {
        this.localSubmit.rootcauses5Why = []
      }
      if (this.localSubmit.rootcauses5Why.length < 5) {
        const newId = this.localSubmit.rootcauses5Why.length
          ? Math.max(
              ...this.localSubmit.rootcauses5Why.map((item) => item.id),
            ) + 1
          : 1
        this.localSubmit.rootcauses5Why.push({ id: newId, description: '' })
      }
    },
    editRootcause(index) {
      console.log('ANJING1')
      console.log('editRootcause called with index:', index)
      console.log(
        'localSubmit.rootcauses5Why:',
        this.localSubmit.rootcauses5Why,
      )
      if (!Array.isArray(this.localSubmit.rootcauses5Why)) {
        console.error('editRootcause2: rootcauses5Why is not an array')
        return
      }
      if (index < 0 || index >= this.localSubmit.rootcauses5Why.length) {
        console.error('editRootcause2: index out of bounds', index)
        return
      }
      const id = this.localSubmit.rootcauses5Why[index]?.id
      if (id === undefined) {
        console.error('editRootcause2: id is undefined for index', index)
        return
      }
      const currentState = this.editingRootcauses[id]
      if (!currentState || currentState === 'locked') {
        this.editingRootcauses = {
          ...this.editingRootcauses,
          [id]: true,
        }
      } else if (currentState === true) {
        this.editingRootcauses = {
          ...this.editingRootcauses,
          [id]: false,
        }
      }
    },
    deleteRootcause(index) {
      if (
        !this.localSubmit.rootcauses5Why ||
        !this.localSubmit.rootcauses5Why[index]
      ) {
        return
      }
      if (Array.isArray(this.localSubmit.rootcauses5Why)) {
        this.localSubmit.rootcauses5Why.splice(index, 1)
      } else {
        this.localSubmit.rootcauses5Why = []
      }
    },
    addStepRepair() {
      if (!this.localSubmit.stepRepair) {
        this.localSubmit.stepRepair = []
      }
      if (this.localSubmit.stepRepair.length < 5) {
        const newId = this.localSubmit.stepRepair.length
          ? Math.max(...this.localSubmit.stepRepair.map((item) => item.id)) + 1
          : 1
        this.localSubmit.stepRepair.push({ id: newId, description: '' })
      }
    },
    editStepRepair(index) {
      const id = this.localSubmit.stepRepair[index].id
      const currentState = this.editingStepRepair[id]
      if (!currentState || currentState === 'locked') {
        this.editingStepRepair = {
          ...this.editingStepRepair,
          [id]: true,
        }
      } else if (currentState === true) {
        this.editingStepRepair = {
          ...this.editingStepRepair,
          [id]: 'locked',
        }
      }
    },
    deleteStepRepair(index) {
      if (!this.localSubmit.stepRepair || !this.localSubmit.stepRepair[index]) {
        return
      }
      if (Array.isArray(this.localSubmit.stepRepair)) {
        this.localSubmit.stepRepair.splice(index, 1)
      } else {
        this.localSubmit.stepRepair = []
      }
    },
    toggleTambahAnalysis() {
      this.showTambahAnalysis = !this.showTambahAnalysis
    },
    addNewAnalysis() {
      const newId = this.tambahAnalysisList.length
        ? Math.max(...this.tambahAnalysisList.map((item) => item.id)) + 1
        : 1
      this.tambahAnalysisList.push({
        id: newId,
        description: '',
        subItems: [],
      })
    },
    addSubItem(parentIndex) {
      const newId = this.tambahAnalysisList[parentIndex].subItems.length
        ? Math.max(
            ...this.tambahAnalysisList[parentIndex].subItems.map(
              (item) => item.id,
            ),
          ) + 1
        : 1
      this.tambahAnalysisList[parentIndex].subItems.push({
        id: newId,
        description: '',
      })
    },
    editItem(index) {},
    deleteItem(index) {
      this.tambahAnalysisList.splice(index, 1)
    },
  },
}
</script>

<style scoped>
.analysis-list ul {
  list-style-type: none;
  padding-left: 20px;
}

.analysis-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
}

.analysis-item input[type='text'] {
  flex-grow: 1;
  margin-right: 10px;
  padding: 4px 8px;
  font-size: 14px;
}

.analysis-item .actions button {
  margin-left: 5px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.analysis-item .actions button:hover {
  color: #007bff;
}
</style>

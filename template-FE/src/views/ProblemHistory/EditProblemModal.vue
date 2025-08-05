<template>

  <CModal :visible="visible" @close="$emit('close')" fullscreen aria-labelledby="LiveDemoExampleLabel">
    <CModalHeader class="mb-3">
      <CModalTitle id="LiveDemoExampleLabel">Edit Problem</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <div v-if="modalLoading" style="text-align: center; padding: 40px 0">
        <CSpinner color="primary" style="width: 3rem; height: 3rem" />
        <div style="margin-top: 10px">Loading data...</div>
      </div>

      <CForm v-else class="row g-3 needs-validation" novalidate :validated="validatedCustom01"
        @submit="handleSubmitCustom01">
        <CRow class="mb-3">
          <CCol md="6">
            <label for="machineSelect" class="form-label">Machine Name</label>
            <Treeselect id="machineSelect" v-model="localSubmit.machineName" :options="machineOptions"
              :searchable="true" :clearable="true" :children="false" placeholder="Select or input machine"
              @input="onMachineInput" :value-consists-of="['id']" :value-key="'id'" :label-key="'label'" />
          </CCol>
          <CCol md="6">
            <label for="lineSelect" class="form-label">Line</label>
            <Treeselect id="lineSelect" v-model="localSubmit.line" :multiple="false" :flat="true" :options="lineOptions"
              :searchable="true" :clearable="true" placeholder="Select or input line" @input="onMachineInput"
              :value-consists-of="['id']" :value-key="'id'" :label-key="'label'" />
          </CCol>
        </CRow>
        <CRow class="mb-3">
          <CCol md="6">
            <CFormInput feedbackInvalid="Operation No." id="Problems" label="Operation No."
              placeholder="Not yet inputted" required disabled v-model="localSubmit.operationNo" />
          </CCol>
          <CCol md="6">
            <CFormInput feedbackInvalid="Maker" id="Problems" label="Maker" placeholder="Not yet inputted" required
              disabled v-model="localSubmit.maker" />
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CFormInput feedbackInvalid="Please input the problems" id="Problems" label="Problems"
              placeholder="Not yet inputted" required v-model="localSubmit.problems" />
          </CCol>
        </CRow>
        <CRow class="mb-3">
          <CCol md="8">
            <CFormInput feedbackInvalid="Please input the problems" id="Problems" label="Uraian Kejadian"
              placeholder="Not yet inputted" required v-model="localSubmit.uraianKejadian" />
          </CCol>
          <CCol md="4">
            <CFormInput type="file" feedbackInvalid="Please input the problems" id="Problems" label="Upload Image"
              required @change="onFileChange($event, 'uploadImage')" />
            <img :src="displayUploadImgImage" width="50" v-if="displayUploadImgImage" />
          </CCol>
        </CRow>
        <CRow class="mb-3">
          <CCol md="8">
            <CFormInput feedbackInvalid="Please input the problems" id="Problems" label="Ilustrasi Standart"
              placeholder="Not yet inputted" required v-model="localSubmit.ilustrasiStandart" />
          </CCol>
          <CCol md="4">
            <CFormInput type="file" feedbackInvalid="Please input the problems" id="Problems" label="Standart Image"
              required @change="onFileChange($event, 'standartImage')" />
            <img :src="displayStandardImage" width="50" v-if="displayStandardImage" />
          </CCol>
        </CRow>
        <CRow class="mb-3">
          <CCol md="8">
            <CFormInput feedbackInvalid="Please input the problems" id="Problems" label="Ilustrasi Actual"
              placeholder="Not yet inputted" required v-model="localSubmit.ilustrasiActual" />
          </CCol>
          <CCol md="4">
            <CFormInput type="file" feedbackInvalid="Please input the problems" id="Problems" label="Actual Image"
              required @change="onFileChange($event, 'actualImage')" />
            <img :src="displayActualImage" width="50" v-if="displayActualImage" />
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CFormInput feedbackInvalid="Please input the problems" id="Problems" label="Gap Between Standar and Actual"
              placeholder="Not yet inputted" required v-model="localSubmit.gapBetweenStandarAndActual" />
          </CCol>
        </CRow>
        <CRow class="mb-3">
          <CCol md="8">
            <CFormInput feedbackInvalid="Please input the problems" id="Problems" label="Pilih Focus Thema Member"
              placeholder="Not yet inputted" required v-model="localSubmit.pilihFocusThemaMember" />
          </CCol>
          <CCol md="4">
            <CFormInput feedbackInvalid="Please input the problems" id="Problems" label="Pilih Taskforce"
              placeholder="Not yet inputted" required v-model="localSubmit.pilihTaskforce" />
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <label for="operatorSelect" class="form-label">Operator</label>
            <Treeselect id="operatorSelect" v-model="localSubmit.operator" :multiple="true" :flat="true"
              :options="memberOption" :searchable="true" :clearable="true" placeholder="Select or input member"
              @input="onMachineInput" :value-consists-of="['id']" :value-key="'id'" :label-key="'label'" />
          </CCol>
        </CRow>
        <CRow class="mb-3">
          <CCol md="6">
            <CFormSelect aria-describedby="avCategory" feedbackInvalid="Please select the AV Category."
              id="avCategorySelect" label="AV Category" required v-model="localSubmit.avCategory">
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
            <CFormSelect aria-describedby="shift" feedbackInvalid="Please select the shift." id="shiftSelect"
              label="Shift" required v-model="localSubmit.shift">
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
              <CInputGroupText id="basic-addon1">
                <CIcon icon="cilClock" size="l" />
              </CInputGroupText>
              <CFormInput id="startDateModal" type="datetime-local" required v-model="localSubmit.startDate"
                aria-label="Start Date" aria-describedby="basic-addon1" />
            </CInputGroup>
          </CCol>
          <CCol md="6">
            <label for="finishDateModal" class="form-label">Finish Date</label>
            <CInputGroup>
              <CInputGroupText id="basic-addon2">
                <CIcon icon="cilClock" size="l" />
              </CInputGroupText>
              <CFormInput id="finishDateModal" type="datetime-local" required v-model="localSubmit.finishDate"
                aria-label="Finish Date" aria-describedby="basic-addon2" />
            </CInputGroup>
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CFormInput feedbackInvalid="Please input the problems" id="Problems" label="Duration (min)"
              placeholder="Not yet inputted" required v-model="localSubmit.durationMin" />
          </CCol>
        </CRow>

        <CRow md="12" class="mb-3">
          <CCol>
            <CFormSelect aria-describedby="problemCategory" feedbackInvalid="Please select the problem category."
              id="problemCategorySelect" label="Problem Category:" required v-model="localSubmit.problemCategory">
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
            <CFormInput feedbackInvalid="Please input the problems" id="Problems" label="Item Temporary Action"
              placeholder="Not yet inputted" required v-model="localSubmit.itemTemporaryAction" />
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
                  <CTableHeaderCell style="width: 120px">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="(item, index) in localSubmit.rootcauses5Why" :key="item.id">
                  <CTableDataCell>{{ index + 1 }}</CTableDataCell>
                  <CTableDataCell>
                    <CFormInput type="text" v-model="item.description" placeholder="Enter description" :disabled="editingRootcauses?.[item.id] === 'locked' ||
                      !editingRootcauses?.[item.id]
                      " />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="primary" size="sm" class="me-2" @click="editRootcause(index)">
                      <CIcon :icon="editingRootcauses?.[item.id]
                        ? 'cil-paper-plane'
                        : 'cil-pencil'
                        " />
                    </CButton>
                    <CButton color="danger" size="sm" @click="deleteRootcause(index)">
                      <CIcon icon="cil-trash" />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
            <CButton color="success" size="sm" class="mt-2" style="color: white" @click="addRootcause"
              v-if="localSubmit.rootcauses5Why.length < 5">
              Add Rootcause
            </CButton>
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <label class="form-label">Tambah Analysis TERJADI</label>
            <CButton color="primary" sm="12" class="mb-3" style="color: white; width: 100%"
              @click="toggleTambahAnalysis">
              Tambah Analysis TERJADI
            </CButton>
            <div v-if="showTambahAnalysis" class="analysis-list">
              <TreeList :model="treeModel || { id: 1, description: '', subItems: [] }"
                @update:model="(val) => (treeModel = val)" />
            </div>
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CFormInput type="file" feedbackInvalid="Please input the problems" id="Problems"
              label="5 Why (Kenapa Terjadi) Image" required @change="onFileChange($event, 'whyImage')" />
            <img :src="displayImg_problem" width="200" style="cursor: pointer;" v-if="displayImg_problem"
              @click="showFullSizeImage = true" />
            <CModal :visible="showFullSizeImage" @update:visible="val => showFullSizeImage = val"
              @close="showFullSizeImage = false" size="lg" aria-labelledby="fullSizeImageLabel" centered>
              <CModalHeader>
                <CModalTitle id="fullSizeImageLabel">5 Why Image Preview</CModalTitle>
              </CModalHeader>

              <CModalBody style="text-align: center;">
                <img :src="displayImg_problem" style="max-width: 100%; max-height: 80vh;" />
              </CModalBody>

              <CModalFooter>
                <CButton color="secondary" size="sm" @click="showFullSizeImage = false">Close</CButton>
              </CModalFooter>

            </CModal>
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CFormInput type="file" feedbackInvalid="Please input the problems" id="Problems"
              label="5 Why (Kenapa lama) Image" required @change="onFileChange($event, 'whyLamaImage')" />
            <img :src="displayWhyLamaImage" width="50" v-if="displayWhyLamaImage" />
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CFormSelect aria-describedby="O6 Category" feedbackInvalid="Please select the O6 Category."
              id="o6CategorySelect" label="O6 Category:" required v-model="localSubmit.oCategory">
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
                  <CTableHeaderCell style="width: 120px">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="(item, index) in localSubmit.stepRepair" :key="item.id">
                  <CTableDataCell>{{ index + 1 }}</CTableDataCell>
                  <CTableDataCell>
                    <CFormInput type="text" v-model="item.description" placeholder="Enter description" :disabled="!editingStepRepair || !editingStepRepair[item.id]
                      " />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="primary" size="sm" class="me-2" @click="editStepRepair(index)">
                      <CIcon :icon="editingStepRepair &&
                        editingStepRepair[localSubmit.stepRepair[index].id] === true
                        ? 'cil-paper-plane'
                        : 'cil-pencil'
                        " />
                    </CButton>
                    <CButton color="danger" size="sm" @click="deleteStepRepair(index)">
                      <CIcon icon="cil-trash" />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
            <CButton color="success" size="sm" class="mt-2" style="color: white" @click="addStepRepair"
              v-if="localSubmit.stepRepair.length < 5">
              Add Step Repair
            </CButton>
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CFormInput feedbackInvalid="Please input the problems" id="Problems" label="Part Change"
              placeholder="Not yet inputted" required v-model="localSubmit.partChange" />
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <label class="form-label">Yokoten</label>
            <div v-if="yokotenList.length === 0">
              <CButton color="primary" @click="showYokotenForm = true">Tambah Yokoten</CButton>
            </div>
            <div v-if="showYokotenForm" class="d-flex align-items-center mb-2">
              <CFormInput v-model="yokotenForm.machine" placeholder="Yokoten Item" class="me-2" />
              <CFormSelect v-model="yokotenForm.pic" class="me-2">
                <option value="">PIC</option>
                <option v-for="pic in picOptions" :key="pic.value" :value="pic.value">
                  {{ pic.label }}
                </option>
              </CFormSelect>
              <CFormInput type="date" v-model="yokotenForm.datePlan" class="me-2" />
              <CFormSelect v-model="yokotenForm.judg" class="me-2">
                <option :value="false">Belum</option>
                <option :value="true">Sudah</option>
              </CFormSelect>
              <CButton color="success" class="me-2" @click="submitYokoten">Submit</CButton>
              <CButton color="secondary" @click="cancelYokoten">Cancel</CButton>
            </div>
            <div v-if="yokotenList.length > 0">
              <CTable bordered>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Item Yokoten</CTableHeaderCell>
                    <CTableHeaderCell>PIC</CTableHeaderCell>
                    <CTableHeaderCell>Plan Date</CTableHeaderCell>
                    <CTableHeaderCell>Judge</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow v-for="(item, idx) in yokotenList" :key="idx">
                    <CTableDataCell>{{ item.machine }}</CTableDataCell>
                    <CTableDataCell>{{
                      picOptions.find(
                        (opt) => String(opt.value) === String(item.pic),
                      )?.label || item.pic
                    }}</CTableDataCell>
                    <CTableDataCell>{{ item.datePlan }}</CTableDataCell>
                    <CTableDataCell>{{
                      item.judg ? 'Sudah' : 'Belum'
                    }}</CTableDataCell>
                    <CTableDataCell>
                      <CButton color="warning" size="sm" class="me-2" @click="editYokoten(idx)">Edit</CButton>
                      <CButton color="danger" size="sm" @click="removeYokoten(idx)">Remove</CButton>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
              <CButton color="primary" class="mt-2" @click="showYokotenForm = true">Tambah Yokoten</CButton>
            </div>
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3 mt-3">
          <CCol>
            <label class="form-label">Countermeasure (kenapa terjadi)</label>
            <div v-if="countermeasureKenapaTerjadiList.length === 0">
              <CButton color="primary" @click="showCountermeasureKenapaTerjadiForm = true">Tambah Countermeasure
              </CButton>
            </div>
            <div v-if="showCountermeasureKenapaTerjadiForm" class="d-flex align-items-center mb-2">
              <CFormCheck v-model="countermeasureKenapaTerjadiForm.isAction" label="Ini Action?" class="me-2" />
              <CFormInput v-model="countermeasureKenapaTerjadiForm.cmDesc" placeholder="Countermeasure/Action"
                class="me-2" />
              <CFormInput type="date" v-model="countermeasureKenapaTerjadiForm.datePlan" class="me-2" />
              <CFormSelect v-model="countermeasureKenapaTerjadiForm.category" class="me-2">
                <option value="">C/M Category</option>
                <option value="Improvement">Improvement</option>
                <option value="Training">Training</option>
                <option value="Revisi TPM">Revisi TPM</option>
                <option value="Sparepart">Sparepart</option>
              </CFormSelect>
              <CFormSelect v-model="countermeasureKenapaTerjadiForm.pic" class="me-2">
                <option value="">PIC</option>
                <option v-for="pic in picOptions" :key="pic.value" :value="pic.value">
                  {{ pic.label }}
                </option>
              </CFormSelect>
              <CFormSelect v-if="
                typeof countermeasureKenapaTerjadiForm._editIdx === 'number'
              " v-model="countermeasureKenapaTerjadiForm.judg" class="me-2">
                <option value="belum">Belum</option>
                <option value="sudah">Sudah</option>
              </CFormSelect>
              <CFormTextarea v-if="
                typeof countermeasureKenapaTerjadiForm._editIdx === 'number'
              " v-model="countermeasureKenapaTerjadiForm.result" placeholder="Result Notes" class="me-2" rows="2" />
              <CButton color="success" class="me-2" @click="submitCountermeasureKenapaTerjadi">
                Submit
              </CButton>
              <CButton color="secondary" @click="cancelCountermeasureKenapaTerjadi">
                Cancel
              </CButton>
            </div>
            <div v-if="countermeasureKenapaTerjadiList.length > 0">
              <CTable bordered>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Action?</CTableHeaderCell>
                    <CTableHeaderCell>Countermeasure/Action</CTableHeaderCell>
                    <CTableHeaderCell>Plan Date</CTableHeaderCell>
                    <CTableHeaderCell>C/M Category</CTableHeaderCell>
                    <CTableHeaderCell>PIC</CTableHeaderCell>
                    <CTableHeaderCell>Judge</CTableHeaderCell>
                    <CTableHeaderCell>Result Notes</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow v-for="(item, idx) in countermeasureKenapaTerjadiList" :key="idx">
                    <CTableDataCell>{{
                      item.isAction ? 'Ya' : 'Tidak'
                    }}</CTableDataCell>
                    <CTableDataCell>{{ item.cmDesc }}</CTableDataCell>
                    <CTableDataCell>{{ item.datePlan }}</CTableDataCell>
                    <CTableDataCell>{{ item.category }}</CTableDataCell>
                    <CTableDataCell>{{
                      picOptions.find(
                        (opt) => String(opt.value) === String(item.pic),
                      )?.label || item.pic
                    }}</CTableDataCell>
                    <CTableDataCell>
                      <CFormSelect v-model="item.judg" disabled>
                        <option value="belum">Belum</option>
                        <option value="sudah">Sudah</option>
                      </CFormSelect>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CFormTextarea v-model="item.result" disabled rows="2" />
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton color="warning" size="sm" class="me-2" @click="editCountermeasureKenapaTerjadi(idx)">Edit
                      </CButton>
                      <CButton color="danger" size="sm" @click="removeCountermeasureKenapaTerjadi(idx)">Remove</CButton>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
              <CButton color="primary" class="mt-2" @click="showCountermeasureKenapaTerjadiForm = true">Tambah
                Countermeasure</CButton>
            </div>
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <label class="form-label">Countermeasure (kenapa Lama)</label>
            <div v-if="countermeasureKenapaLamaList.length === 0">
              <CButton color="primary" @click="showCountermeasureKenapaLamaForm = true">Tambah Countermeasure</CButton>
            </div>
            <div v-if="showCountermeasureKenapaLamaForm" class="d-flex align-items-center mb-2">
              <CFormCheck v-model="countermeasureKenapaLamaForm.isAction" label="Ini Action?" class="me-2" />
              <CFormInput v-model="countermeasureKenapaLamaForm.cmDesc" placeholder="Countermeasure/Action"
                class="me-2" />
              <CFormInput type="date" v-model="countermeasureKenapaLamaForm.datePlan" class="me-2" />
              <CFormSelect v-model="countermeasureKenapaLamaForm.category" class="me-2">
                <option value="">C/M Category</option>
                <option value="Improvement">Improvement</option>
                <option value="Training">Training</option>
                <option value="Revisi TPM">Revisi TPM</option>
                <option value="Sparepart">Sparepart</option>
              </CFormSelect>
              <CFormSelect v-model="countermeasureKenapaLamaForm.pic" class="me-2">
                <option value="">PIC</option>
                <option v-for="pic in picOptions" :key="pic.value" :value="pic.value">
                  {{ pic.label }}
                </option>
              </CFormSelect>
              <CFormSelect v-if="typeof countermeasureKenapaLamaForm._editIdx === 'number'"
                v-model="countermeasureKenapaLamaForm.judg" class="me-2">
                <option value="belum">Belum</option>
                <option value="sudah">Sudah</option>
              </CFormSelect>
              <CFormTextarea v-if="typeof countermeasureKenapaLamaForm._editIdx === 'number'"
                v-model="countermeasureKenapaLamaForm.result" placeholder="Result Notes" class="me-2" rows="2" />
              <CButton color="success" class="me-2" @click="submitCountermeasureKenapaLama">Submit</CButton>
              <CButton color="secondary" @click="cancelCountermeasureKenapaLama">Cancel</CButton>
            </div>
            <div v-if="countermeasureKenapaLamaList.length > 0">
              <CTable bordered>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Action?</CTableHeaderCell>
                    <CTableHeaderCell>Countermeasure/Action</CTableHeaderCell>
                    <CTableHeaderCell>Plan Date</CTableHeaderCell>
                    <CTableHeaderCell>C/M Category</CTableHeaderCell>
                    <CTableHeaderCell>PIC</CTableHeaderCell>
                    <CTableHeaderCell>Judge</CTableHeaderCell>
                    <CTableHeaderCell>Result Notes</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow v-for="(item, idx) in countermeasureKenapaLamaList" :key="idx">
                    <CTableDataCell>{{
                      item.isAction ? 'Ya' : 'Tidak'
                    }}</CTableDataCell>
                    <CTableDataCell>{{ item.cmDesc }}</CTableDataCell>
                    <CTableDataCell>{{ item.datePlan }}</CTableDataCell>
                    <CTableDataCell>{{ item.category }}</CTableDataCell>
                    <CTableDataCell>{{
                      picOptions.find(
                        (opt) => String(opt.value) === String(item.pic),
                      )?.label || item.pic
                    }}</CTableDataCell>
                    <CTableDataCell>
                      <CFormSelect v-model="item.judg" disabled>
                        <option value="belum">Belum</option>
                        <option value="sudah">Sudah</option>
                      </CFormSelect>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CFormTextarea v-model="item.result" disabled rows="2" />
                    </CTableDataCell>
                    <CTableDataCell>
                      <CButton color="warning" size="sm" class="me-2" @click="editCountermeasureKenapaLama(idx)">Edit
                      </CButton>
                      <CButton color="danger" size="sm" @click="removeCountermeasureKenapaLama(idx)">Remove</CButton>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
              <CButton color="primary" class="mt-2" @click="showCountermeasureKenapaLamaForm = true">Tambah
                Countermeasure</CButton>
            </div>
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <LegendStatus class="mb-4" />
          </CCol>

          <CCard class="mt-3 custom-card">
            <CCardBody>
              <CRow>
                <CCol>
                  <h5>Approval Status 5 Why</h5>
                  <CRow class="text-center mb-3">
                    <CCol>
                      <CButton size="sm" color="success" @click="onApprove('5why', 'tl')">Approve</CButton>
                      <CButton size="sm" color="info" class="ms-2" @click="onComment('5why', 'tl')">Comment</CButton>
                    </CCol>
                  </CRow>
                  <CRow class="bg-black text-white fw-bold text-center py-2">
                    <CCol>GL Check</CCol>
                    <CCol>SH Check</CCol>
                  </CRow>
                  <CRow class="text-center py-3">
                    <CCol>
                      <span class="status-circle" :class="statusClass(localSubmit?.fiveWhyLhApprove)" />
                    </CCol>
                    <CCol>
                      <span class="status-circle" :class="statusClass(localSubmit?.fiveWhyShApprove)" />
                    </CCol>
                  </CRow>
                  <h5 class="mt-4">Approval Status Countermeasure</h5>
                  <CRow class="text-center mb-3">
                    <CCol>
                      <CButton size="sm" color="success" @click="onApprove('counter', 'tl')">Approve</CButton>
                      <CButton size="sm" color="info" class="ms-2" @click="onComment('counter', 'tl')">Comment</CButton>
                    </CCol>
                  </CRow>
                  <CRow class="bg-black text-white fw-bold text-center py-2">
                    <CCol>TL Check</CCol>
                    <CCol>GL Check</CCol>
                    <CCol>SH Check</CCol>
                  </CRow>
                  <CRow class="text-center py-3">
                    <CCol>
                      <span class="status-circle" :class="statusClass(localSubmit?.cmTlApprove)" />
                    </CCol>
                    <CCol>
                      <span class="status-circle" :class="statusClass(localSubmit?.cmLhApprove)" />
                    </CCol>
                    <CCol>
                      <span class="status-circle" :class="statusClass(localSubmit?.cmShApprove)" />
                    </CCol>
                  </CRow>

                  <h5 class="mt-4">Approval Status Departement Head</h5>
                  <CRow class="bg-black text-white fw-bold text-center py-2">
                    <CCol>DPH Check</CCol>
                  </CRow>
                  <CRow class="justify-content-center text-center py-3 mb-4">
                    <CCol xs="auto">
                      <span class="status-circle" :class="statusClass(localSubmit?.cmDhApprove)" />
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>

        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CCol md="12">
              <label class="form-label">Last Report File</label>
            </CCol>
            <CCol md="12">
              <CButton style="width: 100%" :color="localSubmit.file_report ? 'primary' : 'secondary'"
                @click="downloadLastReportFile" :disabled="!localSubmit.file_report" v-if="localSubmit.file_report">
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
              <CButton style="width: 100%" :color="'secondary'" @click="downloadTemplateFile">
                Download Template
              </CButton>
            </CCol>
          </CCol>
        </CRow>
        <CRow md="12" class="mb-3">
          <CCol>
            <CFormInput type="file" feedbackInvalid="Please input the problems" id="Problems" label="Upload Report"
              required @change="onFileChange($event, 'uploadFile')" />
          </CCol>
        </CRow>
        <CRow xs="12" class="mb-3">
          <CCol>
            <CFormCheck feedbackInvalid="You must agree before submitting." id="invalidCheck"
              label="Agree to terms and conditions" required type="checkbox" v-model="localSubmit.agreeTerms" />
          </CCol>
        </CRow>
      </CForm>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="$emit('close')"> Close </CButton>

      <CButton color="primary" @click="saveSubmit" :disabled="isSaving">
        <span v-if="isSaving">
          <CSpinner size="sm" /> Saving...
        </span>
        <span v-else> Submit </span>
      </CButton>
    </CModalFooter>
  </CModal>
</template>

<script>
import { ref, watch, toRefs, onMounted } from 'vue'
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
import LegendStatus from '@/views/ProblemHistory/components/LegendStatus.vue'
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
    LegendStatus,
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
      console.log('Initializing editingStepRepair with:', stepRepairArray)
      const editingState = {}
      stepRepairArray.forEach((item) => {
        editingState[item.id] = item.description.trim() === '' ? true : false
      })
      console.log('Editing state for step repair:', editingState)
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
      console.log('newVal.stepRepair:', newVal?.stepRepair)
      console.log('TYPE OF newVal.stepRepair:', typeof newVal?.stepRepair)

      if (Array.isArray(newVal?.stepRepair) && newVal.stepRepair.length > 0) {
        stepRepairArray = newVal.stepRepair.map((item, index) => {
          if (typeof item === 'string') {
            return { id: index + 1, description: item }
          } else if (item && typeof item.description === 'string') {
            return { id: item.id || index + 1, description: item.description }
          } else {
            return { id: index + 1, description: '' }
          }
        })
        console.log('stepRepair from array:', stepRepairArray)
      } else if (typeof newVal?.stepRepair === 'string') {
        try {
          const parsed = JSON.parse(newVal.stepRepair)
          if (Array.isArray(parsed)) {
            stepRepairArray = parsed.map((item, index) => {
              if (typeof item === 'string') {
                return { id: index + 1, description: item }
              } else if (item && typeof item.description === 'string') {
                return {
                  id: item.id || index + 1,
                  description: item.description,
                }
              } else {
                return { id: index + 1, description: '' }
              }
            })
            console.log('Parsed stepRepair from JSON:', stepRepairArray)
          } else {
            stepRepairArray = parseStepRepair(newVal.stepRepair)
            console.log('Parsed stepRepair as string:', stepRepairArray)
          }
        } catch (e) {
          stepRepairArray = parseStepRepair(newVal.stepRepair)
          console.log('Parsed stepRepair from fallback:', stepRepairArray)
        }
      } else if (typeof newVal?.fstep_repair === 'string') {
        stepRepairArray = parseStepRepair(newVal.fstep_repair)
        console.log('Parsed stepRepair from fstep_repair:', stepRepairArray)
      } else {
        stepRepairArray = [{ id: 1, description: '' }]
        console.log('Default stepRepair array:', stepRepairArray)
      }
      localSubmit.value = {
        ...(newVal || {}),
        rootcauses5Why: rootcausesArray,
        stepRepair: stepRepairArray,
        fiveWhyLhApprove: newVal.fiveWhyLhApprove,
        fiveWhyShApprove: newVal.fiveWhyShApprove,
        fiveWhyLhFeedback: newVal.fiveWhyLhFeedback,
        fiveWhyShFeedback: newVal.fiveWhyShFeedback,
        cmLhApprove: newVal.cmLhApprove,
        cmShApprove: newVal.cmShApprove,
        cmTlApprove: newVal.cmTlApprove,
        cmDhApprove: newVal.cmDhApprove,
        cmLhFeedback: newVal.cmLhFeedback,
        cmShFeedback: newVal.cmShFeedback,
        cmTlFeedback: newVal.cmTlFeedback,
        cmDhFeedback: newVal.cmDhFeedback,
      }

      console.log(
        'Updated localSubmit:',
        JSON.stringify(localSubmit.value, null, 2),
      )
      console.log(
        'IS ARRAY COUNTERMEASURE KENAPA TERJADI:',
        Array.isArray(newVal.countermeasureKenapaTerjadi),
      )

      console.log(
        'IS ARRAY COUNTERMEASURE KENAPA LAMA:',
        Array.isArray(newVal.countermeasureKenapaLama),
      )
      initializeEditingRootcauses(rootcausesArray)
      initializeEditingStepRepair(stepRepairArray)
      countermeasureKenapaTerjadiList.value = Array.isArray(
        newVal.countermeasureKenapaTerjadi,
      )
        ? newVal.countermeasureKenapaTerjadi
        : typeof newVal.countermeasureKenapaTerjadi === 'string' &&
          newVal.countermeasureKenapaTerjadi
          ? JSON.parse(newVal.countermeasureKenapaTerjadi)
          : []
      countermeasureKenapaLamaList.value = Array.isArray(
        newVal.countermeasureKenapaLama,
      )
        ? newVal.countermeasureKenapaLama
        : typeof newVal.countermeasureKenapaLama === 'string' &&
          newVal.countermeasureKenapaLama
          ? JSON.parse(newVal.countermeasureKenapaLama)
          : []
      yokotenList.value = Array.isArray(submitData.value?.yokoten)
        ? submitData.value.yokoten
        : typeof submitData.value?.yokoten === 'string' &&
          submitData.value.yokoten
          ? JSON.parse(submitData.value.yokoten)
          : []
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

        localSubmit.value.countermeasureKenapaTerjadiList =
          countermeasureKenapaTerjadiList.value
        localSubmit.value.countermeasureKenapaLamaList =
          countermeasureKenapaLamaList.value
        localSubmit.value.yokotenList = yokotenList.value
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
          yokoten: localSubmit.value.yokotenList ?? [],
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
          cmKenapaLama: localSubmit.value.countermeasureKenapaLamaList ?? [],
          cmKenapaTerjadi:
            localSubmit.value.countermeasureKenapaTerjadiList ?? [],
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
          2: 'Repeat',
          3: 'LTR',
          4: 'SLTR'
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
    console.log('Local submit data: ' + localSubmit.value)
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
        editingRootcauses.value = {
          ...editingRootcauses.value,
          [id]: true,
        }
      } else if (currentState === true) {
        editingRootcauses.value = {
          ...editingRootcauses.value,
          [id]: false,
        }
      }
    }

    watch(
      () => props.visible,
      (newVal) => {
        if (!newVal) {
          isSaving.value = false
        }
      },
    )

    watch(
      localSubmit,
      (val) => {
        console.log('localSubmit changed:', val)
      },
      { deep: true },
    )

    const countermeasureKenapaTerjadiList = ref([])
    const showCountermeasureKenapaTerjadiForm = ref(false)
    const countermeasureKenapaTerjadiForm = ref({
      isAction: false,
      cmDesc: '',
      datePlan: '',
      category: '',
      pic: '',
      result: '',
      judg: 'belum',
    })
    const yokotenForm = ref({
      machine: '',
      pic: '',
      datePlan: '',
      judg: false,
    })
    const yokotenList = ref([])
    const showYokotenForm = ref(false)

    const submitYokoten = () => {
      if (typeof yokotenForm.value._editIdx === 'number') {
        yokotenList.value[yokotenForm.value._editIdx] = { ...yokotenForm.value }
        delete yokotenForm.value._editIdx
      } else {
        yokotenList.value.push({ ...yokotenForm.value })
      }
      showYokotenForm.value = false
      yokotenForm.value = { machine: '', pic: '', datePlan: '', judg: false }
    }

    const editYokoten = (idx) => {
      const item = yokotenList.value[idx]
      if (item) {
        yokotenForm.value = { ...item }
        showYokotenForm.value = true
        yokotenForm.value._editIdx = idx
      }
    }

    const removeYokoten = (idx) => {
      yokotenList.value.splice(idx, 1)
    }

    const cancelYokoten = () => {
      showYokotenForm.value = false
      yokotenForm.value = { machine: '', pic: '', datePlan: '', judg: false }
    }

    const submitCountermeasureKenapaTerjadi = () => {
      if (typeof countermeasureKenapaTerjadiForm.value._editIdx === 'number') {
        countermeasureKenapaTerjadiList.value[
          countermeasureKenapaTerjadiForm.value._editIdx
        ] = {
          ...countermeasureKenapaTerjadiForm.value,
        }
        delete countermeasureKenapaTerjadiForm.value._editIdx
      } else {
        countermeasureKenapaTerjadiList.value.push({
          ...countermeasureKenapaTerjadiForm.value,
        })
      }
      showCountermeasureKenapaTerjadiForm.value = false
      countermeasureKenapaTerjadiForm.value = {
        isAction: false,
        cmDesc: '',
        datePlan: '',
        category: '',
        pic: '',
        result: '',
        judg: 'belum',
      }
    }
    const cancelCountermeasureKenapaTerjadi = () => {
      showCountermeasureKenapaTerjadiForm.value = false
      countermeasureKenapaTerjadiForm.value = {
        isAction: false,
        cmDesc: '',
        datePlan: '',
        category: '',
        pic: '',
        result: '',
        judg: 'belum',
      }
    }
    const editCountermeasureKenapaTerjadi = (idx) => {
      const item = countermeasureKenapaTerjadiList.value[idx]
      if (item) {
        countermeasureKenapaTerjadiForm.value = { ...item }
        showCountermeasureKenapaTerjadiForm.value = true
        countermeasureKenapaTerjadiForm.value._editIdx = idx
      }
    }
    const removeCountermeasureKenapaTerjadi = (idx) => {
      countermeasureKenapaTerjadiList.value.splice(idx, 1)
    }
    watch(
      () => countermeasureKenapaTerjadiForm.value.isAction,
      (val) => {
        if (val) {
          countermeasureKenapaTerjadiForm.value.cmDesc = '[ACTION]'
        } else {
          countermeasureKenapaTerjadiForm.value.cmDesc = ''
        }
      },
    )

    const countermeasureKenapaLamaList = ref([])
    const showCountermeasureKenapaLamaForm = ref(false)
    const countermeasureKenapaLamaForm = ref({
      isAction: false,
      cmDesc: '',
      datePlan: '',
      category: '',
      pic: '',
      judge: 'belum',
    })
    const submitCountermeasureKenapaLama = () => {
      if (typeof countermeasureKenapaLamaForm.value._editIdx === 'number') {
        countermeasureKenapaLamaList.value[
          countermeasureKenapaLamaForm.value._editIdx
        ] = {
          ...countermeasureKenapaLamaForm.value,
        }
        delete countermeasureKenapaLamaForm.value._editIdx
      } else {
        countermeasureKenapaLamaList.value.push({
          ...countermeasureKenapaLamaForm.value,
        })
      }
      showCountermeasureKenapaLamaForm.value = false
      countermeasureKenapaLamaForm.value = {
        isAction: false,
        cmDesc: '',
        datePlan: '',
        category: '',
        pic: '',
        judge: 'belum',
      }
    }

    const editStepRepair = (index) => {
      console.log('editStepRepair called with index:', index)
      console.log('localSubmit.stepRepair:', localSubmit.value.stepRepair)
      if (
        !localSubmit.value.stepRepair ||
        !Array.isArray(localSubmit.value.stepRepair)
      ) {
        console.error(
          'editStepRepair: stepRepair is not an array or is undefined',
        )
        return
      }
      if (index < 0 || index >= localSubmit.value.stepRepair.length) {
        console.error('editStepRepair: index out of bounds', index)
        return
      }
      const item = localSubmit.value.stepRepair[index]
      if (!item || typeof item.id === 'undefined') {
        console.error(
          'editStepRepair: item or item.id is undefined for index',
          index,
        )
        return
      }
      const id = item.id
      console.log('editStepRepair id:', id)
      console.log('editingStepRepair:', editingStepRepair.value)
      const currentState = editingStepRepair.value[id]
      if (!currentState || currentState === false) {
        editingStepRepair.value = {
          ...editingStepRepair.value,
          [id]: true,
        }
      } else if (currentState === true) {
        editingStepRepair.value = {
          ...editingStepRepair.value,
          [id]: false,
        }
      }
    }

    const cancelCountermeasureKenapaLama = () => {
      showCountermeasureKenapaLamaForm.value = false
      countermeasureKenapaLamaForm.value = {
        isAction: false,
        cmDesc: '',
        datePlan: '',
        category: '',
        pic: '',
        judge: 'belum',
      }
    }
    const editCountermeasureKenapaLama = (idx) => {
      const item = countermeasureKenapaLamaList.value[idx]
      if (item) {
        countermeasureKenapaLamaForm.value = { ...item }
        showCountermeasureKenapaLamaForm.value = true
        countermeasureKenapaLamaForm.value._editIdx = idx
      }
    }
    const removeCountermeasureKenapaLama = (idx) => {
      countermeasureKenapaLamaList.value.splice(idx, 1)
    }
    watch(
      () => countermeasureKenapaLamaForm.value.isAction,
      (val) => {
        if (val) {
          countermeasureKenapaLamaForm.value.action = '[ACTION]'
        } else {
          countermeasureKenapaLamaForm.value.action = ''
        }
      },
    )

    const picOptions = ref([])
    onMounted(async () => {
      try {
        const res = await fetch('/api/smartandon/member')
        const data = await res.json()
        console.log('PIC options data:', data)
        picOptions.value = Array.isArray(data)
          ? data.map((m) => ({
            value: String(m.fid) || m.name,
            label: m.fname,
          }))
          : []
      } catch (e) {
        picOptions.value = []
      }
    })

    const addRootcause = () => {
      if (!localSubmit.value.rootcauses5Why) {
        localSubmit.value.rootcauses5Why = []
      }
      if (localSubmit.value.rootcauses5Why.length < 5) {
        const newId = localSubmit.value.rootcauses5Why.length
          ? Math.max(
            ...localSubmit.value.rootcauses5Why.map((item) => item.id),
          ) + 1
          : 1
        localSubmit.value.rootcauses5Why.push({ id: newId, description: '' })
      }
    }

    const deleteRootcause = (index) => {
      if (
        !localSubmit.value.rootcauses5Why ||
        !localSubmit.value.rootcauses5Why[index]
      ) {
        return
      }
      if (Array.isArray(localSubmit.value.rootcauses5Why)) {
        localSubmit.value.rootcauses5Why.splice(index, 1)
      } else {
        localSubmit.value.rootcauses5Why = []
      }
    }

    const addStepRepair = () => {
      if (!localSubmit.value.stepRepair) {
        localSubmit.value.stepRepair = []
      }
      if (localSubmit.value.stepRepair.length < 5) {
        const newId = localSubmit.value.stepRepair.length
          ? Math.max(...localSubmit.value.stepRepair.map((item) => item.id)) + 1
          : 1
        localSubmit.value.stepRepair.push({ id: newId, description: '' })
      }
    }

    const deleteStepRepair = (index) => {
      if (
        !localSubmit.value.stepRepair ||
        !localSubmit.value.stepRepair[index]
      ) {
        return
      }
      if (Array.isArray(localSubmit.value.stepRepair)) {
        localSubmit.value.stepRepair.splice(index, 1)
      } else {
        localSubmit.value.stepRepair = []
      }
    }

    const statusClass = (status) => {
      if (status === 1 || status === '1') return 'status-approved'
      if (status === 0 || status === '0') return 'status-rejected'
      return 'status-pending'
    }

    const onApprove = (section, role) => {
      console.log('Approve', section, role)
    }

    const onComment = (section, role) => {
      console.log('Comment', section, role)
    }

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
      countermeasureKenapaTerjadiList,
      countermeasureKenapaLamaList,
      showCountermeasureKenapaTerjadiForm,
      countermeasureKenapaTerjadiForm,
      submitCountermeasureKenapaTerjadi,
      cancelCountermeasureKenapaTerjadi,
      editCountermeasureKenapaTerjadi,
      removeCountermeasureKenapaTerjadi,
      showCountermeasureKenapaLamaForm,
      countermeasureKenapaLamaForm,
      submitCountermeasureKenapaLama,
      cancelCountermeasureKenapaLama,
      editCountermeasureKenapaLama,
      removeCountermeasureKenapaLama,
      picOptions,
      editStepRepair,
      editingStepRepair,
      yokotenForm,
      yokotenList,
      showYokotenForm,
      submitYokoten,
      cancelYokoten,
      editYokoten,
      removeYokoten,
      addRootcause,
      deleteRootcause,
      addStepRepair,
      deleteStepRepair,
      statusClass,
      onApprove,
      onComment,
    }
  },
  computed: {
    displayImg_problem() {
      console.log('displayImg_problem called, localSubmit:', this.localSubmit)
      if (this.localSubmit?.whyImage) {
        console.log('displayImg_problem whyImage:', this.localSubmit.whyImage)
        return `/api/smartandon/image?path=${this.localSubmit.whyImage}`
      }
      return ''
    },
    display_attachmentImg() {
      if (this.localSubmit?.attachmentMeeting) {
        return `/api/smartandon/image?path=${this.localSubmit.attachmentMeeting}`
      }
      return ''
    },
    displayWhyLamaImage() {
      if (this.localSubmit?.whyLamaImage) {
        return `/api/smartandon/image?path=${this.localSubmit.whyLamaImage}`
      }
      return ''
    },
    displayUploadImgImage() {
      if (this.localSubmit?.uploadImage) {
        return `/api/smartandon/image?path=${this.localSubmit.uploadImage}`
      }
      return ''
    },
    displayActualImage() {
      if (this.localSubmit?.actualImage) {
        return `/api/smartandon/image?path=${this.localSubmit.actualImage}`
      }
      return ''
    },
    displayStandardImage() {
      if (this.localSubmit?.standardImage) {
        return `/api/smartandon/image?path=${this.localSubmit.standardImage}`
      }
      return ''
    },
  },
  data() {
    return {
      showFullSizeImage: false,
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
        let url = `${window.location.origin
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
  },
}
</script>

<style scoped>
.custom-card {
  border-radius: 12px;
}

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

.status-circle {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #ccc;
}

.status-approved {
  background-color: #2eb85c;
  border-color: #2eb85c;
}

.status-rejected {
  background-color: #e55353;
  border-color: #e55353;
}

.status-pending {
  background-color: white;
  border-color: #ccc;
}
</style>

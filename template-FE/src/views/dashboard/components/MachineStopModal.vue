<template>
    <CModal :visible="visible" @close="$emit('close')" aria-labelledby="LiveDemoExampleLabel">
        <CModalHeader>
        <CModalTitle id="LiveDemoExampleLabel">Machine Stop Input</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <CForm class="row g-3 needs-validation" novalidate>
            <CCol md="8">
            <label for="machineSelect" class="form-label">Machine Name</label>
            <Treeselect 
                id="machineSelect" 
                :model-value="formData.machineName" 
                @update:model-value="updateMachineName"
                :options="machineOptions" 
                :searchable="true"
                :clearable="true" 
                :children="false" 
                placeholder="Select or input machine"
                :value-consists-of="['id']" 
                :value-key="'id'" 
                :label-key="'label'" 
            />
            </CCol>
            <CCol md="4">
            <label for="lineSelect" class="form-label">Line</label>
            <Treeselect 
                id="lineSelect" 
                :model-value="formData.line" 
                @update:model-value="updateLine"
                :multiple="false" 
                :flat="true" 
                :options="lineOptions"
                :searchable="true" 
                :clearable="true" 
                placeholder="Select or input line"
                :value-consists-of="['id']" 
                :value-key="'id'" 
                :label-key="'label'" 
            />
            </CCol>
            <CCol md="12">
            <CFormInput 
                feedbackInvalid="Please input the problems" 
                id="Problems" 
                label="Problems" 
                required
                :model-value="formData.problems" 
                @update:model-value="updateProblems"
            />
            </CCol>
            <CCol xs="12">
            <CFormCheck 
                feedbackInvalid="You must agree before submitting." 
                id="invalidCheck"
                label="Agree to terms and conditions" 
                required 
                type="checkbox" 
                :model-value="formData.agreeTerms" 
                @update:model-value="updateAgreeTerms"
            />
            </CCol>
        </CForm>
        </CModalBody>
        <CModalFooter>
        <CButton color="secondary" @click="$emit('close')">
            Close
        </CButton>
        <CButton color="primary" @click="$emit('submit', formData)">Submit</CButton>
        </CModalFooter>
    </CModal>
</template>

<script setup>
import {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CForm,
    CFormInput,
    CFormCheck,
    CCol,
    CButton
} from '@coreui/vue'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    formData: {
        type: Object,
        required: true
    },
    machineOptions: {
        type: Array,
        default: () => []
    },
    lineOptions: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['close', 'submit', 'update:machineName', 'update:line', 'update:problems', 'update:agreeTerms'])

const updateMachineName = (value) => {
    emit('update:machineName', value)
}

const updateLine = (value) => {
    emit('update:line', value)
}

const updateProblems = (value) => {
    emit('update:problems', value)
}

const updateAgreeTerms = (value) => {
    emit('update:agreeTerms', value)
}
</script>
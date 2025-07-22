<template>
    <CCard class="mt-3 mb-5 custom-card">
        <CCol>
            <CCardBody>
                <CRow>
                    <CCol>
                        <CFormLabel for="startDate">Start</CFormLabel>
                        <CInputGroup>
                            <CInputGroupText id="clock-icon1">
                                <Clock size="16" />
                            </CInputGroupText>
                            <CFormInput id="startDate" type="date" :model-value="filterStartDate"
                                @update:model-value="$emit('update:filterStartDate', $event)" aria-label="Start Date"
                                aria-describedby="basic-addon1" />
                        </CInputGroup>
                    </CCol>

                    <CCol>
                        <CFormLabel for="finishDate">Finish</CFormLabel>
                        <CInputGroup>
                            <CInputGroupText id="clock-icon2">
                                <Clock size="16" />
                            </CInputGroupText>
                            <CFormInput id="finishDate" type="date" :model-value="filterFinishDate"
                                @update:model-value="$emit('update:filterFinishDate', $event)" aria-label="Finish Date"
                                aria-describedby="basic-addon2" />
                        </CInputGroup>
                    </CCol>

                    <CCol>
                        <CCol class="md-6">
                            <label for="lineSelect" class="form-label">Line</label>
                            <Treeselect id="lineSelect" :model-value="selectedLine"
                                @update:model-value="$emit('update:selectedLine', $event)" :multiple="false"
                                :flat="true" :options="lineOptions" :searchable="true" :clearable="true"
                                placeholder="Select or input line" @input="$emit('machineInput')"
                                :value-consists-of="['id']" :value-key="'id'" :label-key="'label'" />
                        </CCol>
                    </CCol>

                    <CCol>
                        <label for="selectedMachineName" class="form-label">Machine</label>
                        <Treeselect id="selectedMachineName" :model-value="selectedMachineName" @update:model-value="
                            $emit('update:selectedMachineName', $event)
                            " :options="machineOptions" :searchable="true" :clearable="true" :children="false"
                            placeholder="Select or input machine" @input="$emit('machineInput')"
                            :value-consists-of="['label']" :value-key="'selectedMachineName'" :label-key="'label'" />
                    </CCol>
                </CRow>

                <CRow class="mt-4 g-1 align-items-end">
                    <CCol md="10" class="px-1">
                        <CFormLabel>Problem</CFormLabel>
                        <CInputGroup>
                            <CInputGroupText>
                                <Search size="16" />
                            </CInputGroupText>
                            <CFormInput v-model="searchKeyword" placeholder="Search problem" />
                        </CInputGroup>
                    </CCol>

                    <CCol md="1" class="px-1">
                        <CFormLabel>Category</CFormLabel>
                        <CFormSelect v-model="selectedCategory">
                            <option value="">All</option>
                            <option value="Taskforce">TASKFORCE</option>
                            <option value="Thema">Thema</option>
                        </CFormSelect>
                    </CCol>

                    <CCol md="1" class="px-1">
                        <CFormLabel>Shift</CFormLabel>
                        <CFormSelect v-model="selectedShift">
                            <option value="">All</option>
                            <option value="Red">Red Shift</option>
                            <option value="White">White Shift</option>
                        </CFormSelect>
                    </CCol>
                </CRow>

                <CRow class="mt-5 mb-3">
                    <CCol sm="2">
                        <CButton :disabled="loading" style="width: 100%" color="dark" variant="outline"
                            @click="$emit('reset')">
                            Reset
                        </CButton>
                    </CCol>
                    <CCol sm="10">
                        <CButton :disabled="loading" style="width: 100%" color="primary" @click="$emit('search')">
                            Search
                        </CButton>
                    </CCol>
                </CRow>

                <CRow v-if="loading" class="mb-3">
                    <CCol class="text-center">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </CCol>
                </CRow>
            </CCardBody>
        </CCol>
    </CCard>
</template>

<script>
import {
    CRow,
    CCol,
    CCard,
    CCardHeader,
    CCardBody,
    CFormLabel,
    CInputGroup,
    CInputGroupText,
    CFormInput,
    CButton,
} from '@coreui/vue'
import { Clock, Search } from 'lucide-vue-next'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'

export default {
    name: 'SearchFilters',
    components: {
        CRow,
        CCol,
        CCard,
        CCardHeader,
        CCardBody,
        CFormLabel,
        CInputGroup,
        CInputGroupText,
        CFormInput,
        CButton,
        Clock,
        Search,
        Treeselect,
    },

    props: {
        filterStartDate: {
            type: String,
            default: '',
        },
        filterFinishDate: {
            type: String,
            default: '',
        },
        selectedLine: {
            type: [String, Number],
            default: null,
        },
        selectedMachineName: {
            type: [String, Number],
            default: null,
        },
        selectedProblem: {
            type: String,
            default: '',
        },
        lineOptions: {
            type: Array,
            default: () => [],
        },
        machineOptions: {
            type: Array,
            default: () => [],
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },

    emits: [
        'update:filterStartDate',
        'update:filterFinishDate',
        'update:selectedLine',
        'update:selectedMachineName',
        'update:selectedProblem',
        'search',
        'reset',
        'machineInput',
    ],
}
</script>

<style scoped>
.custom-card {
    border-radius: 12px;
}
</style>
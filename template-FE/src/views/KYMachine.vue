<template>
    <CContainer fluid>
        <CTitle class="mt-2 text-start" size="h6">
            KY Machine
        </CTitle>

        <CRow>
            <CCol :xs="12">
                <CCard class="mt-2 p-3">
                    <CRow>
                        <CCol :xs="6">
                            <CFormSelect v-model="filter.fline" :options="lineOptions" label="Line" />
                        </CCol>
                        <CCol :xs="6">
                            <CFormSelect v-model="filter.fid" :options="machineOptions" label="Machines" />
                        </CCol>
                    </CRow>
                </CCard>
            </CCol>
        </CRow>

        <CDivider class="my-3" />

        <CRow v-if="isLoading" class="justify-content-center py-4 text-center">
            <CCol :xs="12">
                <CSpinner color="primary" size="lg" class="mb-2" />
                <CText color="muted">Loading KY Machine data...</CText>
            </CCol>
        </CRow>

        <CTable v-else hover bordered responsive>
            <CTableHead>
                <CTableRow>
                    <CTableHeaderCell>No</CTableHeaderCell>
                    <CTableHeaderCell>Line</CTableHeaderCell>
                    <CTableHeaderCell>Machine</CTableHeaderCell>
                    <CTableHeaderCell>KY Details</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
                <CTableRow v-for="(item, i) in kyData" :key="item.machine_id">
                    <CTableDataCell>{{ i + 1 }}</CTableDataCell>
                    <CTableDataCell>{{ item.line_nm }}</CTableDataCell>
                    <CTableDataCell>{{ item.machine_nm }}</CTableDataCell>
                    <CTableDataCell>
                        <CButton color="success" variant="outline" size="sm" class="rounded-pill"
                            @click="getDetailDataKy(item)">
                            <CIcon icon="cilBook" />
                            <CBadge color="danger" class="ml-1">{{ item.ky_total }}</CBadge>
                        </CButton>
                    </CTableDataCell>
                </CTableRow>
            </CTableBody>
        </CTable>

        <CModal alignment="center" size="lg" :visible="dialog" @close="clearSubmit">
            <CModalHeader>
                <CModalTitle>KY Machine Input</CModalTitle>
            </CModalHeader>

            <CModalBody>
                <CForm class="mt-3">
                    <CRow class="mb-3">
                        <CCol :xs="12">
                            <CInputGroup class="mb-3">
                                <CInputGroupText class="fw-bold" style="min-width: 130px;">
                                    Machine
                                </CInputGroupText>
                                <CFormSelect v-model="kyObj.machine_id" :options="machineOptions" :disabled="true" />
                            </CInputGroup>
                        </CCol>
                    </CRow>

                    <CButton v-if="!isCardVisible" color="primary" size="sm" class="my-2" @click="isCardVisible = true">
                        Add +
                    </CButton>
                    <CButton v-else color="danger" size="sm" class="my-2" @click="isCardVisible = false">
                        Close ×
                    </CButton>

                    <CCard v-if="isCardVisible" class="p-3">
                        <CFormInput v-model="kyObj.details" label="Description KY" :maxlength="100" required />
                        <CFormSelect v-model="kyObj.stop6_category" :options="stop6Options" label="Stop 6 Category" />
                        <CFormInput type="file" v-model="kyObj.ilustration" label="File input (optional)" />
                        <CButton color="success" class="mt-3 w-100" :disabled="!isKyFullFill" @click="submitKy">
                            Submit
                        </CButton>
                    </CCard>
                </CForm>

                <CBadge v-if="isEditLabel" color="primary" class="mt-3">
                    Edit Mode
                </CBadge>

                <CTable bordered responsive class="mt-3">
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>No</CTableHeaderCell>
                            <CTableHeaderCell>Description</CTableHeaderCell>
                            <CTableHeaderCell>Stop 6 Category</CTableHeaderCell>
                            <CTableHeaderCell>Illustration</CTableHeaderCell>
                            <CTableHeaderCell>Actions</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        <CTableRow v-for="(ky, i) in detailsKyData" :key="ky.id">
                            <CTableDataCell>{{ i + 1 }}</CTableDataCell>
                            <CTableDataCell v-if="!ky.is_edit">{{ ky.details }}</CTableDataCell>
                            <CTableDataCell v-else>
                                <CFormInput v-model="ky.details" />
                            </CTableDataCell>

                            <CTableDataCell v-if="!ky.is_edit">{{ ky.stop6_category }}</CTableDataCell>
                            <CTableDataCell v-else>
                                <CFormSelect v-model="ky.stop6_category"
                                    :options="(stop6Categories || []).map(sc => ({ label: sc.label, value: sc.id }))" />
                            </CTableDataCell>

                            <CTableDataCell>
                                <CImage v-if="ky.ilustration" :src="ky.ilustration" alt="KY Illustration" width="100"
                                    rounded thumbnail />
                                <CText v-else color="danger" class="fw-bold">
                                    No Image
                                </CText>
                            </CTableDataCell>

                            <CTableDataCell>
                                <CButton v-if="!ky.is_edit" color="primary" size="sm" variant="outline"
                                    class="rounded-pill me-2" @click="() => { isEditLabel = true; ky.is_edit = true }">
                                    Edit
                                </CButton>
                                <CButton v-else color="success" size="sm" variant="outline" class="rounded-pill me-2"
                                    @click="editKy(ky)">
                                    Submit Edit
                                </CButton>
                                <CButton color="danger" size="sm" variant="outline" class="rounded-pill"
                                    @click="deleteKy(ky.id)">
                                    Delete
                                </CButton>
                            </CTableDataCell>
                        </CTableRow>

                        <CTableRow v-if="detailsKyData.length === 0">
                            <CTableDataCell colspan="5">Belum Ada KY</CTableDataCell>
                        </CTableRow>
                    </CTableBody>
                </CTable>
            </CModalBody>

            <CModalFooter>
                <CButton color="secondary" @click="clearSubmit">Close</CButton>
            </CModalFooter>
        </CModal>
    </CContainer>
</template>
<script>
import {
    CContainer,
    CRow,
    CCol,
    CFormSelect,
    CInputGroup,
    CInputGroupText,
    CFormLabel,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CCard,
    CCardBody,
    CCardHeader,
    CTitle,
    CSpinner,
    CImage,
    CBadge,
    CDivider,
} from '@coreui/vue'

import { getKYLines, getKYMachines, getKYData } from '@/apis/smartandon'

export default {
    name: 'KYMachine',
    components: {
        CContainer,
        CRow,
        CCol,
        CFormSelect,
        CInputGroup,
        CInputGroupText,
        CFormLabel,
        CTable,
        CTableHead,
        CTableBody,
        CTableRow,
        CTableHeaderCell,
        CTableDataCell,
        CButton,
        CModal,
        CModalHeader,
        CModalTitle,
        CModalBody,
        CModalFooter,
        CCard,
        CCardBody,
        CCardHeader,
        CTitle,
        CSpinner,
        CImage,
        CBadge,
        CDivider,
    },

    data() {
        return {
            lines: [],
            machines: [],
            kyData: [],
            dialog: false,
            kyObj: {
                machine_id: null,
                details: '',
                stop6_category: '',
                ilustration: null,
                is_edit: false,
            },
            isCardVisible: false,
            isEditLabel: false,
            isLoading: false,
            detailsKyData: [],
            stop6Categories: [],
            filter: {
                fline: -1,
                fid: -1,
                name: 'FAJAR TRI CAHYONO',
                INIT_COUNT: 0,
            },
        }
    },

    computed: {
        /** 🔧 Pastikan map() aman — fallback ke array kosong */
        lineOptions() {
            return (this.lines || []).map(line => ({
                label: line.line_nm || line.fline || 'Unknown Line',
                value: line.fline || line.line_nm || '',
            }))
        },
        machineOptions() {
            return (this.machines || []).map(machine => ({
                label: machine.machine_nm || machine.fmc_name || 'Unknown Machine',
                value: machine.machine_id || machine.fid,
            }))
        },
        stop6Options() {
            return (this.stop6Categories || []).map(sc => ({
                label: sc.label,
                value: sc.id,
            }))
        },
    },

    async mounted() {
        try {
            this.isLoading = true
            const [lines, machines, kyData] = await Promise.all([
                getKYLines(),
                getKYMachines('CAM SHAFT'),
                getKYData('CAM SHAFT', -1, 'FAJAR TRI CAHYONO', 0),
            ])

            this.lines = lines.data?.data || []
            this.machines = machines.data?.data || []
            this.kyData = kyData.data?.data?.[0] || []
        } catch (err) {
            console.error('Fetch error:', err)
            this.$toast?.error?.('Gagal memuat data KY Machine')
        } finally {
            this.isLoading = false
        }
    },
}
</script>
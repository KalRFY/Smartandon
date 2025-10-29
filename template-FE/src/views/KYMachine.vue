<template>
    <CContainer fluid>
        <h6 class="mt-2">KY Machine</h6>

        <CRow>
            <CCol :xs="12">
                <CCard class="mt-2 p-3">
                    <CRow>
                        <CCol :xs="6">
                            <CFormLabel>Line</CFormLabel>
                            <CFormSelect v-model="filter.fline">
                                <option v-for="opt in getLinesOpts" :key="opt.value" :value="opt.value">
                                    {{ opt.text }}
                                </option>
                            </CFormSelect>
                        </CCol>
                        <CCol :xs="6">
                            <CFormLabel>Machine</CFormLabel>
                            <CFormSelect v-model="filter.fid">
                                <option v-for="opt in getMachinesOpts" :key="opt.value" :value="opt.value">
                                    {{ opt.text }}
                                </option>
                            </CFormSelect>
                        </CCol>
                    </CRow>
                </CCard>
            </CCol>
        </CRow>

        <hr />

        <div v-if="isLoading" class="text-center py-4">
            <CSpinner color="primary" />
            <p>Loading KY Machine data...</p>
        </div>

        <CTable hover bordered v-else>
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
                        <CButton color="success" size="sm" variant="outline" @click="getDetailDataKy(item)">
                            <i class="fa fa-book"></i>
                            <CBadge color="danger" class="ms-2">{{ item.ky_total }}</CBadge>
                        </CButton>
                    </CTableDataCell>
                </CTableRow>
            </CTableBody>
        </CTable>

        <!-- Modal Detail -->
        <CModal :visible="dialog" @close="clearSubmit" size="lg">
            <CModalHeader>
                <CModalTitle>KY Machine Input</CModalTitle>
            </CModalHeader>

            <CModalBody>
                <CRow class="mb-3">
                    <CCol>
                        <CFormLabel>Machine</CFormLabel>
                        <CFormSelect v-model="kyObj.machine_id" :disabled="true">
                            <option v-for="machine in machines" :key="machine.machine_id" :value="machine.machine_id">
                                {{ machine.machine_nm }}
                            </option>
                        </CFormSelect>
                    </CCol>
                </CRow>

                <CButton color="primary" size="sm" class="me-2" v-if="!isCardVisible" @click="isCardVisible = true">Add
                    +</CButton>
                <CButton color="danger" size="sm" v-else @click="isCardVisible = false">Close X</CButton>

                <CCard v-if="isCardVisible" class="mt-3 p-3">
                    <CFormInput v-model="kyObj.details" label="Description KY" placeholder="Enter KY Description" />
                    <CFormLabel class="mt-3">Stop 6 Category</CFormLabel>
                    <CFormSelect v-model="kyObj.stop6_category">
                        <option v-for="cat in stop6Categories" :key="cat.id" :value="cat.id">
                            {{ cat.label }}
                        </option>
                    </CFormSelect>
                    <CFormLabel class="mt-3">Ilustration (optional)</CFormLabel>
                    <CFormInput type="file" v-model="kyObj.ilustration" />
                    <CButton class="mt-3" color="primary" block :disabled="!isKyFullFill" @click="submitKy">Submit
                    </CButton>
                </CCard>

                <CBadge color="primary" v-if="isEditLabel" class="mt-3">Edit Mode</CBadge>

                <CTable bordered responsive class="mt-3">
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell>No</CTableHeaderCell>
                            <CTableHeaderCell>Description</CTableHeaderCell>
                            <CTableHeaderCell>Stop 6 Category</CTableHeaderCell>
                            <CTableHeaderCell>Ilustration</CTableHeaderCell>
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
                                <CFormSelect v-model="ky.stop6_category">
                                    <option v-for="cat in stop6Categories" :key="cat.id" :value="cat.id">
                                        {{ cat.label }}
                                    </option>
                                </CFormSelect>
                            </CTableDataCell>

                            <CTableDataCell>
                                <img v-if="ky.ilustration" :src="ky.ilustration" alt="image" style="width:100px" />
                                <span v-else class="text-danger fw-bold">No Image</span>
                            </CTableDataCell>

                            <CTableDataCell>
                                <CButton color="primary" variant="outline" size="sm" class="me-2" v-if="!ky.is_edit"
                                    @click="() => { isEditLabel = true; ky.is_edit = true }">
                                    <i class="fa fa-edit"></i> Edit
                                </CButton>
                                <CButton color="success" variant="outline" size="sm" v-else @click="editKy(ky)">
                                    <i class="fa fa-send"></i> Submit Edit
                                </CButton>
                                <CButton color="danger" variant="outline" size="sm" class="ms-2"
                                    @click="deleteKy(ky.id)">
                                    <i class="fa fa-trash"></i> Delete
                                </CButton>
                            </CTableDataCell>
                        </CTableRow>
                    </CTableBody>
                </CTable>
            </CModalBody>

            <CModalFooter>
                <CButton color="secondary" @click="clearSubmit">Close</CButton>
            </CModalFooter>
        </CModal>

        <!-- Loading Overlay -->
        <CModal :visible="isLoading" size="sm" alignment="center">
            <CModalBody class="text-center">
                <CSpinner color="primary" />
                <p class="mt-2 mb-0">Loading...</p>
            </CModalBody>
        </CModal>
    </CContainer>
</template>

<script>
import axios from "axios"
import STOP6_CATEGORY from "../constants/stop6Category"
import isNotEmpty from '../functions/isNotEmpty'
import Swal from "sweetalert2"
import { mapGetters } from "vuex"

import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CForm,
    CFormLabel,
    CFormSelect,
    CFormInput,
    CButton,
    CSpinner,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CBadge,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CProgress,
} from '@coreui/vue'

export default {
    name: "KYMachine",

    components: {
        CContainer, CRow, CCol, CCard, CCardBody,
        CForm, CFormLabel, CFormSelect, CFormInput,
        CButton, CSpinner, CTable, CTableHead, CTableRow,
        CTableHeaderCell, CTableBody, CTableDataCell,
        CBadge, CModal, CModalHeader, CModalTitle,
        CModalBody, CModalFooter, CProgress,
    },

    data() {
        return {
            isEditLabel: false,
            isLoading: false,
            isKyFullFill: false,
            isCardVisible: false,
            filter: {
                fline: "-1",
                fid: "-1",
            },
            kyObj: {
                machine_id: null,
                details: null,
                created_by: localStorage.getItem("name"),
                stop6_category: null,
                ilustration: null,
            },
            stop6Categories: STOP6_CATEGORY,
            dialog: false,
            optionsLines: [],
            machines: [],
            kyData: [],
            detailsKyData: [],
            descriptionRules: [
                (value) => {
                    if (value) return true
                    return "Name is required."
                },
            ],
            countInitFilterApply: 0,
        }
    },

    watch: {
        kyObj: {
            deep: true,
            handler() {
                this.isKyFullFill =
                    this.kyObj.details && this.kyObj.stop6_category ? true : false
            },
        },
        filter: {
            deep: true,
            async handler() {
                if (this.filter.fline !== -1) {
                    await this.$store.dispatch("storeGetMachines", this.filter.fline)
                }
                await this.getKy()
            },
        },
    },

    computed: {
        ...mapGetters(["getMachinesOpts", "getLinesOpts"]),
    },

    methods: {
        async getFilterData() {
            try {
                await this.$store.dispatch("storeGetLines")
                await this.$store.dispatch("storeGetMachines")
            } catch (error) {
                console.log(error)
            }
        },

        customFilter(itemTitle, queryText, item) {
            const textOne = item.raw.label.toLowerCase()
            const searchText = queryText.toLowerCase()
            return textOne.indexOf(searchText) > -1
        },

        async getKy() {
            try {
                this.isLoading = true
                this.filter.name = localStorage.getItem("name")
                this.filter.INIT_COUNT = this.countInitFilterApply

                const rawKy = await axios.get(`https://mt-system.id/v2/ky/get`, {
                    params: this.filter,
                })

                this.kyData = rawKy.data?.data?.[0] || []
                this.filter.fline = rawKy.data?.data?.[1] || "-1"

                this.machines = (rawKy.data?.data?.[0] || []).map((mc) => ({
                    machine_id: mc.machine_id,
                    machine_nm: mc.machine_nm,
                }))

                this.countInitFilterApply++
                this.isLoading = false
            } catch (error) {
                this.isLoading = false
                console.error("getKy() error:", error)
                alert("Gagal memuat data KY Machine")
            }
        },

        getDetailDataKy(machine) {
            this.kyObj.machine_id = machine.machine_id
            this.detailsKyData = machine.ky_data.map((ky) => {
                ky.is_edit = false
                return ky
            })
            this.dialog = true
        },

        clearSubmit() {
            this.kyObj = {
                machine_id: null,
                details: null,
                created_by: localStorage.getItem("name"),
                stop6_category: null,
            }
            this.detailsKyData = []
            this.dialog = false
            this.isCardVisible = false
        },

        async submitKy() {
            try {
                this.isLoading = true
                const image = this.kyObj.ilustration
                delete this.kyObj.ilustration

                if (!isNotEmpty(this.kyObj)) {
                    this.isLoading = false
                    alert("Form tidak boleh kosong")
                    return
                }

                const formData = new FormData()
                formData.append("machine_id", this.kyObj.machine_id)
                formData.append("details", this.kyObj.details)
                formData.append("created_by", this.kyObj.created_by)
                formData.append("stop6_category", this.kyObj.stop6_category)
                formData.append("ilustration", image)

                await axios.post("https://mt-system.id/v2/ky/add", formData)
                alert("Success to add KY")

                await this.getKy()
                this.clearSubmit()
                this.isLoading = false
            } catch (error) {
                console.error(error)
                this.isLoading = false
                alert("Gagal menambahkan KY Machine")
            }
        },

        async editKy(ky) {
            try {
                this.isLoading = true
                this.isEditLabel = false
                ky.is_edit = false

                const formData = new FormData()
                formData.append("id", ky.id)
                formData.append("details", ky.details)
                formData.append("created_by", ky.created_by)
                formData.append("stop6_category", ky.stop6_category)
                formData.append("ilustration", ky.ilustration)

                await axios.put("https://mt-system.id/v2/ky/edit", formData)
                alert("Success to edit KY")

                this.clearSubmit()
                await this.getKy()
                this.isLoading = false
            } catch (error) {
                this.isLoading = false
                alert("Gagal mengedit KY Machine")
            }
        },

        async deleteKy(id) {
            try {
                const result = await Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!",
                })

                if (result.isConfirmed) {
                    this.isLoading = true
                    await axios.delete(`https://mt-system.id/v2/ky/delete/${id}`)
                    alert("Success to delete KY")

                    await this.getKy()
                    this.clearSubmit()
                    this.isLoading = false
                }
            } catch (error) {
                this.isLoading = false
                alert("Gagal menghapus KY Machine")
            }
        },
    },

    async mounted() {
        const queryAvail = Object.keys(this.$route.query).length
        if (queryAvail > 0) {
            this.filter.fline = this.$route.query.fline
            this.filter.fid = this.$route.query.fid
            this.filter.IS_IGNORE = 1
        }

        await this.getFilterData()
        await this.getKy()
    },
}
</script>
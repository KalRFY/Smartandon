<template>
    <div class="ltb-container">
        <CRow>
            <CCol>
                <h3>LTB Report</h3>
            </CCol>
        </CRow>

        <CRow>
            <CCol>
                <CCard class="mb-3">
                    <CCardBody>
                        <CCardBody>
                            <CRow>
                                <CCol md="6">
                                    <CInputGroup>
                                        <CInputGroupText class="form-control-lg">Year</CInputGroupText>
                                        <CFormSelect v-model="filter.year" class="form-control-lg">
                                            <option v-for="year in yearOpts" :key="year.value" :value="year.value">
                                                {{ year.text }}
                                            </option>
                                        </CFormSelect>
                                    </CInputGroup>
                                </CCol>
                                <CCol md="6">
                                    <CInputGroup>
                                        <CInputGroupText class="form-control-lg">Line</CInputGroupText>
                                        <CFormSelect v-model="filter.line_id" class="form-control-lg">
                                            <option v-for="line in getLinesOpts" :key="line.value" :value="line.value">
                                                {{ line.text }}
                                            </option>
                                        </CFormSelect>
                                    </CInputGroup>
                                </CCol>
                            </CRow>
                        </CCardBody>
                        <CRow>
                            <CCol>
                                <CCard class="mt-3 mb-3 mx-3">
                                    <CCardBody>
                                        <div class="table-responsive fixHead">
                                            <table class="table table-striped table-bordered mb-0">
                                                <thead class="table-dark">
                                                    <tr>
                                                        <th class="fixCol-1 text-center">No</th>
                                                        <th class="fixCol-2 text-center">Date</th>
                                                        <th class="text-center">Line</th>
                                                        <th class="text-center">Machine</th>
                                                        <th class="text-center">Problem</th>
                                                        <th class="text-center">Duration (min)</th>
                                                        <th class="text-center" colspan="2">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(ltb, idx) in ltbData" :key="ltb.fid">
                                                        <td class="fixCol-1 text-center">{{ idx + 1 }}</td>
                                                        <td class="fixCol-2 text-center">{{ ltb.date }}</td>
                                                        <td>{{ ltb.line }}</td>
                                                        <td>{{ ltb.machine }}</td>
                                                        <td>{{ ltb.problem }}</td>
                                                        <td class="text-center">{{ ltb.duration }}</td>
                                                        <td class="text-center">
                                                            <router-link class="btn btn-success btn-sm text-white"
                                                                :to="`/pdfViewerLong?v_=${ltb.fid}`">
                                                                <CIcon :icon="cilBook" /> Report
                                                            </router-link>
                                                        </td>
                                                        <td class="text-center">
                                                            <router-link class="btn btn-info btn-sm text-white"
                                                                :to="`/editProblem?v_=${ltb.fid}`">
                                                                <CIcon :icon="cilInfo" /> Details
                                                            </router-link>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </CCardBody>
                                </CCard>
                            </CCol>
                        </CRow>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>

        <CModal :visible="isLoading" backdrop="static" keyboard="false" centered>
            <CModalBody class="text-center">
                Loading...
                <CSpinner />
            </CModalBody>
        </CModal>
    </div>
</template>

<script>
import axios from 'axios'
import queryFormat from '@/functions/queryFormat'
import { mapGetters } from 'vuex'
import {
    CRow, CCol, CInputGroup, CInputGroupText, CFormSelect,
    CModal, CModalBody, CSpinner, CCard, CCardBody
} from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { cilBook, cilInfo } from '@coreui/icons'

export default {
    name: 'LTBReportScreen',
    components: {
        CRow, CCol, CInputGroup, CInputGroupText, CFormSelect,
        CModal, CModalBody, CSpinner, CIcon,
    },
    data() {
        return {
            isLoading: false,
            cilBook,
            cilInfo,
            filter: {
                year: new Date().getFullYear(),
                line_id: '-1',
            },
            yearOpts: [
                { value: new Date().getFullYear() - 2, text: new Date().getFullYear() - 2 },
                { value: new Date().getFullYear() - 1, text: new Date().getFullYear() - 1 },
                { value: new Date().getFullYear(), text: new Date().getFullYear() },
            ],
            ltbData: [
            ],
        }
    },
    watch: {
        filter: {
            handler() { this.getDataLTB() },
            deep: true,
        },
    },
    computed: {
        ...mapGetters(['getLinesOpts']),
    },
    methods: {
        async getDataLTB() {
            this.isLoading = true
            try {
                const resp = await axios.get(
                    `${process.env.VUE_APP_HOST}/v2/ltb-history?${queryFormat(this.filter)}`
                )
                this.ltbData = resp.data.data || []
            } catch (err) {
                console.error('Error fetching LTB data:', err)
                if (this.$toast && typeof this.$toast.error === 'function') {
                    this.$toast.error('Failed To get Data LTB')
                } else {
                    alert('Failed To get Data LTB')
                }
            } finally {
                this.isLoading = false
            }
        },
        async getLines() {
            try {
                await this.$store.dispatch('storeGetLines')
            } catch (err) {
                console.error('Error fetching lines:', err)
                if (this.$toast && typeof this.$toast.error === 'function') {
                    this.$toast.error('Failed To get Lines')
                } else {
                    alert('Failed To get Lines')
                }
            }
        },
    },
    mounted() {
        this.getLines()
        this.getDataLTB()
    },
}
</script>

<style>
.ltb-container {
    padding: 1.5rem;
    transition: transform 0.3s, box-shadow 0.3s;
    border-radius: 10px;
    min-height: 100vh;
    overflow: hidden;
}

.fixHead {
    max-height: 80vh;
    overflow-y: auto;
    position: relative;
}

.fixCol-1 {
    position: sticky;
    left: 0;
    background-color: #fff;
    z-index: 2;
}

.fixCol-2 {
    position: sticky;
    left: 50px;
    background-color: #fff;
    z-index: 1;
}
</style>
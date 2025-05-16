<template>
    <CContainer fluid class="mt-4">
        <CRow>
            <CCol>
                <h3>LTB Report Status</h3>
                <p>Problem (>= 120 min)</p>
            </CCol>
        </CRow>
        <CCard class="mt-2 mb-3 px-0 custom-card">
            <CRow class="mt-3 mb-3 px-3">
                <CCol xs="12">
                    <LegendStatus class="d-flex justify-content-between align-items-center w-100 mb-2" />
                    <CInputGroup size="lg" class="mt-5 w-100">
                        <CInputGroupText>Name</CInputGroupText>
                        <CFormInput placeholder="name TL/GL" v-model="findLeader" />
                    </CInputGroup>
                </CCol>
            </CRow>

            <CRow class="px-3">
                <CCol xs="12">
                    <div class="tableFixHead w-100 custom-table">
                        <table class="table table-bordered w-100">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Date</th>
                                    <th>Mesin</th>
                                    <th>Problem Description</th>
                                    <th>Duration</th>
                                    <th>TL</th>
                                    <th>GL</th>
                                    <th>TL<br />Check</th>
                                    <th>GL<br />Check</th>
                                    <th>SH<br />Check</th>
                                    <th>Mgr<br />Check</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, i) in tableProblemFup" :key="item.fid">
                                    <td>{{ i + 1 }}</td>
                                    <td>{{ item.fstart_time }}</td>
                                    <td>{{ item.fmc_name }}</td>
                                    <td class="text-left">{{ item.ferror_name }}</td>
                                    <td>{{ item.fdur }}</td>
                                    <td>{{ item.tlName }}</td>
                                    <td>{{ item.glName }}</td>
                                    <td>
                                        <div :class="item.tlCheck" />
                                    </td>
                                    <td>
                                        <div :class="item.lhCheck" />
                                    </td>
                                    <td>
                                        <div :class="item.shCheck" />
                                    </td>
                                    <td>
                                        <div :class="item.dhCheck" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CCol>
            </CRow>
        </CCard>
    </CContainer>
</template>

<script>
import {
    CContainer,
    CRow,
    CCol,
    CCard,
    CCardBody,
    CTabs,
    CTab,
    CInputGroup,
    CInputGroupText,
    CFormInput,
    CSpinner
} from '@coreui/vue'
import BarChart from '@/components/BarChart.vue'
import LegendStatus from '@/components/LegendStatus.vue'
import axios from 'axios'

export default {
    name: 'SummaryWeekly',
    components: {
        CContainer,
        CRow,
        CCol,
        CCard,
        CCardBody,
        CTabs,
        CTab,
        CInputGroup,
        CInputGroupText,
        CFormInput,
        CSpinner,
        BarChart,
        LegendStatus
    },
    data() {
        return {
            containerDataA: [],
            containerDataB: [],
            containerDataC: [],
            containerProblemFup: [],
            datacollection: {
                labels: ['A', 'B', 'C', 'D'],
                datasets: [
                    { label: 'Blm Close', backgroundColor: '#f75492', data: [0, 0, 0, 0] },
                    { label: 'Sudah Close', backgroundColor: '#5954f7', data: [0, 0, 0, 0] }
                ]
            },
            options: {
                responsive: true,
                legend: { display: true },
                scales: {
                    yAxes: [{
                        ticks: { fontSize: 12, min: 0 },
                        stacked: true,
                        scaleLabel: { display: true, labelString: 'Jumlah' }
                    }],
                    xAxes: [{
                        ticks: { fontSize: 12, min: 0 },
                        stacked: true
                    }]
                }
            },
            containerTl: [],
            containerGl: [],
            tableProblemFup: [],
            isLoading: false,
            findLeader: null,
            windowWidth: window.innerWidth,
            isMobile: false
        }
    },
    watch: {
        findLeader(val) {
            const leader = val ? val.toUpperCase() : ''
            this.tableProblemFup = this.containerProblemFup.filter(item =>
                (item.glName || '').toUpperCase().includes(leader) ||
                (item.tlName || '').toUpperCase().includes(leader)
            )
        }
    },
    methods: {
        onResize() {
            this.windowWidth = window.innerWidth
            this.isMobile = this.windowWidth < 650
        },
        checkStatus(state) {
            if (state === 1) return 'dotApprove'
            if (state === 2) return 'dotDelay'
            if (state === 3) return 'dotComment'
            return 'dot'
        }
    },
    async mounted() {
        window.addEventListener('resize', this.onResize)
        this.onResize()

        this.isLoading = true
        try {
            const result = await axios.get(`${process.env.VUE_APP_HOST}/delayProblemCm`)
            const data = result.data.data

            this.containerDataA = data[0]
            this.containerDataB = data[1]
            this.containerDataC = data[2]

            const combine = [...data[8], ...data[9]].sort((a, b) =>
                new Date(a.fstart_time) - new Date(b.fstart_time)
            )
            const mapped = combine.map(item => {
                const idxTl = this.containerTl.findIndex(x =>
                    x.line.toUpperCase() === item.fline.toUpperCase() && x.shift === item.fshift
                )
                const idxGl = this.containerGl.findIndex(x =>
                    x.line.toUpperCase() === item.fline.toUpperCase() && x.shift === item.fshift
                )
                item.tlName = this.containerTl[idxTl]?.name || ''
                item.glName = this.containerGl[idxGl]?.name || ''

                item.tlCheck = this.checkStatus(
                    item.fpermanet_cm === '[]' && item.fpermanet_cm_lama === '[]' ? 2 : 1
                )
                const daysSince = d => (Date.now() - new Date(d).getTime()) / (1000 * 3600 * 24)
                if (item.cmLhApprove === 0) {
                    item.lhCheck = daysSince(item.fstart_time) >= 1 && !item.cmLhFeedback
                        ? this.checkStatus(2)
                        : item.cmLhFeedback
                            ? this.checkStatus(3)
                            : this.checkStatus(4)
                } else item.lhCheck = this.checkStatus(1)
                if (item.cmShApprove === 0) {
                    item.shCheck = daysSince(item.fstart_time) >= 2 && !item.cmShFeedback
                        ? this.checkStatus(2)
                        : item.cmShFeedback
                            ? this.checkStatus(3)
                            : this.checkStatus(4)
                } else item.shCheck = this.checkStatus(1)
                if (item.cmDhApprove === 'null') item.cmDhApprove = 0
                if (item.cmDhApprove === 0) {
                    item.dhCheck = daysSince(item.fstart_time) >= 3 && !item.cmDhFeedback
                        ? this.checkStatus(2)
                        : item.cmDhFeedback
                            ? this.checkStatus(3)
                            : this.checkStatus(4)
                } else item.dhCheck = this.checkStatus(1)

                return item
            })

            this.containerProblemFup = mapped
            this.tableProblemFup = mapped
            this.datacollection = {
                labels: ['A', 'B', 'C', 'D'],
                datasets: [
                    { label: 'Blm Close', backgroundColor: '#f75492', data: result.data.count },
                    { label: 'Sudah Close', backgroundColor: '#5954f7', data: result.data.countFin }
                ]
            }
        } catch (err) {
            console.error('Error fetching data:', err)
        } finally {
            this.isLoading = false
        }
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    }
}
</script>

<style scoped>
.custom-card {
    border-radius: 12px;
}

.custom-table {
    border-radius: 12px;
}

.tableFixHead {
    overflow: auto;
    max-height: 70vh;
}

.tableFixHead thead th {
    position: sticky;
    top: 0;
    z-index: 1;
    background: white;
}

.table {
    border-collapse: collapse;
    width: 100%;
}

th,
td {
    font-size: 12px;
    text-align: center;
    white-space: nowrap;
}
</style>
<template>
    <CRow>
        <CCol>
            <CCard class="mb-3">
                <CCardBody>
                <CRow lg="12">
                    <CCol lg="6">
                    <CRow>
                        <CCol lg="3" class="mb-3" v-for="(chartData, index) in chartDataPerLine" :key="index">
                        <div
                            :class="getLineCardClass(chartData.label)"
                            style="border-radius: 9px; height: 100%; box-shadow: 5px 5px 5px rgba(0,0,0,0.2);
                            background-color: white;"
                        >
                            <CCardBody style="height: 100%;">
                            <CRow>
                                <CCardTitle style="font-size: small; height: 35px;">{{ chartData.label }}</CCardTitle>
                            </CRow>
                            <CRow>
                                <CCol>
                                Target:
                                {{
                                    oeeTarget.find(item => item.DEV_NAME === chartData.label)?.REG_VALUE ?? oeeDataSmartandon.ftarget
                                }}
                                </CCol>
                                <CCol>
                                Actual:
                                {{
                                    oeeActual.find(item => item.DEV_NAME === chartData.label)?.REG_VALUE ?? oeeDataSmartandon.factual
                                }}
                                </CCol>
                            </CRow>
                            <ApexCharts :options="chartData.options" :series="chartData.series" type="radialBar" height="250" />
                            </CCardBody>
                        </div>
                        </CCol>
                    </CRow>
                    </CCol>
                    <CCol lg="6">
                    <div style="background-color: white; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); height: 100%;" color="dark" variant="outline">
                        <CCardBody style="height: 100%;">
                        <CCardTitle style="font-size: medium; height: 35px; color: black;">Cumulative OEE per Line</CCardTitle>
                        <ApexCharts :options="cumulativeOeeOptions" :series="cumulativeOeeSeries" type="polarArea" height="350" />
                        </CCardBody>
                    </div>
                    </CCol>
                </CRow>
                </CCardBody>
            </CCard>
        </CCol>
    </CRow>
</template>

<script setup>
import { CRow, CCol, CCard, CCardBody, CCardTitle } from '@coreui/vue'
import ApexCharts from 'vue3-apexcharts'

const props = defineProps({
    chartDataPerLine: {
        type: Array,
        default: () => []
    },
    oeeTarget: {
        type: Array,
        default: () => []
    },
    oeeActual: {
        type: Array,
        default: () => []
    },
    oeeDataSmartandon: {
        type: Object,
        default: () => ({})
    },
    cumulativeOeeSeries: {
        type: Array,
        default: () => []
    },
    cumulativeOeeOptions: {
        type: Object,
        default: () => ({})
    },
    problemActive: {
        type: Array,
        default: () => []
    }
})

const getLineCardClass = (lineLabel) => {
    const normalize = str => (str || '').toString().trim().toLowerCase()
    const normalizedLabel = normalize(lineLabel)

    const problem = props.problemActive.find(
        p => normalize(p.fline) === normalizedLabel
    )
    if (problem) {
        if (Number(problem.fdur) > 30) {
        return "line-danger"
        }
        return 'line-warning'
    }
    return ''
}
</script>

<style scoped>
.line-danger {
    background-color: white !important;
    border: 4px solid red !important;
}

.line-warning {
    background-color: white!important;
    border: 4px solid orange !important;
}
</style>
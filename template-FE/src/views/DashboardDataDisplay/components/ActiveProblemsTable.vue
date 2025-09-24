<template>
    <CRow class="mb-3">
        <CCol>
        <CCard>
            <CTable>
            <CTableHead>
                <CTableRow>
                <CTableHeaderCell scope="col">No</CTableHeaderCell>
                <CTableHeaderCell scope="col">Machine</CTableHeaderCell>
                <CTableHeaderCell scope="col">PIC</CTableHeaderCell>
                <CTableHeaderCell scope="col">Line</CTableHeaderCell>
                <CTableHeaderCell scope="col">Problem</CTableHeaderCell>
                <CTableHeaderCell scope="col">Duration</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
                <CTableRow 
                v-for="(problem, idx) in problemActive" 
                :key="problem.fid"
                >
                <CTableDataCell>{{ idx + 1 }}</CTableDataCell>
                <CTableDataCell>{{ problem.fmc_name }}</CTableDataCell>
                <CTableDataCell>{{ problem.foperator }}</CTableDataCell>
                <CTableDataCell>{{ problem.fline }}</CTableDataCell>
                <CTableDataCell>{{ problem.ferror_name }}</CTableDataCell>
                <CTableDataCell>{{ problem.fdur }}</CTableDataCell>
                </CTableRow>
            </CTableBody>
            </CTable>
        </CCard>
        </CCol>
    </CRow>
</template>

<script setup>
import {
    CRow,
    CCol,
    CCard,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
} from '@coreui/vue'

defineProps({
    problemActive: {
        type: Array,
        default: () => [],
    },
})
</script>

<style scoped>
</style>
<template>
    <CRow>
        <CCol class="mb-3">
        <CTable 
            v-if="data.length" 
            bordered 
            hover 
            responsive
        >
            <CTableHead>
            <CTableRow>
                <CTableHeaderCell 
                v-for="column in columns" 
                :key="column.key"
                scope="col"
                >
                {{ column.label }}
                </CTableHeaderCell>
            </CTableRow>
            </CTableHead>
            <CTableBody>
            <CTableRow 
                v-for="item in data" 
                :key="item[keyField]"
            >
                <CTableDataCell 
                v-for="column in columns" 
                :key="column.key"
                >
                {{ item[column.key] }}
                </CTableDataCell>
            </CTableRow>
            </CTableBody>
        </CTable>
        <p v-else>{{ loadingText }}</p>
        </CCol>
    </CRow>
</template>

<script setup>
import {
    CRow,
    CCol,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
} from '@coreui/vue'

defineProps({
    data: {
        type: Array,
        default: () => [],
    },
    columns: {
        type: Array,
        required: true,
    },
    keyField: {
        type: String,
        required: true,
    },
    loadingText: {
        type: String,
        default: 'Loading data...',
    },
})
</script>

<style scoped>
p {
    font-style: italic;
}
</style>
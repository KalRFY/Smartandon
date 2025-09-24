<template>
    <CRow>
        <CCol>
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>
        </CCol>
    </CRow>
</template>

<script setup>
import { CRow, CCol } from '@coreui/vue'

defineProps({
    title: {
        type: String,
        default: 'LTB Report Status',
    },
    description: {
        type: String,
        default: 'Problem (≥ 120 min, ASSY LINE ≥ 15 min)',
    },
})
</script>

<style scoped>
h3 {
    color: #333;
    margin-bottom: 0.5rem;
}

p {
    color: #666;
    margin-bottom: 0;
}
</style>
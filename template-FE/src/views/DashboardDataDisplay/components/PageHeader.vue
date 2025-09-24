<template>
    <CContainer fluid>
        <CCol>{{ title }}</CCol>
    </CContainer>
</template>

<script setup>
import { CContainer, CCol } from '@coreui/vue'

defineProps({
    title: {
        type: String,
        default: 'Smartandon',
    },
})
</script>

<style scoped>

</style>
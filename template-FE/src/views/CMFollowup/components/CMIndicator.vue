<template>
    <CCard class="mt-1 mb-1 custom-card">
        <CCardBody>
            <CRow class="g-4">
                <CCol sm="6">
                    <CCard class="border border-danger shadow-sm">
                        <CCardBody class="text-center p-3">
                            <h6 class="text-danger fw-bold mb-2">Pending Countermeasure</h6>
                            <h2 class="text-danger m-0">{{ notYetCount }}</h2>
                        </CCardBody>
                    </CCard>
                </CCol>

                <CCol sm="6">
                    <CCard class="border border-success shadow-sm">
                        <CCardBody class="text-center p-3">
                            <h6 class="text-success fw-bold mb-2">Countermeasure Completed</h6>
                            <h2 class="text-success m-0">{{ doneCount }}</h2>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CCardBody>
    </CCard>
</template>

<script setup>
import { computed } from 'vue'
import {
  CCard,
  CCardBody,
  CRow,
  CCol
} from '@coreui/vue'

const props = defineProps({
    data: {
        type: Array,
        required: true,
    },
})

const doneCount = computed(() => props.data.filter(item => item.status === 'OK').length)
const notYetCount = computed(() => props.data.filter(item => item.status === 'NOT YET').length)
</script>

<style scoped>
.d-flex {
    display: flex;
}

.flex-fill {
    flex: 1;
}

.gap-4 {
    gap: 1.5rem;
}
</style>
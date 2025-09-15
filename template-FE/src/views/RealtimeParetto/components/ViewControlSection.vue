<template>
    <CRow class="mb-4">
        <CCol :md="6" class="mb-3 mb-md-0">
        <CCard class="h-100 control-card">
            <CCardBody>
            <h5 class="control-title">View Controls</h5>
            <div class="d-flex flex-wrap gap-2">
                <CButtonGroup role="group" aria-label="Machine or Problem view">
                <CButton 
                    :color="viewMode === 'machines' ? 'primary' : 'outline-primary'" 
                    @click="onToggleViewMode('machines')" 
                    :disabled="isLoading"
                >
                    <Tool size="16" class="me-1" /> Machine View
                </CButton>
                <CButton 
                    :color="viewMode === 'problems' ? 'primary' : 'outline-primary'"
                    @click="onToggleViewMode('problems')" 
                    :disabled="isLoading"
                >
                    <AlertTriangle size="16" class="me-1" /> Problem View
                </CButton>
                </CButtonGroup>
            </div>
            </CCardBody>
        </CCard>
        </CCol>
        <CCol :md="6">
        <CCard class="h-100 control-card">
            <CCardBody>
            <h5 class="control-title">Metric Controls</h5>
            <div class="d-flex flex-wrap gap-2">
                <CButtonGroup role="group" aria-label="Duration or Frequency view">
                <CButton 
                    :color="metricMode === 'duration' ? 'primary' : 'outline-primary'" 
                    @click="onToggleMetricMode('duration')" 
                    :disabled="isLoading"
                >
                    <Clock size="16" class="me-1" /> Duration
                </CButton>
                <CButton 
                    :color="metricMode === 'frequency' ? 'primary' : 'outline-primary'"
                    @click="onToggleMetricMode('frequency')" 
                    :disabled="isLoading"
                >
                    <BarChart2 size="16" class="me-1" /> Frequency
                </CButton>
                </CButtonGroup>
            </div>
            </CCardBody>
        </CCard>
        </CCol>
    </CRow>
</template>

<script setup>
import { 
    CRow, 
    CCol, 
    CCard, 
    CCardBody, 
    CButton, 
    CButtonGroup
} from '@coreui/vue'
import { 
    Tool, 
    AlertTriangle, 
    Clock, 
    BarChart2 
} from 'lucide-vue-next'

const props = defineProps({
    viewMode: {
        type: String,
        required: true,
        default: 'machines'
    },
    metricMode: {
        type: String,
        required: true,
        default: 'duration'
    },
    isLoading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:viewMode', 'update:metricMode'])

const onToggleViewMode = (mode) => {
    if (!props.isLoading) {
        emit('update:viewMode', mode)
    }
}

const onToggleMetricMode = (mode) => {
    if (!props.isLoading) {
        emit('update:metricMode', mode)
    }
}
</script>

<style scoped>
.control-card {
    border: 1px solid #ebedef;
    box-shadow: none;
    transition: all 0.3s ease;
}

.control-card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.control-title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 15px;
    color: #3c4b64;
}

@media (max-width: 768px) {
    .control-card {
        margin-bottom: 10px;
    }
}
</style>
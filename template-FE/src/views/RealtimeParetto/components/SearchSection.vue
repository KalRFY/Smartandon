<template>
    <CCard class="search-card mb-4">
        <CCardHeader class="text-white">
        <div class="d-flex justify-content-between align-items-center">
            <div>
            <strong style="font-size: medium;">Search</strong>
            </div>
        </div>
        </CCardHeader>
        <CCardBody>
        <CRow class="mb-3">
            <CCol :md="6" class="mb-3 mb-md-0">
            <CFormLabel for="start-date">Start Date</CFormLabel>
            <CInputGroup>
                <CInputGroupText>
                <Clock size="16" />
                </CInputGroupText>
                <CFormInput type="date" id="start-date" v-model="startDateModel" />
            </CInputGroup>
            </CCol>

            <CCol :md="6">
            <CFormLabel for="end-date">End Date</CFormLabel>
            <CInputGroup>
                <CInputGroupText>
                <Clock size="16" />
                </CInputGroupText>
                <CFormInput type="date" id="end-date" v-model="endDateModel" />
            </CInputGroup>
            </CCol>
        </CRow>

        <CRow class="mb-3">
            <CCol>
            <CFormLabel for="av-category">AV Category</CFormLabel>
            <CFormSelect id="av-category" v-model="selectedCategoryModel" :options="avCategories" />
            </CCol>
        </CRow>

        <CRow>
            <CCol>
            <CButton 
                color="primary" 
                class="w-100 d-flex align-items-center justify-content-center" 
                @click="onSearch"
                :disabled="isLoading"
            >
                <SearchIcon class="me-2" size="16" />
                {{ isLoading ? 'Loading...' : 'Search' }}
            </CButton>
            </CCol>
        </CRow>

        <CRow class="mt-3">
            <CCol>
            <div class="quick-filter-section">
                <div class="quick-filter-title mb-2">Quick Filters</div>
                <div class="d-flex flex-wrap gap-2">
                <CBadge color="info" class="quick-filter-badge" @click="onSelectTimeRange('today')">Today</CBadge>
                <CBadge color="info" class="quick-filter-badge" @click="onSelectTimeRange('yesterdayAll')">Yesterday All</CBadge>
                <CBadge color="info" class="quick-filter-badge" @click="onSelectTimeRange('yesterdayDay')">Yesterday Day</CBadge>
                <CBadge color="info" class="quick-filter-badge" @click="onSelectTimeRange('yesterdayNight')">Yesterday Night</CBadge>
                <CBadge color="info" class="quick-filter-badge" @click="onSelectTimeRange('lastNight')">Last Night</CBadge>
                <CBadge color="info" class="quick-filter-badge" @click="onSelectTimeRange('thisMonth')">This Month</CBadge>
                <CBadge color="info" class="quick-filter-badge" @click="onSelectTimeRange('lastMonth')">Last Month</CBadge>
                </div>
            </div>
            </CCol>
        </CRow>
        </CCardBody>
    </CCard>
</template>

<script setup>
import { computed } from 'vue'
import {
    CCard,
    CCardHeader,
    CCardBody,
    CRow,
    CCol,
    CFormInput,
    CFormSelect,
    CButton,
    CInputGroup,
    CInputGroupText,
    CBadge,
    CFormLabel,
} from '@coreui/vue'
import { Clock, Search as SearchIcon } from 'lucide-vue-next'

const props = defineProps({
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    selectedCategory: {
        type: String,
        default: ''
    },
    avCategories: {
        type: Array,
        default: () => [{ value: '', label: 'Select category' }]
    },
    isLoading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:startDate', 'update:endDate', 'update:selectedCategory', 'search', 'selectTimeRange'])

// Create computed properties for two-way binding
const startDateModel = computed({
    get: () => props.startDate,
    set: (value) => emit('update:startDate', value)
})

const endDateModel = computed({
    get: () => props.endDate,
    set: (value) => emit('update:endDate', value)
})

const selectedCategoryModel = computed({
    get: () => props.selectedCategory,
    set: (value) => emit('update:selectedCategory', value)
})

// Event handlers
const onSearch = () => {
    emit('search')
}

const onSelectTimeRange = (range) => {
    emit('selectTimeRange', range)
}
</script>

<style scoped>
.search-card {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
    border: none;
}

.search-card .card-header {
    background-color: #3c4b64;
    border-bottom: none;
}

.quick-filter-section {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #e9ecef;
}

.quick-filter-title {
    font-size: 0.875rem;
    font-weight: 600;
}

.quick-filter-badge {
    cursor: pointer;
    padding: 8px 12px;
    transition: all 0.2s ease;
}

.quick-filter-badge:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
    .quick-filter-section .d-flex {
        flex-wrap: wrap;
        gap: 8px;
    }

    .quick-filter-badge {
        margin-bottom: 5px;
    }
}
</style>
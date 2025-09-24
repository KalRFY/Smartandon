<template>
    <CCard class="mt-3 custom-card">
        <CCardBody class="d-flex justify-content-between align-items-center custom-card p-2">
        <CNav variant="tabs">
            <CNavItem>
            <CNavLink 
                :active="activeTab === 0" 
                @click="emit('tabChange', 0)"
            >
                Table Summary
            </CNavLink>
            </CNavItem>
            <CNavItem>
            <CNavLink 
                :active="activeTab === 1" 
                @click="emit('tabChange', 1)"
            >
                Graph Summary
            </CNavLink>
            </CNavItem>
        </CNav>
        <CFormSelect 
            v-if="showYearSelect" 
            :model-value="selectedYear" 
            @update:model-value="emit('update:selectedYear', $event)"
            class="w-auto"
        >
            <option v-for="year in yearOptions" :key="year" :value="year">
            {{ year }}
            </option>
        </CFormSelect>
        </CCardBody>
    </CCard>
</template>

<script setup>
import {
    CCard,
    CCardBody,
    CNav,
    CNavItem,
    CNavLink,
    CFormSelect,
} from '@coreui/vue'

defineProps({
    activeTab: {
        type: Number,
        required: true,
    },
    showYearSelect: {
        type: Boolean,
        default: false,
    },
    selectedYear: {
        type: [String, Number],
        default: null,
    },
    yearOptions: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits(['tabChange', 'update:selectedYear'])
</script>

<style scoped>
.custom-card {
    border-radius: 12px;
}

:deep(.nav-link) {
    cursor: pointer;
}
</style>
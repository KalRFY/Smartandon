<template>
    <CContainer fluid class="mt-4 mb-4">
        <CRow>
            <CCol>
                <h3>CM Followup</h3>
                <p>Post-problem countermeasure tracking</p>
            </CCol>
        </CRow>

        <SearchFilters :filters="filters" :loading="loading" @search="fetchCMFollowup" @reset="resetFilters" />
        <ProblemsTable :data="tableData" :columns="columns" :loading="loading" />
    </CContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import { getCMFollowup } from '@/apis/cmFollowup'

import SearchFilters from '@/views/CMFollowup/components/SearchFilters.vue'
import ProblemsTable from '@/views/CMFollowup/components/ProblemsTable.vue'

const filters = ref({
    line: '',
    start_date: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    end_date: dayjs().format('YYYY-MM-DD'),
})

const loading = ref(false)
const tableData = ref([])

async function fetchCMFollowup() {
    loading.value = true
    try {
        tableData.value = await getCMFollowup(filters.value)
        console.log('Loaded CM data:', tableData.value)
    } catch (err) {
        console.error('Failed to fetch CM Followup:', err)
    } finally {
        loading.value = false
    }
}

function resetFilters() {
    filters.value = {
        line: '',
        start_date: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
        end_date: dayjs().format('YYYY-MM-DD'),
    }
    fetchCMFollowup()
}

onMounted(fetchCMFollowup)
</script>
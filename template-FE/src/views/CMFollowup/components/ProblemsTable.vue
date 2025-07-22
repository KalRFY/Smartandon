<template>
  <CCard class="mt-3 mb-5 custom-card">
    <CCardBody>
      <div v-if="loading" class="text-center py-8">
        Loading data...
      </div>
      <div v-else>
        <LegendStatus class="mb-4" />

        <table class="table-auto w-full border-collapse border text-sm">
          <thead>
            <tr class="bg-gray-100 text-center">
              <th class="border px-2 py-1" rowspan="3">No</th>
              <th class="border px-2 py-1" rowspan="3">Line</th>
              <th class="border px-2 py-1" rowspan="3">Machine</th>
              <th class="border px-2 py-1" rowspan="3">Date Problem</th>
              <th class="border px-2 py-1" rowspan="3">Description Problem</th>
              <th class="border px-2 py-1" rowspan="3">Duration</th>
              <th class="border px-2 py-1" rowspan="3">Rootcause</th>
              <th class="border px-2 py-1" rowspan="3">Countermeasure</th>
              <th class="border px-2 py-1" rowspan="3">Due Date</th>
              <th class="border px-2 py-1" rowspan="3">PIC</th>
              <th class="border px-2 py-1" rowspan="3">Status</th>
              <th class="border px-2 py-1" colspan="2">CM Category (v)</th>
              <th class="border px-2 py-1" colspan="12">2025</th>
              <th class="border px-2 py-1" rowspan="3">Actions</th>
            </tr>
            <tr class="bg-gray-50 text-center">
              <th class="border px-2 py-1" rowspan="2">Cause of Occurrence</th>
              <th class="border px-2 py-1" rowspan="2">Cause of Delay</th>
              <th class="border px-2 py-1" colspan="12">Schedule Countermeasure</th>
            </tr>
            <tr class="bg-gray-50 text-center">
              <th v-for="month in 12" :key="'head-month-' + month" class="border px-2 py-1">
                {{ new Date(0, month - 1).toLocaleString('default', { month: 'short' }) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in data" :key="idx" class="hover:bg-gray-50 text-center">
              <td class="border px-2 py-1">{{ idx + 1 }}</td>
              <td class="border px-2 py-1">{{ row.line || '-' }}</td>
              <td class="border px-2 py-1">{{ row.machine || '-' }}</td>
              <td class="border px-2 py-1">{{ row.date || '-' }}</td>
              <td class="border px-2 py-1 text-left">{{ row.problem || '-' }}</td>
              <td class="border px-2 py-1">{{ row.duration || '-' }}</td>
              <td class="border px-2 py-1 text-left">{{ row.rootcause || '-' }}</td>
              <td class="border px-2 py-1 text-left">{{ row.countermeasure || '-' }}</td>
              <td class="border px-2 py-1">{{ row.dueDate || '-' }}</td>
              <td class="border px-2 py-1">{{ row.pic || '-' }}</td>
              <td class="border px-2 py-1">{{ row.status || '-' }}</td>
              <td class="border px-2 py-1">{{ row.kategori || '-' }}</td>
              <td class="border px-2 py-1">
                <input type="checkbox" disabled :checked="Boolean(row.reason_occurred)" />
              </td>
              <td class="border px-2 py-1">
                <input type="checkbox" disabled :checked="Boolean(row.reason_delayed)" />
              </td>
              <td v-for="month in 12" :key="'month-' + idx + '-' + month" class="border px-2 py-1">
                <input type="checkbox" disabled
                  :checked="Array.isArray(row.schedule) && row.schedule.includes(month)" />
              </td>
              <td class="border px-2 py-1">
                <button v-if="row.status === 'OK'" class="bg-green-500 text-white px-2 py-1 rounded text-xs">
                  OK
                </button>
                <button v-else class="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                  Konfirmasi
                </button>
              </td>
            </tr>
            <tr v-if="data.length === 0">
              <td colspan="28" class="border px-4 py-2 text-center">
                No data available.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <CRow class="mt-5 mb-3">
        <CCol sm="2">
          <CButton :disabled="loading" style="width: 100%" color="primary" @click="$emit('reset')">
            Download Countermeasure
          </CButton>
        </CCol>
        <CCol sm="10">
          <CButton :disabled="loading" style="width: 100%" color="primary" @click="$emit('search')">
            Send Reminder
          </CButton>
        </CCol>
      </CRow>
    </CCardBody>
  </CCard>
</template>

<script setup>
import { defineProps } from 'vue'
import { CCard, CCardBody, CRow, CCol, CButton } from '@coreui/vue'
import LegendStatus from '@/components/CMFollowup/LegendStatus.vue'

const props = defineProps({
  data: Array,
  loading: Boolean
})
</script>

<style scoped>
.custom-card {
  border-radius: 12px;
}
</style>
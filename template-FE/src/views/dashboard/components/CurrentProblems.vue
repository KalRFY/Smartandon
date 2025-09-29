<template>
  <CAccordion class="mb-3" active-item-key="1" style="width: 100%;">
    <CAccordionItem :item-key="1">
      <CAccordionHeader>
        <CRow>
          <CCol>
            <CCardTitle style="font-size: large; font-weight: bold;">
              Current Problems
            </CCardTitle>
          </CCol>
        </CRow>
      </CAccordionHeader>
      <CAccordionBody>
        <CRow>
          <CCol>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">No</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Machine</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Line</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Problem</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Duration</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-if="loading">
                  <CTableDataCell colspan="6" class="text-center">Loading...</CTableDataCell>
                </CTableRow>
                <CTableRow v-else-if="problems.length === 0">
                  <CTableDataCell colspan="6" class="text-center">No active problems</CTableDataCell>
                </CTableRow>
                <CTableRow v-for="(problem, idx) in problems" :key="problem.fid">
                  <CTableDataCell>{{ idx + 1 }}</CTableDataCell>
                  <CTableDataCell>{{ problem.fmc_name }}</CTableDataCell>
                  <CTableDataCell>{{ problem.fline }}</CTableDataCell>
                  <CTableDataCell>{{ problem.ferror_name }}</CTableDataCell>
                  <CTableDataCell>
                    <CButton :color="Number(problem.fdur) > 30 ? 'primary' : 'warning'">
                      <label style="font-size: x-small; font-weight: bold; width: 100px; color: white;">
                        {{ problem.fdur }} Minutes
                      </label>
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCol>
        </CRow>
      </CAccordionBody>
    </CAccordionItem>
  </CAccordion>
</template>

<script setup>
import {
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CRow,
  CCol,
  CCardTitle,
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CButton
} from '@coreui/vue'

defineProps({
  problems: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>
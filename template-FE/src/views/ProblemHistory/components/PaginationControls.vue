<!-- PaginationControls.vue -->
<template>
  <CPagination aria-label="Page navigation example" class="mt-3">
    <CPaginationItem
      href="#"
      :disabled="currentPage === 1"
      @click.prevent="handlePageChange(1)"
    >
      First
    </CPaginationItem>
    <CPaginationItem
      href="#"
      :disabled="currentPage === 1"
      @click.prevent="handlePageChange(currentPage - 1)"
    >
      Previous
    </CPaginationItem>
    <CPaginationItem
      v-for="page in visiblePages"
      :key="page"
      href="#"
      :active="page === currentPage"
      @click.prevent="handlePageChange(page)"
    >
      {{ page }}
    </CPaginationItem>
    <CPaginationItem
      href="#"
      :disabled="currentPage === totalPages"
      @click.prevent="handlePageChange(currentPage + 1)"
    >
      Next
    </CPaginationItem>
    <CPaginationItem
      href="#"
      :disabled="currentPage === totalPages"
      @click.prevent="handlePageChange(totalPages)"
    >
      Last
    </CPaginationItem>
  </CPagination>
</template>

<script setup>
import { CPagination, CPaginationItem } from '@coreui/vue'


const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    default: 1,
  },
  totalPages: {
    type: Number,
    required: true,
    default: 0,
  },
  visiblePages: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['goToPage'])

const handlePageChange = (page) => {
  if (page !== props.currentPage && page >= 1 && page <= props.totalPages) {
    emit('goToPage', page)
  }
}
</script>

<style scoped>
.pagination-info {
  font-size: 0.875rem;
}

.pagination-info span {
  font-weight: 500;
}
</style>

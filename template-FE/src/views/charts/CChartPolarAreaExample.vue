<template>
  <CChartPolarArea :data="defaultData" />
</template>

<script setup>
import { computed } from 'vue'
import { CChartPolarArea } from '@coreui/vue-chartjs'

const defaultData = computed(() => ({
  labels: [
    'Eating',
    'Drinking',
    'Sleeping',
    'Designing',
    'Coding',
    'Cycling',
    'Running',
  ],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#FF6384'
      ],
      data: [65, 59, 90, 81, 56, 55, 40],
    },
  ],
  options: {
    aspectRatio: 1.5,
  },
}))
</script>

<template>
  <CChartRadar :data="defaultData" />
</template>

<script setup>
import { computed } from 'vue'
import { CChartRadar } from '@coreui/vue-chartjs'

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
      label: '2024',
      backgroundColor: 'rgba(179, 181, 198, 0.2)',
      borderColor: 'rgba(179, 181, 198, 1)',
      pointBackgroundColor: 'rgba(179, 181, 198, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(179, 181, 198, 1)',
      data: [65, 59, 90, 81, 56, 55, 40],
    },
    {
      label: '2025',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      pointBackgroundColor: 'rgba(255, 99, 132, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
      data: [28, 48, 40, 19, 96, 27, 100],
    },
  ],
  options: {
    aspectRatio: 1.5,
  },
}))
</script>

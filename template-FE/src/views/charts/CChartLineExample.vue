<template>
  <CChartLine :data="defaultData" />
</template>

<script setup>
import { computed } from 'vue'
import { CChartLine } from '@coreui/vue-chartjs'

const defaultData = computed(() => ({
  labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [
    {
      label: 'Data One',
      backgroundColor: 'rgba(228, 102, 81, 0.2)',
      borderColor: 'rgb(228, 102, 81)',
      data: [30, 39, 10, 50, 30],
    },
    {
      label: 'Data Two',
      backgroundColor: 'rgba(0, 216, 255, 0.2)',
      borderColor: 'rgb(0, 216, 255)',
      data: [39, 80, 40, 35, 40],
    },
  ],
}))
</script>

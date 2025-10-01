<template>
  <CChartDoughnut :data="defaultData" />
</template>

<script setup>
import { computed } from 'vue'
import { CChartDoughnut } from '@coreui/vue-chartjs'

const defaultData = computed(() => ({
  labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
  datasets: [
    {
      backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
      data: [40, 20, 80, 10],
    },
  ],
}))
</script>

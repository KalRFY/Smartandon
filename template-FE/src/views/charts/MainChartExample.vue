<template>
  <CChart
    type="line"
    :data="data"
    :options="options"
    @get-dataset-at-event="handleDatasetEvent"
    @get-element-at-event="handleElementEvent"
    @get-elements-at-event="handleElementsEvent"
  />
</template>

<script setup>
import { reactive, ref } from 'vue'
import { CChart } from '@coreui/vue-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils/src'

const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const data = reactive({
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Performance Metrics',
      backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
      borderColor: getStyle('--cui-info'),
      pointHoverBackgroundColor: getStyle('--cui-info'),
      borderWidth: 2,
      data: [
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
      ],
      fill: true,
    },
    {
      label: 'Secondary Metrics',
      backgroundColor: 'transparent',
      borderColor: getStyle('--cui-success'),
      pointHoverBackgroundColor: getStyle('--cui-success'),
      borderWidth: 2,
      data: [
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
        random(50, 200),
      ],
    },
    {
      label: 'Target Line',
      backgroundColor: 'transparent',
      borderColor: getStyle('--cui-danger'),
      pointHoverBackgroundColor: getStyle('--cui-danger'),
      borderWidth: 1,
      borderDash: [8, 5],
      data: [65, 65, 65, 65, 65, 65, 65],
    },
  ],
})

const options = reactive({
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        drawOnChartArea: false,
      },
    },
    y: {
      ticks: {
        beginAtZero: true,
        maxTicksLimit: 5,
        stepSize: Math.ceil(250 / 5),
        max: 250,
      },
    },
  },
  elements: {
    line: {
      tension: 0.4,
    },
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
      hoverBorderWidth: 3,
    },
  },
})

const handleDatasetEvent = (event, elements) => {
  console.log('Dataset event:', event, elements)
}

const handleElementEvent = (event, elements) => {
  console.log('Element event:', event, elements)
}

const handleElementsEvent = (event, elements) => {
  console.log('Elements event:', event, elements)
}
</script>

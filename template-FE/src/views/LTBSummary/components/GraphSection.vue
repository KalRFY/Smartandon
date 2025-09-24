<template>
    <div>
        <BarChart :data="chartData" :options="chartOptions" />
    </div>
</template>

<script setup>
import BarChart from '@/components/BarChart.vue'

defineProps({
    chartData: {
        type: Object,
        required: true,
    },
    chartOptions: {
        type: Object,
        default: () => ({
        responsive: true,
        scales: {
            y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'LTB Total'
            }
            },
            x: {
            title: {
                display: true,
                text: 'Month'
            }
            }
        }
        }),
    },
})
</script>

<style scoped>

</style>
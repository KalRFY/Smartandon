<template>
  <CContainer fluid v-if="seriesData && seriesData.length > 0" id="chart">
    <ApexChart
      :options="options"
      :series="seriesData"
      type="line"
      height="350"
    />
  </CContainer>
</template>

<script setup>
import { computed, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import ApexChart from 'vue3-apexcharts'
import { CContainer } from '@coreui/vue'

const q6Categories = [
  'Q1 (Diagnose)',
  'Q2 (SpareParts)',
  'Q3 (Tools)',
  'Q4 (Maintenance Ability)',
  'Q5 (Machine Setting)',
  'Q6 (Machine Backup)'
]

const props = defineProps({
  graphData: {
    type: Object,
    required: true,
  },
  seriesData: {
    type: Array,
    required: true,
  },
});

const { graphData, seriesData } = toRefs(props);

const router = useRouter();

const options = computed(() => {
    try {
        const g = graphData?.value ?? {};
        const s = Array.isArray(seriesData?.value) ? seriesData.value : [];

        return {
        chart: {
            stacked: true,
            height: 350,
            type: 'line',
            events: {
            dataPointSelection: (event, chartContext, config) => {
                const si = config?.seriesIndex;
                const item = s?.[si];
                if (!item || !item.fid) return;
                router.push(`/editProblem?v_=${item.fid}`);
            },
            },
        },
        colors: g.chartOptions?.colors ?? [],
        legend: { show: false },
        stroke: { 
            width: g.chartOptions?.strokeWidth ?? [4]
        },
        title: { text: 'Q6 Analysis Graph' },
        dataLabels: {
            enabled: true,
            enabledOnSeries: g.chartOptions?.enabledOnSeries ?? [],
        },

        labels: q6Categories,
        xaxis: {
            categories: q6Categories
        },
        yaxis: Array.isArray(g.chartOptions?.yaxis) && g.chartOptions.yaxis.length > 0
            ? g.chartOptions.yaxis[0]
            : {
                title: { text: 'Values' }
            }
        };
    } catch (error) {
        console.error('Error in options computed:', error);
        return {
        chart: { type: 'line', height: 350 },
        series: []
        };
    }
});

</script>

<style scoped>
#chart {
  width: 100%;
}
</style>
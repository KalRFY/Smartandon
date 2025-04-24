<template>
  
  <CCard>
    <CCardHeader>Dashboard Data</CCardHeader>
    <CCardBody>
      <CListGroup>
        <CListGroupItem v-for="item in dataList" :key="item.id">
          {{ item.name }}: {{ item.value }}
        </CListGroupItem>
      </CListGroup>
    </CCardBody>
  </CCard>
</template>

<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { CCard, CCardHeader, CCardBody, CListGroup, CListGroupItem } from '@coreui/vue';

export default {
  name: 'DashboardDataDisplay',
  components: {
    CCard,
    CCardHeader,
    CCardBody,
    CListGroup,
    CListGroupItem,
  },
  setup() {
    const dataList = ref([]);

    const fetchData = async () => {
      try {
        const response = await axios.get('/dashboard/data');
        dataList.value = response.data;
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    onMounted(() => {
      fetchData();
    });

    return {
      dataList,
    };
  },
};
</script>

<style scoped>
</style>

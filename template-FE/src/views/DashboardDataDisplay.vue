<template>
  <div>
    <h3>QCC M Types</h3>
    <CTable v-if="types.length" bordered hover responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Type ID</CTableHeaderCell>
          <CTableHeaderCell>Type Name</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        <CTableRow v-for="type in types" :key="type.type_id">
          <CTableDataCell>{{ type.type_id }}</CTableDataCell>
          <CTableDataCell>{{ type.type_nm }}</CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>
    <p v-else>Loading data...</p>
  </div>
</template>

<script>
import axios from 'axios';
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
} from '@coreui/vue';

export default {
  name: 'DashboardDataDisplay',
  components: {
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
  },
  data() {
    return {
      types: [],
    };
  },
  async created() {
    try {
      const response = await axios.get('/api/smartandon/qcc-m-types');
      this.types = response.data;
    } catch (error) {
      console.error('Failed to fetch qcc_m_types:', error);
    }
  },
};
</script>

<style scoped>
p {
  font-style: italic;
}
</style>

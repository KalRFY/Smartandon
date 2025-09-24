<template>
  <div>
    <PageHeader title="Smartandon" />
    
    <DataTable
      :data="types"
      :columns="typesColumns"
      key-field="type_id"
      loading-text="Loading data..."
    />

    <DataTable
      :data="spareparts"
      :columns="sparepartsColumns"
      key-field="sparepart_id"
      loading-text="Loading spareparts..."
    />

    <DataTable
      :data="lines"
      :columns="linesColumns"
      key-field="fid"
      loading-text="Loading data..."
    />

    <DataTable
      :data="problems"
      :columns="problemsColumns"
      key-field="fid"
      loading-text="Loading data..."
    />

    <DataTable
      :data="machines"
      :columns="machinesColumns"
      key-field="fid"
      loading-text="Loading data..."
    />

    <DataTable
      :data="oee"
      :columns="oeeColumns"
      key-field="CLIENT_HDL"
      loading-text="Loading data..."
    />

    
    <DataTable
      :data="members"
      :columns="membersColumns"
      key-field="fid"
      loading-text="Loading data..."
    />

    <ActiveProblemsTable :problem-active="problemActive" />

    <CContainer fluid>
    </CContainer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { CContainer } from '@coreui/vue'
import PageHeader from './components/PageHeader.vue'
import DataTable from './components/DataTable.vue'
import ActiveProblemsTable from './components/ActiveProblemsTable.vue'
import api from '@/apis/CommonAPI'

const types = ref([])
const lines = ref([])
const linesOptions = ref([])
const machines = ref([])
const machineOptions = ref([])
const problems = ref([])
const problemOption = ref([])
const oee = ref([])
const oeeOption = ref([])
const members = ref([])
const memberOption = ref([])
const spareparts = ref([])
const sparepartsOption = ref([])
const problemActive = ref([])
const loadingProblemActive = ref(false)
const limitView = ref(0)

const typesColumns = ref([
  { key: 'type_id', label: 'Type ID' },
  { key: 'type_nm', label: 'Type Name' }
])

const sparepartsColumns = ref([
  { key: 'sparepart_id', label: 'ID' },
  { key: 'sparepart_nm', label: 'Sparepart' }
])

const linesColumns = ref([
  { key: 'fid', label: 'fid' },
  { key: 'fline', label: 'fline' }
])

const problemsColumns = ref([
  { key: 'fid', label: 'fid' },
  { key: 'ferror_name', label: 'ferror_name' }
])

const machinesColumns = ref([
  { key: 'fid', label: 'fid' },
  { key: 'fmc_name', label: 'fmc_name' }
])

const oeeColumns = ref([
  { key: 'GROUP_NAME', label: 'Line' },
  { key: 'TAG_NAME', label: 'OEE' },
  { key: 'REG_VALUE', label: 'Value' }
])

const membersColumns = ref([
  { key: 'fid', label: 'Member Id' },
  { key: 'fname', label: 'Member Name' }
])

const fetchSpareparts = async () => {
  try {
    const response = await api.get('/smartandon/spareparts')
    if (response.status !== 200) {
      throw new Error('Failed to fetch spareparts, status: ' + response.status)
    }
    spareparts.value = response.data?.data || response.data
    sparepartsOption.value = spareparts.value.map(sparepart => ({
      id: sparepart.sparepart_id,
      label: sparepart.sparepart_nm
    }))
  } catch (error) {
    console.error('Failed to fetch spareparts:', error)
  }
}

const fetchProblemActive = async () => {
  try {
    loadingProblemActive.value = true
    limitView.value = 0
    const response = await api.get('/smartandon/problemView', {
      limitView: 0,
    })
    if (response.status !== 200) {
      throw new Error('Failed to fetch active problems, status: ' + response.status)
    }
    problemActive.value = response.data?.data || response.data
    console.log('Filtered active problems:', problemActive.value)
  } catch (error) {
    console.error('Failed to fetch active problems:', error)
    problemActive.value = []
  } finally {
    loadingProblemActive.value = false
  }
}

const fetchTypes = async () => {
  try {
    const response = await api.get('/smartandon/qcc-m-types')
    if (response.status !== 200) {
      throw new Error('Failed to fetch qcc_m_types, status: ' + response.status)
    }
    types.value = response.data?.data || response.data
  } catch (error) {
    console.error('Failed to fetch qcc_m_types:', error)
  }
}

const fetchLines = async () => {
  try {
    const response = await api.get('/smartandon/line')
    if (response.status !== 200) {
      throw new Error('Failed to fetch lines, status: ' + response.status)
    }
    lines.value = response.data?.data || response.data
    linesOptions.value = lines.value.map(line => ({
      id: line.fid,
      label: line.fline
    }))
  } catch (error) {
    console.error('Failed to fetch lines:', error)
  }
}

const fetchMachines = async () => {
  try {
    const response = await api.get('/smartandon/machine')
    if (response.status !== 200) {
      throw new Error('Failed to fetch machines, status: ' + response.status)
    }
    machines.value = response.data?.data || response.data
    machineOptions.value = machines.value.map(machine => ({
      id: machine.fid,
      label: machine.fmc_name
    }))
  } catch (error) {
    console.error('Failed to fetch machines:', error)
  }
}

const fetchProblems = async () => {
  try {
    const response = await api.get('/smartandon/problemId')
    if (response.status !== 200) {
      throw new Error('Failed to fetch problems, status: ' + response.status)
    }
    problems.value = response.data?.data || response.data
    problemOption.value = problems.value.map(problem => ({
      id: problem.fid,
      label: problem.ferror_name
    }))
  } catch (error) {
    console.error('Failed to fetch problems:', error)
  }
}

const fetchOee = async () => {
  try {
    const response = await api.get('/smartandon/oee')
    if (response.status !== 200) {
      throw new Error('Failed to fetch oee, status: ' + response.status)
    }
    oee.value = response.data?.data || response.data
    oeeOption.value = oee.value.map(oeeValue => ({
      id: oeeValue.GROUP_NAME,
      label: oeeValue.TAG_NAME,
      labelOee: oeeValue.REG_VALUE
    }))
  } catch (error) {
    console.error('Failed to fetch oee:', error)
  }
}

const fetchMembers = async () => {
  try {
    const response = await api.get('/smartandon/member')
    if (response.status !== 200) {
      throw new Error('Failed to fetch member, status: ' + response.status)
    }
    members.value = response.data?.data || response.data
    memberOption.value = members.value.map(member => ({
      id: member.fid,
      label: member.fname
    }))
  } catch (error) {
    console.error('Failed to fetch member:', error)
  }
}

onMounted(async () => {
  await Promise.all([
    fetchSpareparts(),
    fetchProblemActive(),
    fetchTypes(),
    fetchLines(),
    fetchMachines(),
    fetchProblems(),
    fetchOee(),
    fetchMembers(),
  ])
})
</script>

<style scoped>
/* Main dashboard styles */
</style>

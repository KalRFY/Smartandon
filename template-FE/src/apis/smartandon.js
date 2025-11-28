import axios from 'axios'

const smartandonAxios = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
})

export function getLines() {
  return smartandonAxios.get('/smartandon/ky-lines')
}

export function getMachines(line) {
  return smartandonAxios.get(`/smartandon/ky-machines`, { params: { line } })
}

export function getKYData(fline) {
  return smartandonAxios.get('/smartandon/ky-data', {
    params: {
      fline: fline,
    },
  })
}

export function getKYColorDash() {
  return smartandonAxios.get('/smartandon/ky-colordash')
}

export function addKY(formData) {
  return smartandonAxios.post('/smartandon/ky-add', formData)
}

export function editKY(formData) {
  return smartandonAxios.put('/smartandon/ky-edit', formData)
}

export function deleteKY(id) {
  return smartandonAxios.delete(`/smartandon/ky-delete/${id}`)
}

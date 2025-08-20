import axios from 'axios'

const smartandonAxios = axios.create({
  baseURL: 'https://mt-system.id/api/smartandon'
})

export function getLines() {
  return smartandonAxios.get('/line')
}

export function getMachines() {
  return smartandonAxios.get('/machine')
}
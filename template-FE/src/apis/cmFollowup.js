import axios from 'axios'
import dayjs from 'dayjs'

axios.defaults.baseURL = 'https://smartandonsys.web.app'

export async function getCMFollowup(filters) {
  const { line, start_date, end_date } = filters
  const response = await axios.get('/cmFollowup', {
    params: {
      ...(line ? { line } : {}),
      startDate: start_date,
      endDate: end_date,
    },
  })

  const raw = response.data?.data || []

  return raw.map((item) => {
    let cms = []
    try {
      cms = JSON.parse(item.fpermanet_cm || '[]')
    } catch {
      cms = []
    }

    const first = cms[0] || {}

    let schedule = []
    if (first.datePlan) {
      const date = dayjs(first.datePlan)
      const monthIndex = date.month() + 1
      if (monthIndex >= 1 && monthIndex <= 12) {
        schedule.push(monthIndex)
      }
    }

    return {
      line: item.fline || '-',
      machine: item.fmc_name || '-',
      date: item.fstart_time ? dayjs(item.fstart_time).format('YYYY-MM-DD') : '-',
      problem: item.ferror_name || '-',
      duration: item.fdur || '-',
      rootcause: first.cmCategory || '-',
      countermeasure: first.cmDesc || '-',
      dueDate: first.datePlan || '-',
      pic: first.pic || '-',
      status: first.judg ? 'OK' : 'NOT YET',

      kategori: first.cmCategory || '-',

      reason_occurred: !!first.reason_occurred,
      reason_delayed: !!first.reason_delayed,

      schedule,
    }
  })
}
import queryClient from '@/helpers/client'
import StatisticsService from '@/services/statisticsService'
import {
  DEFAULT_RES_STATISTICS,
  calPreDay,
  getDaysInMonth,
} from '@/utils/chart'
import { endOfQuarter, endOfWeek } from '@/utils/date'
import dayjs from 'dayjs'

const labels = [
  'Thứ 2',
  'Thứ 3',
  'Thứ 4',
  'Thứ 5',
  'Thứ 6',
  'Thứ 7',
  'Chủ nhật',
]
export const chartData = {
  pie: {
    labels: ['Doanh thu', 'Lợi nhuận'],
    datasets: [
      {
        label: '# of Votes',
        data: [3, 5],
        backgroundColor: ['#165BAA', '#F765A3'],
      },
    ],
  },
  bar: {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: labels.map(() => Math.random() * (1000 - 0) + 0),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Dataset 2',
        data: labels.map(() => Math.random() * (1000 - 0) + 0),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  },
}

export const statsData = [
  {
    label: 'Doanh thu',
    number: 500000,
    per: 34,
    desc: 'So với quý trước',
  },
  {
    label: 'Lợi nhuận',
    number: 50000,
    per: 28,
    desc: 'So với quý trước',
  },
]

export const segmentData = [
  { value: 'general', label: 'Tổng' },
  { value: 'per', label: 'Theo tháng' },
]

export const getStatisQuarterData = async (
  user: any,
  selectedDay: Date = new Date(),
) => {
  const startDayOfPreQuarter = dayjs(selectedDay)
    .subtract(1, 'quarter')
    .toDate()
  const preData = await getData(user, startDayOfPreQuarter)
  const selectedData = await getData(user, selectedDay)
  return selectedData && preData
    ? { selectedData, preData }
    : DEFAULT_RES_STATISTICS
}

const getData = async (user: any, selectedDay: Date) => {
  let start: string = selectedDay?.toLocaleDateString('en-GB')
  let end: string = endOfQuarter(selectedDay).toLocaleDateString('en-GB')
  return await queryClient.ensureQueryData({
    queryKey: ['quarterStatsData', start, end],
    queryFn: () => {
      const statisticsService = new StatisticsService(user)
      return statisticsService.getRevenueAndProfit(start, end)
    },
    initialData: {
      revenue: 0,
      profit: 0,
    },
  })
}

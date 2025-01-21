import queryClient from '@/helpers/client'
import StatisticsService from '@/services/statisticsService'
import { DEFAULT_RES_STATISTICS, calPreDay } from '@/utils/chart'

export const getStatisDayData = async (
  user: any,
  selectedDay: Date = new Date(),
) => {
  const preDay = calPreDay(selectedDay)
  const preData = await getData(user, preDay)
  const selectedData = await getData(user, selectedDay)
  return selectedData && preData
    ? { selectedData, preData }
    : DEFAULT_RES_STATISTICS
}

const getChartData = () => {}

const getData = async (user: any, selectedDay: Date | string) => {
  const date =
    typeof selectedDay === 'string'
      ? selectedDay
      : selectedDay?.toLocaleDateString('en-GB')
  return await queryClient.ensureQueryData({
    queryKey: ['dayStatsData', date],
    queryFn: () => {
      const statisticsService = new StatisticsService(user)
      return statisticsService.getRevenueAndProfit(date, date)
    },
    initialData: {
      revenue: 0,
      profit: 0,
    },
  })
}

export const chartData = {
  labels: [''],
  datasets: [
    {
      data: [3],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      data: [5],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
}

export const statsData = [
  {
    label: 'Doanh thu',
    number: 500000,
    per: 34,
    desc: 'So với ngày hôm qua',
  },
  {
    label: 'Lợi nhuận',
    number: 50000,
    per: 28,
    desc: 'So với ngày hôm qua',
  },
]

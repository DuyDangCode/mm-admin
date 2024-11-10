import queryClient from "@/helpers/client";
import StatisticsService from "@/services/statisticsService";
import { DEFAULT_RES_STATISTICS } from "@/utils/chart";

const labels = [
  'Thứ 2',
  'Thứ 3',
  'Thứ 4',
  'Thứ 5',
  'Thứ 6',
  'Thứ 7',
  'Chủ nhật',
];

export const getStatisYearData = async(user: any, day: Date = new Date()) => {
    const selectedDay = `1/1/${day.getFullYear()}`;
    const preDay = `1/1/${day.getFullYear()-1}`;
    const preData = await getData(user, preDay);
    const selectedData = await getData(user, selectedDay);
    return selectedData && preData ? {selectedData, preData} : DEFAULT_RES_STATISTICS;    
}

const getData = async(user: any, selectedDay: Date | string) => {
    let date: string = '1/1/2024';
    let year: any = 2024;

    if(typeof selectedDay === 'string'){
        date =  selectedDay; 
        year = selectedDay.split('/')[2];
    }else{
        date = selectedDay?.toLocaleDateString('en-GB');
        year = selectedDay.getFullYear(); 
    }
    return await queryClient.ensureQueryData({
    queryKey: ['yearStatsData', date],
    queryFn: () => {
      const statisticsService = new StatisticsService(user);
      return statisticsService.getRevenueAndProfit(
        date,
        `31/12/${year}`
      );
        },
    initialData: {
        "revenue": 0,
        "profit": 0
    }
    })
}


export const chartData = {
  pie: {
    labels: ['Doanh thu', 'Lợi nhuận'],
    datasets: [
      {
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
};
export const statsData = [
  {
    label: 'Doanh thu',
    number: 500000,
    per: 34,
    desc: 'Compare with previous year',
  },
  {
    label: 'Lợi nhuận',
    number: 50000,
    per: 28,
    desc: 'Compare with previous year',
  },
];

export const segmentData = [
  { value: 'general', label: 'Tổng' },
  { value: 'per', label: 'Theo tháng' },
];

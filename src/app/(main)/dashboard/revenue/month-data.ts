import queryClient from "@/helpers/client";
import StatisticsService from "@/services/statisticsService";
import { DEFAULT_RES_STATISTICS, calPreDay, getDaysInMonth } from "@/utils/chart";
import dayjs from "dayjs"


export const getStatisMonthData = async(user: any, day: Date = new Date()) => {
    const selectedDay = `1/${day.getMonth() + 1}/${day.getFullYear()}`;
    const preDay = `1/${day.getMonth()}/${day.getFullYear()}`;
    const preData = await getData(user, preDay);
    const selectedData = await getData(user, selectedDay);
    return selectedData && preData ? {selectedData, preData} : DEFAULT_RES_STATISTICS;    
}

const getData = async(user: any, selectedDay: Date | string) => {
    let date: string = '1/1/2024';
    let month: any = 1;
    let year: any = 2024;

    if(typeof selectedDay === 'string'){
        date =  selectedDay; 
        month = selectedDay.split('/')[1];
        year = selectedDay.split('/')[2];
    }else{
        date = selectedDay?.toLocaleDateString('en-GB');
        month = selectedDay.getMonth() + 1; 
        year = selectedDay.getFullYear(); 
    }
    return await queryClient.ensureQueryData({
    queryKey: ['monthStatsData', date],
    queryFn: () => {
      const statisticsService = new StatisticsService(user);
      return statisticsService.getRevenueAndProfit(
        date,
        `${getDaysInMonth(month, year)}/${month}/${year}`
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
        datasets: [{
            data: [3, 5],
            backgroundColor: ['#165BAA', '#F765A3']
        }]
    },
    bar: {
        labels: Array.from({ length: 30 }, (_, index) => index + 1),
        datasets: [
            {
                fill: true,
                label: 'Dataset 2',
                data: Array.from({ length: 30 }, (_, index) => index + 1).map(() => Math.random() * (1000 - 0) + 0),
                borderColor: 'rgb(53, 162, 235)',
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
        desc: 'Compare with previous month'
    },
    {
        label: 'Lợi nhuận',
        number: 50000,
        per: 28,
        desc: 'Compare with previous month'
    }
]

export const segmentData = [ 
    { value: 'general', label: 'Tổng' },
    { value: 'per', label: 'Theo ngày' }
]
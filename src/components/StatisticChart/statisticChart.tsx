'use client';
import { SegmentedControl } from '@mantine/core';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  ArcElement,
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
  Tooltip,
} from 'chart.js';
import { useQueries, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import UserContext from '@/contexts/UserContext';
import StatisticsService from '@/services/statisticsService';
import { endOfQuarter } from '@/utils/date';
import { getDaysInMonth } from '@/utils/chart';

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
);

const mockSegmentData = [
  { value: 'general', label: 'Tổng' },
  { value: 'per', label: 'Theo ngày' },
];
const barOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      // text: 'Chart.js Bar Chart',
    },
  },
};

type Props = {
  segment?: boolean;
  segmentData?: {
    value: string;
    label: string;
  }[];
  chartData: any;
  chartSize?: number;
  startDay: Date;
  endDay: Date;
  type: number;
  user: any;
};

export default function StatisticChart({
  chartData,
  segment = false,
  segmentData = mockSegmentData,
  startDay,
  endDay,
  type = 0,
  user,
}: Props) {
  const [chartType, setChartType] = useState(segmentData.at(0)?.value);
  const [timeType, setTimeType] = useState(segmentData[1].label);

  const divideDay = (
    type: string = 'Theo ngày',
    start: Date = new Date(),
    end: Date = new Date(),
    typeChart: number = 0
  ): Date[] => {
    const result: Date[] = [];
    if (type === 'Theo ngày') {
      const startDate = start.getDate();
      const endDate = typeChart === 1 ? startDate + 6 : end.getDate();
      let temp = start;
      for (let i = startDate; i <= endDate; i++) {
        result.push(temp);
        temp = dayjs(temp).add(1, 'day').toDate();
      }
      return result;
    }

    const startYear = start.getFullYear();
    if (typeChart === 4) {
      for (let i = 0; i < 12; i++) {
        result.push(new Date(`${i + 1}/1/${startYear}`));
      }
      return result;
    }

    const startMonth = start.getMonth() + 1;
    const endMonth = end.getMonth() + 1;
    for (let i = startMonth; i <= endMonth; i++) {
      result.push(new Date(`${i}/1/${startYear}`));
    }
    return result;
  };

  const days = divideDay(timeType, startDay, endDay, type);

  const barChartQuery = useQueries({
    queries: days.map((day) => ({
      queryKey: [
        type === 3 || type === 4 ? 'monthChartData' : 'dayChartData',
        day.toLocaleDateString('en-GB'),
      ],
      queryFn: () => {
        const statisticsService = new StatisticsService(user);
        if (timeType === 'Theo ngày')
          return statisticsService.getRevenueAndProfit(
            day.toLocaleDateString('en-GB'),
            day.toLocaleDateString('en-GB')
          );

        return statisticsService.getRevenueAndProfit(
          day.toLocaleDateString('en-GB'),
          `${getDaysInMonth(day.getMonth() + 1)}/${
            day.getMonth() + 1
          }/${day.getFullYear()}`
        );
        // return { revenue: 0, profit: 0 };
      },
      // staleTime: Infinity,
    })),
    combine: (results: any) => {
      return {
        data: results.map((result: any) => result.data),
        pending: results.some((result: any) => result.isPending),
      };
    },
  });

  const [barChartrRevenueData, setBarChartrRevenueData] = useState<any>([]);
  const [barChartrProfitData, setBarChartrProfitData] = useState<any>([]);

  useLayoutEffect(() => {
    if (barChartQuery.pending == false) {
      const revenueData: any[] = [];
      const profitData: any[] = [];
      barChartQuery.data.map((data: any) => {
        revenueData.push(data?.revenue);
        profitData.push(data?.profit);
      });
      setBarChartrRevenueData(revenueData);
      setBarChartrProfitData(profitData);
    }
  }, [barChartQuery.pending, startDay, endDay]);

  if (type === 3) {
    console.log('barChartQuery', barChartQuery.data);
  }

  let pieChart = (
    <div className={`w-[350px] aspect-square m-auto`}>
      <Pie data={segment ? chartData.pie : chartData} />
    </div>
  );
  let barChart = (
    <Bar
      className={`w-[700px]`}
      options={barOptions}
      data={{
        labels: chartData.bar?.labels,
        datasets: [
          {
            label: 'Doanh thu',
            data: barChartrRevenueData,
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
          {
            label: 'Lợi nhuận',
            data: barChartrProfitData,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      }}
    />
  );
  if (segment)
    return (
      <div className='flex flex-col gap-[12px] flex-wrap items-end'>
        <SegmentedControl
          className=''
          size='sm'
          value={chartType}
          onChange={setChartType}
          data={segmentData}
        />
        <div className='w-[700px]'>
          {chartType === segmentData.at(0)?.value ? pieChart : barChart}
        </div>
      </div>
    );
  else return <div className='w-[700px]'>{pieChart}</div>;
}

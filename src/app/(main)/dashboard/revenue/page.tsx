'use client';
import {
  Flex,
  Group,
  ScrollArea,
  Tabs,
  Title,
  Text,
  Stack,
  Divider,
} from '@mantine/core';
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  chartData as DayChart,
  statsData as DayStats,
  getStatisDayData,
} from './day-data';
import {
  chartData as WeekChart,
  statsData as WeekStats,
  segmentData as WeekSegment,
  getStatisWeekData,
} from './week-data';
import {
  chartData as MonthChart,
  statsData as MonthStats,
  segmentData as MonthSegment,
  getStatisMonthData,
} from './month-data';
import {
  chartData as QuarterChart,
  statsData as QuarterStats,
  segmentData as QuarterSegment,
  getStatisQuarterData,
} from './quarter-data';
import {
  chartData as YearChart,
  statsData as YearStats,
  segmentData as YearSegment,
  getStatisYearData,
} from './year-data';
import ReportTable from '@/components/ReportTable/reportTable';
import StatisticChart from '@/components/StatisticChart/statisticChart';
import CalendarInput from '@/components/CalendarInput/calendarInput';
import {
  startOfWeek,
  startOfQuarter,
  endOfWeek,
  endOfQuarter,
} from '@/utils/date';
import dynamic from 'next/dynamic';
import StatsticCard from '@/components/StatisticChart/StatisticCard/statsticCard';
import { useRouter } from 'next/navigation';
import UserContext from '@/contexts/UserContext';
import {
  DEFAULT_BARCHART,
  DEFAULT_STATS,
  calPer,
  getLabels,
} from '@/utils/chart';
import { ChartInterface, StatsInterface } from '@/utils/response';
import useRangeTime from '@/hooks/useRangeTime';
import { useQueries } from '@tanstack/react-query';
import queryClient from '@/helpers/client';
import StatisticsService from '@/services/statisticsService';
import { getDaysInMonth } from '@/utils/chart';

const tabData = [
  {
    value: 'day',
    display: 'Ngày',
    chart: DayChart,
    stats: DayStats,
  },
  {
    value: 'week',
    display: 'Tuần',
    chart: WeekChart,
    stats: WeekStats,
    segment: WeekSegment,
  },
  {
    value: 'month',
    display: 'Tháng',
    chart: MonthChart,
    stats: MonthStats,
    segment: MonthSegment,
  },
  {
    value: 'quarter',
    display: 'Quý',
    chart: QuarterChart,
    stats: QuarterStats,
    segment: QuarterSegment,
  },
  {
    value: 'year',
    display: 'Năm',
    chart: YearChart,
    stats: YearStats,
    segment: YearSegment,
  },
];
const STATS_INDEX = {
  day: 0,
  week: 1,
  month: 2,
  quarter: 3,
  year: 4,
};

export default function RevenuePage() {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const [stats, setStats] = useState<StatsInterface[]>(DEFAULT_STATS);
  const [chart, setChart] = useState<ChartInterface[]>(DEFAULT_BARCHART);

  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [week, setWeek]: any = useRangeTime('week', selectedDay);
  const [quarter, setQuarter]: any = useRangeTime('quarter', selectedDay);
  const [tabIndex, setTabIndex] = useState(0);
  const [labels, setLabels] = useState(getLabels(selectedDay));

  // useQueries({
  //   queries: labels[0].map((label) => ({
  //     queryKey: ['chartData', label],
  //     queryFn: () => {
  //       const statisticsService = new StatisticsService(user);
  //       return statisticsService.getRevenueAndProfit(week[0], week[0]);
  //     },
  //   })),
  // });

  const getData = (
    fn: Function,
    user: UserContext,
    selectedDay: Date,
    index: number,
    setStatss: Function
  ) => {
    fn(user, selectedDay).then((res: any) => {
      if (res && res.preData && res.selectedData) {
        // console.log('res', res);
        setStatss((prevData: StatsInterface[]) => {
          prevData[index].selectTime = res.selectedData;
          prevData[index].preTime = res.preData;
          return [...prevData];
        });
      }
    });
  };

  useEffect(() => {
    queryClient.refetchQueries({ queryKey: ['Data'], type: 'inactive' });
  }, []);

  useLayoutEffect(() => {
    if (user) {
      getData(getStatisDayData, user, selectedDay, STATS_INDEX.day, setStats);
      getData(getStatisWeekData, user, week[0], STATS_INDEX.week, setStats);
      getData(
        getStatisMonthData,
        user,
        selectedDay,
        STATS_INDEX.month,
        setStats
      );
      getData(
        getStatisQuarterData,
        user,
        quarter[0],
        STATS_INDEX.quarter,
        setStats
      );
      getData(getStatisYearData, user, selectedDay, STATS_INDEX.year, setStats);
    }
  }, [user, selectedDay, week, quarter, tabIndex]);

  useEffect(() => {
    setLabels(getLabels(selectedDay));
  }, [selectedDay]);

  useEffect(() => {
    setLabels(getLabels(quarter[0]));
  }, [quarter]);

  useEffect(() => {
    setWeek([selectedDay, selectedDay]);
    setQuarter([selectedDay, selectedDay]);
  }, [selectedDay]);

  const choseStartDay = [
    selectedDay,
    week[0],
    new Date(`${selectedDay.getMonth() + 1}/1/${selectedDay.getFullYear()}`),
    quarter[0],
    new Date(`1/1/${selectedDay.getFullYear()}`),
  ];

  const choseEndDay = [
    selectedDay,
    week[1],
    new Date(
      `${selectedDay.getMonth() + 1}/${getDaysInMonth(
        selectedDay.getMonth() + 1
      )}/${selectedDay.getFullYear()}`
    ),
    quarter[1],
    new Date(`12/31/${selectedDay.getFullYear() + 1}`),
  ];

  const tabList = tabData.map((item, index) => (
    <Tabs.Tab
      key={item.value}
      value={item.value}
      onClick={() => {
        setTabIndex(index);
      }}
    >
      {item.display}
    </Tabs.Tab>
  ));

  const tabPanels = tabData.map((i, index: number) => (
    <Tabs.Panel
      key={i.value}
      value={i.value}
      className=' p-[12px] flex flex-col justify-between gap-[10px]'
    >
      <CalendarInput
        type={i.value}
        time={index === 1 ? week : index === 3 ? quarter : selectedDay}
        setTime={
          index === 1 ? setWeek : index === 3 ? setQuarter : setSelectedDay
        }
      />
      <div className='rounded-[8px] border-[0.5px] p-[16px] flex gap-[10px] justify-around items-center'>
        <Stack gap='1rem'>
          {i.stats?.map((i, zIndex) => (
            <StatsticCard
              key={i.label}
              label={i.label}
              number={
                zIndex === 0
                  ? stats[index].selectTime.revenue
                  : stats[index].selectTime.profit
              }
              per={
                zIndex === 0
                  ? calPer(
                      stats[index].selectTime.revenue,
                      stats[index].preTime.revenue
                    )
                  : calPer(
                      stats[index].selectTime.profit,
                      stats[index].preTime.profit
                    )
              }
              desc={i.desc}
            />
          ))}
        </Stack>
        {i.segment !== undefined ? (
          <StatisticChart
            chartData={{
              pie: {
                labels: ['Doanh thu', 'Lợi nhuận'],
                datasets: [
                  {
                    data: [
                      stats[index].selectTime.revenue,
                      stats[index].selectTime.profit,
                    ],
                    backgroundColor: ['#165BAA', '#F765A3'],
                  },
                ],
              },
              bar: {
                labels: labels[index - 1],
                datasets: [
                  {
                    label: 'Doanh thu',
                    data: chart[index - 1].revenue,
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                  },
                  {
                    label: 'Lợi nhuận',
                    data: chart[index - 1].profit,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                  },
                ],
              },
            }}
            chartSize={350}
            segment
            segmentData={i.segment}
            startDay={choseStartDay[index]}
            endDay={choseEndDay[index]}
            type={index}
            user={user}
          />
        ) : (
          <StatisticChart
            chartData={{
              labels: ['Doanh thu', 'Lợi nhuận'],
              datasets: [
                {
                  data: [
                    stats[index].selectTime.revenue,
                    stats[index].selectTime.profit,
                  ],
                  backgroundColor: ['#165BAA', '#F765A3'],
                },
              ],
            }}
            chartSize={350}
            startDay={choseStartDay[index]}
            endDay={choseEndDay[index]}
            type={0}
            user={user}
          />
        )}
      </div>
      <Divider my='sm' />
      {/* <ReportTable /> */}
    </Tabs.Panel>
  ));

  return (
    <ScrollArea className='h-full w-full z-[0]' py='1rem' px='2rem'>
      <Tabs
        variant='default'
        orientation='vertical'
        placement='right'
        defaultValue={tabData.at(0)?.value}
        activateTabWithKeyboard={false}
      >
        <div className='rounded-[8px] border-[0.5px] p-[12px] h-fit ml-[12px] sticky top-0'>
          <Tabs.List>{tabList}</Tabs.List>
        </div>
        {tabPanels}
      </Tabs>
    </ScrollArea>
  );
}

// export default dynamic(() => Promise.resolve(RevenuePage), { ssr: false });

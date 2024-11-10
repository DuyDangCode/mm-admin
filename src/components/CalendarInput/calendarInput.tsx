'use client';
import {
  DatePickerInput,
  DateValue,
  DatesRangeValue,
  MonthPickerInput,
  YearPickerInput,
} from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import { useState } from 'react';
import {
  startOfWeek,
  startOfQuarter,
  endOfWeek,
  endOfQuarter,
} from '@/utils/date';
import useRangeTime from '@/hooks/useRangeTime';

type Props = {
  type: string;
  time: any;
  setTime: any;
};

const calendarStratery = {
  day: DatePickerInput,
  month: MonthPickerInput,
};

export default function CalendarInput({ type, time, setTime }: Props) {
  switch (type) {
    case 'day':
      return (
        <DatePickerInput
          w='fit-content'
          leftSection={<IconCalendar />}
          leftSectionPointerEvents='none'
          valueFormat='DD/MM/YYYY'
          value={time}
          onChange={setTime}
        />
      );
    case 'week':
      return (
        <DatePickerInput
          w='fit-content'
          leftSection={<IconCalendar />}
          leftSectionPointerEvents='none'
          valueFormat='DD/MM/YYYY'
          type='range'
          value={time}
          onChange={setTime}
        />
      );
    case 'month':
      return (
        <MonthPickerInput
          w='fit-content'
          leftSection={<IconCalendar />}
          leftSectionPointerEvents='none'
          valueFormat='MM/YYYY'
          value={time}
          onChange={setTime}
        />
      );
    case 'quarter':
      return (
        <MonthPickerInput
          w='fit-content'
          leftSection={<IconCalendar />}
          leftSectionPointerEvents='none'
          valueFormat='MM/YYYY'
          type='range'
          value={time}
          onChange={setTime}
        />
      );
    case 'year':
      return (
        <YearPickerInput
          w='fit-content'
          leftSection={<IconCalendar />}
          leftSectionPointerEvents='none'
          valueFormat='YYYY'
          value={time}
          onChange={setTime}
        />
      );
    default:
      return (
        <DatePickerInput
          w='fit-content'
          leftSection={<IconCalendar />}
          leftSectionPointerEvents='none'
          valueFormat='DD/MM/YYYY'
          value={time}
          onChange={setTime}
        />
      );
  }
}

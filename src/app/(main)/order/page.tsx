'use client';
import CalendarInput from '@/components/CalendarInput/calendarInput';
import { chunk } from '@/utils/array';
import {
  ComboboxProps,
  Fieldset,
  Group,
  Pagination,
  ScrollArea,
  Select,
  Stack,
  Table,
  Checkbox,
  Text,
  LoadingOverlay,
  Button,
  Skeleton,
  Loader,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useContext } from 'react';
import UserContext from '@/contexts/UserContext';
import { useQuery } from '@tanstack/react-query';
import OrderService from '@/services/orderService';
import TableSkeleton from '@/components/Skeleton/tableSkeleton';
import OrderTable from './orderTable';

const dates = ['Ngày', 'Tuần', 'Tháng', 'Quý', 'Năm'];
const dateMapping = {
  Ngày: 'day',
  Tuần: 'week',
  Tháng: 'month',
  Quý: 'quarter',
  Năm: 'year',
};

const paymentState = ['Tất cả', 'Đã thanh toán', 'Chưa thanh toán'];
const shipmentState = [
  'Tất cả',
  'Chờ xác nhận',
  'Chuẩn bị hàng',
  'Đã hủy',
  'Đang giao',
  'Đã giao',
  'Giao thất bại',
  'Giao thành công',
];
const shipmentStatusMapping = {
  'Tất cả': '',
  'Chờ xác nhận': 'pending',
  'Chuẩn bị hàng': 'confirmed',
  'Đang giao': 'shipping',
  'Đã giao': 'shipped',
  'Đã hủy': 'cancelled',
  'Giao thất bại': 'failed',
  'Giao thành công': 'delivered',
};

const paymentStatusMapping = {
  'Tất cả': '',
  'Chưa thanh toán': 'pending',
  'Đã thanh toán': 'paid',
};

const comboboxStyles: ComboboxProps = {
  transitionProps: { transition: 'pop', duration: 200 },
  shadow: 'md',
};
export default function OnlineOrderSegment() {
  const [activePage, setPage] = useState(1);
  // filter
  const [date, setDate] = useState<string | null>(dates[0]);
  const [paymentFilter, setPaymentFilter] = useState<string | null>(
    paymentState[0]
  );
  const [shipmentFilter, setShipmentFilter] = useState<string | null>(
    shipmentState[0]
  );
  const { user } = useContext(UserContext);
  const orders = useQuery({
    queryKey: [
      'orders',
      activePage,
      shipmentStatusMapping[
      shipmentFilter as keyof typeof shipmentStatusMapping
      ],
    ],
    queryFn: () => {
      const orderService = new OrderService(user);
      return orderService.getAllOrder(
        10,
        activePage,
        shipmentStatusMapping[
        shipmentFilter as keyof typeof shipmentStatusMapping
        ]
      );
    },
    enabled: !!user,
  });

  const numberOfOrder = useQuery({
    queryKey: ['numberOfOrder'],
    queryFn: () => {
      const orderService = new OrderService(user);
      return orderService.getNumberOfOrder();
    },
    enabled: !!user,
  });

  // const handleFilter = (data: any) => {
  //     return data.filter((item: any) => {
  //         if (paymentFilter === paymentState[0])
  //             return true
  //         else
  //             return item.order_payment.status === paymentStatusMapping[paymentFilter as keyof typeof paymentStatusMapping]
  //     })
  // }
  const calPages = (num: any) => {
    let total: number;
    switch (shipmentFilter) {
      case shipmentState[0]:
        return (
          num.pending +
          num.confirmed +
          num.cancelled +
          num.shipping +
          num.shipped +
          num.failed +
          num.delivered
        );
      case shipmentState[1]:
        return num.pending;
      case shipmentState[2]:
        return num.confirmed;
      case shipmentState[3]:
        return num.cancelled;
      case shipmentState[4]:
        return num.shipping;
      case shipmentState[5]:
        return num.shipped;
      case shipmentState[6]:
        return num.failed;
      case shipmentState[7]:
        return num.delivered;
      default:
        break;
    }
  };

  return (
    <ScrollArea className='h-full w-full z-[0]' py='1rem' px='2rem'>
      <Stack className='flex flex-col gap-[16px]'>
        <Group justify='space-between'>
          <Title order={4}>Quản lí đơn hàng</Title>
          <Group>
            <Text size='sm' fw='700'>Trạng thái giao hàng: </Text>
            <Select
              w='fit-content'
              data={shipmentState}
              value={shipmentFilter}
              onChange={(value) => {
                setShipmentFilter(value)
                setPage(1)
              }}
              comboboxProps={comboboxStyles}
            />
          </Group>
        </Group>


        {orders.isPending || numberOfOrder.isPending ? (
          <div className='w-full h-[500px] flex justify-center items-center'>
            <Loader type='dots' />
          </div>
        ) : (
          <div>
            <Text>Số đơn hàng hiện có:
              <span style={{ fontWeight: '700', color: 'var(--mantine-color-turquoise-6)' }}>
                {calPages(numberOfOrder.data)}
              </span>
            </Text>
            <div className='flex flex-col border-[0.5px] border-solid rounded-[4px] w-full py-[12px] px-[16px]'>

              <OrderTable orders={orders.data} />
              <Pagination
                classNames={{
                  control: 'pagination-control',
                }}
                className='self-center'
                total={Math.ceil(calPages(numberOfOrder.data) as number / 10)}
                value={activePage}
                onChange={setPage}
                mt='sm'
              />
            </div>
          </div>
        )}
      </Stack>
    </ScrollArea>
  );
}

import { Order } from '@/utils/response';
import { chunk } from '@/utils/array';
import { Button, Checkbox, Pagination, Table, Text } from '@mantine/core';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { formatMoney, formatOrderId } from '@/utils/string';

type tableType = {
  id: string;
  createAt: string;
  customer: string;
  paymentStatus: string;
  shipmentStatus: string;
  finalPrice: number;
}[];

type Props = {
  orders: Order[];
};

const tableHeadList = [
  'Mã đơn hàng',
  'Ngày tạo',
  'Khách hàng',
  'Thanh toán',
  'Giao hàng',
  'Tổng tiền',
];

const tableHeadMapping = {
  id: 'Mã đơn hàng',
  createAt: 'Ngày tạo',
  customer: 'Khách hàng',
  paymentStatus: 'Thanh toán',
  shipmentStatus: 'Giao hàng',
  total: 'Tổng tiền',
};

const shipmentStatusMapping = {
  pending: 'Chờ xác nhận',
  confirmed: 'Chuẩn bị hàng',
  shipping: 'Đang giao',
  shipped: 'Đã giao',
  cancelled: 'Đã hủy',
  failed: 'Giao thất bại',
  delivered: 'Giao thành công',
};

const paymentStatusMapping = {
  pending: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
};
export default function OrderTable({ orders }: Props) {
  let currentPath = usePathname();
  const router = useRouter();

  const orderData: tableType = orders?.map((i: Order) => ({
    id: i._id,
    createAt: dayjs(i.createdAt).format('DD/MM/YYYY'),
    customer: i.order_username,
    paymentStatus: i.order_payment.status,
    shipmentStatus: i.order_status,
    finalPrice: i.order_checkout.finalPrice,
  }));

  const tableHead = tableHeadList.map((i) => <Table.Th key={i}>{i}</Table.Th>);

  const tableBody = orderData?.map((i) => (
    <Table.Tr key={i.id}>
      <Table.Td>{formatOrderId(i.id, i.createAt)}</Table.Td>
      <Table.Td>{i.createAt}</Table.Td>
      <Table.Td>{i.customer}</Table.Td>
      <Table.Td>
        {
          paymentStatusMapping[
          i.paymentStatus as keyof typeof paymentStatusMapping
          ]
        }
      </Table.Td>
      <Table.Td>
        {
          shipmentStatusMapping[
          i.shipmentStatus as keyof typeof shipmentStatusMapping
          ]
        }
      </Table.Td>
      <Table.Td>
        {formatMoney(i.finalPrice)}
        <span> đ</span>
      </Table.Td>
      <Table.Td
        className='cursor-pointer'
        onClick={() => router.push(`${currentPath}/${i.id}`)}
      >
        <Text c='turquoise'>Xem</Text>
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <Table
      highlightOnHover
      highlightOnHoverColor='turquoise.0'
      verticalSpacing='sm'
    >
      <Table.Thead>
        <Table.Tr key='head'>{tableHead}</Table.Tr>
      </Table.Thead>
      <Table.Tbody>{tableBody}</Table.Tbody>
    </Table>
  );
}

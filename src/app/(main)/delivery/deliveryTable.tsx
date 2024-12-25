'use client'
import { Table, Text } from '@mantine/core'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { formatMoney, formatOrderId } from '@/utils/string'
import { DeliveryOrder, DeliveryStatus } from '@/types/deliveryType'
import { paths } from '@/helpers/pathHelper'

type Props = {
  deliveries: DeliveryOrder[]
}

const tableHeadList = ['Mã đơn', 'Ngày tạo', 'Người tạo', 'Tình trạng']

const statusMap = new Map()
statusMap.set(DeliveryStatus.draft, 'Thử nghiệm')
statusMap.set(DeliveryStatus.pending, 'Đang xử lý')
statusMap.set(DeliveryStatus.cancelled, 'Đã hủy')
statusMap.set(DeliveryStatus.completed, 'Đã giao')

const mapStatus = (
  status: DeliveryStatus,
  statusMap: Map<DeliveryStatus, string>,
) => {
  if (statusMap.has(status)) return statusMap.get(status)
  return 'Thử nghiệm'
}

export default function DeliveryTable({ deliveries }: Props) {
  const router = useRouter()

  const tableHead = tableHeadList.map((i: string) => (
    <Table.Th key={i}>{i}</Table.Th>
  ))

  const tableBody = deliveries?.map((i) => (
    <Table.Tr key={i.id}>
      <Table.Td>{formatOrderId(i.id, i.createAt)}</Table.Td>
      <Table.Td>{i.createAt}</Table.Td>
      <Table.Td>{mapStatus(i.status, statusMap)}</Table.Td>
      <Table.Td
        className='cursor-pointer'
        onClick={() => {
          router.push(paths.deliveryDetail(i.id))
        }}
      >
        <Text c='turquoise'>Xem</Text>
      </Table.Td>
    </Table.Tr>
  ))
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
  )
}

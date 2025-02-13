'use client'
import { ActionIcon, ActionIconGroup, Table, Text } from '@mantine/core'
import { useContext, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  formatDeliveryIdWithoutCreateAt,
  formatMoney,
  formatOrderId,
} from '@/utils/string'
import { DeliveryOrder, DeliveryStatus } from '@/types/deliveryType'
import { paths } from '@/helpers/pathHelper'
import { IconEye, IconTrash } from '@tabler/icons-react'
import UserContext from '@/contexts/UserContext'
import DeliveryService from '@/services/deliveryService'
import queryClient from '@/helpers/client'
import toast from 'react-hot-toast'

type Props = {
  deliveries: DeliveryOrder[]
}

const tableHeadList = ['Mã đơn', 'Ngày tạo', 'Người tạo', '']

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
  const { user } = useContext(UserContext)
  const tableHead = tableHeadList.map((i: string) => (
    <Table.Th key={i}>{i}</Table.Th>
  ))

  const deleteDelivery = async (deliveryId: string) => {
    const deliveryService = new DeliveryService(user)
    const deletePromise = deliveryService.deleteDelivery(deliveryId)
    await toast.promise(deletePromise, {
      loading: 'Đang xử lý',
      success: 'Xóa thành công',
      error: 'Xóa thất bại',
    })
    queryClient.refetchQueries({
      queryKey: ['deliveries'],
      type: 'active',
      exact: true,
    })
  }

  const tableBody = deliveries?.map((i) => (
    <Table.Tr key={i.id}>
      <Table.Td>{formatDeliveryIdWithoutCreateAt(i.id)}</Table.Td>
      <Table.Td>{i.createAt}</Table.Td>
      <Table.Td>{mapStatus(i.status, statusMap)}</Table.Td>
      <Table.Td>
        <div className=' flex justify-center items-center gap-2'>
          <ActionIcon
            variant='filled'
            onClick={() => {
              router.push(paths.deliveryDetail(i.id))
            }}
          >
            <IconEye style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            variant='filled'
            onClick={() => {
              deleteDelivery(i.id)
            }}
          >
            <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
        </div>
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

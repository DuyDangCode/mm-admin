'use client'
import {chunk} from '@/utils/array'
import {Button, Checkbox, Pagination, Table, Text} from '@mantine/core'
import {useState} from 'react'
import {usePathname, useRouter} from 'next/navigation'
import dayjs from 'dayjs'
import {formatMoney, formatOrderId} from '@/utils/string'
import {Order, TableType} from '@/utils/response'

type Props = {
    orders: TableType
    callback: Function
    buttonName: string
}

const tableHeadList = [
    'Mã đơn hàng',
    'Ngày tạo',
    'Khách hàng',
    'Thanh toán',
    'Địa chỉ',
    'Tổng tiền',
]

const tableHeadMapping = {
    id: 'Mã đơn hàng',
    createAt: 'Ngày tạo',
    customer: 'Khách hàng',
    paymentStatus: 'Thanh toán',
    shipmentStatus: 'Địa chỉ',
    total: 'Tổng tiền',
}

const shipmentStatusMapping = {
    pending: 'Chờ xác nhận',
    confirmed: 'Chuẩn bị hàng',
    shipping: 'Đang giao',
    shipped: 'Đã giao',
    cancelled: 'Đã hủy',
    failed: 'Giao thất bại',
    delivered: 'Giao thành công',
}

const paymentStatusMapping = {
    pending: 'Chưa thanh toán',
    paid: 'Đã thanh toán',
}
export default function OrderDeliveryTable({
                                               orders,
                                               callback,
                                               buttonName,
                                           }: Props) {
    let currentPath = usePathname()
    const router = useRouter()

    const tableHead = tableHeadList.map((i) => <Table.Th key={i}>{i}</Table.Th>)

    const tableBody = orders?.map((i) => (
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
            <Table.Td>{i.address}</Table.Td>
            <Table.Td>
                {formatMoney(i.finalPrice)}
                <span> đ</span>
            </Table.Td>
            <Table.Td
                className='cursor-pointer'
                onClick={() => {
                    callback(i)
                }}
            >
                <Text c='turquoise'>{buttonName}</Text>
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

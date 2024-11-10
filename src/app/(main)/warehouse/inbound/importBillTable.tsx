import { Bill_Export, Bill_Import } from '@/utils/response'
import { Button, Checkbox, Pagination, Table, Text } from '@mantine/core';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { formatExportBillId, formatImportBillId, formatMoney } from '@/utils/string';

type tableType = {
    id: string;
    createAt: string;
    customer: string;
    paymentStatus: string;
    shipmentStatus: string;
    finalPrice: number;
}[]

const tableHeadList = [
    'Mã phiếu', 'Ngày tạo', 'Nhà cung cấp', 'Thanh toán', 'Tổng tiền'
]

export default function ImportBillTable({ bills }: { bills: Bill_Import[] | undefined }) {

    const currentPath = usePathname()
    const router = useRouter()

    const tableHead = tableHeadList.map(i => (
        <Table.Th key={i}>{i}</Table.Th>
    ))

    const tableBody = bills?.map((bill) => (
        <Table.Tr
            key={bill.bill_info._id}
        >
            <Table.Td>{formatImportBillId(bill.bill_info._id, dayjs(bill.bill_info.bill_date).format('DD/MM/YYYY').toString())}</Table.Td>
            <Table.Td>{dayjs(bill.bill_info.bill_date).format('DD/MM/YYYY').toString()}</Table.Td>
            <Table.Td>{bill.bill_info.supplier.name}</Table.Td>
            <Table.Td>{bill.bill_info.bill_payment.information}</Table.Td>
            <Table.Td>{formatMoney(bill.bill_info.bill_checkout.finalPrice)}<span> đ</span></Table.Td>
            <Table.Td className='cursor-pointer' onClick={() => router.push(`${currentPath}/${bill.bill_info._id}`)}>
                <Text c='turquoise' >Xem</Text>
            </Table.Td>
        </Table.Tr>

    ))
    return (
        <Table highlightOnHover highlightOnHoverColor='turquoise.0' verticalSpacing="sm">
            <Table.Thead>
                <Table.Tr key='head'>
                    {tableHead}
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {tableBody}
            </Table.Tbody>
        </Table>
    )
}



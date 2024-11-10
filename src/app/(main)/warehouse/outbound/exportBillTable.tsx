import { Bill_Export } from '@/utils/response'
import { Table, Text } from '@mantine/core';
import { usePathname, useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { formatExportBillId, formatMoney } from '@/utils/string';

type tableType = {
    id: string;
    createAt: string;
    customer: string;
    paymentStatus: string;
    shipmentStatus: string;
    finalPrice: number;
}[]

const tableHeadList = [
    'Mã phiếu', 'Ngày tạo', 'Khách hàng', 'Thanh toán', 'Tổng tiền'
]


export default function ExportBillTable({ bills }: { bills: Bill_Export[] | undefined }) {

    const currentPath = usePathname()
    const router = useRouter()

    const tableHead = tableHeadList.map(i => (
        <Table.Th key={i}>{i}</Table.Th>
    ))

    const tableBody = bills?.map((bill) => (
        <Table.Tr
            key={bill.bill_info._id}
        >
            <Table.Td>{formatExportBillId(bill.bill_info._id, dayjs(bill.bill_info.bill_date).format('DD/MM/YYYY').toString())}</Table.Td>
            <Table.Td>{dayjs(bill.bill_info.bill_date).format('DD/MM/YYYY').toString()}</Table.Td>
            <Table.Td>{bill.bill_info.customer.name}</Table.Td>
            <Table.Td>{bill.bill_info.bill_payment.method}</Table.Td>
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



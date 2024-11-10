'use client'
import UserContext from "@/contexts/UserContext";
import BillService from "@/services/billService";
import { Divider, Group, Pagination, ScrollArea, Table, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import Loading from "./loading";
import dayjs from "dayjs";
import BackButton from "@/components/BackButton/backButton";
import { formatMoney } from "@/utils/string";


function BillInfoField({
    label,
    children
}: {
    label: string,
    children: React.ReactNode
}) {
    return (
        <Group className="basis-1/3 px-[8px] h-[70px]">
            <Divider size="sm" orientation="vertical" variant='dashed' color="turquoise.4" />
            <div>
                <Text fw='700' c='gray.6' size='sm'>{label}</Text>
                <Text lineClamp={3} w='300'>{children}</Text>
            </div>
        </Group>
    )
}

const TheadLabels = ['Loại vật liệu', 'Tên vật liệu', 'Số lượng', 'Đơn vị', 'Đơn giá', 'Thành tiền']
export default function ExportBillView({ params }: { params: { bill_id: string } }) {
    const { user } = useContext(UserContext);
    const router = useRouter()

    const bill = useQuery({
        queryKey: ['inbound_bill', params.bill_id],
        queryFn: () => {
            const billService = new BillService(user)
            return billService.getImportById(params.bill_id)
        },
        enabled: !!user,
    });


    const [activePage, setPage] = useState(1);
    const tabelHead = TheadLabels.map(i => (
        <Table.Th key={i}>{i}</Table.Th>
    ))
    return (
        <ScrollArea className='h-full w-full z-[0]' >
            {bill.isPending ? <Loading /> :
                <div className='flex flex-col gap-[24px] py-[16px] px-[16px] '>
                    <Group>
                        <BackButton />
                        <Title order={4}>Phiếu nhập kho</Title>
                    </Group>
                    <Group justify="space-between" wrap='nowrap' gap='0'>
                        <BillInfoField label='Ngày tạo'>
                            {dayjs(bill.data?.bill_info.bill_date.toString()).format('DD/MM/YYYY').toString()}
                        </BillInfoField>
                        <BillInfoField label='Tên nhà cung cấp'>
                            {bill.data?.bill_info.supplier.name}
                        </BillInfoField>
                        <BillInfoField label='Thuế'>
                            {formatMoney(bill.data?.bill_info.tax)}
                        </BillInfoField>
                    </Group>
                    <Group justify="space-between" wrap='nowrap' gap='0'>
                        <BillInfoField label='Hình thức thanh toán'>
                            {bill.data?.bill_info.bill_payment.information}
                        </BillInfoField>
                        <BillInfoField label='Địa chỉ kho đi'>
                            {bill.data?.bill_info.bill_address.from}
                        </BillInfoField>
                        <BillInfoField label='Địa chỉ nhận'>
                            {bill.data?.bill_info.bill_address.to}
                        </BillInfoField>
                    </Group>
                    <BillInfoField label='Tổng tiền'>
                        {bill.data?.bill_info.bill_checkout.totalPrice}
                    </BillInfoField>
                    <div className='flex flex-col border-[0.5px] border-solid rounded-[4px] w-full py-[12px] px-[16px]' >
                        <Table highlightOnHover highlightOnHoverColor='turquoise.0' verticalSpacing="sm">
                            <Table.Thead>
                                <Table.Tr key='head'>
                                    {tabelHead}
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {bill.data?.products_info.slice((activePage * 5 - 5), (activePage * 5 - 1)).map(item => (
                                    <Table.Tr key={`row-${item._id}`}>
                                        <Table.Td>{item.product_category}</Table.Td>
                                        <Table.Td>{item.product_name}</Table.Td>
                                        <Table.Td>{item.quantity}</Table.Td>
                                        <Table.Td>{item.product_unit}</Table.Td>
                                        <Table.Td>{item.product_price}</Table.Td>
                                        <Table.Td>{item.totalPrice}</Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                        <Pagination
                            classNames={{
                                control: 'pagination-control'
                            }}
                            className='self-center'
                            total={Math.ceil(bill.data?.products_info.length as number / 5)}
                            value={activePage}
                            onChange={setPage} mt="sm" />
                    </div>
                </div>
            }
        </ScrollArea>
    )
}

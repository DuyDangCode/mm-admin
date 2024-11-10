'use client'
import UserContext from '@/contexts/UserContext'
import VoucherService from '@/services/voucherService'
import { Button, Group, Loader, ScrollArea, Table, Title, Text } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { usePathname, useRouter } from 'next/navigation'
import React, { useContext } from 'react'

const TheadLabels = ['Mã voucher', 'Tên voucher', 'Code', 'Ngày bắt đầu', 'Ngày kết thúc', 'Áp dụng', 'Trạng thái']

export default function ManageVoucherPage() {

    const { user } = useContext(UserContext)

    const router = useRouter()
    const currentPath = usePathname()

    const tabelHead = TheadLabels.map(i => (
        <Table.Th key={i}>{i}</Table.Th>
    ))

    const vouchers = useQuery({
        queryKey: ['vouchers'],
        queryFn: () => {
            const voucherService = new VoucherService(user)
            return voucherService.getAllVouchers()
        },
        enabled: !!user
    })

    return (
        <ScrollArea className='h-full w-full z-[0]' py='1rem' px='2rem'>
            <Group justify='space-between'>
                <Title order={4}>Quản lí voucher</Title>
                <Button className='bg-0-primary-color-6 text-white' onClick={() => router.push(`${currentPath}/create_voucher`)}>Tạo voucher mới</Button>
            </Group>
            {vouchers.isPending ?
                <div className='w-full h-[500px] flex justify-center items-center'>
                    <Loader type="dots" />
                </div>
                :
                <div className='mt-[16px]'>
                    <Text>Số voucher hiện có: <span style={{ fontWeight: '700', color: 'var(--mantine-color-turquoise-6)' }}>{vouchers.data?.length}</span></Text>
                    <div className='flex flex-col border-[0.5px] border-solid rounded-[4px] w-full py-[12px] px-[16px]' >
                        <Table highlightOnHover highlightOnHoverColor='turquoise.0' verticalSpacing="sm">
                            <Table.Thead>
                                <Table.Tr key='head'>
                                    {tabelHead}
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {vouchers.data?.map(voucher => (
                                    <Table.Tr key={`row-${voucher._id}`}>
                                        <Table.Td>{voucher._id}</Table.Td>
                                        <Table.Td>{voucher.discount_name}</Table.Td>
                                        <Table.Td>{voucher.discount_code}</Table.Td>
                                        <Table.Td>{dayjs(voucher.discount_start_date).format('DD/MM/YYYY')}</Table.Td>
                                        <Table.Td>{dayjs(voucher.discount_end_date).format('DD/MM/YYYY')}</Table.Td>
                                        <Table.Td>{voucher.discount_apply_to}</Table.Td>
                                        <Table.Td>{voucher.discount_is_active ? 'ACTIVE' : 'INACTIVE'}</Table.Td>
                                        <Table.Td className='cursor-pointer'>
                                            <Text onClick={() => router.push(`${currentPath}/${voucher._id}`)} c='turquoise' >Xem</Text>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </div>
                </div>
            }
        </ScrollArea>
    )
}

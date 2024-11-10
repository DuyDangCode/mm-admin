'use client'
import { Divider, Image, Group, ScrollArea, Table, Title, Text, Button, ActionIcon } from "@mantine/core"
import Loading from "./loading"
import NImage from 'next/image'
import BackButton from "@/components/BackButton/backButton"
import dayjs from "dayjs"
import VoucherService from "@/services/voucherService"
import { useMutation, useQuery } from "@tanstack/react-query"
import UserContext from "@/contexts/UserContext"
import { useContext, useState } from "react"
import { IconArrowLeft } from "@tabler/icons-react"
import toast from "react-hot-toast"
import queryClient from "@/helpers/client"
import UpdateVoucher from "./updateVoucher"
import { useRouter } from "next/navigation"

const TheadLabels = ['Mã sản phẩm', 'Hình ảnh', 'Tên sản phẩm']

const VoucherDetail = ({ params }: { params: { voucher_id: string } }) => {

    const router = useRouter()

    const { user } = useContext(UserContext)

    const [edit, setEdit] = useState(false)

    const voucher = useQuery({
        queryKey: ['voucher', params.voucher_id],
        queryFn: () => {
            const voucherService = new VoucherService(user)
            return voucherService.getVoucherById(params.voucher_id)
        },
        enabled: !!user,
    })

    const products = useQuery({
        queryKey: ['products_voucher', params.voucher_id],
        queryFn: () => {
            const voucherService = new VoucherService(user)
            return voucherService.getProductOfVoucher(params.voucher_id)
        },
        enabled: !!user,
    })

    const deleteVoucherMutation = useMutation({
        mutationKey: ['deleteVoucher', params.voucher_id],
        mutationFn: (code: string) => {
            const voucherService = new VoucherService(user)
            return voucherService.deleteVoucher(code)
        },
        onSuccess: (res) => {
            toast.success('Xóa thành công')
            queryClient.invalidateQueries({
                queryKey: ['voucher', params.voucher_id],
            })
            router.push('/manager/voucher')
        },
        onError: () => {
            toast.error('Thất bại. Hãy thử lại')
        }
    })

    const VoucherInfoField = ({
        label,
        children
    }: {
        label: string,
        children: React.ReactNode
    }) => {
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

    const tabelHead = TheadLabels.map(i => (
        <Table.Th key={i}>{i}</Table.Th>
    ))

    return (
        <>
            {(voucher.isPending || deleteVoucherMutation.isPending) ? <Loading /> :
                <>
                    {edit ?
                        <ScrollArea className='h-full w-full z-[0]' >
                            <div className='flex flex-col gap-[24px] py-[16px] px-[16px] h-full w-full '>
                                <ActionIcon variant="light" size='lg' aria-label="Back to Order page"
                                    onClick={() => setEdit(false)}><IconArrowLeft /></ActionIcon>
                            </div>
                            <UpdateVoucher voucher={voucher.data} back={() => setEdit(false)} />
                        </ScrollArea>
                        :
                        <ScrollArea className='h-full w-full z-[0]' >
                            <div className='flex flex-col gap-[24px] py-[16px] px-[16px] '>
                                <Group justify="space-between">
                                    <Group>
                                        <BackButton />
                                        <Title order={4}>Voucher</Title>
                                    </Group>
                                    <Group>
                                        <Button bg={'#02B1AB'} className=' text-white' variant="filled" onClick={() => setEdit(true)}>Sửa</Button>
                                        <Button bg={'#D30000'} className=' text-white' variant="filled" onClick={() => {
                                            deleteVoucherMutation.mutate(voucher.data?.discount_code || '')
                                        }}>Xóa</Button>
                                    </Group>
                                </Group>
                                <Group justify="space-between" wrap='nowrap' gap='0'>
                                    <VoucherInfoField label='Tên'>
                                        {voucher.data?.discount_name}
                                    </VoucherInfoField>
                                    <VoucherInfoField label='Mô tả'>
                                        {voucher.data?.discount_description}
                                    </VoucherInfoField>
                                    <VoucherInfoField label='Code'>
                                        {voucher.data?.discount_code}
                                    </VoucherInfoField>
                                </Group>
                                <Group justify="space-between" wrap='nowrap' gap='0'>
                                    <VoucherInfoField label='Hình thức'>
                                        {voucher.data?.discount_type == 'percent' ? 'Giảm theo %' : 'Giảm số tiền nhất định'}
                                    </VoucherInfoField>
                                    <VoucherInfoField label='Ngày bắt đầu'>
                                        {dayjs(voucher.data?.discount_start_date).format('DD/MM/YYYY')}
                                    </VoucherInfoField>
                                    <VoucherInfoField label='Ngày kết thúc'>
                                        {dayjs(voucher.data?.discount_end_date).format('DD/MM/YYYY')}
                                    </VoucherInfoField>
                                </Group>
                                <Group justify="space-between" wrap='nowrap' gap='0'>
                                    <VoucherInfoField label='Số lần sử dụng tối đa'>
                                        {voucher.data?.discount_max_uses}
                                    </VoucherInfoField>
                                    <VoucherInfoField label='Số lần sử dụng tối đa của mỗi user'>
                                        {voucher.data?.discount_max_uses_per_user}
                                    </VoucherInfoField>
                                    <VoucherInfoField label='Giá trị đơn hàng tối thiểu'>
                                        {voucher.data?.discount_min_order_value}
                                    </VoucherInfoField>
                                </Group>
                                <Group wrap='nowrap' gap='0'>
                                    <VoucherInfoField label='Giá trị khuyển mãi'>
                                        {voucher.data?.discount_value}
                                    </VoucherInfoField>
                                    <VoucherInfoField label='Áp dụng cho'>
                                        {voucher.data?.discount_apply_to == 'all' ? 'Tất cả' : 'Một số sản phẩm nhất định'}
                                    </VoucherInfoField>
                                </Group>
                                {voucher.data?.discount_products && voucher.data?.discount_products.length > 0 &&
                                    <div className='flex flex-col border-[0.5px] border-solid rounded-[4px] w-full py-[12px] px-[16px]' >
                                        <Table highlightOnHover highlightOnHoverColor='turquoise.0' verticalSpacing="sm">
                                            <Table.Thead>
                                                <Table.Tr key='head'>
                                                    {tabelHead}
                                                </Table.Tr>
                                            </Table.Thead>
                                            {voucher.data.discount_apply_to == 'specific' && products.isSuccess &&
                                                <Table.Tbody>
                                                    {products.data?.map((item: any) => (
                                                        <Table.Tr key={`row-${item._id}`}>
                                                            <Table.Td>{item._id}</Table.Td>
                                                            <Image
                                                                alt='product'
                                                                w={50}
                                                                width={50}
                                                                height={50}
                                                                src={item.product_thumb}
                                                                component={NImage}
                                                                className=' border-b-[1px] border-gray-300 ' />
                                                            <Table.Td>{item.product_name}</Table.Td>
                                                        </Table.Tr>
                                                    ))}
                                                </Table.Tbody>
                                            }
                                        </Table>
                                    </div>
                                }
                            </div>
                        </ScrollArea>
                    }
                </>
            }
        </>
    )
}

export default VoucherDetail

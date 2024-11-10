'use client'
import { Image, Group, ScrollArea, Title, Text, Button, Flex, NumberInput, Select, Stack, TextInput, Textarea, ActionIcon } from "@mantine/core"
import NImage from 'next/image'
import VoucherService from "@/services/voucherService"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useContext, useEffect, useState } from "react"
import { categoryService } from "@/services/categoryService"
import { Product } from "@/utils/response"
import toast from "react-hot-toast"
import { useForm } from "@mantine/form"
import queryClient from "@/helpers/client"
import ProductPicker from "@/components/ProductPicker/productPicker"
import { DateTimePicker } from "@mantine/dates"
import UserContext from "@/contexts/UserContext"
import dayjs from "dayjs"
import { usePathname, useRouter } from "next/navigation"
import Loading from "./loading"
import { IconArrowLeft, IconTrash } from "@tabler/icons-react"
import router from "next/router"

const UpdateVoucher = ({ voucher, back }: { voucher: any, back: any }) => {

    // const router = useRouter()
    // const currentPath = usePathname()

    const { user } = useContext(UserContext)

    const [type, setType] = useState<string | undefined | null>(voucher.discount_type == 'percent' ? 'Giảm theo %' : 'Giảm số tiền nhất định')
    const [apply, setApply] = useState<string | undefined | null>(voucher.discount_apply_to == 'all' ? 'Toàn bộ sản phẩm' : 'Những sản phẩm nhất định')
    const [addedProduct, setAddedProduct] = useState<any[]>([])

    const categories = useQuery({
        queryKey: ['categories'],
        queryFn: categoryService.getAllCategories,
        staleTime: Infinity,
        gcTime: Infinity,
    })

    const handleChooseProduct = (data: Product) => {
        if (addedProduct.find(p => p._id == data._id))
            toast.error('Sản phẩm đã tồn tại')
        else
            setAddedProduct((prev) => [...prev, {
                _id: data._id,
                product_name: data.product_name,
                product_thumb: data.product_thumb
            }])
    }

    const form = useForm({
        initialValues: {
            name: voucher.discount_name,
            description: voucher.discount_description,
            code: voucher.discount_code,
            value: voucher.discount_value,
            max_uses: voucher.discount_max_uses,
            max_uses_per_user: voucher.discount_max_uses_per_user,
            user_used: voucher.discount_user_used,
            end_date: new Date(voucher.discount_end_date),
            uses_count: voucher.discount_uses_count,
            min_order_value: voucher.discount_min_order_value,
            is_active: voucher.discount_is_active,
        },
        validate: {
            name: (value) => (value.length === 0 ? 'Vui lòng nhập tên' : null),
            description: (value) => (value.length === 0 ? 'Vui lòng nhập miêu tả' : null),
            code: (value) => (value.length === 0 ? 'Vui lòng nhập code' : null),
            max_uses: (value) => (value === null ? 'Vui lòng nhập số lần sử dụng tối đa' : null),
            max_uses_per_user: (value) => (value === null ? 'Vui lòng nhập số lần sử dụng tối đa của mỗi user' : null),
            min_order_value: (value) => (value === null ? 'Vui lòng nhập giá trị đơn hàng tối thiểu' : null),
            end_date: (value) => (value === null ? 'Vui lòng nhập ngày kết thúc' : null)
        },
    })

    const updateVoucherMutation = useMutation({
        mutationKey: ['update_voucher'],
        mutationFn: (body: any) => {
            const voucherService = new VoucherService(user)
            return voucherService.updateVoucher({ id: voucher._id, body })
        },
        onSuccess: (res) => {
            toast.success('Cập nhật thành công')
            queryClient.invalidateQueries({
                queryKey: ['voucher', voucher._id],
            })
            queryClient.invalidateQueries({
                queryKey: ['products_voucher'],
            })
            back()
        },
        onError: () => {
            toast.error('Thất bại. Hãy thử lại')
        }
    })

    const products = useMutation({
        mutationKey: ['products_voucher', voucher._id],
        mutationFn: () => {
            const voucherService = new VoucherService(user)
            return voucherService.getProductOfVoucher(voucher._id)
        },
        onSuccess: (res) => {
            setAddedProduct(res)
        }
    })

    useEffect(() => {
        products.mutate()
    }, [])

    const handleUpdateVoucher = (formData: any) => {
        // console.log({
        //     name: formData.name,
        //     description: formData.description,
        //     code: formData.code,
        //     value: formData.value,
        //     max_uses: formData.max_uses,
        //     max_uses_per_user: formData.max_uses_per_user,
        //     user_used: formData.user_used,
        //     type: type == 'Giảm theo %' ? 'percent' : 'specific',
        //     end_date: dayjs(formData.end_date).format('YYYY-MM-DD HH:mm:ss'),
        //     uses_count: formData.uses_count,
        //     min_order_value: formData.min_order_value,
        //     is_active: formData.is_active,
        //     apply_to: apply == 'Những sản phẩm nhất định' ? 'specific' : 'all',
        //     products: addedProduct.map(i => i._id)
        // })
        if (type == '' || apply == '')
            toast.error('Vui lòng nhập đủ thông tin')
        else
            updateVoucherMutation.mutate({
                discount_name: formData.name,
                discount_description: formData.description,
                discount_code: formData.code,
                discount_value: formData.value,
                discount_max_uses: formData.max_uses,
                discount_max_uses_per_user: formData.max_uses_per_user,
                discount_user_used: formData.user_used,
                discount_type: type == 'Giảm theo %' ? 'percent' : 'specific',
                discount_end_date: dayjs(formData.end_date).format('YYYY-MM-DD HH:mm:ss'),
                discount_uses_count: formData.uses_count,
                discount_min_order_value: formData.min_order_value,
                discount_is_active: formData.is_active,
                discount_apply_to: apply == 'Những sản phẩm nhất định' ? 'specific' : 'all',
                discount_products: addedProduct.map(i => i._id)
            })
    }

    return (
        <>
            {updateVoucherMutation.isPending ? <Loading /> :
                <form onSubmit={form.onSubmit(handleUpdateVoucher)} id="updateVoucherForm">
                    <Flex direction='column-reverse'>
                        <Flex className="rounded-[8px] border-[1px] " p='16' gap={10}>
                            <Stack w='250' className="basis-1/3">
                                <TextInput
                                    label="Tên voucher"
                                    placeholder="VD: Voucher của Khải"
                                    withAsterisk
                                    {...form.getInputProps('name')}
                                />
                                <Textarea
                                    label="Mô tả"
                                    placeholder="VD: Gì dó"
                                    withAsterisk
                                    autosize
                                    {...form.getInputProps('description')}
                                />
                                <TextInput
                                    label="Code"
                                    placeholder="VD: CODE 1"
                                    withAsterisk
                                    {...form.getInputProps('code')}
                                />

                                <Select
                                    label="Hình thức"
                                    value={type} onChange={setType}
                                    data={['Giảm theo %', 'Giảm số tiền nhất định']}
                                    withAsterisk
                                />

                                <Select
                                    label="Áp dụng cho"
                                    value={apply} onChange={(value) => {
                                        setAddedProduct([])
                                        setApply(value)
                                    }}
                                    data={['Những sản phẩm nhất định', 'Toàn bộ sản phẩm']}
                                    withAsterisk
                                />
                            </Stack>
                            <Stack w='250' className="basis-1/3">
                                <NumberInput
                                    label='Số lần sử dụng tối đa'
                                    withAsterisk
                                    {...form.getInputProps('max_uses')}
                                />
                                <NumberInput
                                    label='Số lần sử dụng tối đa của mỗi user'
                                    withAsterisk
                                    {...form.getInputProps('max_uses_per_user')}
                                />
                                <NumberInput
                                    label='Giá trị đơn hàng tối thiểu'
                                    withAsterisk
                                    {...form.getInputProps('min_order_value')}
                                />
                                <DateTimePicker
                                    label="Ngày kết thúc"
                                    withAsterisk
                                    {...form.getInputProps('end_date')}
                                />
                                {
                                    type == 'Giảm theo %' && <NumberInput
                                        label='Số % giảm theo giá tiền'
                                        withAsterisk
                                        min={1}
                                        max={100}
                                        {...form.getInputProps('value')}
                                    />
                                }
                                {
                                    type == 'Giảm số tiền nhất định' && <NumberInput
                                        label='Số tiền được giảm'
                                        withAsterisk
                                        {...form.getInputProps('value')}
                                    />
                                }
                            </Stack>
                            <ScrollArea className='h-[450px] w-full'>
                                <Stack className="basis-2/3" p='16' align="center">
                                    {apply == 'Những sản phẩm nhất định' && addedProduct.map(item => (
                                        <Stack align="center">
                                            <Image
                                                alt='product'
                                                w={200}
                                                width={200}
                                                height={200}
                                                src={item.product_thumb}
                                                component={NImage}
                                                className=' border-b-[1px] border-gray-300 ' />
                                            <Text>{item.product_name}</Text>
                                            <ActionIcon color="red" variant="light" size='lg' aria-label="Back to Order page"
                                                onClick={() => {
                                                    setAddedProduct(addedProduct.filter(p => p._id != item._id))
                                                }}><IconTrash />
                                            </ActionIcon>
                                        </Stack>
                                    ))}
                                    {apply == 'Những sản phẩm nhất định' &&
                                        <ProductPicker categories={categories.data} label="Thêm sản phẩm" onChoose={handleChooseProduct} />
                                    }
                                </Stack>
                            </ScrollArea>
                        </Flex>
                        <Group justify="space-between" >
                            <Stack gap='0' px='32px'>
                                <Title order={2} mb='4'>Sửa voucher</Title>
                            </Stack>
                            <Button.Group>
                                <Button variant='outline' onClick={() => {
                                    form.reset()
                                    setType(voucher.discount_type == 'percent' ? 'Giảm theo %' : 'Giảm số tiền nhất định')
                                    setApply(voucher.discount_apply_to == 'all' ? 'Toàn bộ sản phẩm' : 'Những sản phẩm nhất định')
                                    setAddedProduct([])
                                }}>Reset form</Button>
                                <Button className="bg-0-primary-color-6 text-white" form="updateVoucherForm" type='submit'>Cập nhật voucher</Button>
                            </Button.Group>
                        </Group>
                    </Flex>
                </form>
            }
        </>
    )
}

export default UpdateVoucher
'use client'
import BillProduct from "@/components/BillProduct/billProduct";
import ProductPicker from "@/components/ProductPicker/productPicker";
import UserContext from "@/contexts/UserContext";
import BillService from "@/services/billService";
import { categoryService } from "@/services/categoryService";
import { Bill_Address, Bill_Payment, Bill_Product, Customer_In_Bill } from "@/utils/object";
import { checkNameFormat, checkPhoneFormat } from "@/utils/regex";
import { Bill_Export_Request, Item_Products, Products } from "@/utils/request";
import { Product } from "@/utils/response";
import { ActionIcon, Button, Divider, Flex, Group, NativeSelect, ScrollArea, Stack, Text, TextInput, Textarea, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowLeft } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import Loading from "./loading";
import dayjs from "dayjs";



export default function CreateExportBillPage() {
    const router = useRouter()
    const currentPath = usePathname()
    const { user } = useContext(UserContext)
    const categories = useQuery({
        queryKey: ['categories'],
        queryFn: categoryService.getAllCategories,
        staleTime: Infinity,
        gcTime: Infinity,
    });
    const createExportBillMutation = useMutation({
        mutationKey: ['create_ex_bill'],
        mutationFn: (body: Bill_Export_Request) => {
            const billService = new BillService(user)
            return billService.createExportBill(body)
        },
        onSuccess: (res) => {
            toast.success('Tạo thành công')
            router.replace(`${currentPath.substring(0, currentPath.lastIndexOf('/'))}`)
        },
        onError: () => {
            toast.error('Thất bại. Hãy thử lại')
        }
    })

    const [opened, { open, close }] = useDisclosure(false);

    const [addedProduct, setAddedProduct] = useState<Bill_Product[]>([])
    const [quantity, setQuantity] = useState<number[]>([])
    const [maximum, setMaximum] = useState<number[]>([])

    const [totalBill, setTotalBill] = useState(0)
    const calTotalBill = () => {
        let total = 0
        for (let i = 0; i < addedProduct.length; i++)
            total += addedProduct[i].product_price * addedProduct[i].quantity

        setTotalBill(total)
    }

    const handleDeleteProduct = (id: string) => {
        const indexToRemove = addedProduct.findIndex(i => i._id === id)
        if (indexToRemove !== -1) {
            setMaximum(maximum.filter((_, index) => index !== indexToRemove))
            setAddedProduct(addedProduct.filter((_, index) => index !== indexToRemove))
            console.log(addedProduct)
        }
        else toast.error('Không xóa được do không tìm thấy id')
    }


    const handleChooseProduct = (data: Product) => {
        let billProduct: Bill_Product = {
            _id: data._id,
            product_category: categories.data?.find((item) => item._id == data.product_categories[0])?.category_name as string,
            product_name: data.product_name,
            quantity: 1,
            product_price: data.product_price,
            product_unit: data.product_unit,
            totalPrice: data.product_price
        }
        const fooFind = addedProduct.find((item) => item._id == billProduct._id)
        if (fooFind !== undefined) {
            toast.error('Sản phẩm đã tồn tại')
        }
        else {
            setQuantity([...quantity, 1])
            setAddedProduct((prev) => [...prev, billProduct])
            setMaximum([...maximum, data.product_quantity])
            calTotalBill()
        }
    }


    const form = useForm({
        initialValues: {
            customer_name: '',
            phone: '',
            address_from: '',
            address_to: '',
        },
        validate: {
            customer_name: (value) => checkNameFormat(value),
            phone: (value) => checkPhoneFormat(value),
            address_from: (value) => (value.length === 0 ? 'Vui lòng nhập địa chỉ!' : null),
            address_to: (value) => (value.length === 0 ? 'Vui lòng nhập địa chỉ!' : null),
        },
    });

    const handleCreateBill = (formData: any) => {
        if (addedProduct.length === 0)
            toast.error('Chưa chọn sản phẩm nào!')
        else {
            const BillAddress: Bill_Address = {
                from: formData.address_from,
                to: formData.address_to
            }
            const BillPayment: Bill_Payment = {
                method: 'in store'
            }
            const Customer: Customer_In_Bill = {
                id: '',
                phone: formData.phone,
                name: formData.customer_name
            }
            const bill: Bill_Export_Request = {
                products: addedProduct.map(item => {
                    const iProduct: Item_Products = {
                        price: item.product_price,
                        quantity: item.quantity,
                        productId: item._id
                    }
                    const products: Products = {
                        products: [iProduct]
                    }
                    return products
                }),
                bill_note: '',
                bill_address: BillAddress,
                bill_payment: BillPayment,
                customer: Customer
            }

            createExportBillMutation.mutate(bill)
        }
    }
    return (
        <ScrollArea className='h-full w-full z-[0]' >
            <div className='flex flex-col gap-[24px] py-[16px] px-[16px] h-full w-full '>
                <form onSubmit={form.onSubmit(handleCreateBill)}>
                    <Flex direction='column-reverse' gap='16'>
                        {createExportBillMutation.isPending ? <Loading /> :
                            <Flex className="rounded-[8px] border-[1px] " p='16'>
                                <Stack w='250' className="basis-1/3">
                                    <TextInput
                                        label="Tên khách hàng"
                                        placeholder="VD: Nguyễn Văn Material"
                                        withAsterisk
                                        {...form.getInputProps('customer_name')}
                                    />
                                    <Textarea
                                        label="Địa chỉ kho đi"
                                        placeholder="VD: Đường Hàn Thuyên, khu phố 6 P, Thủ Đức, Thành phố Hồ Chí Minh"
                                        withAsterisk
                                        autosize
                                        {...form.getInputProps('address_from')}
                                    />
                                    <Textarea
                                        label="Địa chỉ nhận"
                                        placeholder="VD: làng Địa Ngục, xã Vần Chải, huyện Đồng Văn, tỉnh Hà Giang"
                                        withAsterisk
                                        {...form.getInputProps('address_to')}
                                    />
                                    <TextInput
                                        label="Số điện thoại"
                                        placeholder="VD: 0123456789"
                                        withAsterisk
                                        {...form.getInputProps('phone')}
                                    />

                                    <NativeSelect
                                        label="Hình thức thanh toán"
                                        data={['Tiền mặt', 'Quẹt thẻ']}
                                        withAsterisk
                                    />

                                </Stack>

                                <ScrollArea className='h-[450px] w-full'>
                                    <Stack className="basis-2/3" p='16' align="center">
                                        {addedProduct.map((item, index) => (
                                            <BillProduct key={item._id} data={addedProduct[index]} order={index} max={maximum[index]} refBills={addedProduct} refSetBills={setAddedProduct} calBillFn={calTotalBill} deleteFn={handleDeleteProduct} />
                                        ))}
                                        <ProductPicker categories={categories.data} label="Thêm sản phẩm" onChoose={handleChooseProduct} />
                                    </Stack>

                                </ScrollArea>
                            </Flex>
                        }
                        <Group justify='space-between' align='flex-end'>
                            <Group>
                                <ActionIcon
                                    variant='light'
                                    size='lg'
                                    aria-label='Back to Order page'
                                    onClick={() => router.back()}
                                >
                                    <IconArrowLeft />
                                </ActionIcon>
                                <Group align='flex-end'>
                                    <Stack gap='0' px='32px'>
                                        <Title order={2} mb='4'>
                                            Phiếu xuất kho
                                        </Title>
                                        <Text fs='italic' size='sm'>
                                            *Tạo phiếu khi cần xuất hàng
                                        </Text>
                                    </Stack>
                                    <Group>
                                        <Divider orientation='vertical' size='sm' />
                                        <Text fs='italic'>
                                            Ngày tạo thiếu: {dayjs(new Date()).format('DD/MM/YYYY')}
                                        </Text>
                                    </Group>
                                </Group>
                            </Group>
                            <Button.Group>
                                <Button
                                    variant='outline'
                                    onClick={() => {
                                        form.reset();
                                        setAddedProduct([]);
                                    }}
                                >
                                    Xóa phiếu
                                </Button>
                                <Button
                                    type='submit'
                                    className="bg-0-primary-color-6 text-white"
                                >
                                    Tạo phiếu
                                </Button>
                            </Button.Group>
                        </Group>
                    </Flex>
                </form>
            </div >
        </ScrollArea>
    )
}

'use client';
import BillProduct from '@/components/BillProduct/billProduct';
import ProductPicker from '@/components/ProductPicker/productPicker';
import UserContext from '@/contexts/UserContext';
import BillService from '@/services/billService';
import { categoryService } from '@/services/categoryService';
import { Bill_Address, Bill_Product, Supplier } from '@/utils/object';
import {
    Bill_Import_Request,
    Create_Product,
    Item_Products,
    Products,
} from '@/utils/request';
import { Category, Product } from '@/utils/response';
import {
    ActionIcon,
    Button,
    Divider,
    Flex,
    Group,
    Modal,
    NumberInput,
    ScrollArea,
    Select,
    Stack,
    Text,
    TextInput,
    Title,
    UnstyledButton,
    rem,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowLeft, IconCurrencyDong } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loading from './loading';
import dayjs from 'dayjs';
import { productService } from '@/services/productService';
import { formatMoney } from '@/utils/string';

function CreateNewProductModal({
    opened,
    open,
    close,
    categories,
    createMutation,
}: {
    opened: boolean;
    open: any;
    close: any;
    categories: Category[];
    createMutation: any;
}) {
    const categoriesData = categories?.map((i) => i.category_name);

    const form = useForm({
        initialValues: {
            name: '',
            category: '',
            thumbnail: '',
            price: 0,
            quantity: 0,
            unit: '',
        },
        validate: {
            name: (value) =>
                value.length === 0 ? 'Vui lòng nhập tên sản phẩm!' : null,
            category: (value) =>
                value.length === 0 ? 'Vui lòng chọn danh mục sản phẩm!' : null,
            price: (value) => (value === 0 ? 'Vui lòng nhập giá!' : null),
            quantity: (value) => (value === 0 ? 'Vui lòng nhập số lượng!' : null),
            unit: (value) =>
                value.length === 0 ? 'Vui lòng nhập tên sản phẩm!' : null,
            thumbnail: (value) =>
                value.length === 0 ? 'Vui lòng nhập link ảnh sản phẩm!' : null,
        },
    });

    const handleCreateProduct = () => {
        const newProduct: Create_Product = {
            name: form.values.name,
            thumb: form.values.thumbnail,
            categories: [
                categories.find((i) => i.category_name === form.values.category)
                    ?._id as string,
            ],
            price: form.values.price,
            quantity: form.values.quantity,
            unit: form.values.unit,
        };

        createMutation.mutate(newProduct);
    };
    return (
        <Modal.Root
            size='auto'
            zIndex={1001}
            opened={opened}
            onClose={close}
            centered
        >
            <Modal.Overlay />
            <Modal.Content>
                <Modal.Header>
                    <Modal.Title w='100%' ta='center'>
                        <Text fw={700}>Thêm sản phẩm mới</Text>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body mt='16' mx='16'>
                    <form
                        onSubmit={form.onSubmit(handleCreateProduct)}
                        id='newProductForm'
                    >
                        <Group>
                            <Stack w='250'>
                                <TextInput
                                    label='Tên sản phẩm'
                                    placeholder='Sản phẩm'
                                    withAsterisk
                                    {...form.getInputProps('name')}
                                />
                                <Select
                                    label='Danh mục'
                                    placeholder='Danh mục'
                                    data={categoriesData}
                                    searchable
                                    comboboxProps={{ zIndex: 1002 }}
                                    {...form.getInputProps('category')}
                                />
                                <TextInput
                                    label='Hình ảnh'
                                    placeholder='Link hình ảnh'
                                    withAsterisk
                                    {...form.getInputProps('thumbnail')}
                                />
                            </Stack>
                            <Stack w='250'>
                                <TextInput
                                    label='Giá bán'
                                    placeholder='0'
                                    rightSectionPointerEvents='none'
                                    rightSection={<IconCurrencyDong style={{ width: rem(20), height: rem(20) }} stroke={1.5} />}
                                    withAsterisk
                                    type='number'
                                    {...form.getInputProps('price')}
                                />
                                <NumberInput
                                    label='Số lượng'
                                    aria-label='Số lượng'
                                    allowNegative={false}
                                    clampBehavior='strict'
                                    min={1}
                                    {...form.getInputProps('quantity')}
                                />
                                <TextInput
                                    label='Đơn vị'
                                    placeholder='Cái'
                                    withAsterisk
                                    {...form.getInputProps('unit')}
                                />
                            </Stack>
                        </Group>
                        <Group justify='center' mt='md'>
                            <Button variant='outline' w='150' onClick={close}>
                                Hủy
                            </Button>
                            <Button
                                w='150'
                                type='submit'
                                form='newProductForm'
                                bg={'#02B1AB'}
                                className=' text-white'
                            >
                                Tạo
                            </Button>
                        </Group>
                    </form>
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    );
}

export default function CreateImportBillPage() {
    const router = useRouter();
    const currentPath = usePathname();
    const { user } = useContext(UserContext);
    const categories = useQuery({
        queryKey: ['categories'],
        queryFn: categoryService.getAllCategories,
        staleTime: Infinity,
        gcTime: Infinity,
    });
    const createExportBillMutation = useMutation({
        mutationKey: ['create_ex_bill'],
        mutationFn: (body: Bill_Import_Request) => {
            const billService = new BillService(user);
            return billService.createImportBill(body);
        },
        onSuccess: (res) => {
            toast.success('Tạo thành công');
            router.replace(
                `${currentPath.substring(0, currentPath.lastIndexOf('/'))}`
            );
        },
        onError: () => {
            toast.error('Thất bại. Hãy thử lại');
        },
    });

    const createProductMutation = useMutation({
        mutationFn: (body: Create_Product) => {
            return productService.createProduct(user, body);
        },
        onSuccess: (res) => {
            toast.success('Tạo thành công');
            const newProduct: Product = {
                _id: res._id,
                product_name: res.product_name,
                product_thumb: res.product_thumb,
                product_description: res.product_description,
                product_price: res.product_price,
                product_quantity: res.product_quantity,
                product_brand: res.product_brand,
                product_unit: res.product_unit,
                product_ratingAverage: res.product_ratingAverage,
                product_categories: res.product_categories,
                createdAt: res.createdAt,
                updatedAt: res.updatedAt,
                product_slug: res.product_slug,
                __v: res.__v,
            };
            handleChooseProduct(newProduct);
        },
    });

    const [opened, { open, close }] = useDisclosure(false);
    const [create_opened, create_controller] = useDisclosure(false);

    const [addedProduct, setAddedProduct] = useState<Bill_Product[]>([]);
    const [quantity, setQuantity] = useState<number[]>([]);

    const [totalBill, setTotalBill] = useState(0);
    const calTotalBill = () => {
        let total = 0;
        for (let i = 0; i < addedProduct.length; i++)
            total += addedProduct[i].product_price * addedProduct[i].quantity;

        setTotalBill(total);
    };

    const handleDeleteProduct = (id: string) => {
        const indexToRemove = addedProduct.findIndex((i) => i._id === id);
        if (indexToRemove !== -1) {
            setAddedProduct(
                addedProduct.filter((_, index) => index !== indexToRemove)
            );
            console.log(addedProduct);
        } else toast.error('Không xóa được do không tìm thấy id');
    };

    const handleChooseProduct = (data: Product) => {
        close();
        let billProduct: Bill_Product = {
            _id: data._id,
            product_category: categories.data?.find(
                (item) => item._id == data.product_categories[0]
            )?.category_name as string,
            product_name: data.product_name,
            quantity: 1,
            product_price: data.product_price,
            product_unit: data.product_unit,
            totalPrice: data.product_price,
        };
        const fooFind = addedProduct.find((item) => item._id == billProduct._id);
        if (fooFind !== undefined) {
            toast.error('Sản phẩm đã tồn tại');
        } else {
            setQuantity([...quantity, 1]);
            setAddedProduct((prev) => [...prev, billProduct]);
            calTotalBill();
        }
    };

    useEffect(() => {
        calTotalBill();
    }, [addedProduct]);

    const form = useForm({
        initialValues: {
            name: '',
            id: '',
            tax_id: '',
            from: '',
            to: '',
        },
        validate: {
            name: (value) =>
                value.length === 0 ? 'Vui lòng nhập tên nhà cung cấp!' : null,
            id: (value) =>
                value.length === 0 ? 'Vui lòng nhập mã nhà cung cấp!' : null,
            tax_id: (value) => (value.length === 0 ? 'Vui lòng nhập địa chỉ!' : null),
            from: (value) =>
                value.length === 0 ? 'Vui lòng nhập địa chỉ kho đi!' : null,
            to: (value) =>
                value.length === 0 ? 'Vui lòng nhập địa chỉ kho nhận!' : null,
        },
    });

    const handleCreateBill = (formData: any) => {
        if (addedProduct.length === 0) toast.error('Chưa chọn sản phẩm nào!');
        else {
            const BillAddress: Bill_Address = {
                from: formData.from,
                to: formData.to,
            };
            const BillPayment = {
                information: 'Đã thanh toán',
            };
            const Supplier: Supplier = {
                id: formData.id,
                name: formData.name,
            };
            const bill: Bill_Import_Request = {
                products: addedProduct.map((item) => {
                    const iProduct: Item_Products = {
                        price: item.product_price,
                        quantity: item.quantity,
                        productId: item._id,
                    };
                    const products: Products = {
                        products: [iProduct],
                    };
                    return products;
                }),
                bill_note: '',
                bill_address: BillAddress,
                bill_payment: BillPayment,
                supplier: Supplier,
                tax: 0,
                bill_image:
                    'https://info.hoasengroup.vn/wp-content/uploads/2023/04/thumbnail-meta.jpg',
            };

            createExportBillMutation.mutate(bill);
        }
    };

    return (
        <ScrollArea className='h-full w-full z-[0]'>
            <div className='flex flex-col gap-[24px] py-[16px] px-[16px] h-full w-full '>
                <form onSubmit={form.onSubmit(handleCreateBill)} id='newBillForm'>
                    <Flex direction='column-reverse' gap='16'>
                        {createExportBillMutation.isPending ||
                            createProductMutation.isPending ? (
                            <Loading />
                        ) : (
                            <Flex className='rounded-[8px] border-[1px]' p='16'>
                                <Stack justify='space-between'>
                                    <Stack w='250' className='basis-1/3'>
                                        <TextInput
                                            label='Mã nhà cung cấp'
                                            placeholder='00001'
                                            withAsterisk
                                            {...form.getInputProps('id')}
                                        />
                                        <TextInput
                                            label='Tên nhà cung cấp'
                                            placeholder='VD: Hoa sen group'
                                            withAsterisk
                                            {...form.getInputProps('name')}
                                        />
                                        <TextInput
                                            label='Mã số thuế'
                                            placeholder='VD: Hoa sen group'
                                            withAsterisk
                                            type='number'
                                            {...form.getInputProps('tax_id')}
                                        />
                                        <TextInput
                                            label='Địa chỉ kho đi'
                                            placeholder='VD: Quận 7'
                                            withAsterisk
                                            {...form.getInputProps('from')}
                                        />
                                        <TextInput
                                            label='Địa chỉ kho nhận'
                                            placeholder='VD: Thủ Đức'
                                            withAsterisk
                                            {...form.getInputProps('to')}
                                        />
                                    </Stack>
                                    <Group>
                                        <Stack>
                                            <Text>Tổng: </Text>
                                            <Text>Thuế: </Text>
                                            <Text>Giảm giá: </Text>
                                            <Text fw={700} c='turquoise'>
                                                Thành tiền:{' '}
                                            </Text>
                                        </Stack>
                                        <Stack>
                                            <Text>{formatMoney(totalBill)} đ</Text>
                                            {/* <Text>{formatMoney(totalBill * 0.1)} đ</Text>
                      <Text>{formatMoney(totalBill * 0.09)} đ</Text> */}
                                            <Text>0 đ</Text>
                                            <Text>0 đ</Text>
                                            <Text fw={700}>
                                                {/* {formatMoney(
                          totalBill + totalBill * 0.1 - totalBill * 0.09
                        )}{' '} */}
                                                {formatMoney(totalBill)}{' '} đ
                                            </Text>
                                        </Stack>
                                    </Group>
                                </Stack>

                                <ScrollArea className='h-[500px] w-full'>
                                    <Stack className='basis-2/3' p='16' align='center'>
                                        {addedProduct.map((item, index) => (
                                            <BillProduct
                                                key={item._id}
                                                data={addedProduct[index]}
                                                order={index}
                                                max={-1}
                                                refBills={addedProduct}
                                                refSetBills={setAddedProduct}
                                                calBillFn={calTotalBill}
                                                deleteFn={handleDeleteProduct}
                                                type='import'
                                            />
                                        ))}
                                        <Modal.Root
                                            size='auto'
                                            zIndex={1000}
                                            opened={opened}
                                            onClose={close}
                                            centered
                                        >
                                            <Modal.Overlay />
                                            <Modal.Content>
                                                <Modal.Header>
                                                    <Modal.Title w='100%' ta='center'>
                                                        <Text fw={700}>Thêm sản phẩm</Text>
                                                    </Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body mt='16' mx='16'>
                                                    <Group justify='center' align='flex-start'>
                                                        <ProductPicker
                                                            categories={categories.data}
                                                            label='Chọn sản sảm có sẵn'
                                                            onChoose={handleChooseProduct}
                                                            type='square'
                                                        />
                                                        <UnstyledButton
                                                            className='rounded-[8px]'
                                                            onClick={create_controller.open}
                                                            h='150'
                                                            w='180'
                                                            bg='turquoise.0'
                                                            ta='center'
                                                            p='lg'
                                                            c='turquoise'
                                                            fw='bold'
                                                        >
                                                            Tạo sản phẩm mới
                                                        </UnstyledButton>
                                                    </Group>
                                                </Modal.Body>
                                            </Modal.Content>
                                        </Modal.Root>
                                        <Button
                                            className="bg-0-primary-color-6 text-white"
                                            onClick={open}
                                        >
                                            Thêm sản phẩm
                                        </Button>
                                    </Stack>
                                </ScrollArea>
                            </Flex>
                        )}
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
                                            Phiếu nhập kho
                                        </Title>
                                        <Text fs='italic' size='sm'>
                                            *Tạo phiếu khi nhập hàng về cửa hàng
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
                                    form='newBillForm'
                                    className="bg-0-primary-color-6 text-white"
                                >
                                    Tạo phiếu
                                </Button>
                            </Button.Group>
                        </Group>
                    </Flex>
                </form>
                <CreateNewProductModal
                    opened={create_opened}
                    open={create_controller.open}
                    close={create_controller.close}
                    categories={categories.data as Category[]}
                    createMutation={createProductMutation}
                />
            </div>
        </ScrollArea>
    );
}

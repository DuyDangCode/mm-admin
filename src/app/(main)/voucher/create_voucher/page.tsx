'use client';

import {
  Image,
  Text,
  ScrollArea,
  Select,
  ActionIcon,
  Flex,
  Stack,
  TextInput,
  Textarea,
  Group,
  Button,
  Title,
  NumberInput,
} from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useContext, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services/categoryService';
import ProductPicker from '@/components/ProductPicker/productPicker';
import { Product } from '@/utils/response';
import toast from 'react-hot-toast';
import NImage from 'next/image';
import { DateTimePicker } from '@mantine/dates';
import VoucherService from '@/services/voucherService';
import UserContext from '@/contexts/UserContext';
import dayjs from 'dayjs';
import Loading from './loading';
import { useRouter } from 'next/navigation';

const CreateVoucher = () => {
  const router = useRouter();

  const { user } = useContext(UserContext);

  const [type, setType] = useState<string | null>('');
  const [apply, setApply] = useState<string | null>('');

  const [addedProduct, setAddedProduct] = useState<any[]>([]);

  const categories = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAllCategories,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const handleChooseProduct = (data: Product) => {
    if (addedProduct.find((p) => p._id == data._id))
      toast.error('Sản phẩm đã tồn tại');
    else
      setAddedProduct((prev) => [
        ...prev,
        {
          _id: data._id,
          product_name: data.product_name,
          product_thumb: data.product_thumb,
        },
      ]);
  };

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      code: '',
      value: 0,
      max_uses: null,
      max_uses_per_user: null,
      user_used: [],
      type: '',
      end_date: '',
      uses_count: 0,
      min_order_value: null,
      is_active: true,
      apply_to: '',
      products: [],
    },
    validate: {
      name: (value) => (value.length === 0 ? 'Vui lòng nhập tên' : null),
      description: (value) =>
        value.length === 0 ? 'Vui lòng nhập miêu tả' : null,
      code: (value) => (value.length === 0 ? 'Vui lòng nhập code' : null),
      max_uses: (value) =>
        value === null ? 'Vui lòng nhập số lần sử dụng tối đa' : null,
      max_uses_per_user: (value) =>
        value === null
          ? 'Vui lòng nhập số lần sử dụng tối đa của mỗi user'
          : null,
      min_order_value: (value) =>
        value === null ? 'Vui lòng nhập giá trị đơn hàng tối thiểu' : null,
      end_date: (value) =>
        value.length === 0 ? 'Vui lòng nhập ngày kết thúc' : null,
    },
  });

  const createVoucherMutation = useMutation({
    mutationKey: ['create_voucher'],
    mutationFn: (body: any) => {
      const voucherService = new VoucherService(user);
      return voucherService.createVoucher(body);
    },
    onSuccess: (res) => {
      toast.success('Tạo thành công');
      router.push('/manager/voucher');
    },
    onError: () => {
      toast.error('Thất bại. Hãy thử lại');
    },
  });

  const handleCreateVoucher = (formData: any) => {
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
    //     apply_to: apply == 'Những sản phẩm nhất định' ?'specific' : 'all',
    //     products: addedProduct.map(i => i._id)
    // })
    if (type == '' || apply == '') toast.error('Vui lòng nhập đủ thông tin');
    else
      createVoucherMutation.mutate({
        name: formData.name,
        description: formData.description,
        code: formData.code,
        value: formData.value,
        max_uses: formData.max_uses,
        max_uses_per_user: formData.max_uses_per_user,
        user_used: formData.user_used,
        type: type == 'Giảm theo %' ? 'percent' : 'specific',
        end_date: dayjs(formData.end_date).format('YYYY-MM-DD HH:mm:ss'),
        uses_count: formData.uses_count,
        min_order_value: formData.min_order_value,
        is_active: formData.is_active,
        apply_to: apply == 'Những sản phẩm nhất định' ? 'specific' : 'all',
        products: addedProduct.map((i) => i.id),
      });
  };

  return (
    <ScrollArea className='h-full w-full z-[0]'>
      <div className='flex flex-col gap-[24px] py-[16px] px-[16px] h-full w-full '>
        <ActionIcon
          variant='light'
          size='lg'
          aria-label='Back to Order page'
          onClick={() => router.back()}
        >
          <IconArrowLeft />
        </ActionIcon>
        {createVoucherMutation.isPending ? (
          <Loading />
        ) : (
          <form
            onSubmit={form.onSubmit(handleCreateVoucher)}
            id='newVoucherForm'
          >
            <Flex direction='column-reverse'>
              <Flex className='rounded-[8px] border-[1px] ' p='16' gap={10}>
                <Stack w='250' className='basis-1/3'>
                  <TextInput
                    label='Tên voucher'
                    placeholder='VD: Voucher của Khải'
                    withAsterisk
                    {...form.getInputProps('name')}
                  />
                  <Textarea
                    label='Mô tả'
                    placeholder='VD: Gì dó'
                    withAsterisk
                    autosize
                    {...form.getInputProps('description')}
                  />
                  <TextInput
                    label='Code'
                    placeholder='VD: CODE 1'
                    withAsterisk
                    {...form.getInputProps('code')}
                  />

                  <Select
                    label='Hình thức'
                    value={type}
                    onChange={setType}
                    data={['Giảm theo %', 'Giảm số tiền nhất định']}
                    withAsterisk
                  />

                  <Select
                    label='Áp dụng cho'
                    value={apply}
                    onChange={(value) => {
                      setAddedProduct([]);
                      setApply(value);
                    }}
                    data={['Những sản phẩm nhất định', 'Toàn bộ sản phẩm']}
                    withAsterisk
                  />
                </Stack>
                <Stack w='250' className='basis-1/3'>
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
                    label='Ngày kết thúc'
                    withAsterisk
                    {...form.getInputProps('end_date')}
                  />
                  {type == 'Giảm theo %' && (
                    <NumberInput
                      label='Số % giảm theo giá tiền'
                      withAsterisk
                      min={1}
                      max={100}
                      {...form.getInputProps('value')}
                    />
                  )}
                  {type == 'Giảm số tiền nhất định' && (
                    <NumberInput
                      label='Số tiền được giảm'
                      withAsterisk
                      {...form.getInputProps('value')}
                    />
                  )}
                </Stack>
                <ScrollArea className='h-[450px] w-full'>
                  <Stack className='basis-2/3' p='16' align='center'>
                    {addedProduct.map((item) => (
                      <Stack align='center'>
                        <Image
                          alt='product'
                          w={200}
                          width={200}
                          height={200}
                          src={item.product_thumb}
                          component={NImage}
                          className=' border-b-[1px] border-gray-300 '
                        />
                        <Text>{item.product_name}</Text>
                      </Stack>
                    ))}
                    {apply == 'Những sản phẩm nhất định' && (
                      <ProductPicker
                        categories={categories.data}
                        label='Thêm sản phẩm'
                        onChoose={handleChooseProduct}
                      />
                    )}
                  </Stack>
                </ScrollArea>
              </Flex>
              <Group justify='space-between'>
                <Stack gap='0' px='32px'>
                  <Title order={2} mb='4'>
                    Tạo voucher
                  </Title>
                </Stack>
                <Button.Group>
                  <Button
                    variant='outline'
                    onClick={() => {
                      form.reset();
                      setAddedProduct([]);
                    }}
                  >
                    Làm mới
                  </Button>
                  <Button
                    className='bg-0-primary-color-6 text-white'
                    form='newVoucherForm'
                    type='submit'
                  >
                    Tạo voucher
                  </Button>
                </Button.Group>
              </Group>
            </Flex>
          </form>
        )}
      </div>
    </ScrollArea>
  );
};

export default CreateVoucher;

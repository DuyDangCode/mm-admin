import UserContext from '@/contexts/UserContext';
import queryClient from '@/helpers/client';
import { productService } from '@/services/productService';
import { Group, Stack, Title, Text, Button, Divider, TextInput, Textarea, Modal } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';
import React, { useContext } from 'react'
import toast from 'react-hot-toast';

export default function GeneralInfoForm({
    id,
    name,
    price,
    unit,
    quantity,
    closeFn,
    mutate
}: {
    id: string,
    name: string,
    price: number,
    unit: string,
    quantity: number,
    closeFn: any,
    mutate: any
}) {

    const { user } = useContext(UserContext)

    const [opened, { open, close }] = useDisclosure(false);
    const form = useForm({
        initialValues: {
            name: name,
            price: price,
            unit: unit,
        },
        validate: {
            name: (value) => (value.length === 0 ? 'Vui lòng nhập tên!' : null),
            price: (value) => (value.toString().length === 0 ? 'Vui lòng nhập giá!' : null),
            unit: (value) => (value.length === 0 ? 'Vui lòng nhập địa chỉ!' : null),
        },
    });

    const handleSubmit = (formData: any) => {
        if (formData.name != name ||
            formData.price != price ||
            formData.unit != unit) {
            open()
        }
        else {
            toast.error('Không có thay đổi nào')
        }

    }
    const handleUpdateProduct = () => {
        let change = {}
        if (form.values.name != name)
            change = { ...change, product_name: form.values.name }
        if (form.values.price != price)
            change = { ...change, product_price: form.values.price as number }
        if (form.values.unit != unit)
            change = { ...change, product_unit: form.values.unit }
        close()
        closeFn(false)
        mutate(change)
    }
    return (
        <Stack className='basis-7/12 rounded-[8px] border-[1px]' p='1rem'>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Group justify='space-between' align='flex-start'>
                    <Title order={5} c='gray.8'>Thông tin chung</Title>
                    <Group gap='8'>
                        <Button variant='white' size='sm' onClick={() => form.reset()}>Cài lại</Button>
                        <Divider orientation='vertical' />
                        <Button variant='outline' size='sm' onClick={() => closeFn(false)}>Hủy</Button>
                        <Button className='bg-0-primary-color-6 text-white' variant='filled' size='sm' type='submit'>Thay đổi</Button>
                    </Group>
                </Group>
                <Group align='flex-start'>
                    <Textarea
                        w='240'
                        label="Tên sản phẩm"
                        withAsterisk
                        autosize
                        {...form.getInputProps('name')}
                    />
                    <TextInput
                        w='240'
                        label="Đơn giá"
                        withAsterisk
                        type='number'
                        {...form.getInputProps('price')}
                    />
                </Group>
                <Group align='flex-start'>
                    <Textarea
                        w='240'
                        label="Đơn vị"
                        withAsterisk
                        autosize
                        {...form.getInputProps('unit')}
                    />
                    <TextInput
                        w='240'
                        label="Số lượng"
                        value={quantity}
                        disabled
                    />
                </Group>
            </form>
            <Modal.Root size='auto' zIndex={10000} opened={opened} onClose={close} centered>
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header>
                        <Modal.Title w='100%' ta='center'><Text fw={700}>Xác nhận thay đổi</Text></Modal.Title>
                    </Modal.Header>
                    <Modal.Body mt='16' mx='16'>
                        <Group justify='center'>
                            <Button variant='light' onClick={close}>Hủy</Button>
                            <Button className='bg-0-primary-color-6 text-white' onClick={handleUpdateProduct}>Xác nhận</Button>
                        </Group>
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root >
        </Stack>
    )
}

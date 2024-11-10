import UserContext from '@/contexts/UserContext'
import { productService } from '@/services/productService'
import { Button, Divider, Group, Stack, Title, Text, Textarea, Modal } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { useMutation } from '@tanstack/react-query'
import React, { useContext } from 'react'
import toast from 'react-hot-toast'

export default function DescInfoForm({
    id,
    desc,
    closeFn,
    mutate
}: {
    id: string,
    desc: string,
    closeFn: any,
    mutate: any
}) {
    const { user } = useContext(UserContext)

    const [opened, { open, close }] = useDisclosure(false);
    const form = useForm({
        initialValues: {
            desc: desc
        },
    });

    const handleSubmit = (formData: any) => {
        if (formData.desc != desc) {
            open()
        }
        else {
            toast.error('Không có thay đổi nào')
        }

    }
    const handleUpdateProduct = () => {
        let change = { product_description: form.values.desc }
        close()
        closeFn(false)
        mutate(change)
    }
    return (
        <Stack className='rounded-[8px] border-[1px]' p='1rem' mt='16'>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Group justify='space-between' align='flex-start'>
                    <Title order={5} c='gray.8'>Mô tả</Title>
                    <Group gap='8'>
                        <Button variant='white' size='sm' onClick={() => form.reset()}>Cài lại</Button>
                        <Divider orientation='vertical' />
                        <Button variant='outline' size='sm' onClick={() => closeFn(false)}>Hủy</Button>
                        <Button className='bg-0-primary-color-6 text-white' variant='filled' size='sm' type='submit'>Thay đổi</Button>
                    </Group>
                </Group>
                <Textarea
                    mt='lg'
                    withAsterisk
                    autosize
                    {...form.getInputProps('desc')}
                />
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

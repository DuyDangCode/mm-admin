'use client'
import UserContext from '@/contexts/UserContext'
import queryClient from '@/helpers/client'
import { categoryService } from '@/services/categoryService'
import { Category } from '@/utils/response'
import { Button, Group, Loader, ScrollArea, Table, Title, Text, Modal, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { useMutation, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'

const TheadLabels = ['Mã danh mục', 'Tên danh mục', 'Ngày tạo']
export default function ManageStaffPage() {

    const [opened, { open, close }] = useDisclosure(false)
    const [updateOpened, updateHandlers] = useDisclosure(false)
    const [deleteOpened, deleteHandlers] = useDisclosure(false)
    const [item, setItem] = useState<Category>()
    const { user } = useContext(UserContext)
    const categories = useQuery({
        queryKey: ['categories'],
        queryFn: categoryService.getAllCategories,
        enabled: !!user
    })

    const tabelHead = TheadLabels.map(i => (
        <Table.Th key={i}>{i}</Table.Th>
    ))

    const form = useForm({
        initialValues: {
            name: ''
        },
        validate: {
            name: (value) => (value.length === 0 ? false : null),
        },
    })

    const createCategoryMutation = useMutation({
        mutationFn: async (name: String) => {
            close()
            return await categoryService.createCategory(name);
        },
        onSuccess: () => {
            toast.success('Tạo danh mục thành công')
            queryClient.invalidateQueries({
                queryKey: ['categories'],
            })
        },
        onError(error) {
            console.log(error)
        },
    })

    const updateCategoryMutation = useMutation({
        mutationFn: async ({ id, name }: { id: string, name: string }) => {
            updateHandlers.close()
            return await categoryService.updateCategory(id, name);
        },
        onSuccess: () => {
            toast.success('Cập nhật danh mục thành công')
            queryClient.invalidateQueries({
                queryKey: ['categories'],
            })
        },
        onError(error) {
            console.log(error)
        },
    })

    const deleteCategoryMutation = useMutation({
        mutationFn: async (id: String) => {
            deleteHandlers.close()
            return await categoryService.deleteCategory(id)
        },
        onSuccess: () => {
            toast.success('Xóa danh mục thành công')
            queryClient.invalidateQueries({
                queryKey: ['categories'],
            })
        },
        onError(error) {
            console.log(error)
            toast.error(error.message)
        },
    })

    const handleCreateSubmit = (formData: any) => {
        if (
            formData &&
            formData.name
        ) {
            createCategoryMutation.mutate(formData.name);
        }
    }

    const handleUpdateSubmit = (formData: any) => {
        if (
            formData &&
            formData.name
        ) {
            updateCategoryMutation.mutate({ id: item?._id || '', name: formData.name });
        }
    }

    const CreateForm = <form onSubmit={form.onSubmit(handleCreateSubmit)}>
        <div className=' flex flex-col items-stretch p-[16px]'>
            <Stack w='350'>
                <TextInput
                    label="Tên danh mục"
                    placeholder="New Category"
                    withAsterisk
                    {...form.getInputProps('name')}
                />

            </Stack>
            <Group mt='md' grow>
                <Button variant='outline' onClick={() => {
                    form.reset()
                }}>Xóa</Button>
                <Button className='bg-0-primary-color-6 text-white' type='submit'>Tạo</Button>
            </Group>
        </div>
    </form>

    const UpdateForm = <form onSubmit={form.onSubmit(handleUpdateSubmit)}>
        <div className=' flex flex-col items-stretch p-[16px]'>
            <Stack w='350'>
                <TextInput
                    label="Tên danh mục"
                    placeholder={item?.category_name}
                    withAsterisk
                    {...form.getInputProps('name')}
                />

            </Stack>
            <Group mt='md' grow>
                <Button variant='outline' onClick={() => {
                    form.reset()
                }}>Xóa</Button>
                <Button className='bg-0-primary-color-6 text-white' type='submit'>Sửa</Button>
            </Group>
        </div>
    </form>

    return (
        <ScrollArea className='h-full w-full z-[0]' py='1rem' px='2rem'>
            <Group justify='space-between'>
                <Title order={4}>Quản lí danh mục</Title>
                <Button className='bg-0-primary-color-6 text-white' onClick={open}>Tạo danh mục mới</Button>
            </Group>
            {categories.isPending || createCategoryMutation.isPending ?
                <div className='w-full h-[500px] flex justify-center items-center'>
                    <Loader type="dots" />
                </div>
                :
                <div className='mt-[16px]'>
                    <Text>Số danh mục hiện có: <span style={{ fontWeight: '700', color: 'var(--mantine-color-turquoise-6)' }}>{categories.data?.length}</span></Text>
                    <div className='flex flex-col border-[0.5px] border-solid rounded-[4px] w-full py-[12px] px-[16px]' >
                        <Table highlightOnHover highlightOnHoverColor='turquoise.0' verticalSpacing="sm">
                            <Table.Thead>
                                <Table.Tr key='head'>
                                    {tabelHead}
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {categories.data?.map(item => (
                                    <Table.Tr key={`row-${item._id}`}>
                                        <Table.Td>{item._id}</Table.Td>
                                        <Table.Td>{item.category_name}</Table.Td>
                                        <Table.Td>{dayjs(item.createdAt).format('DD/MM/YYYY')}</Table.Td>
                                        <Table.Td className='cursor-pointer' onClick={() => {
                                            setItem(item)
                                            updateHandlers.open()
                                        }}>
                                            <Text c='turquoise' >Sửa</Text>
                                        </Table.Td>
                                        <Table.Td className='cursor-pointer'>
                                            <Text c='red' onClick={() => {
                                                setItem(item)
                                                deleteHandlers.open()
                                            }}>Xóa</Text>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </div>
                </div>
            }
            <Modal.Root size='auto' zIndex={10000} opened={opened} onClose={close}>
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header >
                        <Modal.Title w='100%' ta='center'><Text fw={700}>Tạo danh mục</Text></Modal.Title>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body px='lg'>
                        {CreateForm}
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root >
            <Modal.Root size='auto' zIndex={10000} opened={updateOpened} onClose={updateHandlers.close}>
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header >
                        <Modal.Title w='100%' ta='center'><Text fw={700}>Sửa danh mục</Text></Modal.Title>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body px='lg'>
                        {UpdateForm}
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root >
            <Modal className='absolute z-[10000]' size='sm' opened={deleteOpened} onClose={() => deleteHandlers.close()} centered withCloseButton={false}>
                <Text w='100%' size='lg' fw='700' ta='center' my='lg' >Xác nhận xóa danh mục</Text>
                <Group justify='center' mb='sm'>
                    <Button size='md' variant='outline' onClick={() => deleteHandlers.close()}>Hủy</Button>
                    <Button size='md' bg={'#02B1AB'} className=' text-white' onClick={() => deleteCategoryMutation.mutate(item?._id || '')}>Xác nhận</Button>
                </Group>
            </Modal>
        </ScrollArea>
    )
}

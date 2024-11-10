'use client'
import StatusCard from '@/components/StatusCard/statusCard'
import UserContext from '@/contexts/UserContext'
import queryClient from '@/helpers/client'
import { userService } from '@/services/userService'
import { checkEmailFormat, checkNameFormat, checkPasswordFormat, checkPhoneFormat } from '@/utils/regex'
import { Button, Group, Loader, Pagination, ScrollArea, Table, Title, Text, Modal, Flex, Stack, TextInput, PasswordInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { useMutation, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { usePathname, useRouter } from 'next/navigation'
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'

const TheadLabels = ['Mã nhân viên', 'Tên nhân viên', 'Ngày tạo tài khoản', 'Email']
export default function ManageStaffPage() {

    // some inner constant var
    // --start--
    const numInDisplay: number = 10
    // --end-- 

    const [opened, { open, close }] = useDisclosure(false);
    const [activePage, setPage] = useState(1)
    const router = useRouter()
    const currentPath = usePathname()
    const { user } = useContext(UserContext)
    const staffs = useQuery({
        queryKey: ['staffs', activePage],
        queryFn: () => {
            return userService.getAllUserByRole(user, 'staff', numInDisplay, activePage)
        },
        enabled: !!user
    })

    const numberOfStaff = useQuery({
        queryKey: ['number_of_staff'],
        queryFn: () => {
            return userService.getNumberOfStaff(user)
        },
        enabled: !!user
    })

    const tabelHead = TheadLabels.map(i => (
        <Table.Th key={i}>{i}</Table.Th>
    ))

    const form = useForm({
        initialValues: {
            username: '',
            password: '',
            email: '',
            display_name: '',
            phone: ''
        },
        validate: {
            display_name: (value) => (value.length === 0 ? false : null),
            username: (value) => checkNameFormat(value),
            phone: (value) => checkPhoneFormat(value),
            password: (value) => checkPasswordFormat(value),
            email: (value) => checkEmailFormat(value),
        },
    });
    const createAccountMutation = useMutation({
        mutationFn: async (formdata: FormData) => {
            close()
            return await userService.createStaffAccount(formdata);
        },
        onSuccess: () => {
            toast.success('Tạo tài khoản nhân viên thành công')
            queryClient.invalidateQueries({
                queryKey: ['staffs', activePage],
            });
            queryClient.invalidateQueries({
                queryKey: ['number_of_staff'],
            });

        },
        onError(error) {
            console.log(error);
        },
    });

    const handleSubmit = (formData: any) => {
        if (
            formData &&
            formData.username &&
            formData.phone &&
            formData.email &&
            formData.display_name &&
            formData.password
        ) {
            createAccountMutation.mutate(formData);
        }
    };

    const Form = <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className=' flex flex-col items-stretch p-[16px]'>
            <Stack w='350'>
                <TextInput
                    label="Tên nhân viên"
                    placeholder="Nhân viên 1"
                    withAsterisk
                    {...form.getInputProps('display_name')}
                />
                <TextInput
                    label="Tên tài khoản"
                    placeholder="Ten_ne"
                    withAsterisk
                    {...form.getInputProps('username')}
                />
                <PasswordInput
                    label="Mật khẩu"
                    placeholder="Mật khẩu"
                    withAsterisk
                    {...form.getInputProps('password')}
                />

                <TextInput
                    label="Email"
                    placeholder="email@email.what"
                    withAsterisk
                    {...form.getInputProps('email')}
                />
                <TextInput
                    label="Số điện thoại"
                    placeholder="VD: 0123456789"
                    withAsterisk
                    {...form.getInputProps('phone')}
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

    return (
        <ScrollArea className='h-full w-full z-[0]' py='1rem' px='2rem'>
            <Group justify='space-between'>
                <Title order={4}>Quản lí tài khoản nhân viên</Title>
                <Button className='bg-0-primary-color-6 text-white' onClick={open}>Tạo tài khoản mới</Button>
            </Group>
            {staffs.isPending || numberOfStaff.isPending || createAccountMutation.isPending ?
                <div className='w-full h-[500px] flex justify-center items-center'>
                    <Loader type="dots" />
                </div>
                :
                <div className='mt-[16px]'>
                    <Text>Số tài khoản hiện có: <span style={{ fontWeight: '700', color: 'var(--mantine-color-turquoise-6)' }}>{numberOfStaff.data}</span></Text>
                    <div className='flex flex-col border-[0.5px] border-solid rounded-[4px] w-full py-[12px] px-[16px]' >
                        <Table highlightOnHover highlightOnHoverColor='turquoise.0' verticalSpacing="sm">
                            <Table.Thead>
                                <Table.Tr key='head'>
                                    {tabelHead}
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {staffs.data?.map(item => (
                                    <Table.Tr key={`row-${item._id}`}>
                                        <Table.Td>{item._id}</Table.Td>
                                        <Table.Td>{item.display_name}</Table.Td>
                                        <Table.Td>{dayjs(item.createdAt).format('DD/MM/YYYY')}</Table.Td>
                                        <Table.Td>{item.email}</Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                        <Pagination
                            classNames={{
                                control: 'pagination-control'
                            }}
                            className='self-center'
                            total={Math.ceil(numberOfStaff.data / numInDisplay)}
                            value={activePage}
                            onChange={setPage} mt="sm" />
                    </div>
                </div>
            }
            <Modal.Root size='auto' zIndex={10000} opened={opened} onClose={close}>
                <Modal.Overlay />
                <Modal.Content>
                    <Modal.Header >
                        <Modal.Title w='100%' ta='center'><Text fw={700}>Tạo tài khoản nhân viên</Text></Modal.Title>
                        <Modal.CloseButton />
                    </Modal.Header>
                    <Modal.Body px='lg'>
                        {Form}
                    </Modal.Body>
                </Modal.Content>
            </Modal.Root >
        </ScrollArea>
    )
}

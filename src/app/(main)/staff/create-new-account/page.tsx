'use client'
import BackButton from "@/components/BackButton/backButton";
import UserContext from "@/contexts/UserContext";
import { userService } from "@/services/userService";
import { checkEmailFormat, checkNameFormat, checkPasswordFormat, checkPhoneFormat } from "@/utils/regex";
import { Flex, Group, Loader, ScrollArea, Stack, TextInput, Title, Text, Button, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { values } from "cypress/types/lodash";
import { useRouter } from "next/navigation";
import { useContext } from "react";


export default function CreateNewAccountPage() {
    const { user } = useContext(UserContext);
    const router = useRouter();

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
            return await userService.createStaffAccount(formdata);
        },
        onSuccess: (res) => {
            console.log('res', res);

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

    return (
        <ScrollArea className='h-full w-full z-[0]' >
            <div className='flex flex-col gap-[24px] py-[16px] px-[16px] h-full w-full '>
                <Group gap='lg'>
                    <BackButton />
                    <Title order={4}>Tạo tài khoản nhân viên</Title>
                </Group>
                {createAccountMutation.isPending ?
                    <div className='w-full h-[500px] flex justify-center items-center'>
                        <Loader type="dots" />
                    </div> :
                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Flex direction='column' align='center'>
                            <Stack w='400' className="rounded-[8px] border-[1px]" p='16'>
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
                            <Group mt='md'>
                                <Button variant='outline' onClick={() => {
                                    form.reset()
                                }}>Xóa</Button>
                                <Button className="bg-0-primary-color-6 text-white" type='submit'>Tạo</Button>
                            </Group>
                        </Flex>
                    </form>}
            </div>
        </ScrollArea>
    )
}

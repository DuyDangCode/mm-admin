'use client';
import '@/styles/global.css';
import {
  Button,
  Stack,
  TextInput,
  PasswordInput,
  LoadingOverlay,
  Alert,
} from '@mantine/core';
import '@mantine/core/styles.css';

import { IconInfoCircle } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { checkNameFormat, checkPasswordFormat } from '@/utils/regex';
import { userService } from '@/services/userService';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import UserContext from '@/contexts/UserContext';

export function SignInForm() {
  const router = useRouter();
  // const [user, setUser] = useLogin();
  const { user, setUser } = useContext(UserContext);
  const form = useForm({
    initialValues: {
      userInfo: '',
      password: '',
    },
    validate: {
      userInfo: (value) => checkNameFormat(value),
      password: (value) => checkPasswordFormat(value),
    },
  });

  const loginMutation = useMutation({
    mutationKey: ['loginMutation'],
    mutationFn: (formdata: FormData) => userService.login(formdata),

    onSuccess: (res) => {
      try {
        setUser(res);
        router.push('/');
      } catch {}
    },

    onError(error) {
      console.log(error);
    },
  });

  const handleSubmit = (formData: any) => {
    loginMutation.mutate(formData);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap='1rem'>
        <TextInput
          id='signin-form-username-input'
          name='userInfo'
          label='Tên đăng nhập'
          placeholder='Nhập tên đăng nhập'
          withAsterisk
          {...form.getInputProps('userInfo')}
          size='md'
        />
        <PasswordInput
          id='signin-form-password-input'
          name='password'
          label='Mật khẩu'
          placeholder='Nhập mật khẩu'
          withAsterisk
          {...form.getInputProps('password')}
          size='md'
        />
      </Stack>
      <Button
        id='signin-form-btn'
        fullWidth
        h='3rem'
        mt='1.5rem'
        type='submit'
        className=' h-[3rem] mt-[1.5rem] w-full bg-0-primary-color-6 text-white'
      >
        Đăng nhập
      </Button>
      {loginMutation.isPending && (
        <LoadingOverlay
          visible={true}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
      )}
      {loginMutation.isError && (
        <Alert
          variant='light'
          color='red'
          title='Error'
          icon={<IconInfoCircle />}
          withCloseButton
        >
          {loginMutation.failureReason?.message}
        </Alert>
      )}
    </form>
  );
}

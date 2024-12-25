'use client'
import '@/styles/global.css'
import NextImage from 'next/image'
import Link from 'next/link'
import {
  Flex,
  Image,
  Text,
  Title,
  Group,
  Stack,
  Anchor,
  Box,
  Input,
  Button,
} from '@mantine/core'
import displayImg from '@/public/pic/display-img.png'
import { SignInForm } from '../signInForm'
import { IconChevronLeft } from '@tabler/icons-react'

export default function ForgotPasswordPage() {
  return (
    <Flex
      pt='7rem'
      pb='2.5rem'
      px='8.4vw'
      mih='100%'
      justify='center'
      align='self-start'
      pos='fixed'
      top='0'
      left='0'
      right='0'
      bg='#fff'
      className='overlay'
    >
      <Stack className='form'>
        <Title order={2}>Quên mật khẩu</Title>
        <Input placeholder='Nhập email' />
        <Button>Tiếp tục</Button>
      </Stack>
    </Flex>
  )
}

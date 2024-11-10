
import NextImage from 'next/image'
import { Flex, Stack, Image, Container, Text, Anchor, Group } from '@mantine/core'
import logo from '@/public/icon.svg'
import { link } from 'fs'
import classes from './footer.module.css'
const linkData = [
  {
    title: 'Về chúng tôi',
    child: [
      {
        name: 'Chính sách bảo mật',
        href: 'https://mantine.dev/styles/css-variables/'
      },
      {
        name: 'Điều khoản sử dụng',
        href: 'https://mantine.dev/styles/css-variables/'
      },
    ]
  },
  {
    title: 'Dịch vụ',
    child: [
      {
        name: 'Trung tâm trợ giúp',
        href: 'https://mantine.dev/styles/css-variables/'
      },
      {
        name: 'Chăm sóc khách hàng',
        href: 'https://mantine.dev/styles/css-variables/'
      },
    ]
  },
  {
    title: 'Kết nối với chúng tôi',
    child: [
      {
        name: 'Facebook',
        href: 'https://mantine.dev/styles/css-variables/'
      },
      {
        name: 'Twitter',
        href: 'https://mantine.dev/styles/css-variables/'
      },
    ]
  },
]

type LinkGroupProps = {
  title?: string,
  child?: {
    name?: string,
    href?: string
  }[]
}
function LinkGroupWrapper({ title, child }: LinkGroupProps) {
  const list = child?.map(item => (
    <Anchor key={item.name} size='md' c='gray.5' href={item.href} target='_blank' underline='never'>
      {item.name}
    </Anchor>)
  )
  return (
    <Stack gap='1rem'>
      <Text size='md' c='gray.9'>{title}</Text>
      <Stack gap='0.5rem'>
        {list}
      </Stack>
    </Stack>
  )
}

export default function Footer() {

  return (
    <Container className={`${classes.container}`}>
      <Group justify='center' align='center' gap='8rem' py='4rem' bg='white' maw='100%' pos='fixed' bottom='0' right='0' left='0'>
        <Stack gap='3rem' align='center'>
          <Image component={NextImage} src={logo} alt='Logo' w='4rem' h='4rem' fit='fill'></Image>
          <Text c='gray.5'>© 2023 Material Mastery, Tất cả quyền được bảo lưu</Text>
        </Stack>
        <Group gap='4rem' align='flex-start'>
          <LinkGroupWrapper title={linkData.at(0)?.title} child={linkData.at(0)?.child} />
          <LinkGroupWrapper title={linkData.at(1)?.title} child={linkData.at(1)?.child} />
          <LinkGroupWrapper title={linkData.at(2)?.title} child={linkData.at(2)?.child} />
        </Group>
      </Group>
    </Container>
  )
}

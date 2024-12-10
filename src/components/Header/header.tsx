'use client'
import NextImage from 'next/image'
import { Flex, Group, Image, Text, Anchor, Menu, rem } from '@mantine/core'
import logo from '@/public/icon.svg'
import Search from '../Search/search'
// import '../../app/global.css';
import classes from './header.module.css'
import Link from 'next/link'
import { useContext, useEffect, useRef, useState } from 'react'
import queryClient from '@/helpers/client'
import LoggedHeader from './loggedHeader'
import UserContext from '@/contexts/UserContext'
import { usePathname } from 'next/navigation'

// interface OnClickInterface {
//   [index: string]: Function;
// }

export default function Header() {
  const appName = 'Material Mastery Admin'
  const { user, setUser } = useContext(UserContext)
  const [link, setLink] = useState('/')
  const currentPath = usePathname()

  useEffect(() => {
    if (user?.userId) setLink('/')
    else setLink('/sign-in')
    console.log('user', user)
  }, [user])

  if (!user) return <></>

  return (
    <Flex
      justify='space-between'
      align='center'
      bg='white'
      pos='fixed'
      top='0'
      left='0'
      right='0'
      className={`z-1000 ${classes.header}`}
      maw='100%'
    >
      <Link href={link}>
        <Group wrap='nowrap'>
          <Image
            component={NextImage}
            src={logo}
            alt='Logo'
            w='2.5rem'
            h='2.5rem'
            fit='fill'
          />
          <Text size='1rem' fw='900' c='turquoise.6' lh='1.1875rem'>
            {appName}
          </Text>
        </Group>
      </Link>
      {user?.userId && <LoggedHeader user={user} setUser={setUser} />}
    </Flex>
  )
}

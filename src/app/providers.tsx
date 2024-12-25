'use client'
import '@/styles/global.css'
import useLocalStorage from '@/hooks/useLocalStorage'
import { redirect, usePathname, useSearchParams } from 'next/navigation'
import { Toaster } from 'react-hot-toast'
import { useDeepCompareEffect } from 'react-use'

import { ReactNode, Suspense } from 'react'
import UserContext from '@/contexts/UserContext'
import { UserInterface } from '@/utils/response'
import queryClient from '@/helpers/client'

const Providers = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const defaultUser: UserInterface = {
    userId: null,
    roles: [],
    accessToken: null,
  }
  const [user, setUser, isUserSet] = useLocalStorage('user', defaultUser)

  useDeepCompareEffect(() => {
    if (!isUserSet) return
    if (
      !user?.userId &&
      pathname !== '/sign-in' &&
      pathname !== '/sign-in/forgot-password'
    ) {
      console.log(pathname)
      redirect('/sign-in')
    }
    if (
      user?.userId &&
      (pathname === '/sign-in' ||
        pathname === '/sign-up' ||
        pathname === '/sign-in/forgot-password')
    ) {
      redirect('/')
    }
  }, [pathname, searchParams, user, isUserSet])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
      <Toaster position='bottom-center' />
    </UserContext.Provider>
  )
}

export default Providers

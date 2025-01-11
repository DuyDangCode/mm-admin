'use client'
import '@/styles/global.css'
import '@mantine/core/styles.css'
import {
  Flex,
  Text,
  Menu,
  rem,
  Loader,
  Stack,
  Notification,
} from '@mantine/core'
// import '../../app/global.css';
import {
  IconShoppingCart,
  IconUserCircle,
  IconLogout,
  IconUser,
  IconChecklist,
  IconBell,
} from '@tabler/icons-react'
import classes from './header.module.css'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import CartService from '@/services/cartService'
import queryClient from '@/helpers/client'
import { userService } from '@/services/userService'
import NotificationService from '@/services/notificationService'
import { ManagerNotification } from '@/utils/response'

interface OnClickInterface {
  [index: string]: Function
}

const LoggedHeader = ({ user, setUser }: { user: any; setUser: any }) => {
  const router = useRouter()
  const notifications = useQuery({
    queryKey: ['manager_notifications'],
    queryFn: async () => {
      const notificationsService = new NotificationService(user)
      try {
        const notifications = await notificationsService.getNotification()
        return notifications
      } catch (error: any) {
        if (error?.status == 400) {
          handleOnClickOnMenu('signOut')
        }
        return []
      }
    },
    enabled: !!user,
    staleTime: 0,
  })

  const onClickFunction: OnClickInterface = {
    details: () => {
      router.push('/account')
    },
    signOut: () => {
      userService.signOut(user)
      setUser({
        userId: null,
        roles: [],
        accessToken: null,
      })
      queryClient.clear()
    },
  }
  const handleOnClickOnMenu = (type: string) => {
    return onClickFunction[type]()
  }
  // if (cartFromServer.failureCount == 5 && user) {
  //   onClickFunction.signOut();
  // }

  return (
    <Flex gap='1rem' align='center'>
      {/* <LanguagePicker /> */}
      <Menu trigger='hover' openDelay={100} closeDelay={400} zIndex={1002}>
        <Menu.Target>
          <IconBell color='#02B1AB' className={classes.hoverIcon} />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item>
            <Stack>
              {notifications.isLoading && <Loader color='#02B1AB' />}
              {notifications.isSuccess &&
                notifications.data.map(
                  (notification: ManagerNotification, index) => (
                    <Notification
                      title='Sản phẩm sắp hết hàng'
                      key={index}
                      onClick={() =>
                        router.push(`/warehouse/instock/${notification._id}`)
                      }
                    >
                      {notification.product_name}
                    </Notification>
                  ),
                )}
            </Stack>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Menu trigger='hover' openDelay={100} closeDelay={400} zIndex={1002}>
        <Menu.Target>
          <IconUserCircle color='#02B1AB' className={classes.hoverIcon} />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={
              <IconUser style={{ width: rem(14), height: rem(14) }} />
            }
            onClick={() => handleOnClickOnMenu('details')}
          >
            Thông tin tài khoản
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconLogout style={{ width: rem(14), height: rem(14) }} />
            }
            onClick={() => handleOnClickOnMenu('signOut')}
          >
            Đăng xuất
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Flex>
  )
}

export default LoggedHeader

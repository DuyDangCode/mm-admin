'use client'
import { useEffect, useState } from 'react'
import { Stack, NavLink, Group } from '@mantine/core'
import { useRouter, usePathname } from 'next/navigation'
import {
  IconLayoutDashboard,
  IconBuildingWarehouse,
  IconChecklist,
  IconUsersGroup,
  IconCategory,
  IconTicket,
  IconTruckDelivery
} from '@tabler/icons-react'

const staffData = [
  {
    slug: 'dashboard',
    icon: IconLayoutDashboard,
    label: 'Bảng điều khiển',
    child: [
      {
        slug: 'revenue',
        label: 'Doanh thu'
      }
      // {
      //     slug: 'in-outbound',
      //     label: 'Nhập/Xuất kho',
      // },
    ]
  },
  {
    slug: 'warehouse',
    icon: IconBuildingWarehouse,
    label: 'Kho',
    child: [
      {
        slug: 'instock',
        label: 'Tồn kho'
      },
      {
        slug: 'outbound',
        label: 'Xuất kho'
      }
    ]
  },
  {
    slug: 'order',
    icon: IconChecklist,
    label: 'Đơn hàng',
    child: []
  },
  {
    slug: 'category',
    icon: IconCategory,
    label: 'Danh mục',
    child: []
  },
  {
    slug: 'voucher',
    icon: IconTicket,
    label: 'Voucher',
    child: []
  }
]
const managerData = [
  {
    slug: 'dashboard',
    icon: IconLayoutDashboard,
    label: 'Bảng điều khiển',
    child: [
      {
        slug: 'revenue',
        label: 'Doanh thu'
      }
      // {
      //     slug: 'in-outbound',
      //     label: 'Nhập/Xuất kho',
      // },
    ]
  },
  {
    slug: 'warehouse',
    icon: IconBuildingWarehouse,
    label: 'Kho',
    child: [
      {
        slug: 'instock',
        label: 'Tồn kho'
      },
      {
        slug: 'inbound',
        label: 'Nhập kho'
      },
      {
        slug: 'outbound',
        label: 'Xuất kho'
      }
    ]
  },
  {
    slug: 'order',
    icon: IconChecklist,
    label: 'Đơn hàng',
    child: []
  },
  {
    slug: 'staff',
    icon: IconUsersGroup,
    label: 'Nhân viên',
    child: []
  },
  {
    slug: 'category',
    icon: IconCategory,
    label: 'Danh mục',
    child: []
  },
  {
    slug: 'voucher',
    icon: IconTicket,
    label: 'Voucher',
    child: []
  },
  {
    slug: 'delivery',
    icon: IconTruckDelivery,
    label: 'Vận chuyển',
    child: []
  }
]
const defaultSearchParams = {
  warehouse: {
    key: 'tab',
    param: 'publish'
  },
  instock: {
    key: 'tab',
    param: 'publish'
  }
}
export default function SideBar({ from }: { from: string }) {
  const router = useRouter()
  let currentUrl = usePathname()
  const [active, setActive] = useState(currentUrl.split('/').filter(Boolean))

  useEffect(() => {
    setActive(currentUrl.split('/').filter(Boolean))
  }, [currentUrl])

  const handleOnclick = (
    item: any,
    childIndex?: any,
    key?: string,
    params?: string | string[] | undefined
  ) => {
    const targetSlug =
      item.child.length === 0
        ? [item.slug]
        : [item.slug, item.child[childIndex | 0].slug]
    let href = targetSlug.length > 1 ? `/${targetSlug[1]}` : ''
    href =
      params !== undefined && key !== undefined
        ? href + '?' + key + '=' + params
        : href

    router.push(`/${targetSlug[0]}` + href)
  }

  const data = from === 'staff' ? staffData : managerData

  const items = data.map((item) => (
    <NavLink
      key={item.label}
      active={item.child.length === 0 ? item.slug === active[0] : false}
      label={item.label}
      leftSection={
        <div
          style={
            item.child.length === 0 && item.slug === active[0]
              ? {
                  padding: '4px',
                  borderRadius: '4px',
                  color: 'var(--mantine-color-turquoise-6)'
                }
              : {
                  padding: '4px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--mantine-color-turquoise-1)',
                  color: 'var(--mantine-color-turquoise-6)'
                }
          }
        >
          <item.icon size='1rem' stroke={1.5} />
        </div>
      }
      className='rounded-[4px]'
      fw={500}
      onClick={() => {
        const tmp =
          defaultSearchParams[item.slug as keyof typeof defaultSearchParams]
        if (tmp === undefined) handleOnclick(item)
        else handleOnclick(item, 0, tmp.key, tmp.param)
      }}
      rightSection={<></>}
      opened={item.slug === active[0]}
      childrenOffset={20}
      w='190px'
      my='4px'
      px='1rem'
      py='0.8rem'
    >
      <Stack gap='0'>
        {item.child.map((child, index) => (
          <NavLink
            key={child.label}
            active={child.slug === active[1]}
            component='button'
            style={
              child.slug === active[1]
                ? {
                    borderLeft: '1px solid var(--mantine-color-turquoise-6)'
                  }
                : {
                    borderLeft: '1px solid var(--mantine-color-gray-3)',
                    color: 'var(--mantine-color-gray-6)'
                  }
            }
            label={child.label}
            onClick={() => {
              const tmp =
                defaultSearchParams[
                  child.slug as keyof typeof defaultSearchParams
                ]
              if (tmp === undefined) handleOnclick(item, index)
              else handleOnclick(item, index, tmp.key, tmp.param)
            }}
            w='170px'
            ta='left'
          />
        ))}
      </Stack>
    </NavLink>
  ))

  return (
    <Stack
      py='2rem'
      px='1rem'
      bg='white'
      gap='0'
      className='shadow-[0px_0px_4px_0px_rgba(0,0,0,0.2)] z-[1] h-[100%]'
    >
      {items}
    </Stack>
  )
}

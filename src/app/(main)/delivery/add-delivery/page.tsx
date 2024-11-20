'use client'
import {
  ComboboxProps,
  Fieldset,
  Group,
  Pagination,
  ScrollArea,
  Select,
  Stack,
  Table,
  Checkbox,
  Text,
  LoadingOverlay,
  Button,
  Skeleton,
  Loader,
  Title,
} from '@mantine/core'
import { useState } from 'react'

import { useContext } from 'react'
import UserContext from '@/contexts/UserContext'
import { useQuery } from '@tanstack/react-query'
import OrderService from '@/services/orderService'
import OrderDeliveryTable from './orderDeliveryTable'
import { set } from 'zod'
import { Order, TableType } from '@/utils/response'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { createRequire } from 'module'
import DeliveryService from '@/services/deliveryService'
import { cwd } from 'process'

const comboboxStyles: ComboboxProps = {
  transitionProps: { transition: 'pop', duration: 200 },
  shadow: 'md',
}
export default function OnlineOrderSegment() {
  const [activePage, setPage] = useState(1)

  const { user } = useContext(UserContext)
  const [selectedOrders, setSelectedOrders] = useState<any>([])

  const orders = useQuery({
    queryKey: ['orders delivery', activePage],
    queryFn: () => {
      const orderService = new OrderService(user)
      return orderService.getAllOrder(10, activePage, 'shipping')
    },
    enabled: !!user,
  })

  const numberOfOrder = useQuery({
    queryKey: ['numberOfOrder'],
    queryFn: () => {
      const orderService = new OrderService(user)
      return orderService.getNumberOfOrder()
    },
    enabled: !!user,
  })

  const selectOrder = (item: any) => {
    for (let i = 0; i < selectedOrders.length; i++) {
      if (selectedOrders[i].id === item.id) {
        toast.error('Đơn hàng đã được thêm')
        return
      }
    }
    setSelectedOrders([...selectedOrders, item])
    toast.success('Đã thêm đơn hàng')
  }

  const removeOrder = (item: any) => {
    setSelectedOrders(selectedOrders.filter((i: any) => i.id !== item.id))
  }

  const createDelivery = (selectedOrders: any) => {
    if (selectedOrders.length === 0) {
      toast.error('Chưa chọn đơn hàng nào')
      return
    }
    console.log(selectedOrders.map((item: any) => item.id))

    const deliveryService = new DeliveryService(user)
    toast.promise(
      deliveryService.createDelivery(
        selectedOrders.map((item: any) => item.id),
      ),
      {
        loading: '',
        error: '',
        success: 'Tạo chuyến giao hàng thành công',
      },
    )
  }

  return (
    <ScrollArea className='h-full w-full z-[0]' py='1rem' px='2rem'>
      <Stack className='flex flex-col gap-[16px]'>
        {orders.isPending || numberOfOrder.isPending ? (
          <div className='w-full h-[500px] flex justify-center items-center'>
            <Loader type='dots' />
          </div>
        ) : (
          <div>
            <Text>
              Số đơn hàng hiện có:{' '}
              <span
                style={{
                  fontWeight: '700',
                  color: 'var(--mantine-color-turquoise-6)',
                }}
              >
                {numberOfOrder.data['shipping']}
              </span>
            </Text>
            <div className='flex flex-col border-[0.5px] border-solid rounded-[4px] w-full py-[12px] px-[16px]'>
              <OrderDeliveryTable
                orders={orders.data.map((i: Order) => ({
                  id: i._id,
                  createAt: dayjs(i.createdAt).format('DD/MM/YYYY'),
                  customer: i.order_username,
                  paymentStatus: i.order_payment.status,
                  shipmentStatus: i.order_status,
                  finalPrice: i.order_checkout.finalPrice,
                  address: i.order_address.city,
                }))}
                buttonName='Thêm'
                callback={selectOrder}
              />
              <Pagination
                classNames={{
                  control: 'pagination-control',
                }}
                className='self-center'
                total={Math.ceil(
                  (numberOfOrder.data['shipping'] as number) / 10,
                )}
                value={activePage}
                onChange={setPage}
                mt='sm'
              />
            </div>
            <div className='flex flex-col border-[0.5px] border-solid rounded-[4px] w-full py-[12px] px-[16px]'>
              <Button
                className='w-fit self-end'
                onClick={() => {
                  createDelivery(selectedOrders)
                }}
              >
                Tạo đơn vận chuyển
              </Button>
              <OrderDeliveryTable
                orders={selectedOrders}
                buttonName='Xóa'
                callback={removeOrder}
              />
              <Pagination
                classNames={{
                  control: 'pagination-control',
                }}
                className='self-center'
                total={Math.ceil(selectedOrders.length / 10)}
                value={activePage}
                onChange={setPage}
                mt='sm'
              />
            </div>
          </div>
        )}
      </Stack>
    </ScrollArea>
  )
}

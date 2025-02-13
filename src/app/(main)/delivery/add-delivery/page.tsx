'use client'
import {
  Button,
  ComboboxProps,
  Loader,
  NumberInput,
  Pagination,
  ScrollArea,
  Stack,
  Switch,
  Text,
} from '@mantine/core'
import { useContext, useEffect, useState } from 'react'
import UserContext from '@/contexts/UserContext'
import { useMutation, useQuery } from '@tanstack/react-query'
import OrderService from '@/services/orderService'
import OrderDeliveryTable from './orderDeliveryTable'
import { Order } from '@/utils/response'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import DeliveryService from '@/services/deliveryService'
import { useRouter } from 'next/navigation'
import BackButton from '@/components/BackButton/backButton'
import { constant } from '@/utils/constant'

const comboboxStyles: ComboboxProps = {
  transitionProps: { transition: 'pop', duration: 200 },
  shadow: 'md',
}
export default function OnlineOrderSegment() {
  const [activePage, setPage] = useState(1)
  const [startLocation, setStartLocation] = useState<string | null>(
    constant.START_LOCATION,
  )

  const { user } = useContext(UserContext)
  const [selectedOrders, setSelectedOrders] = useState<any>([])
  const router = useRouter()
  const [findByNearestPlaces, setFindByNearestPlaces] = useState(true)
  const [radiusToFind, setRadiusToFind] = useState<string | number>(10)

  const orders = useQuery({
    queryKey: ['orders delivery', activePage],
    queryFn: () => {
      const orderService = new OrderService(user)
      return orderService.getAllOrder(10, activePage, 'shipping')

      // const deliveryService = new DeliveryService(user)
      // return deliveryService.getAllOrdersNotShipping()
    },
    enabled: !!user,
  })

  const nearestOrdersMutation = useMutation({
    mutationKey: ['nearest orders delivery', radiusToFind],
    mutationFn: (orderId: string) => {
      return findNearestOrders([orderId], radiusToFind, user)
    },
  })

  const findNearestOrders = async (
    orderIds: string[],
    radius: number | string,
    user: any,
  ) => {
    const orderService = new OrderService(user)
    const nearestOrders = await orderService.getAllNearestOrdersByIds(
      orderIds,
      radius,
    )
    return nearestOrders[0].nearbyOrders.filter((order: any) => {
      for (let i = 0; i < orderIds.length; i++) {
        if (order.id === orderIds[i]) return false
      }
      return true
    })
  }

  const numberOfOrder = useQuery({
    queryKey: ['numberOfOrder'],
    queryFn: () => {
      const orderService = new OrderService(user)
      return orderService.getNumberOfOrder()
    },
    enabled: !!user,
  })

  const selectOrders = (items: any) => {
    let tempSelectOrders = selectedOrders
    L1: for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < tempSelectOrders.length; j++) {
        if (tempSelectOrders[j].id === items[i].id) {
          continue L1
        }
      }
      tempSelectOrders = [...tempSelectOrders, items[i]]
    }
    setSelectedOrders(tempSelectOrders)
    toast.success('Đã thêm đơn hàng')
  }

  const selectOrder = (item: any) => {
    for (let i = 0; i < selectedOrders.length; i++) {
      if (selectedOrders[i].id === item.id) {
        toast.error('Đơn hàng đã được thêm')
        return
      }
    }
    setSelectedOrders([...selectedOrders, item])
    nearestOrdersMutation.mutate(item.id)
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
    const deliveryService = new DeliveryService(user)
    const createDeliveryPromise = deliveryService
      .createDelivery(
        selectedOrders.map((item: any) => item.id),
        startLocation,
      )
      .then((res) => {
        router.push('/delivery')
      })
    toast.promise(createDeliveryPromise, {
      loading: '',
      error: '',
      success: 'Tạo chuyến giao hàng thành công',
    })
  }
  if (
    orders.isPending ||
    numberOfOrder.isPending ||
    orders.isError ||
    numberOfOrder.isError
  ) {
    return (
      <div className='w-full h-[500px] flex justify-center items-center'>
        <Loader type='dots' />
      </div>
    )
  }

  return (
    <ScrollArea className='h-full w-full z-[0]' py='1rem' px='2rem'>
      <Stack className='flex flex-col gap-[16px]'>
        <div className='flex items-center justify-between  pb-2'>
          <div className='flex flex-col items-start ml-2 gap-2'>
            <BackButton />
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
          </div>
          <div className='flex flex-col w-fit items-center'>
            {/* <Switch */}
            {/*   checked={findByNearestPlaces} */}
            {/*   onChange={(event) => */}
            {/*     setFindByNearestPlaces(event.currentTarget.checked) */}
            {/*   } */}
            {/*   label='Tự động tìm kiếm theo vị trí gần nhất' */}
            {/* /> */}
            <NumberInput
              label='Bán kính'
              description='Bán kính tìm kiếm các sản phẩm. Đơn vị: km'
              value={radiusToFind}
              onChange={setRadiusToFind}
              min={0}
            />
          </div>
        </div>

        <div className='flex flex-col border-[0.5px] border-solid rounded-[4px] w-full py-[12px] px-[16px]'>
          <h2 className='font-bold'>1. Danh sách các đơn hàng cần giao</h2>
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
            total={Math.ceil((numberOfOrder.data['shipping'] as number) / 10)}
            value={activePage}
            onChange={setPage}
            mt='sm'
          />
        </div>
        <div className='flex flex-col border-[0.5px] border-solid rounded-[4px] w-full py-[12px] px-[16px]'>
          <h2 className='font-bold'>2. Danh sách gợi ý</h2>
          {nearestOrdersMutation.isSuccess ? (
            <OrderDeliveryTable
              orders={nearestOrdersMutation.data.map((i: Order) => ({
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
          ) : nearestOrdersMutation.isPending ? (
            <div className='flex justify-center items-center w-full h-full'>
              <Loader color='#02B1AB' size='xs' />
            </div>
          ) : (
            <p className='text-sm opacity-30 text-black'>
              Không tìm thấy đơn hàng
            </p>
          )}
        </div>

        <div className='flex flex-col border-[0.5px] border-solid rounded-[4px] w-full py-[12px] px-[16px]'>
          <div className='flex w-full h-fit items-center justify-end gap-2'>
            <Button
              className='w-fit self-end'
              onClick={async () => {
                const nearestOrders = (
                  await findNearestOrders(
                    selectedOrders.map((order: any) => order.id),
                    radiusToFind,
                    user,
                  )
                ).map((i: Order) => ({
                  id: i._id,
                  createAt: dayjs(i.createdAt).format('DD/MM/YYYY'),
                  customer: i.order_username,
                  paymentStatus: i.order_payment.status,
                  shipmentStatus: i.order_status,
                  finalPrice: i.order_checkout.finalPrice,
                  address: i.order_address.city,
                }))
                selectOrders(nearestOrders)
              }}
            >
              Thêm các đơn hàng ở gần
            </Button>

            <Button
              className='w-fit self-end'
              onClick={() => {
                createDelivery(selectedOrders)
              }}
            >
              Tạo đơn vận chuyển
            </Button>
          </div>
          <h2 className='font-bold'>3. Danh sách chọn</h2>
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
      </Stack>
    </ScrollArea>
  )
}

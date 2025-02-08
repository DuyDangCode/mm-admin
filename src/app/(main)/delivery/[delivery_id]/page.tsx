'use client'
import { Suspense, use, useContext, useMemo, useState } from 'react'

import {
  LoadingOverlay,
  Container,
  Loader,
  NumberInput,
  Switch,
  Button,
  ActionIcon,
} from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import UserContext from '@/contexts/UserContext'
import DeliveryService from '@/services/deliveryService'
import { DeliveryDetailData, Pos } from '@/types/mapType'
import dynamic from 'next/dynamic'
import { formatOrderId, formatOrderIdWithoutCreateAt } from '@/utils/string'
import dayjs from 'dayjs'
import BackButton from '@/components/BackButton/backButton'
import OrderService from '@/services/orderService'
import DotLoading from '@/components/Loading/DotLoading'

import { IconSquarePlus } from '@tabler/icons-react'

export default function DeliveryDetailPage({
  params,
}: {
  params: Promise<{ delivery_id: string }>
}) {
  const deliveryId = use(params).delivery_id
  const [autoFindNearestOrder, setAutoFindNearestOrder] = useState(true)
  const { user } = useContext(UserContext)
  const [radius, setRadius] = useState<string | number>(10)
  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/Map/LeafletMap'), {
        loading: () => <DotLoading />,
        ssr: false,
      }),
    [],
  )

  const deliveryQuery = useQuery({
    queryKey: ['delivery', deliveryId],
    queryFn: async (): Promise<DeliveryDetailData> => {
      const deliveryService = new DeliveryService(user)
      const deliveryData = await deliveryService.getDelivery(deliveryId)
      const locations = deliveryData?.data?.metadata?.deliveries
      return {
        orderIds: locations?.orderIds,
        pos: locations.routes.map((item: string, index: number) => {
          let pos = item.split(',')
          const name =
            index == 0
              ? 'Kho'
              : formatOrderIdWithoutCreateAt(locations?.orderIds[index - 1])
          return { lng: pos[1], lat: pos[0], name }
        }),
        createAt: dayjs(
          deliveryData?.data?.metadata?.orderInfos[0].createdAt,
        ).format('DD/MM/YYYY'),
      }
    },
    enabled: !!deliveryId && !!user,
  })
  const nearestOrderQuery = useQuery({
    queryKey: ['Nearest order query', radius],
    queryFn: async () => {
      const orderService = new OrderService(user)
      if (!deliveryQuery.data?.orderIds) return
      const ordersData = await orderService.getAllNearestOrdersByIds(
        deliveryQuery.data?.orderIds,
        radius,
        1,
        100,
      )
      return ordersData
        .map((order: { nearbyOrders: {}[] }) => order.nearbyOrders)
        .flat()
        .map(
          (orderInfo: {
            _id: string
            order_address: { city: string; longitude: string; latitude: string }
          }) => {
            return {
              name: formatOrderIdWithoutCreateAt(orderInfo._id),
              lng: orderInfo.order_address.longitude,
              lat: orderInfo.order_address.latitude,
            }
          },
        )
    },
    enabled: deliveryQuery.isSuccess && autoFindNearestOrder,
  })

  if (deliveryQuery.isPending || deliveryQuery.isError)
    return <div className='w-full h-full flex'></div>

  return (
    <div className='w-full h-full'>
      <div className='flex flex-row gap-2 items-center pl-2 py-2 px-3'>
        <BackButton />
        <p className='px-3 py-2 text-[#02B1AB]'>
          <b>Mã đơn:</b>{' '}
          {formatOrderId(
            deliveryId,
            deliveryQuery.data?.createAt ?? Date.now().toString(),
          )}
        </p>

        <div className='ml-auto flex items-center gap-2'>
          <ActionIcon variant='transparent' aria-label='Add' onClick={() => {}}>
            <IconSquarePlus
              color='#02B1AB'
              stroke={1.5}
              style={{ color: '#02B1AB' }}
            />
          </ActionIcon>
          <Switch
            // label='Hiển thị các đơn hàng ở gần'
            checked={autoFindNearestOrder}
            onChange={(event) => {
              setAutoFindNearestOrder(event.currentTarget.checked)
            }}
          />
          <NumberInput value={radius} onChange={setRadius} />
        </div>
      </div>

      <div className='w-full h-full'>
        <Map
          deliveryOrdersPos={deliveryQuery.data?.pos}
          nearesOrderPos={nearestOrderQuery.data}
          zoom={10}
        />
      </div>
    </div>
  )
}

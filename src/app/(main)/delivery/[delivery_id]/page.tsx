'use client'
import { use, useContext, useMemo, useState } from 'react'
import { Switch } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import UserContext from '@/contexts/UserContext'
import DeliveryService from '@/services/deliveryService'
import { DeliveryDetailData } from '@/types/mapType'
import dynamic from 'next/dynamic'
import {
  formatDeliveryIdWithoutCreateAt,
  formatOrderIdWithoutCreateAt,
} from '@/utils/string'
import BackButton from '@/components/BackButton/backButton'
import DotLoading from '@/components/Loading/DotLoading'

export default function DeliveryDetailPage({
  params,
}: {
  params: Promise<{ delivery_id: string }>
}) {
  const deliveryId = use(params).delivery_id
  const [isShowDirection, setIsShowDirection] = useState(true)
  const { user } = useContext(UserContext)
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
              : `${index}. ${formatOrderIdWithoutCreateAt(locations?.orderIds[index - 1])}`
          return { lng: pos[1], lat: pos[0], name }
        }),
      }
    },
    // placeholderData: { orderIds: [], pos: [] },
    enabled: !!deliveryId && !!user,
  })
  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/Map/LeafletMap'), {
        loading: () => <DotLoading />,
        ssr: false,
      }),
    [isShowDirection],
  )

  if (deliveryQuery.isPending || deliveryQuery.isError)
    return (
      <div className='w-full h-full'>
        <DotLoading />
      </div>
    )

  return (
    <div className='w-full h-full'>
      <div className='flex flex-row gap-2 items-center pl-2 py-2 px-3'>
        <BackButton />
        <p className='px-3 py-2 text-[#02B1AB]'>
          <b>Mã đơn:</b> {formatDeliveryIdWithoutCreateAt(deliveryId)}
        </p>

        <div className='ml-auto flex items-center gap-2'>
          {/* <ActionIcon */}
          {/*   variant='transparent' */}
          {/*   aria-label='Add' */}
          {/*   onClick={() => { */}
          {/*     if ( */}
          {/*       !autoFindNearestOrder || */}
          {/*       Number.isNaN(radius) || */}
          {/*       nearestOrderQuery.isPending || */}
          {/*       nearestOrderQuery.isError || */}
          {/*       deliveryQuery.isPending || */}
          {/*       deliveryQuery.isError */}
          {/*     ) */}
          {/*       return */}
          {/**/}
          {/*     const deliveryService = new DeliveryService(user) */}
          {/*     const radiusNumber: number = */}
          {/*       typeof radius == 'string' ? parseInt(radius) : radius */}
          {/*     const addNearestOrderPromise = deliveryService */}
          {/*       .addNearestOrderToDelivery( */}
          {/*         deliveryId, */}
          {/*         deliveryQuery.data.orderIds, */}
          {/*         radiusNumber, */}
          {/*       ) */}
          {/*       .then((res) => { */}
          {/*         deliveryQuery.refetch() */}
          {/*         nearestOrderQuery.refetch() */}
          {/*       }) */}
          {/*     toast.promise(addNearestOrderPromise, { */}
          {/*       success: 'Thêm đơn hàng thành công', */}
          {/*       error: 'Thêm đơn hàng thất bại', */}
          {/*       loading: 'Đang xử lý', */}
          {/*     }) */}
          {/*   }} */}
          {/* > */}
          {/*   <IconSquarePlus */}
          {/*     color='#02B1AB' */}
          {/*     stroke={1.5} */}
          {/*     style={{ color: '#02B1AB' }} */}
          {/*   /> */}
          {/* </ActionIcon> */}
          {/* <Switch */}
          {/*   // label='Hiển thị các đơn hàng ở gần' */}
          {/*   checked={autoFindNearestOrder} */}
          {/*   onChange={(event) => { */}
          {/*     setAutoFindNearestOrder(event.currentTarget.checked) */}
          {/*   }} */}
          {/* /> */}
          <Switch
            // label='Hiển thị các đơn hàng ở gần'
            checked={isShowDirection}
            onChange={(event) => {
              setIsShowDirection(event.currentTarget.checked)
            }}
          />
          {/* <NumberInput value={radius} onChange={setRadius} /> */}
        </div>
      </div>
      <div className='w-full h-full'>
        <Map
          deliveryOrdersPos={deliveryQuery.data?.pos}
          isShowDirection={isShowDirection}
          zoom={10}
        />
      </div>
    </div>
  )
}

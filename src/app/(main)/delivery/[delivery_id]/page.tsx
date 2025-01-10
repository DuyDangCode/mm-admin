'use client'

import { Suspense, use, useContext, useMemo } from 'react'

import { LoadingOverlay, Container, Loader } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import UserContext from '@/contexts/UserContext'
import DeliveryService from '@/services/deliveryService'
import { DeliveryDetailData, Pos } from '@/types/mapType'
import dynamic from 'next/dynamic'
import { formatOrderId } from '@/utils/string'
import dayjs from 'dayjs'
import BackButton from '@/components/BackButton/backButton'

export default function DeliveryDetailPage({
  params,
}: {
  params: Promise<{ delivery_id: string }>
}) {
  const deliveryId = use(params).delivery_id
  const { user } = useContext(UserContext)
  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/Map/LeafletMap'), {
        loading: () => <p>A map is loading</p>,
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
      console.log(deliveryData.data.metadata)
      return {
        pos: [
          ...locations.routes.map((item: string) => {
            let pos = item.split(',')
            return { lng: pos[0], lat: pos[1] }
          }),
        ],
        createAt: dayjs(
          deliveryData?.data?.metadata?.orderInfos[0].createdAt,
        ).format('DD/MM/YYYY'),
      }
    },
    enabled: !!deliveryId && !!user,
  })

  if (deliveryQuery.isPending || deliveryQuery.isError)
    return <div className='w-full h-full flex'></div>

  return (
    <div className='w-full h-full'>
      <div className='flex flex-row gap-2 items-center pl-2'>
        <BackButton />
        <p className='px-3 py-2 text-[#02B1AB]'>
          <b>Mã đơn:</b>{' '}
          {formatOrderId(
            deliveryId,
            deliveryQuery.data?.createAt ?? Date.now().toString(),
          )}
        </p>
      </div>

      <div className='w-full h-full'>
        <Map allPositions={deliveryQuery.data?.pos} zoom={15} />
      </div>
    </div>
  )
}

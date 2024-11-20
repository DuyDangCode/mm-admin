'use client'

import { Suspense, use, useContext, useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'
import UserContext from '@/contexts/UserContext'
import DeliveryService from '@/services/deliveryService'
import { Pos } from '@/types/mapType'
import dynamic from 'next/dynamic'

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
    queryFn: async (): Promise<Pos[]> => {
      const deliveryService = new DeliveryService(user)
      const locations = (await deliveryService.getDelivery(deliveryId))?.data
        ?.metadata?.deliveries

      const startLocation = locations.startLocation.split(',')
      return [
        // { lat: startLocation[0], lng: startLocation[1] },
        ...locations.routes.map((item: string) => {
          let pos = item.split(',')
          return { lat: pos[0], lng: pos[1] }
        }),
      ]
    },
    enabled: !!deliveryId && !!user,
  })

  return (
    <div className='w-full h-full'>
      {deliveryId}
      <div className='w-full h-full'>
        <Map allPositions={deliveryQuery.data} zoom={15} />
      </div>
    </div>
  )
}

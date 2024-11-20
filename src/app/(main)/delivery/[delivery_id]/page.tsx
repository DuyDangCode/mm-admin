'use client'

import { Suspense, use, useContext } from 'react'

import Map from '@/components/Map/Map'
import { useQuery } from '@tanstack/react-query'
import UserContext from '@/contexts/UserContext'
import DeliveryService from '@/services/deliveryService'

export default function DeliveryDetailPage({
  params,
}: {
  params: Promise<{ delivery_id: string }>
}) {
  const deliveryId = use(params).delivery_id
  const { user } = useContext(UserContext)

  const deliveryQuery = useQuery({
    queryKey: ['delivery', deliveryId],
    queryFn: async () => {
      const deliveryService = new DeliveryService(user)
      return await deliveryService.getDelivery(deliveryId)
    },
    enabled: !!deliveryId && !!user,
  })

  return (
    <div>
          
        {deliveryId}
        {/* <Map allPositions={allPositions} zoom={15} /> */}
          
    </div>
  )
}

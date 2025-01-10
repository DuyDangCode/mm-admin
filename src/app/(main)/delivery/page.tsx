'use client'

import UserContext from '@/contexts/UserContext'
import DeliveryService from '@/services/deliveryService'
import { Pos } from '@/types/mapType'
import { useQuery } from '@tanstack/react-query'
import 'maplibre-gl/dist/maplibre-gl.css'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Suspense, useContext, useEffect, useMemo, useState } from 'react'
import DeliveryTable from './deliveryTable'
import { Button, Loader, ScrollArea, Skeleton } from '@mantine/core'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'
// import Map from '@/components/Map/Map'

export default function DeliveryPage() {
  const [allPositions, setAllPositions] = useState<Pos[]>([{ lat: 0, lng: 0 }])
  const { user } = useContext(UserContext)
  const router = useRouter()

  const deliveryQuery = useQuery({
    queryKey: ['deliveries'],
    queryFn: async () => {
      const deliveryService = new DeliveryService(user)
      return (await deliveryService.getAllDelivery()).data.metadata.map(
        (item: any) => ({
          userId: item.userId,
          orderIds: item.orderIds,
          routes: item.routes,
          rating: item.rating,
          status: item.status,
          startLocation: item.startLocation,
          id: item._id,
          updateAt: item.updatedAt,
          createAt: dayjs(item.createdAt).format('DD/MM/YYYY'),
        }),
      )
    },
    enabled: !!user,
  })
  useEffect(() => {
    router.prefetch('/delivery/add-delivery')
  }, [])
  if (deliveryQuery.isPending)
    return (
      <div className='w-full h-[500px] flex justify-center items-center'>
        <Loader type='dots' />
      </div>
    )
  return (
    <ScrollArea w='100%' h='100%' py='1rem' px='2rem'>
      <Button
        className='self-end'
        onClick={() => {
          router.push('/delivery/add-delivery')
        }}
      >
        Tạo đơn vận chuyển
      </Button>

      <DeliveryTable deliveries={deliveryQuery.data} />
    </ScrollArea>
  )
}

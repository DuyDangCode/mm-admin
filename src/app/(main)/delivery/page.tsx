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
import { Button, ScrollArea } from '@mantine/core'
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

      {/* <Map allPositions={allPositions} zoom={15} /> */}
      {/* <Map */}
      {/*   initialViewState={{ */}
      {/*     longitude: -100, */}
      {/*     latitude: 40, */}
      {/*     zoom: 3.5, */}
      {/*   }} */}
      {/*   style={{ width: 800, height: 600 }} */}
      {/*   mapStyle='https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json' */}
      {/* > */}
      {/*   <GeolocateControl position='top-left' /> */}
      {/* </Map> */}
    </ScrollArea>
  )
}

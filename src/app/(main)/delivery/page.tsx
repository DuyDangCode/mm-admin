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
// import Map from '@/components/Map/Map'

export default function DeliveryPage() {
  const [allPositions, setAllPositions] = useState<Pos[]>([{ lat: 0, lng: 0 }])
  const { user } = useContext(UserContext)

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
          createAt: item.createdAt,
        }),
      )
    },
    enabled: !!user,
  })
  return (
    <div className='w-full h-full'>
      <Link href={'/delivery/add-delivery'}>Add new delivery</Link>
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
    </div>
  )
}

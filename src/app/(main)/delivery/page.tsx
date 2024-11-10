'use client'

import { Pos } from '@/types/mapType'
import 'maplibre-gl/dist/maplibre-gl.css'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
// import Map from '@/components/Map/Map'

export default function DeliveryPage() {
  const [allPositions, setAllPositions] = useState<Pos[]>([{ lat: 0, lng: 0 }])

  const Map = useMemo(
    () =>
      dynamic(() => import('@/components/Map/LeafletMap'), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    [],
  )
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Vị trí hiện tại:', position.coords)
        setAllPositions([
          { lat: position.coords.latitude, lng: position.coords.longitude },
          { lat: 10.924067, lng: 106.713028 },
          { lat: 10.045162, lng: 105.746857 },
          { lat: 10.762622, lng: 106.660172 },
          { lat: position.coords.latitude, lng: position.coords.longitude },
        ])
      },
      (error) => {
        console.error('Lỗi khi lấy vị trí:', error)
      },
    )
  }, [])
  return (
    <div className='w-full h-full'>
      <Map allPositions={allPositions} zoom={15} />
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

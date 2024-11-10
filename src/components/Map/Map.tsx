'use client'
import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import '@/styles/map.css'

export default function Map() {
  const mapContainerRef = useRef<any>()

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [139.753, 35.6844],
      zoom: 5,
    })

    map.addControl(new maplibregl.NavigationControl(), 'top-right')

    new maplibregl.Marker({ color: '#FF0000' })
      .setLngLat([139.7525, 35.6846])
      .addTo(map)

    return () => {
      map.remove()
    }
  }, [])

  return (
    <div className='map-wrap'>
      <a href='https://www.maptiler.com' className='watermark'>
        <img
          src='https://api.maptiler.com/resources/logo.svg'
          alt='MapTiler logo'
        />
      </a>
      <div ref={mapContainerRef} className='map' />
    </div>
  )
}

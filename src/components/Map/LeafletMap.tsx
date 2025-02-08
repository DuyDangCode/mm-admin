'use client'

import React, { useRef, useEffect, useState, use } from 'react'
import 'leaflet/dist/leaflet.css'

import L from 'leaflet'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'

import '@/styles/map.css'
import { LeafletMapProps } from '@/types/mapType'
import { getColorWithIndex, randomColorCode } from '@/utils/color'

function Map({ deliveryOrdersPos, zoom, nearesOrderPos }: LeafletMapProps) {
  const mapContainer = useRef<any>(null)
  const map = useRef<any>(null)
  const [zoomState] = useState(zoom)

  useEffect(() => {
    if (!deliveryOrdersPos || deliveryOrdersPos.length == 0) return
    if (map.current) return
    map.current = new L.Map(mapContainer.current, {
      center: L.latLng(deliveryOrdersPos[0].lat, deliveryOrdersPos[0].lng),
      zoom: zoomState,
    })

    map.current.off('click')
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map.current)
  }, [])

  useEffect(() => {
    if (!map.current) return
    if (!deliveryOrdersPos) return
    const controlHolder: any[] = []

    const waypoints = deliveryOrdersPos.map(
      // @ts-ignore
      (pos) => L.latLng(pos.lat, pos.lng),
    )

    // @ts-ignore
    // const directionControl = L.Routing.control({
    //   waypoints: waypoints,
    //   lineOptions: {
    //     styles: [{ opacity: 0 }],
    //   },
    //   addWaypoints: false,
    //   show: true,
    //   createMarker: function () {
    //     return null
    //   },
    //   fitSelectedRoutes: false,
    //   routeWhileDragging: false,
    // })

    // if (directionControl) controlHolder.push(directionControl)
    // directionControl.addTo(map.current)

    for (let i = 0; i < deliveryOrdersPos.length - 1; i++) {
      // @ts-ignore
      const routeControl = L.Routing.control({
        waypoints: [waypoints[i], waypoints[i + 1]],
        lineOptions: {
          styles: [{ color: getColorWithIndex(i), weight: 4 }],
          // styles: lineStyles,
        },
        show: false,
        addWaypoints: false,
        fitSelectedRoutes: false,
        routeWhileDragging: false,
        createMarker: function () {
          return null
        },
      })
      // map.current.removeControl(routeControl)

      if (routeControl) controlHolder.push(routeControl)
      routeControl.addTo(map.current)
    }

    return () => {
      while (controlHolder.length > 0) {
        const controlObj = controlHolder.pop()
        if (controlObj && controlObj._map) {
          map.current.removeControl(controlObj)
        }
      }
    }
  }, [deliveryOrdersPos])

  useEffect(() => {
    if (!map.current) return
    if (!nearesOrderPos) return

    const markers: any[] = []
    nearesOrderPos.forEach((pos, index) => {
      const marker = L.marker(L.latLng(pos.lat, pos.lng)).addTo(map.current)
      marker.bindTooltip(pos?.name || 'Đơn hàng', {
        permanent: false,
        direction: 'top',
      })
      markers.push(marker)
    })

    return () => {
      while (markers.length > 0) {
        markers.pop().remove()
      }
    }
  }, [nearesOrderPos])
  useEffect(() => {
    if (!map.current) return
    if (!deliveryOrdersPos) return
    var homeIcon = L.icon({
      iconUrl:
        'https://img.icons8.com/?size=100&id=12229&format=png&color=000000',
      iconSize: [30, 30],
    })
    const markers: any[] = []
    deliveryOrdersPos.forEach((pos, index) => {
      let deliveryOrderMarker = null
      if (index == 0) {
        deliveryOrderMarker = L.marker(L.latLng(pos.lat, pos.lng), {
          icon: homeIcon,
        }).addTo(map.current)
      } else {
        deliveryOrderMarker = L.marker(L.latLng(pos.lat, pos.lng)).addTo(
          map.current,
        )
      }
      deliveryOrderMarker.bindTooltip(pos?.name || 'Đơn hàng', {
        permanent: false,
        direction: 'top',
      })
      if (deliveryOrderMarker) markers.push(deliveryOrderMarker)
    })

    return () => {
      while (markers.length > 0) {
        markers.pop().remove()
      }
    }
  }, [deliveryOrdersPos])

  return (
    <div className='map-wrap'>
      <div ref={mapContainer} className='map' />
    </div>
  )
}

export default Map

'use client'

import React, { useRef, useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'

import L from 'leaflet'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'

import '@/styles/map.css'
import { LeafletMapProps } from '@/types/mapType'
import { randomColorCode } from '@/utils/color'

function Map({ allPositions, zoom, locationInfo }: LeafletMapProps) {
  const mapContainer = useRef<any>(null)
  const map = useRef<any>(null)
  const [zoomState] = useState(zoom)

  useEffect(() => {
    if (!allPositions) return
    if (map.current) return // stops map from intializing more than once

    map.current = new L.Map(mapContainer.current, {
      center: L.latLng(allPositions[0].lat, allPositions[0].lng),
      zoom: zoomState,
    })
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map.current)

    var homeIcon = L.icon({
      iconUrl:
        'https://img.icons8.com/?size=100&id=12229&format=png&color=000000',
      iconSize: [30, 30],
    })

    allPositions.forEach((pos, index) => {
      if (index == 0) {
        const storeLocaion = L.marker(L.latLng(pos.lat, pos.lng), {
          icon: homeIcon,
        }).addTo(map.current)
        storeLocaion.bindTooltip('Kho', {
          permanent: true,
          direction: 'top',
        })
      } else {
        const location = L.marker(L.latLng(pos.lat, pos.lng)).addTo(map.current)
        location.bindTooltip(`Đơn hàng số ${index}`, {
          permanent: false,
          direction: 'top',
        })
      }
    })

    // @ts-ignore
    L.Routing.control({
      waypoints: allPositions.map((pos) => L.latLng(pos.lat, pos.lng)),
      lineOptions: {
        styles: [{ opacity: 0 }],
      },
      show: true,
      createMarker: function () {
        return null
      },
    }).addTo(map.current)

    for (let i = 0; i < allPositions.length - 1; i++) {
      // @ts-ignore
      L.Routing.control({
        waypoints: [
          L.latLng(allPositions[i].lat, allPositions[i].lng),
          L.latLng(allPositions[i + 1].lat, allPositions[i + 1].lng),
        ],
        lineOptions: {
          styles: [{ color: randomColorCode(), weight: 4 }],
          // styles: lineStyles,
        },
        show: false,
        createMarker: function () {
          return null
        },
      }).addTo(map.current)
    }

    map.current.off('click')
  }, [allPositions, zoom])

  return (
    <div className='map-wrap'>
      <div ref={mapContainer} className='map' />
    </div>
  )
}

export default Map

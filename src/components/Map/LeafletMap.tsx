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

    var truckIcon = L.divIcon({
      html: `<div style="width: 30px; height: 30px; background-image: url('https://img.icons8.com/fluency/48/truck.png'); background-size: cover;"></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    })

    var homeIcon = L.icon({
      iconUrl:
        'https://img.icons8.com/?size=100&id=12229&format=png&color=000000',
      iconSize: [30, 30],
    })

    let truckMarker = L.marker(
      L.latLng(allPositions[0].lat, allPositions[0].lng),
      {
        icon: truckIcon,
      },
    ).addTo(map.current)

    allPositions.forEach((pos, index) => {
      if (index == 0) {
        const storeLocaion = L.marker(L.latLng(pos.lat, pos.lng), {
          icon: homeIcon,
        }).addTo(map.current)
        storeLocaion.bindTooltip('Đây là kho', {
          permanent: false,
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
      show: true,
      createMarker: function () {
        return null
      },
      // draggableWaypoints: false,
      // routeWhileDragging: false,
    })
      .on('routesfound', function (e: any) {
        var routes = e.routes
        const coordinates = routes[0].coordinates
        let previousCoord = coordinates[0]
        coordinates.forEach(function (coord: any, index: any) {
          setTimeout(function () {
            const deltaX = coord.lng - previousCoord.lng
            truckMarker.setLatLng([coord.lat, coord.lng])
            const truckElement = truckMarker.getElement()
            if (truckElement) {
              const currentTransform = truckElement.style.transform
              if (deltaX > 0) {
                truckElement.style.transform = `${currentTransform} scaleX(1)`
              } else if (deltaX < 0) {
                truckElement.style.transform = `${currentTransform} scaleX(-1)`
              }
            }

            previousCoord = coord
          }, 50 * index)
        })
      })
      .addTo(map.current)

    map.current.off('click')
  }, [allPositions, zoom])

  return (
    <div className='map-wrap'>
      <div ref={mapContainer} className='map' />
    </div>
  )
}

export default Map

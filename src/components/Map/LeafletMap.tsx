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

function Map({ allPositions, zoom }: LeafletMapProps) {
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

    var taxiIcon = L.icon({
      iconUrl: 'https://img.icons8.com/fluency/48/truck.png',
      iconSize: [30, 30],
    })

    let marker = L.marker([allPositions[0].lng, allPositions[0].lat], {
      icon: taxiIcon,
    }).addTo(map.current)

    allPositions.forEach((pos) => {
      console.log(pos)
      L.marker([pos.lng, pos.lat]).addTo(map.current).addTo(map.current)
    })
    // @ts-ignore
    L.Routing.control({
      waypoints: allPositions.map((pos) => L.latLng(pos.lat, pos.lng)),
      show: true,
    })
      .on('routesfound', function (e: any) {
        var routes = e.routes
        e.routes[0].coordinates.forEach(function (coord: any, index: any) {
          setTimeout(function () {
            marker.setLatLng([coord.lat, coord.lng])
          }, 50 * index)
        })
      })
      .addTo(map.current)

    // map.current.on('click', function (e: any) {
    //   var newMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map.current)
    //   // @ts-ignore
    //   L.Routing.control({
    //     waypoints: [
    //       L.latLng(center.lat, center.lng),
    //       L.latLng(center.lat - 1, center.lng),
    //       L.latLng(e.latlng.lat, e.latlng.lng),
    //     ],
    //     show: true,
    //   })
    //     .on('routesfound', function (e: any) {
    //       var routes = e.routes
    //       e.routes[0].coordinates.forEach(function (coord: any, index: any) {
    //         setTimeout(function () {
    //           marker.setLatLng([coord.lat, coord.lng])
    //         }, 100 * index)
    //       })
    //     })
    //     .addTo(map.current)

    // @ts-ignore
    // })
  }, [allPositions, zoom])

  return (
    <div className='map-wrap'>
      <div ref={mapContainer} className='map' />
    </div>
  )
}

export default Map

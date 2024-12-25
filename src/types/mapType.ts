export type Pos = {
  lat: number
  lng: number
}
export type LeafletMapProps = {
  allPositions: Pos[] | undefined
  zoom: number
}

export type DeliveryDetailData = {
  createAt: string
  pos: Pos[]
}

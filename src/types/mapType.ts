export type Pos = {
  name?: string
  address?: string
  lat: number
  lng: number
}
export type LeafletMapProps = {
  deliveryOrdersPos: Pos[] | undefined
  // nearesOrderPos: Pos[] | undefined
  isShowDirection: boolean
  zoom: number
}

export type DeliveryDetailData = {
  createAt?: string
  orderIds: string[]
  pos: Pos[]
}

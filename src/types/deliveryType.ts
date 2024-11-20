export enum DeliveryStatus {
  'pending',
  'completed',
  'cancelled',
  'draft',
}

export type DeliveryOrder = {
  userId: string
  orderIds: string[]
  routes: string[]
  rating: number
  status: DeliveryStatus
  startLocation: string
  id: string
  updateAt: string
  createAt: string
}

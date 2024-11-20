import { AuthHeader } from '@/types/headerHttp'
import { constant } from '@/utils/constant'
import { UserInterface } from '@/utils/response'
import axios from 'axios'

class DeliveryService {
  private user: UserInterface
  private hearders: AuthHeader
  private url: string = `${constant.BASE_URL}/delivery`

  constructor(user: any) {
    this.user = user
    this.hearders = {
      'x-api-key': constant.API_KEY,
      'x-client-id': this.user.userId,
      authorization: this.user.accessToken,
    }
  }
  createDelivery(orderIds: string[], startLocation: string | null = null) {
    return axios.post(
      this.url,
      {
        orderIds: orderIds,
        startLocation: startLocation,
      },
      { headers: this.hearders },
    )
  }

  getAllDelivery() {
    return axios.get(this.url, { headers: this.hearders })
  }

  getDelivery(id: string) {
    return axios.get(`${this.url}/${id}`, { headers: this.hearders })
  }
}

export default DeliveryService

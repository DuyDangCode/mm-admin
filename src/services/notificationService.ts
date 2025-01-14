import { AuthHeader } from '@/types/headerHttp'
import { constant } from '@/utils/constant'
import { ManagerNotification, UserInterface } from '@/utils/response'
import axios from 'axios'

class NotificationService {
  private currentUser: UserInterface
  private headers: AuthHeader
  constructor(currentUser: UserInterface) {
    const userObject =
      typeof currentUser == 'string' ? JSON.parse(currentUser) : currentUser
    this.currentUser = userObject
    this.headers = {
      'x-api-key': constant.API_KEY,
      'x-client-id': this.currentUser.userId,
      authorization: this.currentUser.accessToken,
    }
  }
  async getNotification(): Promise<ManagerNotification[]> {
    return await axios
      .get(`${constant.BASE_URL}/notification/STAFF`, {
        headers: this.headers,
      })
      .then((res) => res.data.metadata[0].noti_options)
      .catch((error) => {
        throw error
      })
  }
}

export default NotificationService

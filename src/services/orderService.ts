import { constant } from "@/utils/constant";
import { Bill_Export_Request } from "@/utils/request";
import { UserInterface } from "@/utils/response";
import axios from "axios";


const DEFAULT_NUMBER = {
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    shipping: 0,
    shipped: 0,
    delivered: 0,
    failed: 0
};
class OrderService {
    private user: UserInterface;
    private hearders: any;
    private currentTime: string;
    private startTime: string;

    constructor(user: any) {
        this.user = user;
        this.hearders = {
            'x-api-key': constant.API_KEY,
            'x-client-id': this.user.userId,
            'authorization': this.user.accessToken,
        }
        const time = new Date();
        this.currentTime = `${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()}`;
        this.startTime = `01/01/1900`;
    }
    checkOut = async (orders: any = []): Promise<any> => {
        return await axios.post(`${constant.BASE_URL}/checkout/review`, {
            'orders': orders,
        }, { headers: this.hearders }).then((res) => { return res.data.metadata.checkoutOrder }).catch((err) => { console.log(`Err:::CheckOut::: ${err}`); })

    }
    order = async (address: string = '', status: string = "pending", method: string = "upon receipt", note: string = '', orders: any = []): Promise<any> => {
        return await axios.post(`${constant.BASE_URL}/checkout/order`, {
            'order_address': {
                'city': address,
            },
            'order_payment': {
                'status': status,
                'method': method,
            },
            'order_note': note,
            'orders': orders,

        }, { headers: this.hearders }).then(async (res) => { return res.data.statusCode }).catch((err) => { return err.response.status });
    }

    // get order by customer
    getOrders = async (page: number = 1, limit: number = 2, status: string = 'createdAt', isAscending: boolean = false): Promise<any> => {
        return await axios.get(`${constant.BASE_URL}/order?limit=${limit}&page=${page}&sorted[]=${status}&isAscending=${isAscending}`, { headers: this.hearders }).then((res) => { return res.data.metadata; }).catch((err) => {
            console.log(err);
        })
    }

    modifyOrderStatus = async (orderId: string | undefined, status: string = 'cancelled'): Promise<any> => {
        return await axios.patch(`${constant.BASE_URL}/order/status/${orderId}?status=${status}`, {}, { headers: this.hearders }).then((res) => { return res.data }).catch((err) => { err.response.status })
    }

    updateOrderStatusToShipping = async (orderId: string | undefined, body: Bill_Export_Request): Promise<any> => {
        const exportBill = await axios.post(`${constant.BASE_URL}/bill/export`, {
            products: body.products,
            bill_note: body.bill_note,
            bill_address: body.bill_address,
            bill_payment: body.bill_payment,
            customer: body.customer
        }, { headers: this.hearders })
        return await axios.patch(`${constant.BASE_URL}/order/status/${orderId}?status=${'shipping'}&exportId=${exportBill.data.metadata._id}`, {}, { headers: this.hearders })
            .then((res) => { return res.data })
            .catch((err) => { err.response.status })
    }

    updateOrderPaymentStatus = async (orderId: string | undefined, status: string = 'paid'): Promise<any> => {
        return await axios.patch(`${constant.BASE_URL}/order/status/payment/${orderId}?status=${status}`, {}, { headers: this.hearders })
            .then((res) => { return res.data.metadata })
            .catch((err) => { err.response.status })
    }

    getAllOrder = async (limit: number = 4, page: number = 1, status: string = '', sortBy: string = 'order_date', isAscending: boolean = false): Promise<any> => {
        const statusParam = status === '' ? '' : `&status=${status}`
        console.log(`${constant.BASE_URL}/order/staff?limit=${limit}&page=${page}&sorted[]=${sortBy}&isAscending=${isAscending}${statusParam}`)
        return await axios.get(`${constant.BASE_URL}/order/staff?limit=${limit}&page=${page}&sorted[]=${sortBy}&isAscending=${isAscending}${statusParam}`, { headers: this.hearders }).then((res) => { return res.data.metadata; }).catch((err) => {
            console.log(err);
        })
    }

    cancelOrder = async (orderId: string): Promise<any> => {
        return await axios.patch(`${constant.BASE_URL}/order/cancel/${orderId}`, {}, { headers: this.hearders }).then((res) => { return res.data }).catch((err) => { err.response.status })
    }

    getNumberOfOrder = async (start: string = this.startTime, end: string = this.currentTime) => {
        return await axios.get(`${constant.BASE_URL}/order/number?start=${start}&end=${end}`, { headers: this.hearders })
            .then((res) => {
                return res.data.metadata;
            })
            .catch((err: any) => {
                console.log('err', err);
                return DEFAULT_NUMBER;
            })
    }


    getNumberOfOrderByCustomer = async () => {
        return await axios.get(`${constant.BASE_URL}/order/customer/number`, { headers: this.hearders })
            .then((res) => {
                return res.data.metadata;
            })
            .catch((err: any) => {
                console.log('err', err);
                return 0;
            })
    }

    getOrderById = async (id: string): Promise<any> => {
        return await axios.get(`${constant.BASE_URL}/order/find/${id}`, { headers: this.hearders })
            .then((res) => { return res.data.metadata; })
            .catch((err) => { console.log(err); })
    }

    notification = async () => {
        return axios.get(`${constant.BASE_URL}/notification/STAFF`, { headers: this.hearders })
    }

    confirmDeliveredByCustomer = async (orderId: string = '') => {
        return await axios.patch(`${constant.BASE_URL}/order/confirm/${orderId}`, {}, { headers: this.hearders })
            .then((res) => {
                return res.data.metadata;
            })
            .catch((err) => {
                console.log('Err::confirmOrderByCustomer:: ', err);
            })
    }
}


export default OrderService;

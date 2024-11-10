import { constant } from "@/utils/constant";
import { UserInterface, Voucher } from "@/utils/response";
import axios from "axios";

class VoucherService {
    private user: UserInterface;
    private hearders: any;
    constructor(user: any) {
        this.user = user;
        this.hearders = {
            'x-api-key': constant.API_KEY,
            'x-client-id': this.user.userId,
            'authorization': this.user.accessToken,
        }
    }

    getVoucherOfProduct = async (productId: string = '', limit: number = 3, page: number = 1, sorted: string = 'discount_end_date', isAscending: boolean = true): Promise<Voucher[]> => {
        return await axios.get(`${constant.BASE_URL}/discount?limit=${limit}&page=${page}&sorted[]=${sorted}&productId=${productId}&isAscending=${isAscending}`, {
            headers: {
                'x-api-key': constant.API_KEY,
            }
        }).then((res) => { return res.data.metadata }).catch((err) => { console.log(err); })
    }

    getAllVouchers = async (limit: number = 10, page: number = 1, sorted: string = 'product_price', isAscending: boolean = true): Promise<Voucher[]> => {
        return await axios.get(`${constant.BASE_URL}/discount/all?limit=${limit}&page=${page}&sorted[]=${sorted}&isAscending=${isAscending}`, {
            headers: {
                'x-api-key': constant.API_KEY,
            }
        }).then((res) => { return res.data.metadata }).catch((err) => { console.log(err); })
    }

    createVoucher = async (body: any) => {
        return await axios.post(`${constant.BASE_URL}/discount`, body, { headers: this.hearders })
            .then((res) => { return res.data.metadata })
            .catch((err) => { console.log(err); })
    }

    getVoucherById = async (id: string): Promise<Voucher> => {
        return await axios.get(`${constant.BASE_URL}/discount/id/${id}`, {
            headers: {
                'x-api-key': constant.API_KEY,
            }
        }).then((res) => { return res.data.metadata }).catch((err) => { console.log(err); })
    }

    updateVoucher = async ({ id, body }: { id: string, body: any }) => {
        return await axios.patch(`${constant.BASE_URL}/discount/${id}`, body, { headers: this.hearders })
            .then((res) => { return res.data.metadata })
            .catch((err) => { console.log(err); })
    }

    getProductOfVoucher = async (id: string) => {
        return await axios.get(`${constant.BASE_URL}/discount/products?discountId=${id}`, {
            headers: {
                'x-api-key': constant.API_KEY,
            }
        })
            .then((res) => { return res.data.metadata })
            .catch((err) => { console.log(err); })
    }

    deleteVoucher = async (code: string) => {
        return await axios.delete(`${constant.BASE_URL}/discount/delete?code=${code}`, { headers: this.hearders })
            .then((res) => { return res.data.metadata })
            .catch((err) => { console.log(err); })
    }
}

export default VoucherService;
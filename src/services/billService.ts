import { constant } from "@/utils/constant";
import { Bill_Export_Request, Bill_Import_Request } from "@/utils/request";
import { Bill_Export, Bill_Import, NumOfBill, UserInterface } from "@/utils/response";
import axios from "axios";

class BillService {
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

    createExportBill = async (body: Bill_Export_Request): Promise<any> => {
        return await axios.post(`${constant.BASE_URL}/bill/export/`, {
            products: body.products,
            bill_note: body.bill_note,
            bill_address: body.bill_address,
            bill_payment: body.bill_payment,
            customer: body.customer
        }, { headers: this.hearders })
            .then((res) => { return res.data.statusCode; })
            .catch((err) => { console.log(err); })
    }

    createImportBill = async (body: Bill_Import_Request): Promise<any> => {
        return await axios.post(`${constant.BASE_URL}/bill/import/`, {
            products: body.products,
            bill_note: body.bill_note,
            bill_address: body.bill_address,
            bill_payment: body.bill_payment,
            bill_image: body.bill_image,
            tax: body.tax,
            supplier: body.supplier
        }, { headers: this.hearders })
            .then((res) => { return res.data.statusCode; })
            .catch((err) => { console.log(err); })
    }

    getExportById = async (id: string): Promise<Bill_Export> => {
        return await axios.get(`${constant.BASE_URL}/bill/export/${id}`, { headers: this.hearders })
            .then((res) => { return res.data.metadata; })
            .catch((err) => { console.log(err); })
    }

    getImportById = async (id: string): Promise<Bill_Import> => {
        return await axios.get(`${constant.BASE_URL}/bill/import/${id}`, { headers: this.hearders })
            .then((res) => { return res.data.metadata; })
            .catch((err) => { console.log(err); })
    }

    getAllExportBill = async (limit: number = 10, page: number = 1, sortBy: string = 'bill_date', isAscending: boolean = false): Promise<Bill_Export[]> => {
        return await axios.get(`${constant.BASE_URL}/bill/export/?limit=${limit}&page=${page}&sorted[]=${sortBy}&isAscending=${isAscending}`, { headers: this.hearders })
            .then((res) => { return res.data.metadata; })
            .catch((err) => { console.log(err); })
    }

    getAllImportBill = async (limit: number = 10, page: number = 1, sortBy: string = 'bill_date', isAscending: boolean = false): Promise<Bill_Import[]> => {
        return await axios.get(`${constant.BASE_URL}/bill/import/?limit=${limit}&page=${page}&sorted[]=${sortBy}&isAscending=${isAscending}`, { headers: this.hearders })
            .then((res) => { return res.data.metadata; })
            .catch((err) => { console.log(err); })
    }

    getNumberOfBill = async (): Promise<NumOfBill> => {
        console.log('body');

        return await axios.get(`${constant.BASE_URL}/bill/number`, { headers: this.hearders })
            .then((res) => { return res.data.metadata; })
            .catch((err) => { console.log(err); })
    }
}

export default BillService;
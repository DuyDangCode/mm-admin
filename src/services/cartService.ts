import { CartInterface, Product, User } from "@/utils/response";
import axios from "axios";
import { constant } from '@/utils/constant';
import queryClient from "@/helpers/client";



class CartService {
    private currentUser: any;
    private headers: any;
    constructor(currentUser: any){
        const userObject = typeof currentUser == 'string' ? JSON.parse(currentUser) : currentUser;
        this.currentUser = userObject;
        this.headers = {
                'x-api-key': constant.API_KEY,
                'x-client-id': this.currentUser.userId,
                'authorization': this.currentUser.accessToken,
        }
    }
    async getCart(): Promise<CartInterface | number> {
        console.log('getting cart')
        return await axios.get(`${constant.BASE_URL}/cart`, {
            headers: this.headers})
        .then(res=> res.data.metadata)
        .catch(error => error.response.status)
    }

    async addProduct(productId: string, quantity: number | string): Promise<any>{
        console.log('MM:::Add product to cart');
        return await axios.post(`${constant.BASE_URL}/cart`, {
            'productId': productId,
            'quantity': quantity,
        }, {headers: this.headers}).then((res)=>{return res.data.metadata}).catch((err)=>{console.log(err)})
    }

    async deleteProduct(productId: string): Promise<any>{
        console.log('MM:::Delete product');
        return await axios.delete(`${constant.BASE_URL}/cart`,{ headers:this.headers,
        data: {
            'productId': productId
        }
        }).then((res)=>{return res.data.metadata}).catch((err)=>{console.log(err)})
    }

    async updateQuantityProduct(productId: string, quantity: number | string, oldQuantity: number | string) : Promise<any>{
        console.log('MM:::Update quantiy');
        return await axios.post(`${constant.BASE_URL}/cart/quantity`, {
            'productId': productId,
            'quantity': quantity,
            'oldQuantity': oldQuantity,
        }, {headers: this.headers}).then((res)=>{return res.data.metadata}).catch((err)=>{console.log(err)})
    }

}


export default CartService;
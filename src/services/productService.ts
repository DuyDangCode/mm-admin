import axios from "axios";
import { Product, UserInterface } from "@/utils/response";
import { constant } from "@/utils/constant";
import { Create_Product } from "@/utils/request";

const getAllProducts = async (limit: number = 8, page: number = 1, sortType: string = 'product_price', isAscending: boolean = false): Promise<Product[]> => {
    return await axios.get(`${constant.BASE_URL}/product?limit=${limit}&page=${page}&sorted[]=${sortType}&isAscending=${isAscending}`, {
        headers: {
            'x-api-key': constant.API_KEY
        }
    })
        .then(res => res.data.metadata)
        .catch(error => { throw new Error(error.response.data.message) })
}

const getAllDraftProducts = async (user: UserInterface, limit: number = 8, page: number = 1, sortType: string = 'product_price', isAscending: boolean = false): Promise<Product[]> => {
    return await axios.get(`${constant.BASE_URL}/product/all/draft?limit=${limit}&page=${page}&sorted[]=${sortType}&isAscending=${isAscending}`, {
        headers: {
            'x-api-key': constant.API_KEY,
            'x-client-id': user.userId,
            'authorization': user.accessToken,
        }
    })
        .then(res => res.data.metadata)
        .catch(error => { throw new Error(error.response.data.message) })
}

const updateProduct = async (user: UserInterface, id: string, change: Object): Promise<any> => {
    return await axios.patch(`${constant.BASE_URL}/product/${id}`, change, {
        headers: {
            'x-api-key': constant.API_KEY,
            'x-client-id': user.userId,
            'authorization': user.accessToken,
        }
    })
        .then(res => res.data.statusCode)
        .catch(error => { throw new Error(error.response.data.message) })
}

const createProduct = async (user: UserInterface, body: Create_Product): Promise<any> => {
    return await axios.post(`${constant.BASE_URL}/product`, body, {
        headers: {
            'x-api-key': constant.API_KEY,
            'x-client-id': user.userId,
            'authorization': user.accessToken,
        }
    })
        .then(res => res.data.metadata)
        .catch(error => { throw new Error(error.response.data.message) })
}

const getProductById = async (id: string): Promise<Product> => {
    return await axios.get(`${constant.BASE_URL}/product/${id}`, {
        headers: {
            'x-api-key': constant.API_KEY
        }
    })
        .then(res => res.data.metadata)
        .catch(error => { throw new Error(error.response.data.message) })
}

const getAllProductsByCategory = async (id: string, limit = 5, page = 1, sortType = 'product_price', isAscending = true): Promise<Product[]> => {
    return await axios.get(`${constant.BASE_URL}/product/category/${id}?limit=${limit}&page=${page}&sorted[]=${sortType}&isAscending=${isAscending}`, {
        headers: {
            'x-api-key': constant.API_KEY
        }
    })
        .then(res => res.data.metadata)
        .catch(error => { throw new Error(error.response.data.message) })
}

const search = async (keyWord: string = '', isDraft: boolean = false) => {
    const draft = isDraft == true ? '&isDraft=true' : ''
    return await axios.get(`${constant.BASE_URL}/product/search?keySearch=${keyWord}${draft}`,
        {
            headers: {
                'x-api-key': constant.API_KEY
            }
        })
        .then((res) => (res.data.metadata))
        .catch((err) => { console.log(`err: ${err}`); })
}
const publish = async (user: UserInterface, id: string): Promise<any> => {
    return await axios.get(`${constant.BASE_URL}/product/publish/${id}`, {
        headers: {
            'x-api-key': constant.API_KEY,
            'x-client-id': user.userId,
            'authorization': user.accessToken,
        }
    })
        .then(res => res.data.statusCode)
        .catch(error => { throw new Error(error.response.data.message) })
}
const unpublish = async (user: UserInterface, id: string): Promise<any> => {
    return await axios.get(`${constant.BASE_URL}/product/unpublish/${id}`, {
        headers: {
            'x-api-key': constant.API_KEY,
            'x-client-id': user.userId,
            'authorization': user.accessToken,
        }
    })
        .then(res => res.data.statusCode)
        .catch(error => { throw new Error(error.response.data.message) })
}

export const productService = {
    getAllProducts,
    getAllDraftProducts,
    getProductById,
    getAllProductsByCategory,
    search,
    updateProduct,
    createProduct,
    unpublish,
    publish
}
import axios from 'axios';
import { constant } from '@/utils/constant';
import { Category } from '@/utils/response';

const getAllCategories = async (): Promise<Category[]> => {
    return await axios.get(`${constant.BASE_URL}/category`, {
        headers: {
            'x-api-key': constant.API_KEY
        }
    })
    .then(res => res.data.metadata)
    .catch(error => {throw new Error(error.response.data.message)})
}

const createCategory = async (name: String): Promise<Category> => {
    return await axios.post(`${constant.BASE_URL}/category`, {name}, {
        headers: {
            'x-api-key': constant.API_KEY
        }
    })
    .then(res => res.data.metadata)
    .catch(error => {throw new Error(error.response.data.message)})
}

const updateCategory = async (id: String, category_name: String): Promise<Category> => {
    return await axios.patch(`${constant.BASE_URL}/category/${id}`, {category_name}, {
        headers: {
            'x-api-key': constant.API_KEY
        }
    })
    .then(res => res.data.metadata)
    .catch(error => {throw new Error(error.response.data.message)})
}

const deleteCategory = async (id: String): Promise<Category> => {
    return await axios.delete(`${constant.BASE_URL}/category/${id}`, {
        headers: {
            'x-api-key': constant.API_KEY
        }
    })
    .then(res => res.data.metadata)
    .catch(error => {throw new Error(error.response.data.message)})
}

export const categoryService = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
}
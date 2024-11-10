import { Bill_Address, Bill_Payment, Customer_In_Bill, Supplier } from "./object"

export interface UserRequest {
  username: string
  password: string
  email: string
  display_name: string
  phone: string
  roles: string[]
  user_attributes?: UserAttributesRequest
}

export interface UserAttributesRequest {
  positionId?: string
  manager_start_date?: string
  salary?: number
  address?: string
}

export interface Item_Products {
  price: number,
  quantity: number,
  productId: string
}

export interface Products {
  products: Item_Products[]
}
export interface Bill_Import_Request {
  bill_note: string
  tax: number,
  supplier: Supplier
  products: Products[]
  bill_payment: {
    information: string
  }
  bill_address: Bill_Address
  bill_image: string
}

export interface Bill_Export_Request {
  bill_note: string
  customer: Customer_In_Bill
  products: Products[]
  bill_payment: Bill_Payment
  bill_address: Bill_Address
}

export interface Create_Product {
  name: string
  thumb: string
  categories: string[]
  price: number
  quantity: number
  unit: string
}
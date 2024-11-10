export interface Supplier {
    id: string
    name: string
}

export interface Customer_In_Bill {
    id: string,
    name: string,
    phone: string
}
export interface Bill_Checkout {
    totalPrice: number
    feeShip: number
    totalDiscount: number
    finalPrice: number
}

export interface Bill_Payment {
    method: string
}

export interface Bill_Address {
    from: string
    to: string
}

export interface Bill_Info_Import {
    _id: string
    bill_date: Date
    bill_note: string
    tax: number
    supplier: Supplier
    bill_checkout: Bill_Checkout
    bill_payment: {
        information: string
    }
    bill_address: Bill_Address
    bill_image: string
}

export interface Bill_Info_Export {
    _id: string
    bill_date: Date
    bill_note: string
    bill_checkout: Bill_Checkout
    bill_payment: Bill_Payment
    bill_address: Bill_Address
    customer: Customer_In_Bill
}

export interface Bill_Product {
    _id: string
    product_category: string
    product_name: string
    quantity: number
    product_unit: string
    product_price: number
    totalPrice: number
}


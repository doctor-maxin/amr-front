import {IProduct} from "./product";

export type CartItem = {
    id: string;
    count: number
}

export enum DeliveryTypes {
    'points' = 'points',
    'delivery' = 'delivery'
}

export type CartDiscount = {
    promoCode: null;
    amount: number;
}

export type CartState = {
    items: CartItem[]
    delivery: {
        calculated: boolean;
        amount: number;
        type: DeliveryTypes;
    }
    discount: CartDiscount
}

export type CartPopulatedItem = CartItem & {
    product: IProduct;
}


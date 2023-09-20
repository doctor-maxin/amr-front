import {IProduct} from "./product";
import { IPromoCode } from "~/types/common";

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
    discount: IPromoCode
}

export type CartPopulatedItem = CartItem & {
    product: IProduct;
}


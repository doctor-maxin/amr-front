import { DeliveryTypes } from "~/types/cart";

export type ICheckoutPayload = {
	phone: string;
	deliveryType: DeliveryTypes;
	email: string;
	name: string;
	house: string;
	flat: string;
	paymentType: string;
	street: string;
	city: string;
	floor?: string;
	entrance?: string;

	items: {
		id: string;
		count: number;
	}[]
	promocodes: string[];
	deliveryPrice: number;
}


export enum PaymentTypes {
	TINKOFF = 'tinkoff',
	SELF_CASH = 'self-cash',
	SELF_CARD = 'self-card'
}
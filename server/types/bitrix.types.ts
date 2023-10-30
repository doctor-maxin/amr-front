import { IProduct } from "~/types/product";

export type ILeadCreatePayload = {
	name: string;
	phone: string;
	comment?: string;
	variant?: string;
	type?: string;
	product?: IProduct;
	file?: Buffer;
};

export type IUTMPayload = {
	utm_content?: string;
	utm_term?: string;
	utm_campaign?: string;
	utm_source?: string;
	utm_medium?: string;
};

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

class EmployeersList {
	private list = [27, 665, 793, 861, 685]
	private index = 0;

	getId() {
		return this.list[this.index].toString()
	}
	interate() {
		this.index = this.index < this.list.length ? this.index + 1 : 0;
	}
}
export const employeersList = new EmployeersList()
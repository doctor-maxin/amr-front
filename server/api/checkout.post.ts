import { useDirectusItems } from "~/.nuxt/imports";
import { IOrderPayload } from "~/types/common";

type ICheckoutPayload = {
	phone: string;
	deliveryType: string;
	email: string;
	name: string;
	house: string;
	flat: string;
	paymentType: string;
	street: string;
	city: string;
	floor?: string;
	entrance?: string;
}
export default defineEventHandler(async (event) => {
	const {createItems} = useDirectusItems()
	const body = await readBody<ICheckoutPayload>(event)

	const payload = {
		phone: body.phone,
		email: body.email,
		name: body.name,
		deliveryType: body.deliveryType,
		city?: string;
		street?: string;
		house?: string;
		flat?: string;
		entrance?: string;
		paymentType: string;
		items: any[];
		promocodes: string[];
		deliveryPrice: number;
		total: number;
		number?: number;
		trackNumber?: string;
	} satisfies IOrderPayload
	return createItems({
		collection: 'orders',
		items: [payload]
	})
})
import { IOrderPayload } from "~/types/common";
import { ICheckoutPayload, PaymentTypes } from "~/server/types/checkout.types";
import { DeliveryTypes } from "~/types/cart";
import { createDirectus, staticToken } from "@directus/sdk";
import { rest, readItems, createItem, withToken } from "@directus/sdk/rest";
import { initPayment } from "~/server/utils/tinkoff.payments";

export default defineEventHandler(async (event) => {
	const client = createDirectus(process.env.DIRECTUS_URL)
		.with(rest())
		.with(staticToken(process.env.DIRECTUS_TOKEN));
	const body = await readBody<ICheckoutPayload>(event);
	console.log("[createOrderBody]", body);
	let payload = {
		phone: body.phone,
		email: body.email,
		name: body.name,
		deliveryType: body.deliveryType,
		paymentType: body.paymentType,
		items: body.items,
		promocodes: body.promocodes,
		deliveryPrice: body.deliveryPrice,
		total: 0,
		city: "",
		street: "",
		house: "",
		flat: "",
		entrance: "",
	} satisfies IOrderPayload;

	if (body.deliveryType === DeliveryTypes.delivery) {
		payload = {
			...payload,
			city: body.city,
			street: body.street,
			house: body.house,
			flat: body.flat,
			entrance: body.entrance ? body.entrance : "",
		} satisfies IOrderPayload;
	} else if (body.deliveryType === DeliveryTypes.points) {
	} else
		throw createError({
			statusCode: 400,
			statusMessage: "Не указан тип доставки",
		});

	const items = (await client.request(
		readItems("products", {
			filter: {
				id: {
					_in: body.items.map((item) => item.id),
				},
			},
			fields: ["price", "id"],
		}),
	)) as { price: number; id: string }[];
	for (const item of body.items) {
		payload.total += items?.find((i) => i.id === item.id)?.price ?? 0;
	}

	const order = await client.request(createItem("orders", payload));
	console.log("order", order);

	if (body.paymentType === PaymentTypes.TINKOFF) {
		const paymentResult = await initPayment({
			orderId: order.id,
			amount: payload.total,
			email: payload.email,
			phone: payload.phone,
		});
		console.log("Create Tinkoff result", paymentResult);

		if (paymentResult.Success) {
			return {
				status: 302,
				location: paymentResult.PaymentURL,
			};
		}
		throw createError({
			status: 400,
			message: paymentResult.Message,
			data: paymentResult,
		});
	} else {
		return {
			location: "/checkout/result?orderId=" + order.id,
			status: 302,
		};
	}
});

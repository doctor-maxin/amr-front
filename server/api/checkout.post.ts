import { IOrderPayload } from "~/types/common";
import { ICheckoutPayload, PaymentTypes } from "~/server/types/checkout.types";
import { DeliveryTypes } from "~/types/cart";
import {
	createDirectus,
	authentication,
	rest,
	readItems,
	createItem,
} from "@directus/sdk";
import { initPayment } from "~/server/utils/tinkoff.payments";
import createBitrixOrder from "~/server/utils/bitrix.order";

export default defineEventHandler(async (event) => {
	const client = createDirectus(process.env.DIRECTUS_URL)
		.with(rest())
		.with(authentication());
	const query = getQuery(event);
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
		payload = {
			...payload,
			city: body.address,
			deliveryPoint: body.deliveryPointId,
		};
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
			fields: ["price", "id", "name"],
		})
	)) as { price: number; id: string }[];

	for (const item of body.items) {
		payload.total += items?.find((i) => i.id === item.id)?.price ?? 0;
		payload.items = payload.items.map((item) => {
			const product = items.find((item) => item.id === item.id);
			return {
				...item,
				name: product?.name,
				price: product?.price,
			};
		});
	}

	try {
		const bitrixOrder = await createBitrixOrder(payload, query);

		payload.number = bitrixOrder;
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
				location: "/checkout/result?status=success&orderId=" + order.id,
				status: 302,
			};
		}
	} catch (err: any) {
		console.log("Error on bitrix", err.errors);
	}
});

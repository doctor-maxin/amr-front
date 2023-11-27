import { IOrderPayload } from "~/types/common";
import { ICheckoutPayload, PaymentTypes } from "~/server/types/checkout.types";
import { DeliveryTypes } from "~/types/cart";
import {
	createDirectus,
	authentication,
	rest,
	readItems,
	createItem,
	staticToken,
	readSingleton,
	updateSingleton,
} from "@directus/sdk";
import { initPayment } from "~/server/utils/tinkoff.payments";
import createBitrixOrder from "~/server/utils/bitrix.order";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const bearerToken = event.headers.get("authorization");
	const body = await readBody<ICheckoutPayload>(event);
	const client = createDirectus("http://localhost:8055")
		.with(rest())
		.with(staticToken(process.env.DIRECTUS_TOKEN));

	const data = jwt.decode(bearerToken?.slice(7));

	console.log("[createOrderBody]", body, data, process.env.DIRECTUS_TOKEN);
	const customerId = [];
	if (data?.id)
		customerId.push({
			directus_users_id: data.id,
		});
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
		customerId,
	};

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
	)) as { price: number; id: string; name: string }[];

	payload.items = payload.items.map((item) => {
		const product = items.find((d) => d.id === item.id);
		if (!product) return item;
		payload.total += product.price * item.count;

		return {
			...item,
			name: product.name,
			price: product?.price,
		};
	});

	try {
		const managers = await client.request(readSingleton("managers"));

		const list: string[] = managers?.ids?.split(",");
		const firstElement = list.shift() as string;

		const bitrixOrder = await createBitrixOrder(
			payload,
			query,
			firstElement
		);
		client.request(
			updateSingleton("managers", {
				ids: [...list, firstElement].join(","),
			})
		);

		payload.paymentType = body.paymentType;
		payload["number"] = bitrixOrder;
		console.log("Payload", payload);
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
		if (err.errors) console.log("Error on bitrix", err.errors);
		else
			console.dir(err, {
				depth: 10,
			});
	}
});

import {
	ITinkoffInitPaymentPayload,
	ITinkoffInitPaymentResult,
	ITinkoffOrderStatusResult,
	ITinkoffPaymentStatusResult,
	ITinkoffAuthorizePayload,
} from "~/server/types/tinkoff.types";
import useTinkoffClient from "~/server/utils/tinkoff.client";

export async function initPayment(
	payload: Pick<
		ITinkoffInitPaymentPayload,
		"amount" | "orderId" | "email" | "phone"
	>,
) {
	const client = useTinkoffClient();

	return client<ITinkoffInitPaymentResult>("/Init", {
		body: {
			Amount: payload.amount * 100,
			// Amount: 100,
			OrderId: payload.orderId,
			DATA: {
				Email: payload.email,
				Phone: payload.phone,
			},
			PayType: "T",
			NotificationURL: process.env.NUXT_TINKOFF_NOTIFICATION_URL,
			SuccessURL: `${process.env.NUXT_PUBLIC_FRONT_HOST}/api/tinkoff/result?orderId=${payload.orderId}&status=success`,
			FailURL: `${process.env.NUXT_PUBLIC_FRONT_HOST}/api/tinkoff/result?orderId=${payload.orderId}&status=fail`,
		},
		method: "POST",
	});
}

export async function statusPaymentOrder(orderId: string) {
	const client = useTinkoffClient();

	return client<ITinkoffOrderStatusResult>("/CheckOrder", {
		body: {
			OrderId: orderId,
		},
		method: "POST",
	});
}

export async function statusPayment(paymentId: string) {
	const client = useTinkoffClient();

	return client<ITinkoffPaymentStatusResult>("/GetState", {
		body: {
			PaymentId: paymentId,
		},
		method: "POST",
	});
}

export async function authorizePayment(payload: ITinkoffAuthorizePayload) {
	const client = useTinkoffClient();

	return client<ITinkoffAuthorizePayload>("/GetState", {
		body: payload,
		method: "POST",
	});
}

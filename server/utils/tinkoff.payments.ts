import {
	ITinkoffInitPaymentPayload,
	ITinkoffInitPaymentResult,
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
			Amount: payload.amount,
			OrderId: payload.orderId,
			DATA: {
				Email: payload.email,
				Phone: payload.phone,
			},
			PayType: "T",
			NotificationURL: process.env.NUXT_TINKOFF_NOTIFICATION_URL,
			SuccessURL: `${process.env.NUXT_PUBLIC_FRONT_HOST}/checkout/result?orderId=${payload.orderId}&status=success`,
			FailURL: `${process.env.NUXT_PUBLIC_FRONT_HOST}/checkout/result?orderId=${payload.orderId}&status=fail`,
		},
		method: "POST",
	});
}

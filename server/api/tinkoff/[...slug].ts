import { createRouter, defineEventHandler, useBase } from "h3";
import {
	statusPaymentOrder,
	authorizePayment,
} from "~/server/utils/tinkoff.payments";

const router = createRouter();

router.post(
	"/notify",
	defineEventHandler(async (event) => {
		const query = getQuery(event);
		const body = await readBody(event);
		console.log("Notifuy query", query, body);
	}),
);

router.get(
	"/result",
	defineEventHandler(async (event) => {
		const query = getQuery<{
			status: string;
			orderId: string;
		}>(event);
		const params = new URLSearchParams();
		params.append("orderId", query.orderId);
		params.append("status", query.status);

		if (query.status !== "success")
			return sendRedirect(
				event,
				"/checkout/result?" + params.toString(),
				302,
			);

		const paymentStatus = await statusPaymentOrder(query.orderId);
		const payment = paymentStatus.Payments[0];
		if (payment && payment.Status === "PREAUTHORIZING") {
			const authorizeResult = await authorizePayment({
				PaymentId: payment.PaymentId,
			});
			console.log(authorizeResult);
		}
		console.log("[paymentStatus]", paymentStatus);

		return sendRedirect(
			event,
			"/checkout/result?" + params.toString(),
			302,
		);
	}),
);

export default useBase("/api/tinkoff", router.handler);

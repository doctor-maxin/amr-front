import { createRouter, defineEventHandler, useBase } from "h3";
import {
	createDirectus,
	rest,
	staticToken,
	readUsers,
	updateUser,
	createUser,
} from "@directus/sdk";
import GreenSMS from "greensms";

const client = new GreenSMS({
	user: process.env.GREEN_SMS_USER,
	pass: process.env.GREEN_SMS_PASS,
});

const router = createRouter();
const directusClient = createDirectus(process.env.DIRECTUS_URL)
	.with(rest())
	.with(staticToken(process.env.DIRECTUS_TOKEN));

router.post(
	"/sign_in",
	defineEventHandler(async (event) => {
		const { phoneNumber } = await readBody<{
			phoneNumber: string;
		}>(event);
		if (!phoneNumber)
			throw createError({
				statusCode: 400,
				statusMessage: "Не указан номер телефона",
			});
		console.log("sign_in resuest");
		const response = await client.call.send({ to: phoneNumber });
		console.log("response", response);
		const hasUser = await directusClient.request(
			readUsers({
				filter: {
					phone: {
						_eq: phoneNumber,
					},
				},
				fields: ["id", "email"],
			}),
		);
		if (hasUser.length) {
			await directusClient.request(
				updateUser(hasUser[0].id, {
					password: response.code,
				}),
			);
			return {
				email: hasUser[0].email,
			};
		} else {
			const user = await directusClient.request(
				createUser({
					password: response.code,
					phone: phoneNumber,
					email: `avtorm-${Date.now()}@examile.com`,
				}),
			);
			return {
				email: user.email,
			};
		}
	}),
);

export default useBase("/api/auth", router.handler);

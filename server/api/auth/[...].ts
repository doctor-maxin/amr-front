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
const directusClient = createDirectus("http://localhost:8055")
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
		const code = Date.now().toString().slice(-4)
		console.log('Generated code ', code)
		client.sms.send({ to: phoneNumber, txt: 'Ваш код: ' + code }).then((response: any) => {
			console.log("response", response);
		}).catch((err: any) => {
			console.error(err)
		})
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
		console.log('hasUser', hasUser)
		if (hasUser.length) {
			const email = hasUser[0].email
				? hasUser[0].email
				: `avtorm-${Date.now()}@examile.com`;
			const payload = {
				password: code,
				email,
			};
			await directusClient.request(updateUser(hasUser[0].id, payload));
			return {
				email,
			};
		} else {
			const user = await directusClient.request(
				createUser({
					password: code,
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

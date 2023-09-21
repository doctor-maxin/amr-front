import { FetchContext } from "ofetch";
import { createHash } from "node:crypto";
import generateToken from "~/server/utils/tinkoff.token.util";

export default function useTinkoffClient() {
	const client = $fetch.create({
		baseURL: "https://securepay.tinkoff.ru/v2",
		responseType: "json",
		headers: {
			"Content-Type": "application/json",
		},
		onRequest(context: FetchContext) {
			const body = {
				//@ts-ignore
				...context.options.body,
				TerminalKey: process.env.NUXT_TINKOFF_TERMINAL_KEY,
				Password: process.env.NUXT_TINKOFF_KEY,
			};
			// const bodyArray = Object.keys(body)
			// 	.sort()
			// 	.filter((key) =>
			// 		["string", "number"].includes(typeof body[key]),
			// 	)
			// 	.map((key) => ({
			// 		[key]: body[key],
			// 	}));
			// bodyArray.push({
			//
			// });
			// let valuesString = "";
			// for (const item of bodyArray) {
			// 	valuesString += Object.values(item).join("");
			// }
			// console.log('token values', valuesString)
			// const hasher = createHash("sha256");
			// let encryptedStr = hasher.update(valuesString);
			// encryptedStr = hasher.digest('hex');
			body.Token = generateToken(body)
			console.log("BODY", body);
			context.options.body = body;
		},
	});

	return client;
}

import { FetchContext } from "ofetch";
import { createHash } from "node:crypto";

export default function useTinkoffClient() {
	const client = $fetch.create({
		baseURL: "https://securepay.tinkoff.ru/v2",
		responseType: "json",
		headers: {
			"Content-Type": "application/json",
		},
		onRequest(context: FetchContext) {
			const body = {
				...context.options.body,
				TerminalKey: process.env.NUXT_TINKOFF_TERMINAL_KEY,
			};
			const bodyArray = Object.keys(body)
				.sort()
				.filter((key) =>
					["string", "number"].includes(typeof body[key]),
				)
				.map((key) => ({
					[key]: body[key],
				}));
			bodyArray.push({
				Password: process.env.NUXT_TINKOFF_KEY,
			});
			let valuesString = "";
			for (const item of bodyArray) {
				valuesString += Object.values(item).join("");
			}
			const hasher = createHash("sha256");
			let encryptedStr = hasher.update(valuesString);
			encryptedStr = hasher.digest(encryptedStr);
			body.Token = encryptedStr.toString();
			console.log("BODY", body);
			context.options.body = body;
		},
	});

	return client;
}

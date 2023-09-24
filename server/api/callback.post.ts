import { createDirectus, staticToken } from "@directus/sdk";
import { rest, readItems, createItem, withToken } from "@directus/sdk/rest";

export default defineEventHandler(async (event) => {
	const client = createDirectus(process.env.DIRECTUS_URL)
		.with(rest())
		.with(staticToken(process.env.DIRECTUS_TOKEN));

	const body = await readMultipartFormData(event);
	if (!body)
		throw createError({
			statusCode: 400,
			statusMessage: "Неверный формат данных",
		});
	const data: any = {};
	for (const item of body) {
		if (item.type) {
			const blob = new Blob([item.data], { type: item.type });
			data[item.name] = blob;
		} else data[item.name] = item.data.toString("utf8");
	}
	console.log("bopdy", data);

	return true;
});

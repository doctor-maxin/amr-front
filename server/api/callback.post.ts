import {
	createDirectus,
	staticToken,
	createItem,
	uploadFiles,
	graphql,
	rest,
} from "@directus/sdk";
import { createError } from "@directus/errors";
import { createBitrixLead } from "~/server/utils/bitrix.contacts";

export default defineEventHandler(async (event) => {
	const client = createDirectus(process.env.DIRECTUS_URL)
		.with(rest())
		.with(staticToken(process.env.DIRECTUS_TOKEN));

	const userClient = createDirectus(process.env.DIRECTUS_URL).with(
		graphql({
			credentials: "include",
		})
	);

	const body = await readMultipartFormData(event);
	const query = getQuery(event);
	if (!body) throw createError("400", "Неверный формат данных");
	const data: any = {};
	const form = new FormData();
	let hasFile = false;
	for (const item of body) {
		if (item.filename) {
			const blob = new Blob([item.data], {
				type: item.type,
			});
			form.append("file", blob);
			hasFile = true;
		} else if (item.name) {
			if (item.name === "product")
				data[item.name] = JSON.parse(item.data.toString("utf8"));
			else data[item.name] = item.data.toString("utf8");
		}
	}

	try {
		if (hasFile) {
			const file = await client.request(uploadFiles(form));
			data.file = file.id;
		}
		console.log(data);
		const productsPayload = []
		if (data.product) productsPayload.push({
			products_id: data.product.id
		})
		const variantPayload = []
		if (data.variant) variantPayload.push({
			variants_id: data.variant
		})
		const req = await userClient.query(
			`
				
			mutation CreateReqItem($name: String, $phone: String, $type: String, $comment: String, $file: String, $products: [create_requests_products_input], $variant: [create_requests_variants_input]) {
				create_requests_item(data: {name: $name, phone: $phone, type: $type, comment: $comment, file: $file, variant: $variant, products: $products}) {
					id
					status
				}
			}
		`,
			{
				name: data.name,
				phone: data.phone,
				type: data.type,
				comment: data.comment,
				file: data.file,
				variant: variantPayload,
				products: productsPayload
			}
		);

		createBitrixLead(data, query);
		if (req.create_requests_item.id) return req.create_requests_item;
	} catch (err: any) {
		if (err.errors) {
			console.dir(err.errors, {
				depth: 10,
			});
		} else console.log("Err", err);
	}

	return true;
});

function sleep(ms: number) {
	return new Promise((resolve, _reject) => {
		setTimeout(() => {
			resolve(true);
		}, ms);
	});
}

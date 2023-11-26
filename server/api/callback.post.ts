import {
	createDirectus,
	staticToken,
	createItem,
	readItems,
	readSingleton,
	uploadFiles,
	rest,
	updateSingleton,
} from "@directus/sdk";
import { createError } from "@directus/errors";
import { createBitrixLead } from "~/server/utils/bitrix.contacts";

export default defineEventHandler(async (event) => {
	const client = createDirectus("http://avtorm.ru:8055")
		.with(rest())
		.with(staticToken(process.env.DIRECTUS_TOKEN));

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
			const fileUploadResult = await client.request(uploadFiles(form));
			if (fileUploadResult?.id) {
				data.file = fileUploadResult.id;
				data.fileName = fileUploadResult.filename_download;
			}
			console.log(data.fileName);
		}
		console.log(data);
		const productsPayload = [];
		if (data.product)
			productsPayload.push({
				products_id: data.product.id,
			});
		const variantPayload = [];
		if (data.variant)
			variantPayload.push({
				variants_id: data.variant,
			});
		const req = await client.request(
			createItem("requests", {
				name: data.name,
				phone: data.phone,
				type: data.type,
				comment: data.comment,
				file: data.file,
				variant: variantPayload,
				products: productsPayload,
			}),
		);

		const managers = await client.request(readSingleton('managers'))

		console.log("[directusCreaterequest]", req, managers);
		const list: string[] = managers?.ids?.split(',')
		const firstElement = list.shift() as string
		createBitrixLead(data, query.from as string, query, firstElement)

		client.request(updateSingleton('managers', {
			ids: [...list, firstElement].join(',')
		})).then((r) => console.log(r))

		return {
			id: req.id,
			status: req.status,
		};
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

import useBitrixClient from "~/server/utils/bitrix.client";
import { ILeadCreatePayload, IUTMPayload } from "~/server/types/bitrix.types";

export async function getBitrixContact(phone: string, email: string) {
	const client = await useBitrixClient();

	const { result } = await client.call("crm.duplicate.findbycomm", {
		entity_type: "CONTACT",
		type: "PHONE",
		values: [phone],
	});
	console.log('result', result)
	if (typeof result === "number") return result; else if (Array.isArray(result)) {
		if (result.length) return result[0] as number;
	} else if (typeof result === "object") return result.CONTACT[0] as number;

	const { result: emailResult } = await client.call(
		"crm.duplicate.findbycomm",
		{
			entity_type: "CONTACT",
			type: "EMAIL",
			values: [email],
		},
	);
	if (typeof emailResult === "number") return emailResult;
	else if (Array.isArray(emailResult)) {
		if (emailResult?.length) {
			return emailResult[0] as number;
		}
	} else if (typeof emailResult === "object")
		return emailResult.CONTACT[0] as number;


	return undefined;
}

export async function createBitrixContact(data) {
	const client = await useBitrixClient();

	const { result } = await client.contacts.create({
		ADDRESS_CITY: data.city,
		ADDRESS: `${data.street ?? ""} ${data.house ?? ""}`,
		ADDRESS_2: `${data.flat ?? ""} ${data.floor ?? ""}`,
		NAME: data.name,
		EMAIL: [{ VALUE: data.email, VALUE_TYPE: "WORK" }],
		PHONE: [
			{ VALUE: data.phone.replace(/[^\w\s]/gi, ""), VALUE_TYPE: "WORK" },
		],
	});
	return result;
}

export async function createBitrixLead(
	data: ILeadCreatePayload,
	from: string,
	utms: IUTMPayload,
	active: string
) {
	const client = useBitrixClient();
	const phone = data.phone.replace(/[^\w\s]/gi, "");
	let reqType = "";
	if (data.type === "consult") reqType = "Получить консультацию";
	if (data.type === "3d") reqType = " Заказать 3D проект ";
	if (data.type === "calc") reqType = "Получить расчет стоимости ";

	let { result: contactId } = await client.call("crm.duplicate.findbycomm", {
		entity_type: "CONTACT",
		type: "PHONE",
		values: [phone],
	});

	if (!contactId || (Array.isArray(contactId) && contactId.length === 0)) {
		const { result } = await client.contacts.create({
			NAME: data.name,
			PHONE: [
				{
					VALUE: phone,
					VALUE_TYPE: "WORK",
				},
			],
		});
		contactId = result;
	} else if (typeof contactId !== "number") {
		contactId = contactId.CONTACT[0];
	}

	console.log("[contactId]", contactId);

	if (data.product) {
		let productName = data.product.name;
		if (data.variant && data.product.variants?.length) {
			const variant = data.product.variants.find(
				(item) => item.id === data.variant,
			);
			if (variant?.name) productName = variant.name;
		}
		const lead = await client.leads.create({
			NAME: data.name,
			CONTACT_ID: contactId,
			TITLE: "Заявка с формы покупки товара",
			PHONE: [
				{
					VALUE_TYPE: "WORK",
					VALUE: phone,
				},
			],
			STATUS: "NEW",
			ASSIGNED_BY_ID: active.trim(),
			COMMENTS: data.comment,
			UF_CRM_1693211893: reqType,
			UF_CRM_1700389811434: from,
			UTM_CONTENT: utms.utm_content,
			UTM_TERM: utms.utm_term,
			UTM_CAMPAIGN: utms.utm_campaign,
			UTM_MEDIUM: utms.utm_medium,
			UTM_SOURCE: utms.utm_source,
		}).catch(console.error)

		if (lead?.result) {
			await client.leads.update(lead.result.toString(), {
				STATUS_ID: "NEW",
			});

			client.call("crm.lead.productrows.set", {
				id: lead.result,
				rows: [
					{
						PRODUCT_NAME: productName,
						PRICE: data.product.price,
						QUANTITY: data.product.count,
					},
				],
			});
		}
		console.log("LEAD", lead);
		return lead;
	} else {
		const payload = {
			NAME: data.name ?? "",
			CONTACT_ID: contactId.toString() ?? "",
			TITLE: "Заявка с формы обратной связи",
			PHONE: [
				{
					VALUE_TYPE: "WORK",
					VALUE: phone.toString(),
				},
			],
			COMMENTS: data.comment ?? "",
			ASSIGNED_BY_ID: active.trim(),
			STATUS: "NEW",
			UF_CRM_1693211893: reqType ?? "",
			UF_CRM_1700389811434: from,
			UTM_CONTENT: utms.utm_content ?? "",
			UTM_TERM: utms.utm_term ?? "",
			UTM_CAMPAIGN: utms.utm_campaign ?? "",
			UTM_MEDIUM: utms.utm_medium ?? "",
			UTM_SOURCE: utms.utm_source ?? "",
			UF_CRM_1696323959937: data.file
				? `${process.env.DIRECTUS_URL}/assets/${data.file}/`
				: "",
		};

		//@ts-ignore
		const lead = await client.leads.create(payload).catch(console.error)
		if (lead?.result) {

			await client.leads.update(lead.result.toString(), {
				STATUS_ID: "NEW",
			});
		}

		console.log("LEAD", lead);
		return lead;
	}
}

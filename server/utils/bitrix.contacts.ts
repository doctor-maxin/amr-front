import useBitrixClient from "~/server/utils/bitrix.client";
import { ILeadCreatePayload, IUTMPayload } from "~/server/types/bitrix.types";

export async function getBitrixContact(phone: string, email: string) {
	const client = await useBitrixClient();

	const { result } = await client.call("crm.duplicate.findbycomm", {
		entity_type: "CONTACT",
		type: "PHONE",
		values: [phone],
	});
	if (result?.length) return result[0] as number;
	const { result: emailResult } = await client.call(
		"crm.duplicate.findbycomm",
		{
			entity_type: "CONTACT",
			type: "EMAIL",
			values: [email],
		}
	);
	if (emailResult?.length) return emailResult[0] as number;

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
	utms: IUTMPayload
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
	if (!contactId || contactId.length === 0) {
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
	}
	console.log(contactId);

	if (data.product) {
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
			COMMENTS: data.comment,
			UF_CRM_1693211893: reqType,
			UTM_CONTENT: utms.utm_content,
			UTM_TERM: utms.utm_term,
			UTM_CAMPAIGN: utms.utm_campaign,
			UTM_MEDIUM: utms.utm_medium,
			UTM_SOURCE: utms.utm_source,
		});
		client.call("crm.lead.productrows.set", {
			id: lead.result,
			rows: [
				{
					PRODUCT_NAME: data.product.name,
					PRICE: data.product.price,
					QUANTITY: data.product.count,
				},
			],
		});
		console.log("LEAD", lead);
		return lead;
	} else {
		const lead = await client.leads.create({
			NAME: data.name,
			CONTACT_ID: contactId,
			TITLE: "Заявка с формы обратной связи",
			PHONE: [
				{
					VALUE_TYPE: "WORK",
					VALUE: phone,
				},
			],
			COMMENTS: data.comment,
			UF_CRM_1693211893: reqType,
			UTM_CONTENT: utms.utm_content,
			UTM_TERM: utms.utm_term,
			UTM_CAMPAIGN: utms.utm_campaign,
			UTM_MEDIUM: utms.utm_medium,
			UTM_SOURCE: utms.utm_source,
		});
		console.log("LEAD", lead);
		return lead;
	}
}

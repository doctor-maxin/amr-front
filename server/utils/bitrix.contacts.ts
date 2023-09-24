import useBitrixClient from "~/server/utils/bitrix.client";

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
		},
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
		EMAIL: data.email,
		PHONE: data.phone,
	});
	return result;
}

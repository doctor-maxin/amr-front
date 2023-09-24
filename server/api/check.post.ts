import useBitrixClient from "~/server/utils/bitrix.client";
import { Method } from "@2bad/bitrix";

export default defineEventHandler(async (event) => {
	const client = useBitrixClient();
	const { result } = await client.contacts.fields("");

	// await client.deals.update(deals.result, {});
	return result;
});

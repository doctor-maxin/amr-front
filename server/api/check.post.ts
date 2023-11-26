import useBitrixClient from "~/server/utils/bitrix.client";
import { Method } from "@2bad/bitrix";

export default defineEventHandler(async (event) => {
	const client = useBitrixClient();

	const r = await client.leads.fields()
	console.log(r)

	return true;
});

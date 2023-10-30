import useBitrixClient from "~/server/utils/bitrix.client";
import { Method } from "@2bad/bitrix";

export default defineEventHandler(async (event) => {
	const client = useBitrixClient();
	// const { result } = await client.call("crm.category.fields", {
	// 	entityTypeId: 1,
	// });

	await client.leads.update("2513", {
		STATUS_ID: "NEW",
	});
	const result2 = await client.leads.get("2513").catch((err) => {
		console.log(err);
	});
	console.log(result2);
	// await client.deals.update(deals.result, {});
	return result2.result.STATUS_ID;
});

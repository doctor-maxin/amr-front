import useTinkoffClient from "~/server/utils/tinkoff.client";
import useBitrixClient from "~/server/utils/bitrix.client";

export default defineEventHandler(async (event) => {
	const client = useBitrixClient();
	const deals = await client.contacts.list()
	return deals
});

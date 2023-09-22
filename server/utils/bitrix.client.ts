import { Bitrix } from "@2bad/bitrix";

export default function useBitrixClient() {
	const client = Bitrix(process.env.NUXT_BITRIX_URL)
	return client
}
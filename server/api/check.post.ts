import useTinkoffClient from "~/server/utils/tinkoff.client";

export default defineEventHandler(async (event) => {
	const result = useTinkoffClient();
	return {
		result,
	};
});

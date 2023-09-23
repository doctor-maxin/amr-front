import { useDirectusToken, useRuntimeConfig } from "#imports";
import { createFetch } from "@vueuse/core";

export const useFavoritesFetch = () => {
	const runtimeConfig = useRuntimeConfig();
	//@ts-ignore
	const baseUrl = runtimeConfig.public?.directus?.url as string;

	const client = createFetch({
		baseUrl: `${baseUrl}/api/favorites`,
		fetchOptions: {
			credentials: "include",
		},
		options: {
			async beforeFetch({ options }) {
				const token = useDirectusToken();
				if (token.token.value) {
					// @ts-ignore
					options.headers.Authorization = `Bearer ${token.token.value}`;
				}

				return { options };
			},
		},
	});

	return {
		client,
	};
};

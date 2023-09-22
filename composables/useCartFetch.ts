import { useDirectusToken, useRuntimeConfig } from "#imports";
import { createFetch } from "@vueuse/core";

export const useCartFetch = () => {
	const runtimeConfig = useRuntimeConfig()
	//@ts-ignore
	const baseUrl = runtimeConfig.public?.directus?.url as string
	const client = createFetch({
		baseUrl: `${baseUrl}/api/cart`,
		options: {
			async beforeFetch({ options }) {
				const token = useDirectusToken()
				if (token.token.value) {
					// @ts-ignore
					options.headers.Authorization = `Bearer ${token.token.value}`
				}

				return { options }
			}
		}
	})

	return {
		client
	}
}
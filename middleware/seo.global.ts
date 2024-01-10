import { useSeoMeta } from "#imports";

export default defineNuxtRouteMiddleware(async (to) => {
	const config = useRuntimeConfig();

	const seo = await fetch(
		`${config.public.directus.url}/items/seo?filter={"handle":"${to.path}"}`,
		{
			headers: {
				Authentication: `Bearer ${config.public.directus.token}`,
			},
		}
	).then((r) => r.json());
	if (seo.data.length) {
		const data = seo.data[0]
		useSeoMeta({
			title: data.title,
			ogTitle: data.ogTitle,
			description: data.description,
			ogDescription: data.ogDescription,
			ogImage: data.ogImage,
		})
	}
	console.log("seo", seo.data[0]);
});

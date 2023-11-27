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
	if (seo.length) {
		useSeoMeta(seo[0]);
	}
	console.log("seo", seo);
});

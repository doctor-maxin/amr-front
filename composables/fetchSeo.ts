const fetchSeo = async () => {
    const config = useRuntimeConfig();
    const route = useRoute()

    const seo = await fetch(
        `${config.public.directus.url}/items/seo?filter={"handle":"${route.path}"}`,
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
}

export default fetchSeo
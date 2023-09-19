declare module 'nuxt/schema' {
    interface AppConfigInput {
        noImageId: string;
        messages: {
            productAdded: string;
            productRemoved: string;
            toCheckoutError: string;
            productSoldOut: string;
        }
        favorites: {
            emptyList: string;
            productAdded: string;
            productRemoved: string;
        }
        articles: {
            emptyList: string;
        }
        mapCenter: number[];
    }
}
export {}
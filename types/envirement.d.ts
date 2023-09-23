export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			// TInkoff
			NUXT_TINKOFF_TERMINAL_KEY: string;
			NUXT_TINKOFF_KEY: string;
			NUXT_TINKOFF_NOTIFICATION_URL: string;
			// Directus
			DIRECTUS_URL: string;
			DIRECTUS_TOKEN: string;
			// Other
			NUXT_PUBLIC_FRONT_HOST: string;
			NUXT_PUBLIC_YANDEX_KEY: string;
			// 	 Bitrix
			NUXT_BITRIX_URL: string;
			// #Green
			GREEN_SMS_USER: string;
			GREEN_SMS_PASS: string;
		}
	}
}

// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
	devtools: { enabled: false },
	css: ["~/assets/css/fonts.css", "~/assets/css/main.css"],
	// @ts-ignore
	loading: "~/components/loader/Loader.vue",
	ssr: false,
	imports: {
		autoImport: true,
	},
	runtimeConfig: {
		directus: {
			url: process.env.DIRECTUS_URL,
			token: process.env.DIRECTUS_TOKEN
		},
		public: {
			yandexKey: "",
		},
		tinkoff: {
			terminalKey: "",
			key: "",
		},
	},
	routeRules: {
		"/": {
			prerender: true,
		},
	},
	components: false,
	modules: [
		'@nuxt-alt/proxy',
		[
			"@nuxt/image",
			{
				inject: true,
				directus: {
					baseURL: `${process.env.DIRECTUS_URL}/assets/`,
				},
			},
		],
		[
			"nuxt-svgo",
			{
				autoImportPath: "./assets/icons/",
			},
		],
		"@pinia/nuxt",
		"@pinia-plugin-persistedstate/nuxt",
		"@vueuse/nuxt",
		[
			"nuxt-directus",
			{
				url: process.env.DIRECTUS_URL,
				token: process.env.DIRECTUS_TOKEN,
			},
		],
		[
			"@vee-validate/nuxt",
			{
				autoImports: true,
				componentNames: {
					Form: "VeeForm",
					Field: "VeeField",
					FieldArray: "VeeFieldArray",
					ErrorMessage: "VeeErrorMessage",
				},
			},
		],
	],
	proxy: {
		proxies: {
			'/api/cart': {target: process.env.DIRECTUS_URL},
			'/assets/*': {target: process.env.DIRECTUS_URL},
			'/api/favorites': {target: process.env.DIRECTUS_URL},
		}
	},
	// vite: {
	// 	server: {
	// 		proxy: {
	// 			"/assets": process.env.DIRECTUS_URL,
	// 			// '/assets': 'http://127.0.0.1:8055',
	// 			"/api/favorites": process.env.DIRECTUS_URL,
	// 			"/api/cart": process.env.DIRECTUS_URL,
	// 			// '/api': 'http://127.0.0.1:8055',
	// 		},
	//
	// 	},
	// },
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
});

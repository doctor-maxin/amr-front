// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
	devtools: { enabled: false },
	css: ["~/assets/css/fonts.css", "~/assets/css/main.css"],
	loading: "~/components/loader/Loader.vue",
	ssr: false,
	imports: {
		autoImport: true,
	},
	runtimeConfig: {
		directus: {
			url: "http://109.195.74.198:8055",
			// url: 'http://127.0.0.1:8055',
		},
		public: {
			apiSecret: "",
			yandexKey: "",
		},
		tinkoff: {
			terminalKey: "1693570153217DEMO",
			key: "y9s03ap10uunqry4",
		},
	},
	routeRules: {
		"/": {
			prerender: true,
		},
	},
	components: false,
	modules: [
		[
			"@nuxt/image",
			{
				inject: true,
				directus: {
					baseURL: "http://109.195.74.198:8055/assets/",
					// baseURL: 'http://127.0.0.1:8055/assets/'
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
				url: "http://109.195.74.198:8055",
				token: "RFgM_SPPCQr_L5RJfiSYoox0QunHYpbE",
				// url: 'http://127.0.0.1:8055',
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
	vite: {
		server: {
			proxy: {
				"/assets": "http://109.195.74.198:8055",
				// '/assets': 'http://127.0.0.1:8055',
				"/api/favorites": "http://109.195.74.198:8055",
				"/api/cart": "http://109.195.74.198:8055",
				// '/api': 'http://127.0.0.1:8055',
			},
		},
	},
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
});

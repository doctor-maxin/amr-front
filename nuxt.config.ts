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
	typescript: {
		includeWorkspace: true,
	},
	runtimeConfig: {
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
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
});

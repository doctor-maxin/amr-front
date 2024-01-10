// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";


export default defineNuxtConfig({
	devtools: { enabled: false },
	css: ["~/assets/css/fonts.css", "~/assets/css/main.css"],
	// @ts-ignore
	loading: "~/components/loader/Loader.vue",
	ssr: true,
	experimental: {
		asyncContext: true
	},
	imports: {
		autoImport: true,
	},
	typescript: {
		tsConfig: {
			compilerOptions: {
				target: 'ESNext',
				lib: ['DOM', 'ES2022'],
				resolveJsonModule: true,
				noImplicitAny: false
			},
			include: [
				"index.d.ts",
				"./composables/*.ts",
				"~/types/*.ts",
				"./components/*.vue",
				"./pages/*.vue",
				"./plugins/*.ts",
				"./app.vue",
				"./error.vue"
			]
		}
	},
	vite: {
		server: {
			// hmr: {
			// 	protocol: "wss",
			// 	clientPort: 443,
			// 	path: "hmr/",
			// },
		},
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
		'/catalog/product-[handle]': {
			ssr: false
		},
	},
	components: false,
	modules: [
		[
			"@nuxt/image",
			{
				inject: true,
				format: ['webp', 'png'],
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

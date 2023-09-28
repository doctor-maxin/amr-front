module.exports = {
	apps: [
		{
			name: "frontend",
			exec_mode: "cluster",
			port: "3000",
			instances: "6", // Or a number of instances
			script: "./.output/server/index.mjs",
			env: {
				NUXT_TINKOFF_TERMINAL_KEY: "1693470153217DEMO",
				NUXT_TINKOFF_KEY: "lglvwe6mm4axaxz7",
				NUXT_TINKOFF_NOTIFICATION_URL:
					"https://avtorm.ru/api/tinkoff/notify",
				DIRECTUS_URL: "http://127.0.0.1:8055/",
				DIRECTUS_TOKEN: "RtUkXxMS0Zk9aXrpLAXmq9WLU_rj0czH",
				NUXT_PUBLIC_FRONT_HOST: "https://avtorm.ru",
				NUXT_PUBLIC_YANDEX_KEY: "cc97cb86-1ceb-44ef-9890-0c2211bf66e1",
				NUXT_BITRIX_URL:
					"https://obraztsovo.bitrix24.ru/rest/657/pqm67mkyiob30tg8",
			},
		},
	],
};

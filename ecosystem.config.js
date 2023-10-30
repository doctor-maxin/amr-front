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
				DIRECTUS_URL: "https://avtorm.ru",
				DIRECTUS_TOKEN: "RtUkXxMS0Zk9aXrpLAXmq9WLU_rj0czH",
				NUXT_PUBLIC_FRONT_HOST: "https://avtorm.ru",
				NUXT_PUBLIC_YANDEX_KEY: "cc97cb86-1ceb-44ef-9890-0c2211bf66e1",
				NUXT_BITRIX_URL:
					"https://obraztsovo.bitrix24.ru/rest/657/pqm67mkyiob30tg8",
				NITRO_HOST: '127.0.0.1',
				NITRO_PRESET: 'node_cluster',
				GREEN_SMS_USER: 'avtor',
				GREEN_SMS_PASS: 'avtor2023'
				// NITRO_SSL_CERT: '/var/www/httpd-cert/avtorm.ru_2023-07-29-22-43_32.crt',
				// NITRO_SSL_KEY: '/var/www/httpd-cert/avtorm.ru_2023-07-29-22-43_32.key',
			},
		},
	],
};

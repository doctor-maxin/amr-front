module.exports = {
    apps: [
        {
            name: 'frontend',
            exec_mode: 'cluster',
            instances: 'max', // Or a number of instances
            script: './node_modules/nuxi/bin/nuxi.mjs',
            args: 'start',
            env: {
                NUXT_TINKOFF_TERMINAL_KEY: "1693470153217DEMO",
                NUXT_TINKOFF_KEY: "lglvwe6mm4axaxz7",
                NUXT_TINKOFF_NOTIFICATION_URL: "https://avtorm.ru/api/tinkoff/notify",
                DIRECTUS_URL: "http://127.0.0.1:8055",
                DIRECTUS_TOKEN: "RFgM_SPPCQr_L5RJfiSYoox0QunHYpbE",
                NUXT_PUBLIC_FRONT_HOST: "https://avtorm.ru:3000",
                NUXT_PUBLIC_YANDEX_KEY: "45411020-0966-44ba-9ad2-f75d62b1d897",
                NUXT_BITRIX_URL: "https://obraztsovo.bitrix24.ru/rest/657/pqm67mkyiob30tg8"
            }
        }
    ]
}
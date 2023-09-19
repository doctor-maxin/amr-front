module.exports = {
    apps: [
        {
            name: 'frontend',
            exec_mode: 'cluster',
            instances: 'max', // Or a number of instances
            script: './node_modules/nuxi/bin/nuxi.mjs',
            args: 'start',
        }
    ]
}
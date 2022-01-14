const {ESLINT_MODES} = require('@craco/craco');
const CracoLessPlugin = require('craco-less');
const isDev = true; // process.env.NODE_ENV === 'development';


module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {

                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
    eslint: {
        enable: true,
        mode: ESLINT_MODES.extends,
        pluginOptions: (eslintOptions) => (
            {
                ...eslintOptions,
                emitWarning: true,
                failOnWarning: false,
                emitError: true,
                failOnError: true,
                fix: isDev,
                quiet: false
            }
        )
    },
};
/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import eslintPlugin from 'vite-plugin-eslint2';

const DEFAULT_API_TARGET = 'https://happylife.develop.onlineberatung.net';

function attachProxyLogging(proxy: any) {
    proxy.on('error', (err: any, _req: any, _res: any) => {
        console.error('proxy error', err);
    });
    proxy.on('proxyReq', (_proxyReq: any, req: any, _res: any) => {
        console.info('Sending Request to the Target:', req.method, req.url);
    });
    proxy.on('proxyRes', (proxyRes: any, req: any, _res: any) => {
        console.info('Received Response from the Target:', proxyRes.statusCode, req.url);
    });
}

// https://vitejs.dev/config/
export default ({ mode }) => {
    const env = loadEnv(mode, process.cwd());
    process.env = { ...process.env, ...env };

    return defineConfig({
        base: process.env.BASE || '/',
        plugins: [
            react(),
            viteTsconfigPaths(),
            svgrPlugin(),
            eslintPlugin({
                emitWarning: true,
                emitError: true,
            }),
        ],
        css: {
            preprocessorOptions: {
                scss: {
                    silenceDeprecations: ['import'],
                },
            },
        },
        build: {
            outDir: 'build',
        },
        server: {
            host: true,
            port: 5174,
            proxy: {
                '/service': {
                    target: env.VITE_API_URL || DEFAULT_API_TARGET,
                    changeOrigin: true,
                    secure: false,
                    ws: true, // Enable WebSocket support for /service/live/* endpoints
                    configure: (proxy, _options) => {
                        attachProxyLogging(proxy);
                    },
                },
                '/api': {
                    target: env.VITE_API_URL || DEFAULT_API_TARGET,
                    changeOrigin: true,
                    secure: false,
                    configure: (proxy, _options) => {
                        attachProxyLogging(proxy);
                    },
                },
                '/auth': {
                    target: env.VITE_API_URL || DEFAULT_API_TARGET,
                    changeOrigin: true,
                    secure: false,
                    configure: (proxy, _options) => {
                        attachProxyLogging(proxy);
                    },
                },
                '/p/weblate': {
                    target: env.VITE_API_URL || DEFAULT_API_TARGET,
                    changeOrigin: true,
                    secure: false,
                    configure: (proxy, _options) => {
                        attachProxyLogging(proxy);
                    },
                },
            },
        },
        test: {
            globals: true,
            environment: 'jsdom',
            include: ['src/**/*.{test,spec}.{ts,tsx}'],
            setupFiles: ['./src/setupTests.ts'],
        },
    });
};

/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import eslintPlugin from 'vite-plugin-eslint2';

// https://vitejs.dev/config/
export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

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
            host: '0.0.0.0',
            port: (process.env.VITE_PORT as unknown as number) || 9000,
            proxy: {
                '/service': {
                    target:
                        process.env.VITE_DEV_PROXY_TARGET ||
                        'https://happylife.develop.onlineberatung.net',
                    changeOrigin: true,
                    secure: false, // dev target has incomplete cert chain
                },
                '/auth': {
                    target:
                        process.env.VITE_DEV_PROXY_TARGET ||
                        'https://happylife.develop.onlineberatung.net',
                    changeOrigin: true,
                    secure: false, // dev target has incomplete cert chain
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

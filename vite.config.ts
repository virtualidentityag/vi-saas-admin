import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import eslintPlugin from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return defineConfig({
        base: process.env.BASE || '/',
        plugins: [
            react(),
            viteTsconfigPaths(),
            svgr({
                include: '**/*.svg',
                svgrOptions: {
                    exportType: 'named',
                    namedExport: 'ReactComponent',
                },
            }),
            eslintPlugin({
                emitWarning: true,
                failOnWarning: false,
                emitError: true,
                failOnError: true,
                fix: process.env.NODE_ENV === 'development',
            }),
        ],
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler',
                    quietDeps: true,
                },
            },
        },
        build: {
            outDir: 'build',
        },
        server: {
            host: '0.0.0.0',
            port: (process.env.VITE_PORT as unknown as number) || 9000,
        },
    });
};

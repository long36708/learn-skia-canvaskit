import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import TurboConsole from 'unplugin-turbo-console/vite'
import {codeInspectorPlugin} from 'code-inspector-plugin';
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        TurboConsole({
            extendedPathFileNames: ['index']
        }),
        codeInspectorPlugin({
            bundler: 'vite',
        }),
    ],
})

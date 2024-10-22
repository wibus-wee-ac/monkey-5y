import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        icon: 'https://vitejs.dev/logo.svg',
        namespace: '5y 学习平台. 自动抹屁股',
        match: ['http://5y.gdoa.net/CCenter/*'],
      },
    }),
  ],
});

import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import path from 'path';
import { defineConfig } from 'vite';
import glob from 'fast-glob';
import { fileURLToPath } from 'url';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: '/Dashboard-SASS/',

  plugins: [
    ViteImageOptimizer({
      png: { quality: 86 },
      jpeg: { quality: 86 },
      jpg: { quality: 86 },
      svg: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeHiddenElems: false,
                cleanupIds: false,
                inlineStyles: false,
                removeUselessDefs: false,
              },
            },
          },
        ],
      },
      exclude: /icons\.svg$/i, // ← виключи спрайт
    }),
    {
      ...imagemin(['./src/img/**/*.{jpg,png,jpeg}'], {
        destination: './src/img/webp/',
        plugins: [imageminWebp({ quality: 86 })],
      }),
      apply: 'serve',
    },
    {
      name: 'fix-svg-paths',
      transformIndexHtml(html) {
        return html.replace(
          /\.\/src\/img\/icons\.svg/g,
          '/Dashboard-SASS/assets/icons.svg'
        );
      },
    },
  ],

  build: {
    minify: false,
    rollupOptions: {
      input: Object.fromEntries(
        glob
          .sync(['./*.html', './pages/**/*.html'])
          .map(file => [
            path.relative(
              __dirname,
              file.slice(0, file.length - path.extname(file).length)
            ),
            fileURLToPath(new URL(file, import.meta.url)),
          ])
      ),
      output: {
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});

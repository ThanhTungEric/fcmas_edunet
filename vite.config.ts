import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
// import vue from '@vitejs/plugin-vue'
import adonisjs from '@adonisjs/vite/client'

import Vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import Components from 'unplugin-vue-components/vite'
import Imports from 'unplugin-auto-import/vite'
import PurgeCSS from 'rollup-plugin-purgecss'
import Unhead from '@unhead/addons/vite'
import DevTools from 'vite-plugin-vue-devtools'
import { unheadVueComposablesImports } from '@unhead/vue'
// import I18n from '@intlify/unplugin-vue-i18n/vite'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { VitePWA } from 'vite-plugin-pwa'
const isProduction = false
const isDebug = true
const isSsrBuild = false

export default defineConfig({
  // Project root directory (where index.html is located).
  root: process.cwd(),
  // Base public path when served in development or production.
  // You also need to add this base like `history: createWebHistory('my-subdirectory')`
  // in ./src/router.ts
  // base: '/my-subdirectory/',
  base: '/',
  publicDir: 'public',
  logLevel: 'info',
  // plugins: [inertia({ ssr: { enabled: false } }), vue(), adonisjs({ entrypoints: ['inertia/app/app.ts'], reload: ['resources/views/**/*.edge'] })],

  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: [
      {
        find: '/@src/',
        replacement: `${getDirname(import.meta.url)}/inertia/`,
      },
    ],
    // alias: {
    //   '~/': `${getDirname(import.meta.url)}/inertia/`,
    //   '@/': `${getDirname(import.meta.url)}/inertia/`,
    //   '/@src/': `${getDirname(import.meta.url)}/inertia/`,
    // },
  },

  // Predefine dependencies in order to prevent reloading them in the browser during development.
  optimizeDeps: {
    include: [
      '@ckeditor/ckeditor5-vue',
      '@ckeditor/ckeditor5-build-classic',
      '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.min.js',
      '@shikijs/rehype',
      '@vee-validate/zod',
      '@vueuse/core',
      '@vueuse/router',
      '@vueuse/integrations/useCookies',
      '@vueform/multiselect',
      '@vueform/slider',
      'billboard.js',
      'dayjs',
      'dropzone',
      'dragula',
      'defu',
      'filepond',
      'filepond-plugin-file-validate-size',
      'filepond-plugin-file-validate-type',
      'filepond-plugin-image-exif-orientation',
      'filepond-plugin-image-crop',
      'filepond-plugin-image-edit',
      'filepond-plugin-image-preview',
      'filepond-plugin-image-resize',
      'filepond-plugin-image-transform',
      'focus-trap-vue',
      'imask',
      'nprogress',
      'notyf',
      'mapbox-gl',
      'ofetch',
      'photoswipe/lightbox',
      'photoswipe',
      'plyr',
      'ufo',
      'v-calendar',
      'vee-validate',
      'vue',
      'vue-scrollto',
      'vue3-apexcharts',
      'vue-tippy',
      'vue-i18n',
      'vue-router',
      'unplugin-vue-router/runtime',
      'scule',
      // 'simplebar',
      'tiny-slider/src/tiny-slider',
      'vue-accessible-color-picker',
      'zod',
      'rehype-external-links',
      'rehype-raw',
      'rehype-sanitize',
      'rehype-stringify',
      'rehype-slug',
      'rehype-autolink-headings',
      'remark-gfm',
      'remark-parse',
      'remark-rehype',
      'unified',
      'workbox-window',
      'textarea-markdown-editor/dist/esm/bootstrap',
    ],
  },
  build: {
    outDir: 'build',
    target: 'esnext',
    cssMinify: isDebug
      ? false
      : 'esbuild',
    minify: isDebug
      ? false
      : 'terser',
    sourcemap: isDebug,
    commonjsOptions: { transformMixedEsModules: true },
    rollupOptions: {
      output: {
        format: 'esm',
        entryFileNames: isSsrBuild ? '[name].mjs' : '[name]-[hash].js',
        // Using only hash to prevent adblockers from blocking assets that match their patterns.
        chunkFileNames: isDebug
          ? `assets/_/[name].${isSsrBuild ? 'mjs' : 'js'}`
          : `assets/_/[hash].${isSsrBuild ? 'mjs' : 'js'}`,
        assetFileNames: isDebug
          ? 'assets/[name][extname]'
          : 'assets/[hash][extname]',
        // Using manualChunks to group layout scss in one chunk to avoid Cumulative Layout Shift (CLS)
        manualChunks(id) {
          if (id.endsWith('scss/main.scss')) {
            return 'layouts'
          }
          if (id.endsWith('.scss') && id.match(/components\/layouts\/(?:.*?)scss$/)) {
            return 'layouts'
          }
        },
      },
    },
  },
  // build: {
  //   target: 'esnext',
  //   minify: 'terser',
  //   rollupOptions: {
  //     output: {
  //       // Using only hash to prevent adblockers from blocking assets that match their patterns.
  //       // Replace with [name] to use the original name for debug purposes.
  //       entryFileNames: 'assets/[name]-[hash].js',
  //       chunkFileNames: 'assets/_/[hash].js',
  //       assetFileNames: 'assets/[hash][extname]',
  //     },
  //   },
  // },

  plugins: [
    inertia({ ssr: { enabled: false } }),
    // vue(),
    /**
     * Shows a quick overview of your app, including the Vue version, pages and components.
     *
     * @see https://devtools-next.vuejs.org/
     */
    DevTools(),

    /**
     * unplugin-vue-router plugin generate routes based on file system
     * allow to use typed routes and usage of defineLoader
     *
     * @see https://uvr.esm.is/rfcs/data-loaders/
     */
    VueRouter({
      routesFolder: 'inertia/pages',
      dts: './types/router.d.ts',
    }),

    /**
     * plugin-vue plugin inject vue library and allow sfc files to work (*.vue)
     *
     * @see https://github.com/vitejs/vite-plugin-vue/blob/main/packages/plugin-vue/README.md
     */
    Vue({
      include: [/\.vue$/],
      template: {
        compilerOptions: {
          isCustomElement: tag => ['iconify-icon'].includes(tag),
        },
      },
    }),

    /**
     * unplugin-vue-i18n plugin does i18n resources pre-compilation / optimizations
     *
     * @see https://github.com/intlify/bundle-tools/blob/main/packages/unplugin-vue-i18n/README.md
     */
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './inertia/locales/**'),
      // fullInstall: false,
      // compositionOnly: true,
      runtimeOnly: true,
    }),

    /**
     * Unhead provides a Vite plugin to optimise your builds, by removing composables that aren't needed and simplifying your code.
     *
     * @see https://unhead.harlanzw.com/guide/getting-started/vite-plugin
     */
    Unhead(),

    /**
     * unplugin-auto-import allow to automaticaly import modules/components
     *
     * @see https://github.com/antfu/unplugin-auto-import
     */
    Imports({
      dts: './types/imports.d.ts',
      imports: [
        'vue',
        '@vueuse/core',
        'vue-i18n',
        VueRouterAutoImports,
        unheadVueComposablesImports,
      ],
      dirs: ['inertia/composables', 'inertia/stores', 'inertia/utils'],
    }),

    /**
     * unplugin-vue-components plugin is responsible of autoloading components
     * documentation and md file are loaded for elements and components sections
     *
     * @see https://github.com/antfu/unplugin-vue-components
     */
    Components({
      dirs: ['inertia/components'],
      extensions: ['vue'],
      dts: './types/components.d.ts',
      include: [/\.vue$/, /\.vue\?vue/],
    }),

    /**
     * vite-plugin-pwa generate manifest.json and register services worker to enable PWA
     *
     * @see https://github.com/antfu/vite-plugin-pwa
     */
    VitePWA({
      base: '/',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Vuero - A complete Vue 3 design system',
        short_name: 'Vuero',
        start_url: '/?utm_source=pwa',
        display: 'standalone',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      mode: isProduction
        ? 'production'
        : 'development',
      workbox: {
        /**
         * precache files that match the glob pattern
         *
         * @see https://vite-pwa-org.netlify.app/guide/service-worker-precache.html
         */
        globPatterns: ['**/*.{js,mjs,css,ico,png,svg,webp,jpg,jpeg,html}'],
      },
    }),

    /**
     * rollup-plugin-purgecss plugin is responsible of purging css rules
     * that are not used in the bundle
     *
     * @see https://github.com/FullHuman/purgecss/tree/main/packages/rollup-plugin-purgecss
     */
    PurgeCSS({
      output: false,
      content: [`./inertia/**/*.vue`],
      variables: false,
      safelist: {
        standard: [
          /(autv|lnil|lnir|fas?)/,
          /-(leave|enter|appear)(|-(to|from|active))$/,
          /^(?!(|.*?:)cursor-move).+-move$/,
          /^router-link(|-exact)-active$/,
          /data-v-.*/,
        ],
      },
      defaultExtractor(content) {
        const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, '')
        return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || []
      },
    }),

    adonisjs({ entrypoints: ['inertia/app/app.ts'], reload: ['resources/views/**/*.edge'] }),
  ],
})

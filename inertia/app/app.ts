/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

// import '../css/app.css';
import { createApp, h } from 'vue'
// import type { Component } from 'vue'
// import type { DefineComponent } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
// import { resolvePageComponent } from '@adonisjs/inertia/helpers'

const appName = import.meta.env.VITE_APP_NAME || 'FCMAS'

import { createHead } from '@unhead/vue'
import { InferSeoMetaPlugin } from '@unhead/addons'
import { createPinia } from 'pinia'
import type { VueroAppContext } from '/@src/utils/plugins'
import { createRouter } from '/@src/router'
// import VueroApp from '/@src/VueroApp.vue'
import '/@src/styles'

import ContextPlugin from '/@src/plugins/vuero-context'
import SessionPlugin from '/@src/plugins/session-check'
import DarkmodePlugin from '/@src/plugins/darkmode'
// import I18nPlugin from '/@src/plugins/i18n'
import VueformPlugin from '/@src/plugins/vueform'
import VcalendarPlugin from '/@src/plugins/v-calendar'
import VueTippyPlugin from '/@src/plugins/vue-tippy'
import NotyfPlugin from '/@src/plugins/notyf'
// import { createNotyf } from '/@src/composables/notyf'

import 'iconify-icon'
import Layout from '/@src/layouts/navbar.vue'


import { createI18n } from 'vue-i18n'
import messages from '@intlify/unplugin-vue-i18n/messages'

createInertiaApp({
  // progress: { color: '#5468FF' },
  progress: false,

  title: (title) => `${title} - ${appName}`,

  // resolve: (name) => {
  //   return resolvePageComponent(
  //     `../pages/${name}.vue`,
  //     import.meta.glob<DefineComponent>('../pages/**/*.vue'),
  //   )
  // },

  resolve: (name) => {
    const pages = import.meta.glob('../pages/**/*.vue', { eager: true })
    // const pages = resolvePageComponent(
    //   `../pages/${name}.vue`,
    //   import.meta.glob<DefineComponent>('../pages/**/*.vue'),
    // )
    // const pages = import.meta.glob<DefineComponent>('../pages/**/*.vue')
    let page: any = pages[`../pages/${name}.vue`]
    if (name !== 'auth') {
      page.default.layout = Layout
    }
    return page
  },

  setup({ el, App, props, plugin }) {
    
    // createApp({ render: () => h(App, props) })
    
    //   .use(plugin)
    //   .mount(el)
    // const app = createApp(VueroApp, { render: () => h(App, props) })
    const app = createApp({ render: () => h(App, props) })

    // app.use(createNotyf())
    // const app = createApp(VueroApp)

    const router = createRouter()

    const head = createHead({
      plugins: [InferSeoMetaPlugin()],
    })
    app.use(head)

    const pinia = createPinia()
    app.use(pinia)

    const vuero: VueroAppContext = {
      app,
      router,
      head,
      pinia,
    }

    const defaultLocale = useStorage('locale', 'en')
    const i18n = createI18n({
      locale: defaultLocale.value,
      messages,
    })

    app.use(i18n)

    // I18nPlugin(vuero)
    DarkmodePlugin(vuero)
    SessionPlugin(vuero)
    ContextPlugin(vuero)
    VueformPlugin(vuero)
    VcalendarPlugin(vuero)
    VueTippyPlugin(vuero)
    NotyfPlugin(vuero)

    // use router after plugin registration, so we can register navigation guards in plugins
    app.use(vuero.router)
    app.use(plugin)
    app.mount(el)
    // vuero.app.mount('#app')

    // return vuero
  },
})
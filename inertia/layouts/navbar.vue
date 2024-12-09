<script setup lang="ts">
import { usePage } from '@inertiajs/vue3'
import type { NavbarItem } from '/@src/components/layouts/navbar/navbar.types'
import type { SidebarItem, SidebarItemSubsidebar, SubsidebarItemCollapse, SubsidebarItemCollapseChild } from '/@src/components/layouts/sidebar/sidebar.types'

const pageTitle = useVueroContext<string>('page-title')
const sidebarData: any = computed(() => usePage().props?.sidebarData)

const links = ref<NavbarItem[]>([
  {
    type: 'link',
    label: 'Dashboards',
    icon: 'lucide:activity',
    to: '/dashboard'
  },
  {
    type: 'dropdown',
    label: 'Infra structure',
    id: 'faq',
    icon: 'lucide:grid',
    children: [
      {
        label: 'Infra type',
        to: '/infra-types',
        icon: 'lucide:shopping-cart',
      },
      {
        label: 'Infra',
        to: '/infras',
        icon: 'lucide:book',
      },
      {
        label: 'Custom field',
        to: '/custom-fields',
        icon: 'lucide:message-circle',
      },
    ],
  },
  // {
  //   type: 'link',
  //   label: 'Site management',
  //   icon: 'lucide:grid',
  //   to: '/sites'
  // },
  {
    type: 'link',
    label: 'D3 components',
    icon: 'lucide:cpu',
    to: '/d3js'
  },
  {
    type: 'link',
    label: 'Settings',
    icon: 'lucide:settings',
    to: '/settings'
  },
  {
    type: 'link',
    label: 'Users',
    icon: 'lucide:users',
    to: '/users'
  }
])

import NProgress from 'nprogress'
import { router } from '@inertiajs/vue3'

let timeout: any = null

router.on('start', () => {
  NProgress.start()
  console.log('vao day ne nha')
  // timeout = setTimeout(() => NProgress.start(), 50)
})

// router.on('progress', (event) => {
//   alert('aaa')
//   if (NProgress.isStarted() && event.detail.progress.percentage) {
//     NProgress.set((event.detail.progress.percentage / 100) * 0.9)
//   }
// })

router.on('finish', (event) => {
  clearTimeout(timeout)
  if (!NProgress.isStarted()) {
    return
  } else if (event.detail.visit.completed) {
    NProgress.done()
  } else if (event.detail.visit.interrupted) {
    NProgress.set(0)
  } else if (event.detail.visit.cancelled) {
    NProgress.done()
    NProgress.remove()
  }
})

function generateHrefFromUrl (id:number, url: string) {
  let to = ''
  if (url) {
    to = `/infras/circuit-diagrams/${id}/${encodeURIComponent(url)}`
  }
  return to
}

function generateTreeSidebar(anyItem: any, parentId: number, level: number) {
  if (sidebarData.value) {
    for (let sKey in sidebarData.value) {
      let infra = sidebarData.value[sKey]
      if (infra.parent_id == parentId) {
        switch (level) {
          case 1: {
            let subItem: SubsidebarItemCollapse = {
              type: 'collapse',
              id: infra.uuid,
              label: infra.name,
              to: generateHrefFromUrl(infra.id, infra.url),
              children: []
            }
            anyItem.subsidebar.items.push(subItem)
            generateTreeSidebar(subItem, infra.id, 2)
            break
          }
          case 2: {
            let subItemChild: SubsidebarItemCollapseChild = {
              type: 'collapse',
              label: infra.name,
              to: generateHrefFromUrl(infra.id, infra.url),
              children2: []
            }
            anyItem.children.push(subItemChild)
            generateTreeSidebar(subItemChild, infra.id, 3)
            break
          }
          case 3: {
            let subItemChild: SubsidebarItemCollapseChild = {
              type: 'collapse',
              label: infra.name,
              to: generateHrefFromUrl(infra.id, infra.url),
              children2: []
            }
            anyItem.children2.push(subItemChild)
            // generateTreeSidebar(subItemChild, infra.id, 3)
            break
          }
        }
      }
    }
  }
}
let sidebarLinks = Array<SidebarItem>()
if (sidebarData.value) {
  for (let sKey in sidebarData.value) {
    let infra = sidebarData.value[sKey]
    if (infra.parent_id == 0) {
      let sidebarItem: SidebarItem = {
        id: infra.uuid,
        label: infra.name.substring(0,3),
        icon: "lucide:activity",
        type: "subsidebar",
        subsidebar: {
          label: infra.code,
          to: infra.url,
          items: []
        }
      }
      sidebarLinks.push(sidebarItem)
      generateTreeSidebar(sidebarItem, infra.id, 1)
    }
  }
}
</script>

<template>
  
<SidebarLayout size="wide" :links="sidebarLinks" defaultSidebar="dashboard">
  <NavbarLayout size="full" :links>
    <!-- Propagating the context to the default slot -->
    <template #default="context">
      <slot v-bind="context" />
    </template>

    <template #logo>
      <RouterLink
        to="/"
      >
        <AnimatedLogo
          width="38px"
          height="38px"
        />
      </RouterLink>
    </template>

    <template #navbar-title>
      <ProjectsQuickDropdown />
      <h1 class="title is-6">
        {{ pageTitle }}
      </h1>
    </template>

    <template #title-mobile>
      <div class="is-flex is-align-items-center">
        <ProjectsQuickDropdown />

        <h1 class="title is-4">
          {{ pageTitle }}
        </h1>
      </div>
    </template>

    <template #toolbar>
      <!-- <LayoutSwitcher class="is-hidden-mobile" /> -->
      <ToolbarNotification />
      <!-- <ToolbarActivity /> -->
      <ToolbarThemeToggle />
      <ToolbarLanguage />
      <ToolbarUserProfile right class="ml-2 is-hidden-mobile" />
    </template>

    <!-- <template #toolbar-mobile>
      <ToolbarNotificationMobile />
      <ToolbarUserProfile right />
    </template> -->

    <template #megamenu-start>
      <SearchHistory />
    </template>
    <template #megamenu-top>
      <NavsearchInput class="mt-4 mb-2" />
    </template>

    <template #extra>
      <PanelLanguages />
      <!-- <PanelActivity /> -->
      <!-- <PanelSearch /> -->
      <!-- <PanelTask /> -->

      <ClientOnly>
        <VReloadPrompt app-name="Vuero" />
      </ClientOnly>
    </template>
  </NavbarLayout>
</SidebarLayout>
</template>

<style lang="scss">
.is-navbar-md {
  margin-top: 10px !important;
}
// .main-sidebar{
//   width: 150px;
// }
// .sidebar-panel {
//   inset-inline-start: 150px;
//   padding-top: 64px !important;
// }
.main-sidebar .sidebar-inner {
  padding-top: 64px !important;
}
// .main-sidebar .sidebar-inner .icon-menu li, .main-sidebar .sidebar-inner .bottom-menu li {
//   width: 150px;
// }

.sidebar-panel.is-generic .inner li {
  border-inline-start: 0 !important;
}

// .sidebar-panel.is-generic .inner ul li.has-children {
//   background-color: red;
//   padding-left: 10px !important;
// }

.sidebar-panel.is-generic .inner ul li.has-children ul li {
  height: auto;
}

.sidebar-panel.is-generic .inner ul li.has-children ul li a {
  font-weight: 400 !important;
  font-size: 0.9rem !important;
  color: var(--light-text);
}

.sidebar-panel.is-generic .inner ul li.has-children.active ul li a {
  padding-inline-start: 32px;
}

.sidebar-panel.is-generic .inner ul li.has-children ul li a .iconify {
  // background-color: red !important;
  transform: none !important;
}

.sidebar-panel.is-generic .inner ul li.has-children ul li.has-children.active a .iconify {
  // background-color: blue !important;
  transform: rotate(calc(var(--transform-direction) * 90deg)) !important;
}

.sidebar-panel.is-generic .inner ul li.has-children ul li.has-children.active ul li a {
  padding-inline-start: 48px;
}

.sidebar-panel.is-generic .inner ul li.has-children ul li.has-children.active ul li a .iconify {
  // background-color: pink !important;
  transform: none !important;
}

.sidebar-panel.is-generic .inner ul li.has-children ul li.has-children.active ul li.has-children.active a .iconify {
  // background-color: yellow !important;
  transform: rotate(calc(var(--transform-direction) * 90deg)) !important;
}

.sidebar-panel.is-generic .inner ul li.has-children ul li.has-children.active ul li.has-children.active ul li a {
  padding-inline-start: 64px;
  // background-color: orange;
}

</style>
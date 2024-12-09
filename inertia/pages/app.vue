<script setup lang="ts">
import Layout from '/@src/layouts/navbar.vue'

definePage({
  meta: {
    // requiresAuth: true
  }
})

useHead({
  meta: [
    {
      name: 'robots',
      content: 'noindex',
    },
  ],
})
const pageTitle = useVueroContext<string>('page-title')
onMounted(() => {
  pageTitle.value = 'FCMAS'
})
</script>

<template>
  <Layout>
    <!-- <RouterView /> -->

    <div>
      <VCard>
        Hello Vuero
      </VCard>
    </div>
  </Layout>
</template>

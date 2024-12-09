<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Link } from '@inertiajs/vue3'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  // @ts-ignore
  ...RouterLink.props,
})

const isExternalLink = computed(() => {
  return typeof props.to === 'string' && props.to.startsWith('http')
})
</script>

<template>
  <a
    v-if="isExternalLink"
    v-bind="$attrs"
    :href="props.to"
    target="_blank"
  >
    <slot />
  </a>
  <Link
    v-else
    v-bind="$attrs"
    :href="props.to"
    :class="[
      props.isActive && 'router-link-active',
      props.isExactActive && 'router-link-exact-active',
    ]"
    @click="props.navigate"
  >
    <slot />
  </Link>
  <!-- <RouterLink
    v-else
    v-slot="{ href, navigate, isActive, isExactActive }"
    v-bind="({
      ...$props,
      custom: true,
    } as any)"
  >
    <Link
      v-bind="$attrs"
      :href="href"
      :class="[
        isActive && 'router-link-active',
        isExactActive && 'router-link-exact-active',
      ]"
      @click="navigate"
    >
      <slot />
    </Link>
  </RouterLink> -->
</template>

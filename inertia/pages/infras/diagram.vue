<script setup lang="ts">
// import { usePage, Link } from '@inertiajs/vue3'
// const user: any = computed(() => usePage().props?.user)
defineProps<{
  url: string,
  infra: any
}>()
</script>

<template>
  <div>
    <div class="card-grid-toolbar">
      <div>
        <h6 class="title is-5">Sơ đồ {{ infra ? infra.name : '' }}</h6>
      </div>

      <div class="buttons">
        <Link href="/infras/create">
          <VButton
            color="primary"
            raised
          >
            <span class="icon">
              <i
                aria-hidden="true"
                class="fas fa-plus"
              />
            </span>
            <span>Tạo Infra</span>
          </VButton>
        </Link>
      </div>
    </div>
    <div class="custom-container">
      <iframe :src="decodeURIComponent(url)" class="diagram-ifram"></iframe>
    </div>
  </div>
</template>

<style lang="scss">
// .page-content-wrapper {
//   background-color: #fff;
// }
.custom-container {
  width: 100%;
  height: calc(100vh - 64px - 94px - 94px);
  background: var(--white);
}
.diagram-ifram {
  width: 100%;
  height: 100%;
  background: var(--white);
}
</style>

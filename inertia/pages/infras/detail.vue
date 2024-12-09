<script setup lang="ts">
import { usePage, Link, useForm } from '@inertiajs/vue3'
import { projects } from '/@src/data/layouts/card-grid-v3'

defineProps<{
  parentId: any
}>()

const paginationJSON: any = computed(() => usePage().props?.paginationJSON)
const grandParent: any = computed(() => usePage().props?.grandParent)

const filters = ref('')

const filteredData = computed(() => {
  if (!filters.value) {
    return projects
  }
  else {
    return projects.filter((item) => {
      return (
        item.name.match(new RegExp(filters.value, 'i'))
        || item.remaining.match(new RegExp(filters.value, 'i'))
      )
    })
  }
})

const centeredActionsOpen = ref(false)
const deleteSelectedId = ref(0)

function openDeleteView(deleteId: number) {
  deleteSelectedId.value = deleteId
  centeredActionsOpen.value = true
}

const form = useForm({
  id: 0
})

const isLoading = ref(false)

const onDelete = () => {
  // console.log('Form submitted!')
  centeredActionsOpen.value = false
  form.delete(`/infras/${deleteSelectedId.value}`, {
    preserveScroll: true,
    onStart: visit => {
      isLoading.value = true
      // NProgress.start()
    },
    onFinish: visit => {
      // NProgress.done()
      isLoading.value = false
    },
    onError: (errors) => {
      console.log(errors)
    }
  })
}
function back(): string {
  let backUrl = '/infras'
  if (grandParent.value) {
    return `/infras/detail/${grandParent.value}`
  }
  return backUrl
}
</script>

<template>
  <div>

    <VModal
      :open="centeredActionsOpen"
      actions="center"
      @close="centeredActionsOpen = false"
      title="Thông báo"
      cancel-label="Hủy bỏ"
    >
      <template #content>
        <VPlaceholderSection
          :title="`Xóa Infra`"
          subtitle="Tất cả dữ liệu liên quan đến Infra này sẽ bị xóa. Bao gồm Tài liệu, Attrs, ..."
        />
      </template>
      <template #action>
        <VButton color="danger" raised @click="onDelete">
          Đồng ý
        </VButton>
      </template>
    </VModal>

    <div class="card-grid-toolbar">
      <!-- <VControl icon="lucide:search">
        <input
          v-model="filters"
          class="input custom-text-filter"
          placeholder="Search..."
        >
      </VControl> -->
      <div>
        <h6 class="title is-4">Infra</h6>
      </div>

      <div class="buttons">
        <!-- <VField class="h-hidden-mobile">
          <VControl>
            <Multiselect
              v-model="valueSingle"
              :valueProp="'id'"
              :label="'name'"
              :options="optionsSingle"
              :max-height="145"
              placeholder="Chọn Infra type"
            />
          </VControl>
        </VField> -->

        <Link :href="back()">
          <VButton
            icon="lnir lnir-arrow-left rem-100"
            light
            dark-outlined
          >
            Quay lại
          </VButton>
        </Link>
        <Link :href="`/infras/create/${parentId}`" class="ml-4">
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

    <div class="card-grid card-grid-v3">
      <!--List Empty Search Placeholder -->
      <VPlaceholderPage
        :class="[filteredData.length !== 0 && 'is-hidden']"
        title="We couldn't find any matching results."
        subtitle="Too bad. Looks like we couldn't find any matching results for the
          search terms you've entered. Please try different search terms or
          criteria."
        larger
      >
        <template #image>
          <img
            class="light-image"
            :src="'/images/illustrations/placeholders/search-3.svg'"
            alt=""
          >
          <img
            class="dark-image"
            :src="'/images/illustrations/placeholders/search-3-dark.svg'"
            alt=""
          >
        </template>
      </VPlaceholderPage>

      <!--Card Grid v3-->
      <TransitionGroup
        name="list"
        tag="div"
        class="columns is-multiline is-flex-tablet-p is-half-tablet-p"
        v-if="paginationJSON && paginationJSON.data"
      >
        <!--Grid Item-->
        <div
          v-for="item in paginationJSON.data"
          :key="item.id"
          class="column is-4"
        >
          <div class="card-grid-item">
              <div class="h-toggle">

                <Link :href="`/infras/edit/${item.id}`">
                  <VIcon
                    icon="lucide:edit-2"
                    circle
                  />
                </Link>
                <VIcon
                  @click="openDeleteView(item.id)"
                  class="ml-4"
                  icon="lucide:trash"
                  circle
                />
              </div>
            <VAvatar
              size="large"
              :picture="'https://media.cssninja.io/content/photos/apps/1.jpg'"
              :badge="'/images/icons/stacks/illustrator.svg'"
              squared
            />
            <h3 class="dark-inverted">
              {{ item.name }}
            </h3>
            <p>Loại {{ item.type ? item.type.name : 'Loại NA' }}</p>
            <div class="description">
              <p>{{ item.type ? item.type.description : '' }}</p>
            </div>
            <div class="buttons">
              <Link :href="`/infras/detail/${item.id}`" class="button v-button is-dark-outlined is-clickable">
                <button class="transparent-button is-clickable">
                  <span class="icon">
                    <VIcon
                      icon="lucide:eye"
                    />
                  </span>
                  <span>Chi tiết</span>
                </button>
              </Link>
              <Link :href="`/infras/create/${item.id}`" class="button v-button is-dark-outlined is-clickable">
                <button class="transparent-button is-clickable">
                  <span class="icon">
                    <VIcon
                      icon="lucide:plus"
                    />
                  </span>
                  <span>Thêm Infra</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </TransitionGroup>
      
      <VFlexPagination
        v-if="paginationJSON && paginationJSON.meta"
        :router-query-key="`/infras/detail/${parentId}`"
        :use-inertia="true"
        :item-per-page="paginationJSON.meta.perPage"
        :total-items="paginationJSON.meta.total"
        :current-page="paginationJSON.meta.currentPage"
        :max-links-displayed="5"
      />
    </div>
  </div>
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';
.transparent-button {
  border: none;
  background: transparent;
  padding: 0;
  align-items: center;
  justify-content: center;
  display: flex;
  color: var(--light-text);
}
.card-grid {
  .columns {
    margin-inline-start: -0.5rem !important;
    margin-inline-end: -0.5rem !important;
    margin-top: -0.5rem !important;
  }

  .column {
    padding: 0.5rem !important;
  }
}

.card-grid-v3 {
  .card-grid-item {
    @include vuero-s-card;

    position: relative;
    text-align: center;
    padding: 30px;

    .h-toggle {
      position: absolute;
      top: 28px;
      inset-inline-end: 10px;
      transform: scale(0.85);
    }

    > .v-avatar {
      display: block;
      margin: 0 auto 10px;
      border-radius: 16px;

      .avatar {
        object-fit: cover;
        border: 1px solid color-mix(in oklab, var(--fade-grey), black 4%);
        box-shadow: var(--light-box-shadow);
      }

      .badge {
        bottom: 22px;
        inset-inline-end: -12px;
      }
    }

    > h3 {
      font-size: 1.1rem;
      font-weight: 600;
      font-family: var(--font-alt);
      color: var(--dark-text);
    }

    > p {
      font-size: 0.9rem;
    }

    .description {
      padding: 12px 0;
    }

    .people {
      display: flex;
      justify-content: center;
      padding: 8px 0 30px;

      .v-avatar {
        margin: 0 4px;
      }
    }

    .buttons {
      display: flex;
      justify-content: space-between;

      .button {
        width: calc(50% - 4px);
        color: var(--light-text);

        &:hover,
        &:focus {
          border-color: color-mix(in oklab, var(--fade-grey), black 4%);
          color: var(--primary);
          box-shadow: var(--light-box-shadow);
        }
      }
    }
  }
}

.is-dark {
  .card-grid-v3 {
    .card-grid-item {
      @include vuero-card--dark;
    }
  }
}

@media only screen and (width >= 768px) and (width <= 1024px) and (orientation: landscape) {
  .card-grid-v3 .card-grid-item > h3 {
    font-size: 1rem;
  }
}
</style>

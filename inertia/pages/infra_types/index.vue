<script setup lang="ts">
import { usePage, Link, useForm } from '@inertiajs/vue3'
import { useTemplateRef, onMounted, reactive, onBeforeUpdate } from 'vue'

import { Draggable } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'
import '@he-tree/vue/style/material-design.css'
import NProgress from 'nprogress'
import { Stat } from '@he-tree/tree-utils';

const notyf = useNotyf()
const infraTypeTree = computed(() => usePage().props?.infraTypeTree)

const isLoading = ref(false)
// defineProps<{
//   infraTypeTree: []
// }>()


// const treeRef = useTemplateRef('tree')
const editButtonRef = useTemplateRef('editBtn')

// type StatObj = {
//   selected: boolean,
//   open: string,
//   data: {
//     id: number,
//     label: string
//   }
// }

let statCache: Stat<any> = {
  selected: false,
  open: false,
  data: {id: 0, label: ''},
  parent: null,
  children: [],
  level: 1,
  isStat: true,
  hidden: false,
  checked: false,
  draggable: null,
  droppable: null,
  style: null,
  class: null
}

const dragModel = defineModel({type: []})
dragModel.value = []
const infraTypeSelected = reactive(statCache)

onMounted(() => {
  // console.log(`the component is now mounted.`)
  // console.log(infraTypeTree.value)
  dragModel.value = infraTypeTree.value
})

onBeforeUpdate(() => {
  // console.log('vao before update')
  dragModel.value = infraTypeTree.value
})

const clickNote = (stat: Stat<any>) => {
  infraTypeSelected.data.id = stat.id
  infraTypeSelected.data.label = stat.label
}

const form = useForm({
  id: 0
})

function openDeleteView() {
  if (!infraTypeSelected.data.id) {
    notyf.dismissAll()
    notyf.warning('Hãy chọn 1 Infra type để xóa')
    return
  }
  centeredActionsOpen.value = true
}

const onDelete = () => {
  // console.log('Form submitted!')
  centeredActionsOpen.value = false
  form.delete(`/infra-types/${infraTypeSelected.data.id}`, {
    preserveScroll: true,
    onStart: visit => {
      isLoading.value = true
      NProgress.start()
    },
    onFinish: visit => {
      NProgress.done()
      isLoading.value = false
      infraTypeSelected.data.id = 0
      infraTypeSelected.data.label = ''
    },
    onError: (errors) => {
      console.log(errors)
    }
  })
}
const centeredActionsOpen = ref(false)

function openEditView() {
  if (!infraTypeSelected.data.id) {
    notyf.dismissAll()
    notyf.warning('Hãy chọn 1 Infra type để sửa')
    return
  }

  editButtonRef.value?.$el.click()
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
          :title="`Xóa ${infraTypeSelected.data.label}`"
          subtitle="Tất cả dữ liệu liên quan đến Infra type này sẽ bị xóa. Bao gồm Tài liệu, Attrs, Infra."
        />
      </template>
      <template #action>
        <VButton color="danger" raised @click="onDelete">
          Đồng ý
        </VButton>
      </template>
    </VModal>
    <form method="post" novalidate class="form-layout" >
      <div class="form-outer">
        <div class="form-header stuck-header">
          <div class="form-header-inner">
            <div class="left">
              <h3>Infra Type</h3>
            </div>
            <div class="right">
              <div class="buttons">
                <VButton color="danger" light dark-outlined @click="openDeleteView">
                  Xóa {{ infraTypeSelected.data.label }}
                </VButton>

                <Link :href="`/infra-types/edit/${infraTypeSelected.data.id}`" class="ml-4" ref="editBtn">
                  <VButton color="info" raised @click.prevent="openEditView">
                    Sửa {{ infraTypeSelected.data.label }}
                  </VButton>
                </Link>

                <Link href="/infra-types/create" class="ml-4">
                  <VButton color="primary" raised>
                    Tạo mới
                  </VButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div class="form-body">
              <Draggable v-model="dragModel" ref="tree" virtualization treeLine>
                <template #default="{ node, stat }">
                  <span @click="clickNote(node, stat)" :style="{color: stat.selected ? 'var(--dark-text)' :'var(--dark-text)'}" class="is-clickable" >
                    {{ node?.label }}
                  </span>
                </template>
              </Draggable>
        </div>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
.create-link {
  color: var(--white--color);
}
.tree-node-inner span {
  display: block;
}
</style>

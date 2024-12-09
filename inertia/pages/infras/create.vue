<script setup lang="ts">
import NProgress from 'nprogress'
import { Link, useForm, usePage } from '@inertiajs/vue3'
// import the component
// import Treeselect from 'vue3-treeselect'
  // import Treeselect from 'vue3-treeselect-ts'
  // import the styles
// import 'vue3-treeselect/dist/vue3-treeselect.css'

// import Multiselect from '@vueform/multiselect'
// import '@vueform/multiselect/themes/default.css'
// import { Sortable } from "sortablejs-vue3";
import { watch } from 'vue'

// defineProps<{
//   infraTypeTree: [],
// }>()
const parentId = computed(() => usePage().props?.parentId)
const infraTypes: any = computed(() => usePage().props?.infraTypes)
const infraReferer: any = computed(() => usePage().props?.infraReferer)

// const attrSelectOptionText = ref('')
const isLoading = ref(false)
const isLoadingAttrs = ref(false)

const { y } = useWindowScroll()

const isStuck = computed(() => {
  return y.value > 30
})

type itemAttrOption = {
  id: number,
  name: string
}
type formAttr = {
  id: number,
  name: string,
  code: string,
  type: string,
  options: {
    required: number,
    multiple: number,
    display: {
      span: number
    },
    data: Array<itemAttrOption>
  }
}

type infraValueType = {
  [key: string]: any
}
let infraValueInit:  infraValueType = {}

const form = useForm({
  name: null,
  code: null,
  parentId: parentId.value ? parentId.value : null,
  typeId: null,
  osId: null,
  attachments: [],
  options: {},
  attrs: Array<formAttr>(),
  value: infraValueInit,
  errors: {
    result: {
      message: null
    }
  }
})

function transformAttrs(attrs: Array<formAttr>) {
  attrs.forEach(attr => {
    attr.options.multiple = parseInt(attr.options.multiple.toString())
    attr.options.required = parseInt(attr.options.required.toString())
  })
  return attrs
}

const onSubmit = () => {
  console.log('Form submitted!')
  console.log(form)
  // return
  form.transform((data) => ({
    ...data,
    // options: data.options ? (JSON.parse(data.options) ?? {}) : {},
    parentId: data.parentId === null ? 0 : data.parentId,
    attrs: transformAttrs(data.attrs),
    infraReferer: infraReferer.value != window.location.href ? infraReferer.value : ''
  })).post('/infras', {
    preserveScroll: true,
    onStart: visit => {
      isLoading.value = true
      NProgress.start()
    },
    onFinish: visit => {
      NProgress.done()
      isLoading.value = false
    },
    onError: (errors) => {
      console.log(errors)
    }
  })
}

watch(
  () => form.typeId,
  (infraTypeId) => {
    isLoadingAttrs.value = true
    NProgress.start()
    fetch(`/infra-types/attrs/${infraTypeId}`, {
        method: 'get',
        headers: { 'Content-type': 'application/json' },
      }).then(async (response) => {
        isLoadingAttrs.value = false
        NProgress.done()
        if (!response.ok) {
          throw Error(response.statusText);
        }
        const data = await response.json();
        console.log('response: ', data)
        if (data && data.attrs) {
          form.attrs = data.attrs
        }
      }).catch((error) => {
        isLoadingAttrs.value = false
        NProgress.done()
        console.log('Looks like there was a problem: \n', error);
      });
  }
)

if (infraTypes.value && infraTypes.value.length === 1) {
  form.typeId = infraTypes.value[0].id
}

</script>

<template>
  <form
    method="post"
    novalidate
    class="form-layout"
    @submit.prevent="onSubmit"
    @keydown.enter="$event.preventDefault()"
  >
    <div class="form-outer">
      <div
        :class="[isStuck && 'is-stuck']"
        class="form-header stuck-header"
      >
        <div class="form-header-inner">
          <div class="left">
            <h3>Tạo Infra</h3>
          </div>
          <div class="right">
            <div class="buttons">
              <Link href="/infras">
                <VButton
                  icon="lnir lnir-arrow-left rem-100"
                  light
                  dark-outlined
                >
                  Hủy bỏ
                </VButton>
              </Link>
              <VButton
                type="submit"
                color="primary"
                raised
                class="ml-4"
                :loading="isLoading"
              >
                Lưu lại
              </VButton>
            </div>
          </div>
        </div>
      </div>
      <div class="form-body">
        <VMessage color="warning" v-if="form.errors.result?.message">
          {{ form.errors.result.message }}
        </VMessage>
        <!--Fieldset-->
        <div class="form-fieldset">
          <div class="fieldset-heading">
            <h4>Thông tin chung</h4>
            <p>Hãy điền các trường dưới đây</p>
          </div>

          <div class="columns is-multiline">
            <div class="column is-8">
              <VField>
                <VLabel>Tên Infra</VLabel>
                <VControl icon="lucide:info">
                  <VInput
                    type="text"
                    placeholder=""
                    v-model="form.name"
                  />
                </VControl>
              </VField>
              <div class="text-danger fw-light fst-italic" v-if="form.errors.name" style="color: var(--danger)">{{ form.errors.name[0] }}</div>
            </div>
            <div class="column is-4">
              <VField>
                <VLabel>Mã code</VLabel>
                <VControl icon="lucide:info">
                  <VInput
                    type="text"
                    placeholder=""
                    autocomplete="family-name"
                    v-model="form.code"
                  />
                </VControl>
              </VField>
            </div>
            <div class="column is-8">
              <VField>
                <VLabel>Chọn loại Infra</VLabel>
                <VControl>
                  <!-- <treeselect v-model="form.typeId" :multiple="false" :options="infraTypeTree" /> -->
                  <Multiselect
                    mode="single"
                    v-model="form.typeId"
                    :valueProp="'id'"
                    :label="'name'"
                    :options="infraTypes"
                    :max-height="145"
                    placeholder="Chọn Infra type"
                  />
                </VControl>
                <div class="text-danger fw-light fst-italic" v-if="form.errors.typeId" style="color: var(--danger)">{{ form.errors.typeId[0] }}</div>
              </VField>
            </div>
            <div class="column is-4">
              <VField>
                <VLabel>Open search ID</VLabel>
                <VControl icon="lucide:info">
                  <VInput
                    type="text"
                    placeholder=""
                    autocomplete="family-name"
                    v-model="form.osId"
                  />
                </VControl>
              </VField>
            </div>
          </div>
        </div>
        <!--Fieldset-->
        <div class="form-fieldset">
          <div class="fieldset-heading">
            <h4>Tài liệu</h4>
            <p>Tải các tài liệu liên quan nếu có</p>
          </div>

          <div class="columns is-multiline">
            <div class="column is-12">
              <VField>
                <!-- <VLabel>Company Name</VLabel> -->
                <VControl>
                  <input type="file" 
                  name="attachments[]"
                  @input="form.attachments = $event.target?.files"
                  multiple />
                  <!-- <VInput
                    type="file"
                    multiple
                    placeholder=""
                    autocomplete="family-name"
                    @input="form.attachments = $event.target.files"
                  /> -->
                </VControl>
              </VField>
            </div>
          </div>
        </div>
        <!--Fieldset-->
        <div class="form-fieldset">
          <div class="fieldset-heading columns">
            <VLoader size="small" :active="isLoadingAttrs">
              <div class="column is-12">
                <h4>Attrs</h4>
                <p>Cấu hình thuộc tính cho Infra</p>
              </div>
            </VLoader>
          </div>

          <div class="columns is-multiline" v-if="form.attrs.length">
            <div class="column mb-4" v-for="(attr, index) in form.attrs" :class="[`is-${attr.options.display.span}`]">
              <VField v-if="attr.type === 'string'">
                <VLabel>{{ attr.name }}</VLabel>
                <VControl>
                  <VInput
                    type="text"
                    placeholder="Điền thông tin..."
                    v-model="form.value[attr.id]"
                  />
                </VControl>
                <div class="text-danger fw-light fst-italic" v-if="form.errors.value && form.errors.value[attr.id]" style="color: var(--danger)">{{ form.errors.value[attr.id] }}</div>
              </VField>
              <VField v-if="attr.type === 'number'">
                <VLabel>{{ attr.name }}</VLabel>
                <VControl>
                  <VInput
                    type="number"
                    placeholder="Điền số..."
                    v-model="form.value[attr.id]"
                  />
                </VControl>
                <div class="text-danger fw-light fst-italic" v-if="form.errors.value && form.errors.value[attr.id]" style="color: var(--danger)">{{ form.errors.value[attr.id] }}</div>
              </VField>
              <VField v-if="attr.type === 'boolean'" class="custom-checkbox-outline">
                <VLabel>{{ attr.name }}</VLabel>
                <VControl>
                  <VCheckbox
                    v-model="form.value[attr.id]"
                    :label="attr.name"
                    color="primary"
                  />
                  <!-- <VSwitchSegment
                    class="is-justify-content-flex-start"
                    v-model="form.value[attr.id]"
                    label-true="Có"
                    label-false="Không"
                    color="primary"
                  /> -->
                </VControl>
                <div class="text-danger fw-light fst-italic" v-if="form.errors.value && form.errors.value[attr.id]" style="color: var(--danger)">{{ form.errors.value[attr.id] }}</div>
              </VField>
              <VField v-if="attr.type === 'text'">
                <VLabel>{{ attr.name }}</VLabel>
                <VControl>
                  <VTextarea
                    class="textarea"
                    rows="4"
                    placeholder="Điền thông tin..."
                    autocomplete="off"
                    autocapitalize="off"
                    spellcheck="true"
                    v-model="form.value[attr.id]"
                  />
                </VControl>
                <div class="text-danger fw-light fst-italic" v-if="form.errors.value && form.errors.value[attr.id]" style="color: var(--danger)">{{ form.errors.value[attr.id] }}</div>
              </VField>
              <VField v-if="attr.type === 'select'">
                <VLabel>{{ attr.name }}</VLabel>
                <VControl>
                  <Multiselect
                    :mode="attr.options.multiple ? 'multiple' : 'single'"
                    v-model="form.value[attr.id]"
                    :valueProp="'id'"
                    :label="'name'"
                    :options="attr.options.data"
                    :max-height="145"
                    placeholder="Chọn Infra type"
                  />
                </VControl>
                <div class="text-danger fw-light fst-italic" v-if="form.errors.value && form.errors.value[attr.id]" style="color: var(--danger)">{{ form.errors.value[attr.id] }}</div>
              </VField>
              <VField v-if="attr.type === 'file'">
                <VLabel>{{ attr.name }}</VLabel>
                <VControl>
                  <input v-if="attr.options.multiple"
                    type="file" 
                    :name="`${attr.id}_files[]`"
                    @input="form.value[attr.id] = $event.target?.files"
                    multiple />
                  <input v-else
                    type="file" 
                    :name="`${attr.id}_files[]`"
                    @input="form.value[attr.id] = $event.target?.files" />
                </VControl>
                <div class="text-danger fw-light fst-italic" v-if="form.errors.value && form.errors.value[attr.id]" style="color: var(--danger)">{{ form.errors.value[attr.id] }}</div>
              </VField>
            </div>
          </div>

        </div>
      </div>
    </div>
  </form>
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/components/forms-outer';

.form-layout {
  max-width: 740px;
  margin: 0 auto;
}
.custom-checkbox-outline .checkbox {
  padding-left: 0;
}
</style>

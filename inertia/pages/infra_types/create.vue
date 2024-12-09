<script setup lang="ts">
import NProgress from 'nprogress'
import { Link, useForm } from '@inertiajs/vue3'
// import the component
// import Treeselect from 'vue3-treeselect'
  import Treeselect from 'vue3-treeselect-ts'
  // import the styles
import 'vue3-treeselect/dist/vue3-treeselect.css'

// import Multiselect from '@vueform/multiselect'
// import '@vueform/multiselect/themes/default.css'
import { Sortable } from "sortablejs-vue3";

defineProps<{
  infraTypeTree: []
}>()

const attrSelectOptionText = ref('')
const isLoading = ref(false)

const { y } = useWindowScroll()

const isStuck = computed(() => {
  return y.value > 30
})

const attrTypes = ['string', 'number', 'boolean', 'text', 'select', 'file']

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

const form = useForm({
  name: null,
  code: null,
  description: '',
  parentId: null,
  attachments: [],
  options: {},
  attrs: Array<formAttr>(),
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
    attr.options.display.span = parseInt(attr.options.display.span.toString())
  })
  return attrs
}

const onSubmit = () => {
  console.log('Form submitted!')
  form.transform((data) => ({
    ...data,
    // options: data.options ? (JSON.parse(data.options) ?? {}) : {},
    parentId: data.parentId === null ? 0 : data.parentId,
    attrs: transformAttrs(data.attrs)
  })).post('/infra-types', {
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

function addNewAttr() {
  let attr: formAttr = {
    id: 0,
    name: '',
    code: '',
    options: {
      required: 0,
      multiple: 0,
      display: {
        span: 12
      },
      data: Array<itemAttrOption>()
    },
    type: 'string'
  }
  form.attrs.push(attr)
}

function addAttrSelectOption(index: number) {
  if (attrSelectOptionText.value.trim() == '') {
    return
  }
  form.attrs[index].options.data.push({
    id: form.attrs[index].options.data.length + 1, 
    name: attrSelectOptionText.value
  });
  attrSelectOptionText.value = ''
}

function removeAttrSelectOption(index: number, optionIndex: number) {
  if (form.attrs[index].options.data.length === 1) {
    form.attrs[index].options.data = Array<itemAttrOption>()
  } else {
    form.attrs[index].options.data.splice(optionIndex, 1)
  }
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
            <h3>Tạo Infra Type</h3>
          </div>
          <div class="right">
            <div class="buttons">
              <Link href="/infra-types">
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
                <VLabel>Tên loại Infra</VLabel>
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
                <VLabel>Parent</VLabel>
                <VControl>
                  <treeselect v-model="form.parentId" :multiple="false" :options="infraTypeTree" />
                  <!-- <Multiselect
                    v-model="form.parentId"
                    :attrs="{ id }"
                    placeholder="Select a size"
                    :options="[
                      '1-5 Employees',
                      '5-25 Employees',
                      '25-50 Employees',
                      '50-100 Employees',
                      '100+ Employees',
                    ]"
                  /> -->
                </VControl>
              </VField>
            </div>
            <div class="column is-12">
              <VField>
                <VLabel>Mô tả</VLabel>
                <VControl>
                  <VTextarea
                    class="textarea"
                    rows="4"
                    placeholder="Mô tả ngắn gọn về loại Infra này..."
                    autocomplete="off"
                    autocapitalize="off"
                    spellcheck="true"
                    v-model="form.description"
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
            <div class="column is-8">
              <h4>Attrs</h4>
              <p>Cấu hình thuộc tính cho Infra type</p>
            </div>
            <div class="column is-4 has-text-right">
              <VAction @click.prevent="addNewAttr">Thêm Attr</VAction>
            </div>
          </div>

          <div v-if="form.attrs.length" class="custom-card">
            <VCardAdvanced v-for="(attr, index) in form.attrs" class="mb-4" >
              <template #header-left>
                <VField style="min-width: 200px;">
                  <!-- <VLabel>Tên Attr</VLabel> -->
                  <VControl>
                    <Multiselect
                      v-model="form.attrs[index].type"
                      placeholder="Chọn loại"
                      :options="attrTypes"
                    />
                  </VControl>
                </VField>
              </template>
              <template #header-right>
                <VIconButton
                  icon="lucide:trash"
                  circle
                />
              </template>
              <template #content>
                <div class="columns is-multiline">
                  <div class="column is-6">
                    <VField>
                      <VLabel>Tên Attr</VLabel>
                      <VControl>
                        <VInput
                            type="text"
                            v-model="form.attrs[index].name"
                        />
                      </VControl>
                    </VField>
                  </div>
                  <div class="column is-6">
                    <VField>
                      <VLabel>Span</VLabel>
                      <VControl>
                        <VInput
                            type="text"
                            v-model="form.attrs[index].options.display.span"
                        />
                      </VControl>
                    </VField>
                  </div>
                  <div class="column is-12">
                    <VField>
                      <VLabel>Bắt buộc</VLabel>
                      <VControl>
                         <!-- <VSwitchBlock v-model="form.attrs[index].required" label="Bắt buộc" /> -->
                         <VSwitchSegment
                          class="is-justify-content-flex-start"
                          v-model="form.attrs[index].options.required"
                          label-true="Có"
                          label-false="Không"
                          color="primary"
                        />
                      </VControl>
                    </VField>
                  </div>
                  <div class="column is-12" v-if="['select', 'file'].includes(form.attrs[index].type)">
                    <VField>
                      <VControl>
                        <VRadio
                          v-model="form.attrs[index].options.multiple"
                          :value="0"
                          label="Chọn 1"
                          color="primary"
                        />
                        <VRadio
                          v-model="form.attrs[index].options.multiple"
                          :value="1"
                          label="Chọn nhiều"
                          color="primary"
                        />
                      </VControl>
                    </VField>
                  </div>
                  <div class="column is-12" v-if="['select'].includes(form.attrs[index].type)">
                    <VCardAdvanced class="mb-4" >
                      <template #header-left>
                        <VField style="min-width: 200px;">
                          <!-- <VLabel>Tên Attr</VLabel> -->
                          <VControl>
                            <VInput
                              type="text"
                              placeholder="Nhập tên option rồi enter/+"
                              v-model="attrSelectOptionText"
                              @keydown.enter.prevent="addAttrSelectOption(index)"
                            />
                          </VControl>
                        </VField>
                      </template>
                      <template #header-right>
                        <VIconButton
                          icon="lucide:plus"
                          circle
                          @click.prevent="addAttrSelectOption(index)"
                        />
                      </template>
                      <template #content>
                        <div v-if="form.attrs[index].options.data.length">
                          <Sortable
                            :list="form.attrs[index].options.data"
                            item-key="id"
                            tag="div"
                            :options="{}"
                          >
                            <template #item="{element}">
                              <div class="draggable mb-2" :key="element.id">
                                <VTags addons>
                                  <VTag :label="element.name" color="primary" />
                                  <VTag remove class="is-clickable" @click.prevent="removeAttrSelectOption(index, element.id - 1)" />
                                </VTags>
                              </div>
                            </template>
                          </Sortable>
                        </div>
                      </template>
                    </VCardAdvanced>
                  </div>
                </div>
              </template>
              <template #footer-left></template>
            </VCardAdvanced>
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
.custom-card .card-foot {
  display: none !important;
}
</style>

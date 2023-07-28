<template>
  <form class="blog-form" @submit.prevent="onSubmitArticle">
    <label class="title">
      <span>标题</span>
      <input
        pattern=".{2,30}"
        title="2~30个字符"
        required
        v-model="addArticle.title"
      />
    </label>

    <label class="desc">
      <span>描述</span>
      <textarea
        required
        name="描述"
        v-model="addArticle.description"
      ></textarea>
    </label>

    <div class="group">
      <label class="categ">
        <span>选择分类</span>
        <select required v-model="addArticle.categoryName">
          <option value="">请选择</option>
          <option
            v-for="categ in categList"
            :key="categ.id"
            :value="categ.categoryName"
          >
            {{ categ.categoryName }}
          </option>
        </select>
      </label>

      <label for="tag">
        <span>添加标签</span>
        <tag-selector v-model:articletag="addArticle.tagNameList" />
      </label>
    </div>
    <div class="group">
      <label class="img">
        <span>选择预览图片</span>
        <input
          type="file"
          id="desc-img"
          name="预览图片"
          accept="image/png, image/jpeg"
        />
      </label>
      <button
        :disabled="!addArticle.content?.length"
        type="submit"
        class="mild-effect"
      >
        提交
      </button>
    </div>

    <md-editor
      class="editor"
      :theme="Store.$state.config.theme as Themes"
      style="max-width: 100vw"
      v-model="addArticle.content"
      @onChange="onChange"
      @onUploadImg="onUploadImg"
      @onSave="onSave"
    />

    <Popup ref="popupRef" />
  </form>
</template>

<script setup lang="ts">
import {
  uploadImg,
  getCateg,
  updateAnBlog,
  IAddAnBlog,
  ICategItem,
  addAnBlog,
  baseURL,
} from '@/api'
import { MdEditor, Themes } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { onMounted, ref, watchEffect } from 'vue'
import Popup from '@/components/Notice.vue'
import { CNotice } from '@/utils/type'
import AdminStore from '@/store/index'
import TagSelector from '@/components/TagSelector.vue'
const Store = AdminStore()
let popupRef = ref<CNotice | null>(null)

const categList = ref<ICategItem[]>([])
const getCategList = async () => {
  const { data: aaa } = await getCateg()
  categList.value = aaa as unknown as ICategItem[]
}

let addArticle = ref<IAddAnBlog>({
  title: '',
  description: '',
  categoryName: '',
  tagNameList: [],
  content: '',
})

const props = defineProps({
  id: String,
  title: String,
  description: String,
  categoryName: String,
  tagNameList: Array,
  content: String,
})

watchEffect(() => {
  addArticle.value.title = props.title as string
  addArticle.value.description = props.description as string
  addArticle.value.categoryName = props.categoryName as string
  addArticle.value.tagNameList = props.tagNameList as string[]
  addArticle.value.content = props.content as string
})

const onSubmitArticle = async () => {
  try {
    if (props.id) {
      await updateAnBlog({ ...addArticle.value, id: props.id })
      popupRef.value?.notice.success(`文章${addArticle.value.title}更新成功`)
    } else {
      await addAnBlog(addArticle.value)
      popupRef.value?.notice.success(`文章${addArticle.value.title}添加成功`)
    }
  } catch (error: any) {
    popupRef.value?.notice.error(error.toString())
  }
}

// 任何更改
let timeoutId: number | null | undefined = null
const onChange = (val: any) => {
  console.log('onChange val', val)
  // 如果已经有一个定时器在计时，则重置它
  if (timeoutId) clearTimeout(timeoutId)

  // 设置一个新的定时器，在 3 秒后执行操作
  timeoutId = setTimeout(() => {
    console.log('操作执行了')
    // onSave(addArticle.content)
    // 在这里执行所需的操作
    timeoutId = null
  }, 3000)
}
// 点击保存
const onSave = (v: string, h: Promise<any> | undefined) => {
  console.log('onSave', v)
  if (h) {
    h.then((html: any) => {
      console.log(html)
    })
  }
}
// 上传图片
const onUploadImg = async (files: any, callback: any) => {
  console.log('files', files)
  console.log('callback', callback)
  const res = await Promise.all(
    files.map((file: string | Blob) => {
      return new Promise((rev, rej) => {
        const form = new FormData()
        form.append('file', file)
        uploadImg({ data: file })
          .then((res) => {
            rev(res)
          })
          .catch((error) => rej(error))
      })
    }),
  )
  callback(
    res.map((item) => {
      if (item.length) {
        return `${baseURL}/${item[0]}`
      } else {
        popupRef.value?.notice.error(`图片上传失败！`)
      }
    }),
  )
}

onMounted(() => {
  // getTagList()
  getCategList()
})
</script>

<style lang="scss">
.blog-form {
  display: flex;
  flex-direction: column;
  margin-inline: auto;
  max-width: calc(100vw - 10rem);
  gap: $gap;
}

.add-tag {
  position: relative;
}

label {
  display: flex;
  flex-direction: column;
  max-width: 60rem;
}

.group {
  max-width: 60rem;
  display: flex;
  gap: $gap;

  > * {
    flex: 1;
  }
}

@media screen and (max-width: 45rem) {
  .blog-form {
    max-width: calc(100vw - 2rem);
  }
}
</style>

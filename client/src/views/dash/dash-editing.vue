<template>
  <BlogEditor
    :id="editId"
    :title="addArticle.title"
    :description="addArticle.description"
    :categoryName="addArticle.categoryName"
    :tagNameList="addArticle.tagNameList"
    :content="addArticle.content"
  />
</template>

<script setup lang="ts">
import { getDetailById, IAddAnBlog } from '@/api'
import BlogEditor from '@/components/BlogEditor.vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

// interface IGetDetails {
//   id: string
//   title: string
//   description: string
//   categoryName: string
//   tagNameList: string[]
//   content: string
//   descImg?: string
// }

const addArticle = ref<IAddAnBlog>({
  title: '',
  description: '',
  categoryName: '',
  tagNameList: ['asdf', 'sdf', '', 'asdf'],
  content: '',
})

const editId = ref('')

onMounted(async () => {
  const { data: sdafsd } = await getDetailById({
    id: route.params.id as string,
  })
  console.log('sdafsd', sdafsd)
  editId.value = sdafsd.id
  addArticle.value.title = sdafsd.title
  addArticle.value.description = sdafsd.description
  addArticle.value.categoryName = sdafsd.categoryName
  addArticle.value.tagNameList = sdafsd.tagNameList
  addArticle.value.content = sdafsd.content
})
</script>

<style lang="scss"></style>

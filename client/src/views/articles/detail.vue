<template>
  <main>
    <aside class="sidebar">
      sidebar loading:{{ loading }}

      <!-- <MdCatalog :scrollElementOffsetTop="headerHeightPx" class="aside-content" :editorId="id" -->
      <MdCatalog
        :scrollElementOffsetTop="headerHeightPx"
        class="aside-content"
        :editorId="blogs.id"
        :scrollElement="scrollElement"
      />
    </aside>

    <!-- <div title="没有查询到任何文章！" v-show="!loading && !blogs.length" class="not-found">
    <h2 class="text" data-text="Noresult...">Noresult...</h2>
  </div> -->
    <article>
      <h1>{{ blogs.title }}</h1>

      <MdPreview
        class="main"
        :editorId="blogs.id"
        :modelValue="blogs.content"
      />
    </article>
  </main>
</template>

<script setup lang="ts">
import { IBlogDetail, getDetailById } from '@/api/index'
import { reactive, ref, watchEffect } from 'vue'
// import router from '@/router';
import { useRoute } from 'vue-router'
const route = useRoute()

import { MdPreview, MdCatalog } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
const scrollElement = document.documentElement
// const headerHeightPx = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) * parseInt(getComputedStyle(document.documentElement).fontSize)
const headerHeightPx =
  3 * parseInt(getComputedStyle(document.documentElement).fontSize)

// let blogs = ref({})
let blogs = reactive<IBlogDetail>({
  id: '',
  title: '',
  description: '',
  content: '',
  categoryName: '',
  tagNameList: [],
  postAt: '',
  editAt: '',
  descImg: '',
})

// const count = ref(0)
// const target = ref<HTMLElement | null>(null)
// const scrollToTarget = () => {
//   const target = document.querySelector('.search-info')
//   // const navHeight = document.querySelector('header')?.offsetHeight
//   // console.log('navHeight', navHeight)
//   // console.log('navHeight', navHeight)
//   // target.value?.scrollIntoView({ block: "start" })
//   target?.scrollIntoView({
//     block: 'start',
//     behavior: 'smooth',
//     inline: 'nearest',
//   } as any)
// }
// const totalPage = ref(0)
// const currentPage = ref(0)

// const keyword = ref('')

const loading = ref(false)

// let lastSearchTime = 0

// let timeout = 100

// const isCurrent = (categ: ICategItem) => {
//   return categ.id == route.params.id
// }

// const searchInfo = computed(() => {
//   const queryKeyword = route.params.id
//     ? (route.params.id as string)
//     : ''

//   const displayKeyword =
//     queryKeyword.length < 6
//       ? queryKeyword
//       : queryKeyword.substring(0, 5) + '...'

//   const str = route.params.id
//     ? route.params.id == '无'
//       ? `未分类文章\n`
//       : `「${displayKeyword}」分类\n`
//     : `全部文章\n`
//   const searching = `${str}加载中......`
//   const success = `${str}共${count.value}条结果`
//   const nores = `${str}没有结果...`

//   return loading.value ? searching : count.value ? success : nores
// })

// const onSearch = () => {
//   keyword.value
//     ? router.push({ path: '/articles', query: { keyword: keyword.value } })
//     : router.push({ path: '/articles' })
// }

// const safeName: ComputedRef<string> = computed(() => {
//   return route.params.id ? decodeURIComponent(route.params.id as string) : '无'
// })

const getBlog = async () => {
  loading.value = true
  // const now = Date.now()
  // if (now - lastSearchTime > timeout) {
  // lastSearchTime = now
  // const paramsCategName = route.params.id
  //   ? route.params.id
  //   : '无'
  // const page = route.query.page ? Number(route.query.page) : 1
  const { data } = await getDetailById({
    id: route.params.id as string,
  })
  console.log('data', data)
  blogs = data
  // count.value = data.totalCount
  // totalPage.value = data.totalPages
  // currentPage.value = data.currentPage
  loading.value = false
  // }
}
// const toCateg = (categ: string) => {
//   router.push(`/categories/${encodeURIComponent(categ)}`)
//   scrollToTarget()
// }

// const categList = ref<ICategItem[]>([])

// const nowCategoryName = ref('')

// const getCategList = async () => {
//   const aaa = await getCateg()
//   categList.value = aaa.data
// }

// getCategList()

console.log('route', route)
console.log('route', route)
console.log('route', route)
watchEffect(() => {
  // nowCategoryName.value = route.params.id as string
  console.log('route.params.id', route.params.id)
  getBlog()
})
</script>

<style lang="scss" scoped>
aside {
  margin-inline: $gap-s;
  // position: sticky;
  // top: $gap-xl + $gap;
  align-self: start;
  grid-column: 2 / 3;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  gap: $gap;
  height: 100%;
  max-width: 20rem;
  * {
    word-break: break-word;
    word-wrap: break-word;
  }
}

.content {
  white-space: pre-wrap;
}
.md-editor-dark {
  --md-bk-color: #333 !important;
}
</style>

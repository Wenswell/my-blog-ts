<template>
  <main>
    <aside class="sidebar">
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
      :theme="getTheme"
      />
    </article>
  </main>
</template>

<script setup lang="ts">
import { IBlogDetail, getDetailById } from '@/api/index'
import { computed, ref, watchEffect } from 'vue'
// import router from '@/router';
import { useRoute } from 'vue-router'
const route = useRoute()

import { MdPreview, MdCatalog,Themes } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import AdminStore from '@/store/index'
const Store = AdminStore()
const getTheme = computed(()=>{
  return Store.$state.config.theme as Themes
})
const scrollElement = document.documentElement
// const headerHeightPx = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) * parseInt(getComputedStyle(document.documentElement).fontSize)
const headerHeightPx =
  3 * parseInt(getComputedStyle(document.documentElement).fontSize)

// let blogs = ref({})
let blogs = ref<IBlogDetail>({
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

const loading = ref(false)

const getBlog = async () => {
  loading.value = true
  const { data } = await getDetailById({
    id: route.params.id as string,
  })
  blogs.value = data
  loading.value = false
}

watchEffect(() => {
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

.aside-content {
  top: $gap-xl + $gap;
  position: sticky;
}

.content {
  white-space: pre-wrap;
}

.md-editor-dark {
  --md-bk-color: #333 !important;
}

@media screen and (max-width: 45rem) {
  .aside-content {
    display: none;
  }
}
</style>

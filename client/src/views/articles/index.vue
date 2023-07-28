<template>
  <main>
    <aside class="sidebar">
      <div class="search-info">
        {{ searchInfo }}
      </div>

      <!-- <div class="search-box">
        <label class="search">
          <input
            @keydown.enter="onSearch"
            id="search"
            class="search_field"
            type="search"
            placeholder=" "
            v-model="keyword"
          />
          <span class="search_label">输入关键词</span>
        </label>
        <button
          :disabled="loading"
          :aria-disabled="loading"
          class="search effect"
          @click="onSearch"
        >
          搜索文章
          <i
            class="ri-loop-right-line loading-icon"
            :class="{ loading: loading }"
          ></i>
        </button>
      </div> -->
      <SearchBox
        v-model:keyword="keyword"
        :loading="loading"
        @on-search="onSearch"
      />

      <Pagination
        @handleClick="scrollToTarget"
        to-path="/articles"
        :total-page="totalPage"
        :current-page="currentPage"
      />
    </aside>
    <div
      title="没有查询到任何文章！"
      v-show="!loading && !blogs.length"
      class="not-found"
    >
      <h2 class="text" data-text="Noresult...">Noresult...</h2>
    </div>

    <PostList :blogs="blogs" />
  </main>
</template>

<script setup lang="ts">
import PostList from '@/components/PostList.vue'
import { IBlogPrew, searchBlogs } from '@/api/index'
import { computed, ref, watchEffect } from 'vue'
import router from '@/router'
import { useRoute } from 'vue-router'
import Pagination from '@/components/Pagination.vue'
import SearchBox from '@/components/SearchBox.vue'
const route = useRoute()

let blogs = ref<IBlogPrew[]>([])

const count = ref(0)
const totalPage = ref(0)
const currentPage = ref(0)

const keyword = ref('')

const loading = ref(false)

let lastSearchTime = 0

let timeout = 100

const scrollToTarget = () => {
  const target = document.querySelector('.search-info')
  console.log("target", target)
  // const navHeight = document.querySelector('header')?.offsetHeight
  // console.log('navHeight', navHeight)
  // console.log('navHeight', navHeight)
  // target.value?.scrollIntoView({ block: "start" })
  target?.scrollIntoView({
    block: 'start',
    behavior: 'smooth',
    inline: 'nearest',
  } as any)
}

const searchInfo = computed(() => {
  const queryKeyword = route.query.keyword
    ? (route.query.keyword as string)
    : ''

  const displayKeyword =
    queryKeyword.length < 6
      ? queryKeyword
      : queryKeyword.substring(0, 5) + '...'

  const str = route.query.keyword ? `搜索「${displayKeyword}」\n` : `全部文章\n`
  const searching = `${str}加载中......`
  const success = `${str}共${count.value}条结果`
  const nores = `${str}没有结果...`

  return loading.value ? searching : count.value ? success : nores
})

const onSearch = () => {
  keyword.value
    ? router.push({ path: '/articles', query: { keyword: keyword.value } })
    : router.push({ path: '/articles' })
}

const handleSearch = async () => {
  window.scrollTo(0, 0)

  loading.value = true
  const now = Date.now()
  if (now - lastSearchTime > timeout) {
    lastSearchTime = now
    const { data } = await searchBlogs(route.query)
    blogs.value = data.blogs
    count.value = data.totalCount
    totalPage.value = data.totalPages
    currentPage.value = data.currentPage
    loading.value = false
    scrollToTarget()
  }
}

watchEffect(() => {
  keyword.value = route.query.keyword as string
  handleSearch()
})
// onMounted(()=>{
//   window.scrollTo(0, 0)
// })
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
}

.search-info {
  scroll-margin-top: $gap-xl + $gap;
  white-space: pre-wrap;
  margin-block: $gap;
  text-align: center;
}

.not-found {
  max-width: 42rem;
  overflow: hidden;

  .text {
    font-weight: bolder;
    position: relative;
    font-size: max(4vw, 6vh);
    -webkit-text-stroke: min(0.2vw, 0.2vh) hsla(0, 0%, 50%, 0.5);
    text-transform: uppercase;
    @include unset_bg_white_txt;

    &::before {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 100%;
      -webkit-text-stroke: 0vw currentColor;
      border-right: 2px solid;
      @include red_mild_clr_border_clr;
      overflow: hidden;
      animation: to-right 20s linear infinite;
    }
  }
}

@keyframes to-right {
  0%,
  10%,
  100% {
    width: 0;
  }

  70%,
  90% {
    width: max(4.3vw * 6, 6vh * 6);
  }
}

@media screen and (max-width: 45rem) {
  aside {
    top: 0;
    margin: 0;
    width: 100%;
    position: static;
    display: grid;
    grid-template-columns: 1fr 1fr;

    .pagination {
      grid-column: 1/3;
    }

    .search-info {
      scroll-margin-top: 110rem;
      all: unset;
      white-space: pre-wrap;
      grid-column: 2;
      grid-row: 1;
      align-self: center;
      justify-self: center;
    }

    .search-box {
      grid-column: 1;
      grid-row: 1;
    }
  }
}
</style>

<template>
  <!-- <main> -->

  <aside class="sidebar">
    <div class="search-info">
      {{ searchInfo }}
    </div>
    <!-- 
    <div class="search-box">
      <label class="search">
        <input @keydown.enter="onSearch" id="search" class="search_field" type="search" placeholder=" " v-model="keyword">
        <span class="search_label">输入关键词</span>
      </label>
      <button :disabled="loading" :aria-disabled="loading" class="search effect" @click="onSearch">搜索文章
        <i class="ri-loop-right-line loading-icon" :class="{ loading: loading }"></i>
      </button>
    </div>
 -->
    <ul class="tag-box">
      <li
        :style="{ zoom: Math.log10(tag.count + 10) - 0.6 }"
        @click="scrollToTarget"
        v-for="tag in tagList"
        :key="tag.id"
      >
        <router-link :to="'/tags/' + tag.tagName">
          {{ tag.tagName }}
          <!-- <span>{{ tag.count }}</span> -->
        </router-link>
      </li>
    </ul>

    <Pagination
      to-path="/tags"
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

  <!-- </main> -->
</template>

<script setup lang="ts">
import PostList from '@/components/PostList.vue'
import { IBlogPrew, ITagItem, getTag, getBlogByTagName } from '@/api/index'
import { computed, ref, watchEffect } from 'vue'
// import router from '@/router';
import { useRoute } from 'vue-router'
import Pagination from '@/components/Pagination.vue'
const route = useRoute()

let blogs = ref<IBlogPrew[]>([])

const count = ref(0)
// const target = ref<HTMLElement | null>(null)
const scrollToTarget = () => {
  const target = document.querySelector('.search-info')

  const navHeight = document.querySelector('header')?.offsetHeight
  console.log('navHeight', navHeight)
  console.log('navHeight', navHeight)
  // target.value?.scrollIntoView({ block: "start" })
  target?.scrollIntoView({
    block: 'start',
    behavior: 'smooth',
    inline: 'nearest',
  } as any)
}
const totalPage = ref(0)
const currentPage = ref(0)

// const keyword = ref('')

const loading = ref(false)

// let lastSearchTime = 0

// let timeout = 100

const searchInfo = computed(() => {
  const queryKeyword = route.params.tagName
    ? (route.params.tagName as string)
    : ''

  const displayKeyword =
    queryKeyword.length < 6
      ? queryKeyword
      : queryKeyword.substring(0, 5) + '...'

  const str = route.params.tagName
    ? route.params.tagName == '无'
      ? `未标签文章\n`
      : `「${displayKeyword}」标签\n`
    : `全部文章\n`
  const searching = `${str}加载中......`
  const success = `${str}共${count.value}条结果`
  const nores = `${str}没有结果...`

  return loading.value ? searching : count.value ? success : nores
})

// const onSearch = () => {
//   keyword.value
//     ? router.push({ path: '/articles', query: { keyword: keyword.value } })
//     : router.push({ path: '/articles' })
// }

const handleSearch = async () => {
  loading.value = true
  // const now = Date.now()
  // if (now - lastSearchTime > timeout) {
  // lastSearchTime = now
  const paramsTagName = route.params.tagName ? route.params.tagName : '无'
  const page = route.query.page ? Number(route.query.page) : 1
  const { data } = await getBlogByTagName({
    tagName: paramsTagName as string,
    page,
  })
  blogs.value = data.blogs
  count.value = data.totalCount
  totalPage.value = data.totalPages
  currentPage.value = data.currentPage
  loading.value = false
  // }
}

const tagList = ref<ITagItem[]>([])

const nowTagName = ref('')

const getTagList = async () => {
  const aaa = await getTag()
  tagList.value = aaa.data
}

getTagList()

console.log('route', route)
console.log('route', route)
console.log('route', route)
watchEffect(() => {
  nowTagName.value = route.params.tagName as string
  handleSearch()
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
}

.tag-box {
  margin-bottom: $gap;
  display: block;
  // padding-bottom: $gap;
  // display: flex;
  // flex-wrap: wrap;
  // gap: $gap-xs $gap-s;
  // justify-content: center;

  li {
    justify-content: normal;
    display: inline-block;
    outline: solid;
    padding-inline: calc($gap-s/2) $gap-s;
    margin-top: $gap-s;
    margin-right: $gap-s;
    // flex-basis: 40%;
    // flex-grow: 1;
    // gap: $gap-px;
    // position: relative;
    // overflow: hidden;
    // @include mild_bg_prime_txt;

    a {
      // display: block;
      // text-align: center;
      // display: flex;
      // align-items: center;
      // justify-content: center;
      // padding-block: $gap;
    }

    span {
      // top: -$gap-s;
      // right: -$gap;
      // font-weight: bold;
      // position: absolute;
      // right: 0;
      // font-size: $fz-xxl;
      // mix-blend-mode: plus-lighter;
      // opacity: 0.05;
    }
  }
}

.search-info {
  // https://developer.mozilla.org/docs/Web/CSS/scroll-margin
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
    grid-template-columns: 1fr;

    .search-info {
      all: unset;
      scroll-margin-top: $gap-xl + $gap-s;
      white-space: normal;
      grid-column: 1;
      grid-row: 2;
      align-self: center;
      justify-self: center;
    }

    .tag-box {
      scroll-margin-top: $gap-xl + $gap;

      li span {
        top: -$gap;
        font-size: $fz-xxxl;
      }
    }
  }
}
</style>

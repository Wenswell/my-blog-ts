<template>
  <main>
    <aside class="sidebar">
      <div class="search-info">
        {{ searchInfo }}
      </div>
      <ul class="category-box _selector">
        <li
          :class="{ active: isCurrent(categ) }"
          v-for="categ in categList"
          :key="categ.id"
        >
          <button
            @click="toCateg(categ.categoryName)"
            :title="isCurrent(categ) ? '就在这里' : '点击前往'"
            :aria-label="
              isCurrent(categ)
                ? '当前页面为' + categ.categoryName + '分类'
                : '点击前往' + categ.categoryName + '分类'
            "
            :aria-current="isCurrent(categ) ? 'page' : false"
          >
            <i
              :class="
                isCurrent(categ) ? 'ri-folder-open-line' : 'ri-folder-line'
              "
            ></i>
            {{ categ.categoryName }}
            <span>{{ categ.count }}</span>
          </button>
        </li>
      </ul>

      <Pagination
        @handleClick="scrollToTarget"
        to-path="/categories"
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
import {
  IBlogPrew,
  ICategItem,
  getCateg,
  getBlogByCategName,
} from '@/api/index'
import { computed, ComputedRef, ref, watchEffect } from 'vue'
// import router from '@/router';
import { useRoute } from 'vue-router'
import Pagination from '@/components/Pagination.vue'
import router from '@/router'
const route = useRoute()

let blogs = ref<IBlogPrew[]>([])

const count = ref(0)
// const target = ref<HTMLElement | null>(null)
const scrollToTarget = () => {
  const target = document.querySelector('.search-info')
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
const totalPage = ref(0)
const currentPage = ref(0)

// const keyword = ref('')

const loading = ref(false)

// let lastSearchTime = 0

// let timeout = 100

const isCurrent = (categ: ICategItem) => {
  return categ.categoryName == safeName.value
}

const searchInfo = computed(() => {
  const queryKeyword = safeName.value ? (safeName.value as string) : ''

  const displayKeyword =
    queryKeyword.length < 6
      ? queryKeyword
      : queryKeyword.substring(0, 5) + '...'

  const str = safeName.value
    ? safeName.value == '无'
      ? `未分类文章\n`
      : `「${displayKeyword}」分类\n`
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

const safeName: ComputedRef<string> = computed(() => {
  return route.params.categoryName
    ? decodeURIComponent(route.params.categoryName as string)
    : '无'
})

const handleSearch = async () => {
  loading.value = true
  // const now = Date.now()
  // if (now - lastSearchTime > timeout) {
  // lastSearchTime = now
  const paramsCategName = safeName.value ? safeName.value : '无'
  const page = route.query.page ? Number(route.query.page) : 1
  const { data } = await getBlogByCategName({
    categoryName: paramsCategName as string,
    page,
  })
  blogs.value = data.blogs
  count.value = data.totalCount
  totalPage.value = data.totalPages
  currentPage.value = data.currentPage
  loading.value = false
  scrollToTarget()
  // }
}
const toCateg = (categ: string) => {
  router.push(`/categories/${encodeURIComponent(categ)}`)
}

const categList = ref<ICategItem[]>([])

const nowCategoryName = ref('')

const getCategList = async () => {
  const aaa = await getCateg()
  categList.value = aaa.data
}

getCategList()

console.log('route', route)
console.log('route', route)
console.log('route', route)
watchEffect(() => {
  nowCategoryName.value = safeName.value as string
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

.category-box {
  display: flex;
  flex-wrap: wrap;
  gap: $gap-xs $gap-s;
  justify-content: center;

  li {
    flex-basis: 40%;
    flex-grow: 1;
    gap: $gap-px;
    position: relative;
    transition: all 150ms;

    button {
      padding-block: $gap;
      position: relative;
    }

    span {
      position: absolute;
      top: -$gap-s;
      right: -$gap;
      right: 0;
      font-weight: 900;
      font-size: $fz-xxl;
      // mix-blend-mode: plus-lighter;
      opacity: 0.1;
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

    .category-box {
      scroll-margin-top: $gap-xl + $gap;

      li span {
        top: -$gap;
        font-size: $fz-xxxl;
      }
    }
  }
}
</style>

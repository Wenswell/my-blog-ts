<template>
  <main>
    <SearchBox
      v-model:keyword="keyword"
      :loading="loading"
      @on-search="onSearch"
      :line="true"
    />
    <div class="filter">
      <div class="filter-categ">
        <label class="label" for="category">选择分类</label>
        <select id="category" @change="onCateg" v-model="categ">
          <option value="">请选择</option>
          <option
            v-for="categ in categList"
            :key="categ.id"
            :value="categ.categoryName"
          >
            {{ categ.categoryName }}
          </option>
        </select>
      </div>
      <div class="filter-tag" :class="{ 'show-all': isShowAll }">
        <button
          class="show"
          :title="isShowAll ? '收起标签' : '展开全部标签'"
          :class="{ close: isShowAll }"
          @click="isShowAll = !isShowAll"
        >
          {{ isShowAll ? '收起标签' : '展开标签' }}
          <i class="ri-arrow-down-double-line"></i>
        </button>

        <button
          :class="{ active: tags.has(tag.tagName) }"
          @click="onTag(tag.tagName)"
          class="tag"
          v-for="tag in tagList"
          :key="tag.id"
        >
          {{ tag.tagName }}
        </button>
      </div>
    </div>
    <div class="search-info">
      {{ searchInfo }}
      <button class="mild-effect" @click="clearAll" v-if="blogs.length === 0">
        清空查询条件
      </button>
    </div>
    <div class="postList">
      <AEditCard
        v-for="blog in blogs"
        :key="blog.id"
        :post="blog"
        @handleClick="deleteBlog"
      />
    </div>

    <!-- <PostList :blogs="blogs" /> -->

    <Pagination
      @handleClick="scrollToTarget"
      to-path="/articles"
      :total-page="totalPage"
      :current-page="currentPage"
    />
    <dialog ref="dialog">
      <div class="delete-card">
        <p class="info">
          <i class="ri-information-line"></i>
          确定删除「{{ deleteBlogTitle }}」吗？
        </p>
        <footer class="handle">
          <button class="cancel mild-effect" @click="dialog?.close()">
            算了
          </button>
          <button class="delete mild-effect" @click="onDelBlog">删了</button>
        </footer>
      </div>
    </dialog>
    <Popup ref="popupRef" />
  </main>
</template>

<script setup lang="ts">
import {
  getCateg,
  getTag,
  IBlogPrew,
  ICategItem,
  ITagItem,
  searchBlogs,
  delBlogById,
} from '@/api/index'
import SearchBox from '@/components/SearchBox.vue'
import Pagination from '@/components/Pagination.vue'
import AEditCard from '@/components/AEditCard.vue'
import Popup from '@/components/Notice.vue'
import router from '@/router'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { CNotice } from '@/utils/type'
import { useRoute } from 'vue-router'
const route = useRoute()
let popupRef = ref<CNotice | null>(null)

const isShowAll = ref(false)

const keyword = ref('')
const categ = ref('')
const tags = ref(new Set<string>())
const loading = ref(false)
let blogs = ref<IBlogPrew[]>([])

const count = ref(0)
const totalPage = ref(0)
const currentPage = ref(0)

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
const handleSearch = async () => {
  window.scrollTo(0, 0)
  loading.value = true
  const { data } = await searchBlogs(route.query)
  blogs.value = data.blogs
  count.value = data.totalCount
  totalPage.value = data.totalPages
  currentPage.value = data.currentPage

  loading.value = false
  scrollToTarget()
}
const handleRouter = ({ type, value }: { type: string; value: string }) => {
  const query = { ...route.query }
  if (!value) {
    delete query[type]
  } else {
    query[type] = value
  }
  delete query['page']
  router.push({ path: '/dash/articles', query })
}

const onSearch = () => {
  handleRouter({ type: 'keyword', value: keyword.value })
}
const onCateg = () => {
  handleRouter({ type: 'categoryName', value: categ.value })
}
const onTag = (tagName: string) => {
  const query = { ...route.query }
  if (tags.value.has(tagName)) {
    tags.value.delete(tagName)
    if (tags.value.size) {
      query.tagNameList = [...tags.value]
    } else {
      delete query['tagNameList']
    }
  } else {
    tags.value.add(tagName)
    query.tagNameList = [...tags.value]
  }
  delete query['page']
  router.push({ path: '/dash/articles', query })
}
const clearAll = () => {
  keyword.value = ''
  categ.value = ''
  tags.value.clear()
  router.push('/dash/articles')
}

const searchInfo = computed(() => {
  const queryKeyword = route.query.keyword
    ? (route.query.keyword as string)
    : ''

  const queryCateg = route.query.categoryName
    ? `分类[ ${route.query.categoryName} ]`
    : ''

  const queryTags = route.query.tagNameList
    ? Array.isArray(route.query.tagNameList)
      ? `标签[ ${route.query.tagNameList.join(', ')} ]`
      : `标签[ ${route.query.tagNameList} ]`
    : ''

  const displayKeyword = queryKeyword
    ? queryKeyword.length < 6
      ? `关键词[ ${queryKeyword} ]`
      : `关键词[ ${queryKeyword.substring(0, 5) + '...'} ]`
    : ''

  const strList = [displayKeyword, queryCateg, queryTags].filter((i) => i)

  const str = strList.length ? strList.join(' & ') : `全部文章`
  const searching = `查询 ${str} 加载中......`
  const success = `查询 ${str} 共${count.value}条结果（第${currentPage.value}/${totalPage.value}页）`
  const nores = `查询 ${str} 没有结果...`

  return loading.value ? searching : count.value ? success : nores
})
watchEffect(() => {
  keyword.value = route.query.keyword as string
  handleSearch()
})

const deleteBlogTitle = ref('')
const deleteBlogId = ref('')
const dialog = ref<HTMLDialogElement | null>(null)
const deleteBlog = ({ id, title }: { id: string; title: string }) => {
  deleteBlogTitle.value = title
  deleteBlogId.value = id
  dialog.value?.showModal()
  console.log(id)
}
const onDelBlog = async () => {
  const reres = await delBlogById({ id: deleteBlogId.value })
  if (deleteBlogId.value === reres.data.deletedId) {
    dialog.value?.close()
    popupRef.value?.notice.success(`文章「${deleteBlogTitle.value}」已删除`)
  }
  handleSearch()
}

const categList = ref<ICategItem[]>([])
const getCategList = async () => {
  const aaa = await getCateg()
  categList.value = aaa.data
}
const tagList = ref<ITagItem[]>([])
const getTagList = async () => {
  const aaa = await getTag()
  tagList.value = aaa.data
}

onMounted(() => {
  getTagList()
  getCategList()
  handleSearch()
  const query = { ...route.query }
  if (query.tagNameList) {
    if (Array.isArray(query.tagNameList)) {
      ;(query.tagNameList as string[]).forEach((tagName) => {
        tags.value.add(tagName)
      })
    } else {
      tags.value.add(query.tagNameList)
    }
  } else {
    tags.value.clear()
  }
  keyword.value = (query.keyword || '') as string
  categ.value = (query.categoryName || '') as string
})
</script>

<style lang="scss" scoped>
.filter {
  margin-top: $gap-s;
  display: grid;
  grid-template-columns: minmax(15rem, 1fr) auto;
  gap: $gap;
  margin-inline: $gap-s;

  .label {
    word-break: keep-all;
  }

  &-categ {
    margin-top: $gap-s;
    display: flex;
    align-items: start;
    gap: $gap-s;

    select {
      width: 100%;
    }
  }

  &-tag {
    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;
    position: relative;

    button {
      background-color: transparent;

      &:where(:hover, :focus-visible) {
        @include mild_bg_prime_txt;
      }
    }

    .show {
      display: flex;
      align-items: baseline;
      word-break: keep-all;
      border: none;

      i {
        transition: transform 200ms;
      }

      &.close {
        i {
          transform: rotate(180deg);
        }
      }
    }

    button.tag {
      border: none;
      margin-left: $gap-s;

      &.active {
        @include prime_bg_white_txt;
      }
    }

    &.show-all {
      flex-wrap: wrap;
    }
  }
}

.search-info {
  scroll-margin-top: $gap-s;
  white-space: pre-wrap;
  margin-block: $gap;
  text-align: center;
}

.postList {
  display: flex;
  flex-direction: column;
  gap: $gap;
  margin-right: $gap-s;
}

dialog {
  border-radius: $gap-xs;
}

.delete-card {
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .info {
    display: flex;
    align-items: center;

    i {
      margin-right: $gap-xs;
      font-size: $fz-l;
      color: #d03050;

      .dark & {
        color: lighten(#d03050, 10);
      }
    }
  }

  .delete {
    color: #d03050;
    margin-inline: $gap-s;

    .dark & {
      color: lighten(#d03050, 10);
    }
  }
}

@media screen and (max-width: 45rem) {
  .filter {
    grid-template-columns: auto;
    gap: $gap-s;
  }
}
</style>

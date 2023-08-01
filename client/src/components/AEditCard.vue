<template>
  <article class="post-preview">
    <div class="main">
      <h3 title="这是标题" class="title">
        {{ post.title }}
      </h3>
      <p class="info">
        <span title="这是分类" class="category">
          <i aria-hidden="true" class="ri-folder-open-line"></i>
          {{ post.categoryName }}
        </span>

        <span
          title="这是标签"
          class="tags"
          v-for="tag in post.tagNameList"
          :key="tag"
        >
          <i class="ri-hashtag"></i>
          {{ tag }}
        </span>
      </p>
      <p title="这是预览" class="description">
        {{ post.description }}
      </p>
      <footer>
        <time
          :datetime="post.postAt"
        >
          <!-- {{ formatTimestamp(post.postAt) }} -->
        </time>
        <time
          v-if="post.editAt"
          :datetime="post.editAt"
        >
          <!-- (updated {{ formatTimestamp(post.editAt) }}) -->
        </time>
      </footer>
    </div>
    <div class="aside">
      <button
        @click="router.push('/dash/editing/' + post.id)"
        class="edit effect"
      >
        修改
      </button>
      <button
        @click="emits('handleClick', { id: post.id, title: post.title })"
        class="delete effect"
      >
        删除
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import router from '@/router'
// import * as dayjs from 'dayjs'

// const formatTimestamp = (timestamp: string) => {
//   const now = dayjs()
//   const date = dayjs(timestamp)
//   const formatString = now.year() === date.year() ? 'D MMM' : 'D MMM YYYY'
//   // const formatString = now.year() === date.year() ? 'MMM D' : 'YYYY MMM D';
//   return date.format(formatString)
// }

// const rnFormatTS = (ts: string) => {
//   return dayjs(ts).format('YYYY-MM-DD HH:mm:ss')
// }

interface Post {
  id: string
  title: string
  description: string
  categoryName: string
  tagNameList?: string[]
  postAt: string
  editAt?: string
  img?: string
}

defineProps<{
  post: Post
}>()

const emits = defineEmits(['handleClick'])
</script>

<style lang="scss" scoped>
/* 样式相关 */

.post-preview {
  // 样式代码
  padding: $gap $gap-s;
  box-shadow:
    -1px 1px 1px min(0.2vw, 0.2vh) hsla(0, 0%, 50%, 0.25),
    1px 1px min(0.5vw, 0.5vh) 1px hsla(0, 0%, 50%, 0.25);
  display: flex;
}

.main {
  flex-grow: 1;
}

.aside {
  display: flex;
  flex-direction: column;
  gap: $gap-s;

  button {
    word-break: keep-all;
  }

  .edit {
    flex: 1;
  }
}

.title {
  font-size: $fz-xl;
  font-weight: normal;
}

.info {
  margin-block: $gap-s;
  font-size: $fz-s;
  word-wrap: normal;
  word-break: break-all;
  @include unset_bg_grey_txt;
  opacity: 0.9;

  .category {
    margin-right: $gap;

    i {
      margin-right: $gap-px;
    }

    a {
      @include foucs_mild_txt;
    }
  }

  .tags a {
    @include foucs_mild_txt;
    margin-right: $gap-xs;

    i {
      margin-right: -5px;
    }
  }
}

.description {
  margin-block: $gap-s;
}

time {
  font-size: $fz-xs;
  @include unset_bg_grey_txt;
  opacity: 0.5;
}

@media screen and (max-width: 45rem) {
  .post-preview {
    // 样式代码
    box-shadow:
      -1px 1px min(0.5vw, 0.5vh) hsla(0, 0%, 50%, 0.25),
      1px 1px min(1vw, 1vh) 1px hsla(0, 0%, 50%, 0.25);
  }
}
</style>

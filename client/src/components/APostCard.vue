<template>
  <!-- <img v-if="post.img" src="../assets/images/1.png" :alt="post.title"> -->
  <article class="post-preview">
    <h3>
      <router-link
        title="这是标题"
        :to="'/articles/' + post.id"
        class="title _under"
      >
        {{ post.title }}
      </router-link>
    </h3>
    <p class="info">
      <span title="这是分类" class="category">
        <i aria-hidden="true" class="ri-folder-open-line"></i>
        <router-link :to="'/categories/' + post.categoryName">
          {{ post.categoryName }}
        </router-link>
      </span>

      <span title="这是标签" class="tags">
        <i aria-hidden="true" class="ri-bookmark-line"></i>
        <router-link
          v-for="tag in post.tagNameList"
          :key="tag"
          :to="$router.resolve({ path: '/tags', query: { name: tag } })"
        >
          <i class="ri-hashtag"></i>
          {{ tag }}
        </router-link>
      </span>
    </p>
    <p>
      <router-link
        title="这是预览"
        :to="'/articles/' + post.id"
        class="description"
      >
        {{ post.description }}
      </router-link>
    </p>
    <footer>
      <time
        :datetime="post.postAt"
        :title="'发布时间: ' + rnFormatTS(post.postAt)"
        :aria-label="'发布时间: ' + rnFormatTS(post.postAt)"
      >
        {{ formatTimestamp(post.postAt) }}
      </time>
      <time
        v-if="post.editAt"
        :datetime="post.editAt"
        :title="'更新时间: ' + rnFormatTS(post.editAt)"
        :aria-label="'更新时间: ' + rnFormatTS(post.editAt)"
      >
        (updated {{ formatTimestamp(post.editAt) }})
      </time>
    </footer>
  </article>
</template>

<script setup lang="ts">
import * as dayjs from 'dayjs'

const formatTimestamp = (timestamp: string) => {
  const now = dayjs()
  const date = dayjs(timestamp)
  const formatString = now.year() === date.year() ? 'D MMM' : 'D MMM YYYY'
  // const formatString = now.year() === date.year() ? 'MMM D' : 'YYYY MMM D';
  return date.format(formatString)
}

const rnFormatTS = (ts: string) => {
  return dayjs(ts).format('YYYY-MM-DD HH:mm:ss')
}

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
</script>

<style scoped lang="scss">
/* 样式相关 */

.post-preview {
  // 样式代码
  padding: $gap $gap-s;
  box-shadow:
    -1px 1px 1px min(0.2vw, 0.2vh) hsla(0, 0%, 50%, 0.25),
    1px 1px min(0.5vw, 0.5vh) 1px hsla(0, 0%, 50%, 0.25);

  position: relative;

  .description {
    @include foucs_mild_txt;
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

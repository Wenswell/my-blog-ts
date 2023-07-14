<template>
  <!-- <img v-if="post.img" src="../assets/images/1.png" :alt="post.title"> -->
  <article class="post-preview">
    <h3>
      <router-link :to="'/articles/' + post.id" class="title _under">
        {{ post.title }}
      </router-link>
    </h3>
    <p>
      <router-link :to="'/articles/' + post.id" class="description">
        {{ post.description }}}
      </router-link>
    </p>
    <footer>
      <time :datetime="post.postAt">Posted: {{ formatDate(post.postAt) }}</time>
      <time v-if="post.editAt" :datetime="post.editAt">
        Edited: {{ formatDate(post.editAt) }}
      </time>
    </footer>
  </article>
</template>

<script setup lang="ts">
interface Post {
  id: string
  title: string
  description: string
  postAt: string
  editAt?: string
  img?: string
}

defineProps<{
  post: Post
}>()

// 格式化时间
const formatDate = (timestamp: string) => {
  const date = new Date(parseInt(timestamp) * 1000)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
}
</script>

<style scoped lang="scss">
/* 样式相关 */

.post-preview {
  // 样式代码
  padding: $gap $gap-s;
  border: 1px solid #eee;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;

  .description:where(:hover, :focus-visible) {
    // text-decoration-color: transparent;
    @include __reverse_mild_txt;
    // text-wrap:balance;
    // display: inline-block;
  }
}
</style>

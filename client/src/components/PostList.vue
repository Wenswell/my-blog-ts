<template>
  <section class="articlePrevList">
    <APostCard v-for="post in blogs" :key="post.id" :post="post" />
  </section>
</template>

<script setup lang="ts">
import { IBlogPrew } from '@/api/index'
import APostCard from '@/components/APostCard.vue'

defineProps<{
  blogs: IBlogPrew[]
}>()
</script>

<style lang="scss" scoped>
.articlePrevList {
  // margin: $gap;
  display: flex;
  flex-direction: column;
  gap: $gap;
}

@media screen and (max-width: 45rem) {
  .articlePrevList {
    margin-inline: 0;
  }
}
</style>

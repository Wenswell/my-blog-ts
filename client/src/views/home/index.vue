<template>
  <Header />
  <main>
    <section class="articlePrevList">
      <h2>文章列表</h2>
      <h2>文章列表</h2>
      <h2>文章列表</h2>
      <h2>文章列表</h2>
      <h2>文章列表</h2>
      <h2>文章列表</h2>
      <h2>文章列表</h2>
      <h2>文章列表</h2>
      <h2>文章列表</h2>
      <h2>文章列表</h2>
      <h2>文章列表</h2>
      <h2>文章列表</h2>
      <h2>文章列表</h2>
      <h2>文章列表</h2>
      <h2>文章列表</h2>
      <h2>文章列表</h2>
      <h2>文章列表</h2>
      <h2>文章列表</h2>
      <h2>文章列表</h2>
      <ul>
        <li>
          <a href="/blog1">博客1</a>
        </li>
        <li>
          <a href="/blog2">博客2</a>
        </li>
        <li>
          <a href="/blog3">博客3</a>
        </li>
        <li>
          <a href="/blog3">博客3</a>
        </li>
        <li>
          <a href="/blog3">博客3</a>
        </li>
        <li>
          <a href="/blog3">博客3</a>
        </li>
        <li>
          <a href="/blog3">博客3</a>
        </li>
      </ul>
    </section>
    <aside class="sidebar">
      <h2>作者简介</h2>
      <div>...</div>
    </aside>
  </main>

  <footer>
    <p>powered by myself</p>
  </footer>
  <ModeToggleButton />
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import ModeToggleButton from '@/components/ModeToggleButton.vue'
</script>

<style lang="scss" scoped>
main {
  margin-inline: auto;
  max-width: 60rem;
  min-height: calc(100vh - $gap-xl);
  outline: solid;
  outline-offset: -2px;
  display: grid;
  grid-template-columns: 3fr 1fr;
}

aside {
  position: sticky;
  align-self: start;
  top: $gap-xl;
}

footer {
  display: flex;
  justify-content: center;
  align-items: center;
  @include prime_bg_white_txt;
}

@media screen and (max-width: 45rem) {
  main {
    all: unset;
  }
}
</style>

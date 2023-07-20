<template>
  <Header />
  <main>
    <aside class="sidebar"></aside>
    C:\TOOLs\Gitee2023\my-blog-ts\client\src\views\home\index.vue
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
  // outline: solid;
  // outline-offset: -2px;

  margin-inline: auto;
  max-width: 60rem;
  min-height: calc(100vh - $gap-xl);
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: $gap;
  padding: $gap;
}

aside {
  margin-inline: $gap-s;
  position: sticky;
  align-self: start;
  top: $gap-xl + $gap;
  grid-column: 2 / 3;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  gap: $gap;
}

.search-box {
  display: flex;
  flex-direction: column;
  gap: $gap-s;
  flex: 1;
}

.search-info {
  margin-block: $gap;
  text-align: center;
  flex: 1;
}

.search {
  @include input_label_effect(0);
}

footer {
  grid-column: 1 / 2;
  grid-row: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  @include prime_bg_white_txt;
}

@media screen and (max-width: 45rem) {
  main {
    // all: unset;
    display: flex;
    flex-direction: column;
  }

  aside {
    top: 0;
    margin: 0;
    width: 100%;
    position: static;
    display: grid;
    grid-template-columns: 1fr 1fr;

    .search-info {
      all: unset;
      grid-column: 2;
      grid-row: 1;
    }

    .search-box {
      grid-column: 1;
      grid-row: 1;
    }
  }
}

.loading-icon {
  transition: opacity 100ms;
  opacity: 0;
}

.loading {
  opacity: 1;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>

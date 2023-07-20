<template>
  <Header />
  <main>
    <router-view />
  </main>
  <footer>
    <p>powered by myself</p>
  </footer>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
</script>

<style lang="scss" scoped>
main {
  // outline: solid;
  // outline-offset: -2px;

  margin-inline: auto;
  max-width: 60rem;
  min-height: calc(100dvh - $gap-xl);
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: $gap;
  padding: $gap;
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
}
</style>

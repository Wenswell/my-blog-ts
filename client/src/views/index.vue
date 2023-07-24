<template>
  <Header />
  <router-view v-slot="{ Component }">
    <transition name="route">
      <component :is="Component" />
    </transition>
  </router-view>
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

.route-enter-from {
  opacity: 0;
  filter: blur(10px);
  // transform: translateY(60px);
}
.route-enter-active {
  transition: all 250ms ease-out;
}
.route-leave-active {
  transition: all 100ms ease-out;
}

.route-leave-to {
  opacity: 0;
  filter: blur(10px);
  // transform: translateX(-100px);
}
</style>

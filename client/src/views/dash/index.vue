<template>
  <transition-group appear name="login-form">
    <div key="1" class="container">
      <aside class="sidebar">asfd</aside>
      <main class="content">lorem1000</main>
    </div>
  </transition-group>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.login-form-enter-from {
  opacity: 0;
  filter: blur(10px);
}

.login-form-enter-active {
  transition:
    opacity 400ms,
    filter 200ms;
}

.login-form-leave-active {
  transition:
    opacity 300ms,
    filter 200ms;
}

.login-form-leave-to {
  opacity: 0;
  transform: scale(0.9);
  filter: blur(10px);
  // transform: translateX(-100px);
}
</style>

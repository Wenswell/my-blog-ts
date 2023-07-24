<template>
  <router-view v-slot="{ Component }">
    <transition name="route" mode="out-in" appear>
      <div>
        <component :is="Component" />
      </div>
    </transition>
  </router-view>
</template>
<style lang="scss" scoped>
.route-enter-from {
  opacity: 0;
  transform: translateX(100px);
}
.route-enter-active {
  transition: all 200ms ease-out;
}

.route-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}
</style>

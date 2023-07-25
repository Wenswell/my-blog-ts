<template>
  <router-view v-slot="{ Component }">
    <transition name="route" mode="out-in" appear>
      <div>
        <component :is="Component" />
      </div>
    </transition>
  </router-view>
</template>
<style lang="scss" scoped></style>

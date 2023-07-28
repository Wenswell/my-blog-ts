<!-- appear.vue -->

<template>
  <!-- 显示消息的容器 -->
  <transition name="list" appear>
    <div class="notice-item" v-if="isShow" ref="messageRef">
      {{ message }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const messageRef = ref<HTMLElement | null>(null)
onMounted(() => {
  const nextSibling = messageRef.value?.parentElement?.nextElementSibling
  console.log('nextSibling', nextSibling)
  const grandparent = messageRef.value?.parentElement?.parentElement
  const parent = messageRef.value?.parentElement
  console.log('parent', parent)
  if (parent) parent.style.transition = 'all 1s'
  console.log('grandparent', grandparent)
})

// 接收父组件传过来的 message
defineProps<{
  message: string
}>()

let timer: number

const isShow = ref(true)

onMounted(() => {
  timer = setTimeout(() => {
    isShow.value = false
  }, 11000)
})

onUnmounted(() => {
  clearTimeout(timer)
})
</script>

<style lang="scss" scoped>
/* appear 样式 */
.appear {
  padding: 10px 20px;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.list-enter-from {
  opacity: 0;
  transform: scale(0.85);
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.list-move {
  transition: all 300ms ease;
}

.list-enter-active {
  transition: all 400ms ease;
}

.list-leave-active {
  position: absolute;
  transition: all 200ms ease;
}

.notice-item {
  width: max-content;
  padding: $gap-s $gap;
  @include white_bg_unset_txt;
  box-shadow:
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);

  .info {
    color: #2080f0;

    .dark & {
      color: lighten(#2080f0, 10);
    }
  }

  .success {
    color: #18a058;

    .dark & {
      color: lighten(#18a058, 10);
    }
  }

  .warning {
    color: #f0a020;

    .dark & {
      color: lighten(#f0a020, 10);
    }
  }

  .error {
    color: #d03050;

    .dark & {
      color: lighten(#d03050, 10);
    }
  }
}
</style>

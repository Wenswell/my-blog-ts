<template>
  <transition-group
    v-for="item in isShow"
    :key="item"
    class="notice-ul"
    tag="ul"
    name="list"
    appear
  >
    <div class="notice-li" v-for="item in list" :key="item.id">
      <i v-if="item.text" :class="[typeToIcon(item.type), item.type]"></i>
      {{ item.text }}
    </div>
  </transition-group>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watchEffect } from 'vue'

const typeToIcon = (type: string) => {
  switch (type) {
    case 'success':
      return 'ri-checkbox-circle-fill'
    case 'warning':
      return 'ri-information-fill'
    case 'error':
      return 'ri-close-circle-fill'
    default:
      return 'ri-message-3-fill'
  }
}

const list = ref<
  {
    id: number
    text: string
    type: string
  }[]
>([
  // { id: 0, text: 'message', type: 'info' }
])
let setTimeList = <number[]>[]

let Lduration = 2000

const clearOnce = (duration = 2000) => {
  Lduration = duration
  const asd = setTimeout(() => {
    list.value.splice(0, 1)
    setTimeList.splice(0, 1)
  }, Lduration)
  setTimeList.push(asd)
}

onUnmounted(() => {
  console.log('onUnmounted', onUnmounted)
  setTimeList.forEach((timer) => {
    clearTimeout(timer)
  })
})

const isShow = ref<number[]>([])
let removeUlTimer = 0

watchEffect(() => {
  console.log('list.value.length', list.value.length)
  if (!list.value.length) {
    removeUlTimer = setTimeout(() => {
      isShow.value = []
      setTimeList.splice(0, 1)
    }, Lduration + 400)
    setTimeList.push(removeUlTimer)
  } else {
    clearTimeout(removeUlTimer)
    setTimeList = setTimeList.filter((item) => item !== removeUlTimer)
    isShow.value = [1]
  }
})

let maxId = 0
const notice = {
  info: (text = '普通提示', duration = 2000) => {
    clearOnce(duration)
    list.value.push({
      id: ++maxId,
      type: 'info',
      text,
    })
  },
  success: (text = '成功提示', duration = 2000) => {
    clearOnce(duration)
    list.value.push({
      id: ++maxId,
      type: 'success',
      text,
    })
  },
  warning: (text = '警告提示', duration = 2000) => {
    clearOnce(duration)
    list.value.push({
      id: ++maxId,
      type: 'warning',
      text,
    })
  },
  error: (text = '错误提示', duration = 2000) => {
    clearOnce(duration)
    list.value.push({
      id: ++maxId,
      type: 'error',
      text,
    })
  },
}

defineExpose({ notice }) //暴露子组件的方法或者数据
</script>

<style lang="scss" scoped>
.list-enter-from {
  opacity: 0;
  transform: scale(0.85);
}

.list-leave-to {
  position: absolute;
  left: 50%;
  opacity: 0;
  transform: translateX(-50%) translateY(-30%) scale(0.1);
}

.list-move {
  transition: all 200ms ease;
}

.list-enter-active {
  transition: all 400ms ease;
}

.list-leave-active {
  position: absolute;
  left: 50%;
  opacity: 0;
  transform: translateX(-50%) translateY(-30%) scale(0.1);
  transition: all 200ms ease;
}

.notice-ul {
  position: fixed;
  top: $gap-s;
  left: 50%;
  transform: translateX(-50%);

  height: 0;
  z-index: 10;
  overflow: visible;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $gap-s;
}

.notice-li {
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

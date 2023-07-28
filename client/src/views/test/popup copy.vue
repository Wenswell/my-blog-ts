<template>
  <Transition name="fade">
    <div v-if="isOpen" class="popup">
      <h2>{{ props.title }}</h2>
      <p>{{ props.info }}</p>
      <button @click="close">Close</button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// props definition
const props = withDefaults(
  defineProps<{
    title: string
    info: string
  }>(),
  {
    title: '',
    info: '',
  },
)

// state definition
const isOpen = ref(false)

// methods definition
const close = () => {
  isOpen.value = false
}
const open = () => {
  isOpen.value = true
}

// expose methods to parent
defineExpose({
  open,
  close,
})
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background: white;
  border-radius: 10px;
}
</style>

<template>
  <button @click="dialog?.show()">show</button>
  <button @click="dialog?.showModal()">showModal</button>

  <dialog ref="dialog">
    <form method="dialog">
      <input type="text" />
      <button @click="dialog?.close()">close</button>
      <button type="submit">Submit</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const dialog = ref<any | null>(null)
onMounted(() => {
  console.log('dialog', dialog)
  // dialog.value?.show() // Opens a non-modal dialog
  // dialog.value?.showModal() // Opens a modal
})
</script>

<style lang="scss" scoped></style>

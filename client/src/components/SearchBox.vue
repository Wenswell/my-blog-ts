<template>
  <div class="search-box" :class="{ 'one-line': line }">
    <label class="search">
      <input
        @keydown.enter="emits('onSearch')"
        id="search"
        class="search_field"
        type="search"
        placeholder=" "
        :value="keyword"
        @input="
          $emit('update:keyword', ($event.target as HTMLInputElement).value)
        "
      />
      <span class="search_label">输入关键词</span>
    </label>
    <button
      :disabled="loading"
      :aria-disabled="loading"
      class="search mild-effect"
      :class="{ effect: !line }"
      @click="emits('onSearch')"
    >
      搜索文章
      <i
        class="ri-loop-right-line loading-icon"
        :class="{ loading: loading }"
      ></i>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps({
  keyword: {
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  line: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['onSearch', 'update:keyword'])
</script>

<style lang="scss" scoped>
.search-box {
  display: flex;
  flex-direction: column;
  gap: $gap-s;

  &.one-line {
    display: grid;
    grid-template-columns: 2fr 1fr;
    margin-right: $gap-xs;
  }
}

.search {
  @include input_label_effect(0);
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

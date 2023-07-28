<template>
  <div class="tag-box">
    <span class="select-tag" v-for="tag in preTagSet" :key="tag">
      {{ tag }}
      <button @click="removeTag(tag)"><i class="ri-close-line"></i></button>
    </span>
    <div class="add-tag">
      <button v-if="!isAddNew" @click="showAddTagInput">
        添加
        <i class="ri-add-box-line"></i>
      </button>

      <input
        id="tag"
        @keydown.up.prevent="upSelect"
        @keydown.down.prevent="downSelect"
        @keydown.enter.prevent="enterSelect"
        ref="addTagInput"
        autofocus
        type="text"
        v-model="preTag"
        @blur="inputBlur"
        v-else
      />

      <ul v-show="isAddNew" class="show-tags">
        <li
          @mouseenter="hoverOption(index)"
          @click="clickOption()"
          v-for="(tag, index) in matchTags"
          :class="{ selected: index === selectTagIndex }"
          :key="tag"
        >
          {{ tag }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getTag, ITagItem } from '@/api'
import 'md-editor-v3/lib/style.css'
import { nextTick, onMounted, ref, watchEffect } from 'vue'
const tagList = ref<string[]>([])
const getTagList = async () => {
  const aaa = await getTag()
  tagList.value = aaa.data.map((t: ITagItem) => t.tagName)
}

const addTagInput = ref<HTMLInputElement | null>(null)
const showAddTagInput = () => {
  isAddNew.value = true
  nextTick(() => {
    addTagInput.value?.focus()
  })
}

const isAddNew = ref(false)
const preTagSet = ref(new Set(''))
const preTag = ref('')
const matchTags = ref<string[]>([])
const selectTagIndex = ref(1)

defineProps({
  articletag: {
    required: true,
  },
})
const emits = defineEmits(['update:articletag'])

watchEffect(() => {
  matchTags.value = preTag.value
    ? tagList.value.filter((t) => t.includes(preTag.value))
    : tagList.value
  if (!matchTags.value.some((tag) => tag === preTag.value))
    matchTags.value.unshift(preTag.value)
})
watchEffect(() => {
  emits('update:articletag', [...preTagSet.value])
})
const inputBlur = () => {
  console.log('inputBlur', inputBlur)
  setTimeout(() => {
    addTagInput.value?.blur()
    isAddNew.value = false
  }, 100) //保证先触发clickOption点击事件
}
const upSelect = () => {
  console.log('upSelect', upSelect)
  selectTagIndex.value = --selectTagIndex.value >= 0 ? selectTagIndex.value : 0
}
const downSelect = () => {
  console.log('downSelect', downSelect)
  selectTagIndex.value =
    ++selectTagIndex.value >= matchTags.value.length - 1
      ? matchTags.value.length - 1
      : selectTagIndex.value
}
const hoverOption = (index: number) => {
  console.log('hoverOption', hoverOption)
  selectTagIndex.value = index
}
const clickOption = () => {
  console.log('clickOption', clickOption)
  isAddNew.value = false
  preTagSet.value.add(matchTags.value[selectTagIndex.value])
  preTag.value = ''
}
const enterSelect = () => {
  console.log('enterSelect', enterSelect)
  isAddNew.value = false
  preTagSet.value.add(
    matchTags.value[selectTagIndex.value]
      ? matchTags.value[selectTagIndex.value]
      : matchTags.value[selectTagIndex.value + 1],
  )
  preTag.value = ''
}
const removeTag = (tag: string) => {
  console.log('removeTag', removeTag)
  preTagSet.value.delete(tag)
}
onMounted(() => {
  getTagList()
})
</script>

<style scoped lang="scss">
.tag-box {
  display: flex;
  flex-wrap: wrap;
  gap: $gap-s;
}

.select-tag {
  border: 1px solid;
  padding-inline: $gap-xs;
  @include prime_border_color;
  word-break: keep-all;
  display: flex;
  gap: $gap-px;
  align-items: baseline;

  button {
    border: 1px solid transparent;
    display: inline-block;
    padding: 0;
    height: $fz;
    display: flex;
    align-items: center;

    &:where(:hover, :focus-visible) {
      background-color: hsla(0, 0%, 50%, 0.5);
    }
  }
}

.add-tag {
  input,
  button {
    padding: 0;
    padding-inline: $gap-xs;
  }
}

.show-tags {
  position: absolute;
  z-index: 1;
  @include white_bg_prime_txt;

  .selected {
    @include mild_bg_prime_txt;
  }
}
</style>

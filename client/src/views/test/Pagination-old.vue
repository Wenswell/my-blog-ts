<template>
  <ul v-show="makePage.length" class="pagination">
    <li
      class="arrow"
      v-show="showPag"
      :class="{ disable: props.currentPage == 1 }"
      :aria-disabled="props.currentPage == 1"
    >
      <router-link
        v-if="props.currentPage !== 1"
        :title="'前往第' + (props.currentPage - 1) + '页'"
        :aria-label="'前往第' + (props.currentPage - 1) + '页'"
        :to="{
          path: route.path,
          query: { ...$route.query, page: props.currentPage - 1 },
        }"
      >
        <i class="ri-arrow-left-line"></i>
      </router-link>

      <a v-else title="已经到达第一页了" aria-label="已经到达第一页了">
        <i class="ri-arrow-left-line"></i>
      </a>
    </li>

    <li
      class="arrow"
      v-show="showPag"
      :class="{ disable: props.currentPage == props.totalPage }"
      :aria-disabled="props.currentPage == props.totalPage"
    >
      <router-link
        v-if="props.currentPage !== props.totalPage"
        :title="'前往第' + (props.currentPage + 1) + '页'"
        :aria-label="'前往第' + (props.currentPage + 1) + '页'"
        :to="{
          path: route.path,
          query: { ...$route.query, page: props.currentPage + 1 },
        }"
      >
        <i class="ri-arrow-right-line"></i>
      </router-link>

      <a v-else title="已经到达最后一页了" aria-label="已经到达最后一页了">
        <i class="ri-arrow-right-line"></i>
      </a>
    </li>

    <li
      class="item"
      v-show="showPag"
      :class="{ active: page.i == props.currentPage }"
      v-for="page in makePage"
      :key="page.i"
    >
      <router-link
        :aria-label="'前往第' + props.currentPage + '页'"
        :to="{ path: route.path, query: { ...$route.query, page: page.i } }"
      >
        {{ page.d }}
      </router-link>
    </li>

    <li class="traggle" @click="showPag = !showPag">
      <a
        title="收起分页器"
        aria-label="收起分页器"
        href="javascript:void(0);"
        class="close"
        v-if="showPag"
      >
        <i class="ri-close-circle-line"></i>
        <!-- <i class="ri-contract-left-right-line"></i> -->
      </a>

      <a
        title="展开分页器"
        aria-label="展开分页器"
        href="javascript:void(0);"
        class="open"
        v-else
      >
        <i class="ri-code-s-line"></i>
      </a>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const props = defineProps({
  toPath: {
    type: String,
    required: true,
  },
  totalPage: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
})

const showPag = ref(true)

const makePage = computed(() => {
  if (props.totalPage < 2) return []
  const total = props.totalPage
  const cur = props.currentPage
  const around = 1
  let result: Array<string | number>
  let baseCount = around * 2 + 1 + 2 + 2 + 2 //总共元素个数
  let surplus = baseCount - 4 //只出现一个省略号 剩余元素个数
  let startPosition = 1 + 2 + around + 1 //前面出现省略号的临界点
  let endPosition = total - 2 - around - 1 //后面出现省略号的临界点

  if (total <= baseCount - 2) {
    //全部显示 不出现省略号
    result = Array.from({ length: total }, (_, i) => i + 1)
  } else {
    //需要出现省略号
    if (cur < startPosition) {
      //1.只有后面出现省略号
      result = [
        ...Array.from({ length: surplus }, (_, i) => i + 1),
        '...',
        total,
      ]
    } else if (cur > endPosition) {
      //2.只有前边出现省略号
      result = [
        1,
        '...',
        ...Array.from({ length: surplus }, (_, i) => total - surplus + i + 1),
      ]
    } else {
      //3.两边都有省略号
      result = [
        1,
        '...',
        ...Array.from({ length: around * 2 + 1 }, (_, i) => cur - around + i),
        '...',
        total,
      ]
    }
  }
  console.log('result', result)

  const disp: any[] = []

  const leftEllipsis = result.indexOf('...', 1)
  const rightEllipsis = result.indexOf('...', 3)
  for (let i = 0; i < result.length; i++) {
    console.log('result[i]', result[i])
    console.log('disp', disp)
    const count = (typeof result[i] === 'number' ? result[i] : 0) as number
    disp.push({
      d: count,
      i: count,
    })
  }
  if (leftEllipsis > 0) {
    disp[leftEllipsis] = {
      d: '...',
      i: (result[leftEllipsis + 1] as number) - 1,
    }
  }
  if (rightEllipsis > 0) {
    disp[rightEllipsis] = {
      d: '...',
      i: (result[rightEllipsis - 1] as number) + 1,
    }
  }

  return disp
})
</script>

<style lang="scss" scoped>
.pagination {
  width: 100%;
  display: grid;
  grid-gap: $gap-s;
  grid-template-columns: repeat(auto-fill, minmax($gap-l, 1fr));
  margin: $gap auto;
  align-items: center;
  position: sticky;
  top: $gap-xl + $gap;

  li {
    width: $gap-l;
    height: $gap-l;
    border: 1px solid;
    box-sizing: content-box;

    &:active {
      transform: translateY(1px);
    }
  }

  a {
    display: block;
    line-height: $gap-l;
    text-align: center;
  }

  .active {
    &:active {
      transform: translateY(0);
    }

    @include prime_bg_white_txt;
  }

  .arrow {
    @include prime_border_clr;
    @include mild_bg_prime_txt;
    transition: all 125ms;

    &.disable {
      opacity: 0.35;
      transform: none;
      border-color: transparent;
      @include unset_bg_unset_txt;
    }
  }

  .traggle {
    i {
      transition: all 100ms;
    }

    .close:where(:hover, :focus-visible) i {
      color: red;
      opacity: 0.7;
      font-size: 1.15rem;
    }

    .open:where(:hover, :focus-visible) i {
      font-size: 1.15rem;
      @include white_bg_prime_txt;
    }
  }
}
</style>

<template>
  <transition-group appear name="route">
    <div key="1" class="container">
      <aside :class="{ folded: isFolded }" class="sidebar">
        <h2 class="nav-title">
          <i class="ri-dashboard-2-fill"></i>
          <span>后台管理</span>
        </h2>
        <ul>
          <li v-for="item in showList" :key="item.path">
            <button
              :class="{ active: isCurrent(item.path) }"
              class="nav-item"
              @click="toPath(item.path)"
              :title="getTitle(item)"
              :aria-label="getAriaLabel(item)"
            >
              <i :class="item.icon"></i>
              <span>{{ item.label }}</span>
            </button>
          </li>
          <li>
            <button
              class="nav-item"
              @click="logout"
              title="退出"
              aria-label="退出登录"
            >
              <i class="ri-logout-box-line"></i>
              <span>退出</span>
            </button>
          </li>
        </ul>
      </aside>

      <div
        v-show="isFolded"
        class="nav-back-toggler"
        @click="toggleSidebar"
      ></div>

      <section class="main">
        <header class="header">
          <button
            :class="{ open: isFolded }"
            class="toggler"
            @click="toggleSidebar"
          >
            <i class="ri-menu-fold-line"></i>
          </button>
          <div class="info">{{ getPosition }}</div>
          <ModeToggleButton class="theme" />
        </header>

        <main class="content">
          <p>
            <router-view v-slot="{ Component }">
              <transition name="abso">
                <component :is="Component" />
              </transition>
            </router-view>
          </p>
        </main>
      </section>
    </div>
  </transition-group>
</template>

<script setup lang="ts">
import ModeToggleButton from '@/components/ModeToggleButton.vue'
import router from '@/router'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const navList = [
  { path: '/dash/home', label: '首页', icon: 'ri-home-2-line' },
  { path: '/dash/articles', label: '文章管理', icon: 'ri-article-line' },
  { path: '/dash/writing', label: '新增文章', icon: 'ri-edit-2-line' },
  { path: '/dash/editing', label: '修改文章', icon: 'ri-edit-box-line' },
  { path: '/dash/categories', label: '分类管理', icon: 'ri-folder-5-line' },
  { path: '/dash/tags', label: '标签管理', icon: 'ri-price-tag-3-line' },
  // { path: '/dash/account', label: '账户管理', icon: 'ri-account-circle-line' },
]

const showList = [
  { path: '/dash/home', label: '首页', icon: 'ri-home-2-line' },
  { path: '/dash/articles', label: '文章管理', icon: 'ri-article-line' },
  { path: '/dash/writing', label: '新增文章', icon: 'ri-edit-2-line' },
  { path: '/dash/categories', label: '分类管理', icon: 'ri-folder-5-line' },
  { path: '/dash/tags', label: '标签管理', icon: 'ri-price-tag-3-line' },
  // { path: '/dash/account', label: '账户管理', icon: 'ri-account-circle-line' },
]

const getPosition = computed(() => {
  if (route.name == 'DEditing') return '修改文章'
  return navList.find((item) => item.path === route.path)?.label
})

const toPath = (path: string) => {
  router.push(path)
  isFolded.value = false
  window.scrollTo(0, 0)
  const target = document.querySelector('.content')
  target?.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  })
}

const logout = () => {
  document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;'
  router.push('/login')
}

const getTitle = (item: { path: string; label: string }) => {
  return isFolded.value
    ? isCurrent(item.path)
      ? '就在' + item.label
      : '点击前往' + item.label
    : ''
}

const getAriaLabel = (item: { path: string; label: string }) => {
  return isCurrent(item.path)
    ? '当前页面为' + item.label
    : '点击前往' + item.label
}

const isCurrent = (path: string) => {
  return path == route.path
}

const isFolded = ref(false)

const toggleSidebar = () => {
  isFolded.value = !isFolded.value
  // 折叠侧边栏逻辑
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
}

.sidebar {
  z-index: 100;
  position: sticky;
  top: 0;
  height: 100dvh;
  min-width: 8rem;
  // @include white_bg_unset_txt;
  // 只有暗色
  background-color: $dark-bg-sub;
  color: $dark-fc;
  border-radius: 0;
  transition: all 200ms;

  overflow: hidden;

  .nav-title {
    height: $gap-xl;
    padding: $gap-s;
    font-size: 1.1 * $fz;
    display: flex;
    gap: $gap-px;
    align-items: center;

    i {
      font-size: 1.1 * $fz;
    }
  }

  ul {
    height: calc(100dvh - $gap-xl);
    overflow: hidden auto;
    display: flex;
    flex-direction: column;

    > li:last-child {
      margin-bottom: $gap-l;
    }
  }

  .nav-item {
    background-color: initial;
    padding: $gap $gap-s;
    border-color: transparent;
    justify-content: start;
    border-radius: 0;
    border-inline: 4px solid transparent;
    border-block: 1px solid transparent;

    width: 100%;
    display: flex;
    gap: $gap-px;
    align-items: center;

    &.active {
      border-color: lighten($light-prime-clr, 20);
      background-color: lighten($dark-bg, 10);
    }

    &:where(:hover, :focus-visible) {
      background-color: $dark-bg;
    }

    i {
      margin-right: $gap-px;
    }

    span {
      height: 100%;
      text-align: left;
    }
  }

  span {
    word-break: keep-all;
    opacity: 1;
    width: 100%;
    display: inline-block;
    transition:
      opacity 100ms 100ms,
      height 50ms 200ms;
  }

  &.folded {
    min-width: 3rem;
    .nav-item {
      transition: all 200ms;
      border: 0;

      &.active {
        @include prime_bg_white_txt;
      }
    }

    width: $gap-xl;
    transition: width 200ms 25ms;

    .nav-title {
      font-size: $fz;
      justify-content: center;

      i {
        font-size: 1.1 * $fz-l;
        transition: all 200ms 100ms;
      }
    }

    .nav-item {
      justify-content: center;
    }

    span {
      opacity: 0;
      width: 0;
      height: 0;
      transition:
        opacity 25ms,
        height 25ms 25ms,
        width 1s 25ms;
    }
  }
}

@media screen and (max-width: 45rem) {
  .nav-back-toggler {
    z-index: 10;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: hsla(0, 0%, 50%, 0.5);
  }

  .sidebar {
    all: unset;
    position: fixed;
    z-index: 100;
    top: 0;
    width: 45%;
    transition: all 200ms 50ms;
    transform: translateX(-100%);

    .nav-title {
      height: $gap-l;
    }

    .nav-title i {
      font-size: 1.1 * $fz-l;
      transition: all 200ms 100ms;
    }

    .nav-item {
      transform: translateX(-100%);
      opacity: 0;
      transition: all 150ms;
      display: block;
      box-sizing: border-box;
    }

    span {
      all: unset;
    }

    &.folded {
      all: unset;
      z-index: 100;
      position: fixed;
      top: 0;
      background-color: $dark-bg-sub;
      color: $dark-fc;
      transform: translate(0);
      transition: all 200ms;
      width: 45%;

      .nav-title i {
        transition: all 20ms;
      }

      .nav-item {
        border-radius: 0;
        transition:
          transform 200ms,
          opacity 300ms 50ms;
        transform: translateX(0);
        opacity: 1;
        display: block;
        box-sizing: border-box;
      }

      span {
        all: unset;
      }
    }
  }

  .header {
    .toggler {
      border: 0;
      transition: transform 100ms;

      transform: rotate(180deg);

      &.open {
        transform: rotate(0deg);
      }
    }
  }
}

.main {
  flex: 1;

  .header {
    position: sticky;
    top: 0;
    height: $gap-xl;
    padding-inline: $gap-s;
    display: flex;
    align-items: center;
    gap: $gap;
    box-shadow: 0px 1px 1px 0 hsla(0, 0%, 50%, 0.5);

    .toggler {
      border: 0;
      transition: transform 100ms;

      &.open {
        transform: rotate(180deg);
      }
    }

    .info {
      flex-grow: 1;
    }

    .theme {
      width: 2.35rem;
    }
  }

  .content {
    height: calc(100dvh - $gap-xl);
    overflow: hidden auto;
    padding-left: $gap-s;
    // 主题内容样式
  }
}
</style>

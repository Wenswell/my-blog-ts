<template>
  <header>
    <div class="topbar">
      <span class="logo">my-blog</span>
      <ModeToggleButton class="theme" />
    </div>
    <input type="checkbox" id="menu-toggle" aria-controls="sidebar" />
    <label for="menu-toggle" class="hamburger-menu">
      <span></span>
    </label>
    <aside class="sidebar" id="sidebar">
      <nav>
        <ul role="menu">
          <li role="none" v-for="item in navList" :key="item.link">
            <router-link
              :aria-current="currentRoutePath === item.link ? 'page' : false"
              :class="{ active: currentRoutePath === item.link }"
              :to="item.link"
            >
              {{ item.label }}
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>
    <label for="menu-toggle" class="secLabel"></label>
  </header>
</template>

<script setup lang="ts">
import ModeToggleButton from '@/components/ModeToggleButton.vue'

import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentRoutePath = computed(() => route.path)
console.log('route', route)
console.log('route', route)
console.log('route', route)

const navList = [
  { link: '/', label: '主页' },
  { link: '/articles', label: '文章' },
  { link: '/categories', label: '分类' },
  { link: '/tags', label: '标签' },
  { link: '/about', label: '关于' },
  { link: '/admin', label: '后台' },
]
</script>

<style scoped lang="scss">
$bar-width: 30px;
$bar-height: 4px;
$hbg-gap: calc((#{$bar-width} - #{$bar-height} * 3) / 3);
$hbg-margin: 10px;
$hbg-height: calc(#{$bar-height} * 3 + #{$hbg-gap} * 2);
// $foreground: #333;
// $background: white;
$x-width: calc(#{$hbg-height} * 1.4);
$ani-time: 200ms;

header {
  height: $gap-xl;
  overflow: hidden;
  position: sticky;
  top: 0;
  z-index: 10;
  @include white_bg_black_txt;
}

input {
  appearance: none;
  outline: none;
  pointer-events: none;

  &:checked {
    opacity: 0;
    width: 0;

    & ~ .hamburger-menu {
      & ~ .secLabel {
        display: block;
        opacity: 0.15;
      }

      &::after,
      &::before,
      & span {
        @include white_bg_prime_txt;
      }

      & ~ .sidebar {
        translate: 0;
      }

      & span {
        opacity: 0;
        width: 0;
      }

      &::before {
        rotate: 45deg;
        width: $x-width;
        translate: 0 calc(#{$bar-height} / -2);
      }

      &::after {
        rotate: -45deg;
        width: $x-width;
        translate: 0 calc(#{$bar-height} / 2);
      }
    }
  }
}

input:focus-visible {
  & ~ .hamburger-menu {
    &::after,
    &::before,
    & span {
      @include prime_shadow_white_border;
    }
  }
}

input:checked:focus-visible {
  & ~ .hamburger-menu {
    &::before,
    & span,
    &::after {
      @include white_shadow_prime_border;
    }
  }
}

.hamburger-menu {
  display: flex;
  flex-direction: column;
  gap: $hbg-gap;
  width: max-content;
  position: absolute;
  top: $hbg-margin;
  left: $hbg-margin;
  z-index: 3;
  cursor: pointer;

  &::before,
  & span,
  &::after {
    content: '';
    box-sizing: border-box;
    border: 2px solid transparent;
    width: $bar-width;
    height: $bar-height;
    @include prime_bg_white_txt;
    border-radius: $bar-width;
    transform-origin: left center;
    transition:
      opacity $ani-time,
      rotate $ani-time,
      translate $ani-time,
      width $ani-time;
  }
}

.secLabel {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  opacity: 0;
  transition: all $ani-time;
  @include prime_bg_white_txt;
}

.sidebar {
  z-index: 2;
  position: fixed;
  top: 0;
  left: 0;
  transition: translate $ani-time;
  translate: -100%;
  width: clamp(4rem, 10rem, 40vw);
  min-height: 100vh;
  @include prime_bg_white_txt;

  nav {
    padding-top: calc(#{$hbg-height} + #{$hbg-margin} + 1rem);
  }

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    list-style: none;
    height: 1.5em;
    line-height: 1.5em;
    display: flex;
    padding: $gap-s;
  }

  a {
    text-decoration: none;
    width: 100%;
    text-align: left;
    @include prime_bg_white_txt;
  }
}

.topbar {
  padding-bottom: $gap-s;

  box-shadow: 0px 1px 2px 0px hsla(0, 0%, 50%, 0.2);

  z-index: 1;
  position: absolute;
  height: $hbg-height;
  width: 100%;
  margin-top: $hbg-margin;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  .logo {
    font-size: $fz-l;
    line-height: $fz-l;
    grid-column-start: 2;
    justify-self: center;
    @include white_bg_prime_txt;
  }

  .theme {
    justify-self: end;
    margin-right: $gap-s;
  }
}

@media screen and (min-width: 45rem) {
  .hamburger-menu,
  #menu-toggle {
    display: none;
  }

  .sidebar,
  .topbar,
  .sidebar nav,
  // .sidebar ul,
  .sidebar li {
    all: unset;
  }

  header {
    display: grid;
    gap: $gap-s;
    grid-template-columns: minmax($gap-xl, 5vw) 2fr auto minmax($gap-xl, 5vw);
    align-items: center;
    box-shadow: 0px 1px 2px 0px hsla(0, 0%, 50%, 0.2);

    .topbar {
      grid-column-start: 2;
      display: flex;
      justify-content: space-between;

      .logo {
        font-size: $fz-l;
        line-height: $fz-l;
      }
    }

    .sidebar {
      @include white_bg_black_txt;

      ul {
        display: flex;
      }

      li {
        margin-block: 1rem;
      }

      a {
        // border-inline: 2px solid transparent;
        user-select: none;
        // transition: background 200ms;
        z-index: 2;
        padding: $gap;
        @include white_bg_black_txt;

        &:focus-visible {
          @include white_bg_prime_txt;
          outline-offset: -$gap-s;
        }

        &:hover {
          @include mild_bg_prime_txt;
        }

        &.active {
          cursor: default;
          @include prime_bg_white_txt;
        }
      }
    }
  }
}
</style>

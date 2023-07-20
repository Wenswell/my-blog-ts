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
          <li role="none" v-for="item in navList" :key="item.path">
            <router-link
              :title="currentRoute === item.path ? '就在这里' : '点击前往'"
              :aria-label="
                currentRoute === item.path
                  ? '当前页面：' + item.label
                  : '点击前往页面：' + item.label
              "
              :aria-current="currentRoute === item.path ? 'page' : false"
              :class="{ active: currentRoute === item.path }"
              :to="item.path"
            >
              {{ item.label }}
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>
    <label for="menu-toggle" class="sec-label"></label>
  </header>
</template>

<script setup lang="ts">
import ModeToggleButton from '@/components/ModeToggleButton.vue'

import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentRoute = computed(() => route.matched[0].path)

const navList = [
  { path: '/', label: '主页' },
  { path: '/articles', label: '文章' },
  { path: '/categories', label: '分类' },
  { path: '/tags', label: '标签' },
  { path: '/about', label: '关于' },
  { path: '/login', label: '后台' },
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
  // height: $gap-xl;
  height: calc($hbg-height + $gap + 2px);
  // overflow: hidden;
  position: sticky;
  top: 0;
  z-index: 10;
  @include white_black_bg_unset_txt;
}

input {
  opacity: 0;
  appearance: none;
  outline: none;
  pointer-events: none;

  &:checked {
    opacity: 0;
    width: 0;

    & ~ .hamburger-menu {
      & ~ .sec-label {
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
      @include prime_shadow_white_border_clr;
    }
  }
}

input:checked:focus-visible {
  & ~ .hamburger-menu {
    &::before,
    & span,
    &::after {
      @include pwhite_shadow_prime_border_clr;
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

.sec-label {
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
    padding-top: calc($hbg-height + $hbg-margin + $gap);
  }

  li {
    line-height: $gap;
    display: flex;
    padding: $gap-s;
  }

  a {
    text-decoration: none;
    width: 100%;
    line-height: $fz-xxl;
    text-align: left;
    @include prime_bg_white_txt;
  }
}

.topbar {
  width: 100%;
  height: 100%;
  position: absolute;
  display: grid;
  align-items: center;
  grid-template-columns: 1fr auto 1fr;
  z-index: 1;
  padding-block: $gap-s;
  box-shadow: 0px 1px 2px 0px hsla(0, 0%, 50%, 0.2);
  // margin-top: $hbg-margin;
  @include white_bg_unset_txt;

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
  .sec-label,
  #menu-toggle {
    display: none !important;
  }

  .sidebar,
  .topbar,
  .sidebar nav,
  // .sidebar ul,
  .sidebar li {
    all: unset;
  }

  header {
    height: $gap-xl;
    display: grid;
    gap: $gap-s;
    grid-template-columns: minmax($gap-xl, 5vw) 2fr auto minmax($gap-xl, 5vw);
    align-items: center;
    box-shadow: 0px 1px 2px 0px hsla(0, 0%, 50%, 0.2);

    .topbar {
      grid-column-start: 2;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .logo {
        font-size: $fz-l;
        line-height: $fz-l;
      }
    }

    nav {
      display: block;
      height: 100%;
    }

    .sidebar {
      height: $gap-xl;
      @include white_bg_unset_txt;

      ul {
        display: flex;
        height: 100%;
      }

      a {
        width: auto;
        display: inline-block;
        // border-inline: 2px solid transparent;
        height: 100%;
        line-height: 3rem;
        user-select: none;
        z-index: 2;
        padding-inline: $gap;
        @include white_bg_unset_txt;

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

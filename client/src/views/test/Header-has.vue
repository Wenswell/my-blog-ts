<template>
  <header>
    <div class="topbar">
      <span class="logo">my-blog</span>
      <!-- <span class="theme">☀️</span> -->
      <ModeToggleButton class="theme" />
    </div>
    <label for="menu-toggle" class="hamburger-menu">
      <input type="checkbox" id="menu-toggle" />
    </label>
    <aside class="sidebar">
      <nav>
        <ul>
          <li><a href="">主页</a></li>
          <li><a class="active" href="">分类</a></li>
          <li><a href="">标签</a></li>
          <li><a href="">关于</a></li>
          <li><a href="">后台</a></li>
        </ul>
      </nav>
    </aside>
    <label for="menu-toggle" class="secLabel">123123</label>
  </header>
</template>

<script setup lang="ts">
import ModeToggleButton from '@/components/ModeToggleButton.vue'
</script>

<style scoped lang="scss">
$bar-width: 30px;
$bar-height: 4px;
$hbg-gap: calc((#{$bar-width} - #{$bar-height} * 3) / 4);
$hbg-margin: 10px;
$hbg-height: calc(#{$bar-height} * 3 + #{$hbg-gap} * 2);
// $foreground: #333;
// $background: white;
$ani-time: 200ms;

.hamburger-menu {
  $x-width: calc(#{$hbg-height} * 1.4);
  display: flex;
  flex-direction: column;
  gap: $hbg-gap;
  width: max-content;
  position: absolute;
  top: $hbg-margin;
  left: $hbg-margin;
  z-index: 3;
  cursor: pointer;

  input {
    appearance: none;
    outline: none;
    pointer-events: none;

    &:checked {
      opacity: 0;
      width: 0;
    }
  }

  &::before,
  & input,
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

  &:has(input:focus-visible)::after,
  &:has(input:focus-visible)::before,
  & input:focus-visible {
    @include prime_shadow_white_border;
  }

  &:has(input:checked) {
    &:has(input:focus-visible)::after,
    &:has(input:focus-visible)::before,
    & input:focus-visible {
      @include white_shadow_prime_border;
    }

    &::before,
    & input,
    &::after {
      @include white_bg_prime_txt;
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

  &:has(input:checked) + .sidebar {
    translate: 0;
  }

  &:has(input:checked) ~ .secLabel {
    display: block;
    opacity: 0.15;
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

  box-shadow: 0px 1px 2px 0px hsla(0, 0, 50%, 0.2);

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
  .hamburger-menu {
    display: none;
  }

  .sidebar,
  .topbar,
  .sidebar nav,
  // .sidebar ul,
  .sidebar li {
    all: unset;
  }

  nav,
  nav ul {
    display: flex;
    flex-direction: row;
  }

  header {
    display: grid;
    grid-template-columns: 2rem 2fr auto 2rem;
    align-items: center;
    margin-top: $gap;
    padding-bottom: $gap;
    height: 100%;
    box-shadow: 0px 1px 2px 0px hsla(0, 0, 50%, 0.2);

    .topbar {
      grid-column-start: 2;
      display: flex;
      justify-content: space-between;
    }

    .logo {
      font-size: $fz-l;
      line-height: $fz-l;
    }

    .sidebar ul {
      @include white_bg_black_txt;
    }

    .sidebar a {
      // border-inline: 2px solid transparent;
      user-select: none;
      transition: all 200ms;
      z-index: 2;
      padding: 1rem;
      @include white_bg_black_txt;

      &:focus-visible {
        // @include black_border;
        @include mild_bg_prime_txt;
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
</style>

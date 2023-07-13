<template>
  <header>
    <span class="logo">my-blog</span>

    <input ref="check" type="checkbox" id="nav-toggle" class="nav-toggle" />

    <nav>
      <ul>
        <li><a href="">主页</a></li>
        <li><a href="">分类</a></li>
        <li><a href="">标签</a></li>
        <li><a href="">关于</a></li>
        <li><a href="">后台</a></li>
      </ul>
    </nav>
    <label for="nav-toggle" class="nav-toggle-label">❌</label>
  </header>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
header {
  // display: flex;
  // align-items: center;
  @include prime_bg_white_txt;

  position: fixed;
  z-index: 10;
  width: 100%;
  text-align: center;
  height: $gap-l;
  padding-block: $gap-s;
}

.logo {
  display: inline-block;
  font-size: $fz-l;
}

.nav-toggle {
  display: none;

  &:checked ~ nav {
    display: block;
    transform: scale(1, 1);

    .nav-item {
      opacity: 1;
      transition: opacity 150ms ease-in-out 50ms;
    }
  }
}

.nav-toggle-label {
  position: absolute;
  top: $gap-s;
  left: $gap-s;
  height: 100%;
}

nav {
  margin-top: 1em;
  @include prime_bg_white_txt;
  transform: scale(1, 0);
  transform-origin: top;
  transition: transform 200ms ease-in-out;

  ul {
    margin: 0;
    padding: 0;

    li {
      height: 1.5em;
      line-height: 1.5em;
      display: flex;
      padding: $gap-s;

      a {
        width: 100%;
        text-align: left;
        @include prime_bg_white_txt;
      }
    }
  }
}

li {
  list-style: none;
}

a {
  text-decoration: none;
}
</style>

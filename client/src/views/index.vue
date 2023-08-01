<template>
  <Header />
  <router-view v-slot="{ Component }">
    <transition name="route">
      <component :is="Component" />
    </transition>
  </router-view>
  <footer>
    <div>powered by myself</div>
    <div class="beian">
      <a href="https://beian.miit.gov.cn/" target="_blank">赣ICP备2023007094号-1</a>
      /
      <a href="https://beian.miit.gov.cn/" target="_blank"><img alt=""
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAElUlEQVR4nI2UC0xTZxTHLwSNQ2Ikc8Ewh5qRCU4y5gPBrPURFERArYpQy1MtdFqZIoM2jFVAzFReCipzkU1MGIq8BDaxSFXKAKlKC6W1UAsUaGmhPupQQf+7vVu6GYzZTW5uznf/93f+37nnfATxngvodX7eU8OuyU+9e/UEv8Movbzfsva+b94NGhetVVallBbF7Ri/EOmJI6GrkMEJQPF3DPzIYU3Ir6SW48WDwP8HA2Y05EbAZ443Tkd5oWnfMgxGfQrjQQ/01nFQdjGBenf9RCgs2vfDJkwuL+7xbwWv2Iw8fhiepbhBZvcBpD4L8DDIHfdtbDBRtAGlNXnY7r0NbxQ51cCjd0NfQuPedy3upZdzECLC2JjMXgLpQmd0LZiL+0ucofRzw30nR9xymAncjMK+hAysc/XFyB3+kEGRu2iqu+cFK/JPJoIgBCjJCsPjCBfKnfzL+ZA7O6HDwRGd3q5oJWxhiHRHQ30qqT2ArMwkvHoo8HwLNtrROG+ycfudU1mkyC4JtYLV6N/gAiUxHfL5TuimLUT36oV/uyW3bYkV7UkUMIXPA0yZNy3lsgI7KhLjxy/5oLgwg3JYUxiKP9O8ICGmoTVsMTrP0DAg2gpNth86PrLH6MHlkNw+SAELctMBWQiM6qp0K7CnPvOc/uxyiMtTQMzIw4GYGLxq8kV9kCua6Z+gK24plImroOKuRPfxDUD/bvD2RJFAHsQNx2CuXAOtKKfIClT+yh1UZXrjSdsBzKOfhd00Lm4EukGfRkeX/2LctWw5chlkaz6DNt4Lsr00zJweCyfPH/BUkQxNgQ80FWyVFagqi3l+L3kVULsRh47mU5nriNl4/bk9und/ATHDFV2JK6kErz3moJFwJDVfg5OajTdiBmTHyJIIORorUFsnqOotWofJ9j2QCY+B+DgbgYQPqmbNQtNcezQv+hDt5G3pxXa6Bzi2XiBm89FWl4wJaTwGqrfDKDla8B/gkT968taiv3QnIGUjI6eQ+tuETSzpJBrBs4IR5bIFDkT4P2s8HOKnAapIDNaGY+ByAAwtvCYrUNecMqG4EIruvG0YOE2jaikXJSM/iYX9vOOoKWZDUsYAKzIZIcHxSPg2DaO3Y6D7mQbV+fUYqNgEk/J7479TYm5lDgoZ6LkUiK5cP3QddsOLplDKARRBVJ0eV/iT7plkz3Gppzp9KaXtq2ZgpJVFtmEt/a3mnjQ/YOlbwh8PiXZAmk6DPPsrmCR7MSLcBW3lVgzfYFLxExkH6sL1eHgmAPo2LrS3uUaz/qrvlNEzaVrW9lXGDluy6cXRGKoLgUG0EwZxOPS3omBqi8ZIQyge/eKHod+ZGOv8BsNNbPSUhBmMvRemAs2PjteP9x/GmCIR/XWR0F5jWt1ZgPrfGJQzDVkWC9Di2CiJwzPtITzTn7oy9XAYarcfUWac1grDzLrrm/G0NQRjN7dAX7UJRjLWlW+kHI+1MKFrDMZIWwxG1YI+k+5iCiCwnQK0Tk1hwpy7GczwOwL6T+pSRrPq/FbpQNk2ra6WpVWX7GoebuAKDR1nTyrK0/0hmAr6Cz6PILkClLAqAAAAAElFTkSuQmCC" />赣公网安备
        36072202000228号</a>
    </div>

  </footer>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
</script>

<style lang="scss" scoped>
main {
  // outline: solid;
  // outline-offset: -2px;

  margin-inline: auto;
  max-width: 60rem;
  min-height: calc(100dvh - $gap-xl);
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: $gap;
  padding: $gap;
}

footer {
  grid-column: 1 / 2;
  grid-row: 1;
  display: flex;
  padding: $gap;
  gap: $gap-s;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @include prime_bg_white_txt;
}

.beian {
  a{
    word-break: keep-all;
  }
  a:last-child {
    img {
      vertical-align: middle;
    }
  }
}

@media screen and (max-width: 45rem) {
  main {
    // all: unset;
    display: flex;
    flex-direction: column;
  }
}</style>

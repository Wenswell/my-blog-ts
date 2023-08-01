<template>
  <main>
    <section class="show">
      <article class="project">
        <h2> <img src="../../assets/images/mart.svg" style="height: 1em;margin-right:2px;vertical-align: middle;"> 生鲜商城
        </h2>
        <div class="link">
          <a title="生鲜商城-代码仓库" href="https://github.com/Wenswell/fresh-mart/"><i class="ri-github-fill"></i> 代码仓库</a>
          <a title="生鲜商城-在线预览(客户端)" href="https://wswensw.top/client/"><i class="ri-smartphone-line"></i> 在线预览(客户端)</a>
          <a title="生鲜商城-在线预览(管理端)" href="https://wswensw.top/manager/"><i class="ri-folder-settings-line"></i>
            在线预览(管理端)</a>
        </div>
      </article>
      <article class="project">
        <h2><img src="../../assets/images/blog.svg"
            style="height: 1em;margin-right:2px;vertical-align: middle; background-color: white;border-radius: 50%;padding: 1px;overflow: visible;">个人博客
        </h2>
        <div class="link">
          <a title="个人博客-代码仓库" href="https://github.com/Wenswell/my-blog-ts/"><i class="ri-github-fill"></i> 代码仓库</a>
        </div>
      </article>
    </section>
    <section>
      <article class="project">
        <h2><i class="ri-pages-line"></i>简历</h2>
        <div class="link">
          <router-link title="个人简历" to="/about"><i class="ri-ie-fill"></i> 在线</router-link>
          <a title="个人简历" href="https://blog0801-1319032318.cos.ap-shanghai.myqcloud.com/%E6%B8%A9%E4%B8%96%E4%BC%9F-%E5%88%9D%E7%BA%A7%E5%89%8D%E7%AB%AF-%E7%AE%80%E5%8E%86.pdf"><i class="ri-file-pdf-2-line"></i> PDF</a>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
main.show {
  display: grid;
  grid-template-columns: 3fr 2fr;
}

h2 {
  margin-block: $gap-s;
}

.project {
  flex: 1;
  padding: $gap;
  text-align: center;

  .link {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: $gap-xs;
  }

  a {
    flex: 1;
    word-break: keep-all;
    @include mild_bg_prime_txt;
    display: inline-block;
    padding: $gap;
    transition: all 200ms;
    box-shadow: 1px 2px 2px transparent;

    &:where(:hover, :focus-visible) {
      position: relative;
      transform: translate(-2px, -2px);
      box-shadow: 1px 2px 2px hsla(0, 0%, 50%, 0.5);
    }

    &:active {
      position: relative;
      transform: translate(-1px, -1px);
    }
  }
}
</style>

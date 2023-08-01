<template>
  <main>
    <aside class="sidebar">
    <MdCatalog
        :scrollElementOffsetTop="headerHeightPx"
        class="aside-content"
        :editorId="id"
        :scrollElement="scrollElement"
      />
    </aside>

    <MdPreview
      class="main"
      :editorId="id"
      :modelValue="content"
      :theme="getTheme"
      previewTheme="github"
      />
  </main>
</template>

<script setup lang="ts">
import { MdPreview, MdCatalog,Themes } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import AdminStore from '@/store/index'
import { computed } from 'vue';

const Store = AdminStore()
const getTheme = computed(()=>{
  return Store.$state.config.theme as Themes
})
const id = 'resume'
const scrollElement = document.documentElement
const headerHeightPx =
  3 * parseInt(getComputedStyle(document.documentElement).fontSize)
const content = `

## 个人信息

- 电话: 17758143684
- 邮箱: <wswensw@163.com>
- 年龄: 24岁
- 求职意向: 初级前端开发工程师
- 期望薪资: 7k-9k

## 专业技能

1. 熟悉 HTML5、CSS3、JS ES6，能使用 TypeScript 规范数据类型，能够实现语义清晰的响应式布局，高度还原视觉设计
2. 熟悉 Vue2/3 全家桶、能使用常用的 UI 库如 Vant、Element UI、ECharts，能够实现前端模块化和组件化，根据需要定制组件
3. 能够使用 ChatGPT 等 AI 模型，包括辅助解释错误、开拓思路、优化代码、进行 Code Review 等，提高开发效率
4. 熟悉 Node.js，能够使用 Webpack 和 Vite 等打包工具进行资源管理和打包，使用 Git 进行团队协作开发
5. 熟悉 HTTP 和 TCP/IP 协议，能使用 Express 结合常用数据库开发符合规范的 RESTful API、使用 API 与后端进行数据交互

## 项目经历

### 生鲜商城
- **项目仓库**: [github.com/Wenswell/fresh-mart](https://github.com/Wenswell/fresh-mart/)
- **在线预览**: [wswensw.top/client](https://wswensw.top/client/) (客户端) 、 [wswensw.top/manager](https://wswensw.top/manager/) (管理端)
- **项目描述**: 生鲜商城是一个移动端商城项目，客户端、管理端、服务端之间数据互通。项目为独立开发，包括页面设计、功能实现、交互效果等
- **技术栈**: Vue2、Vant、Element UI、Express、MySQL
- **客户端**: 
  - 依照 UI 设计稿独立构建项目，力求 1:1 还原设计
  - 统一使用 Vuex 管理数据、发送请求，实现多个页面共享数据，减少网络请求，加快响应，提高前端性能
  - 实现组件化管理，使得文件结构清晰；封装常用组件，使得页面效果统一，便于维护
  - 因 Vant 的轮播图功能较少，引入 Swiper 实现首页、商品页符合设计稿的轮播图
- **管理端**: 
  - 使用 Mock.js 模拟数据用于测试 ECharts 显示效果
  - 根据用户拥有的权限由后端返回并设置动态路由，防止越权操作
- **服务端**: 
  - 使用 jwt 配合本地随机生成的密钥生成 token 鉴权
### 个人博客
- **项目仓库**: [github.com/Wenswell/my-blog-ts](https://github.com/Wenswell/my-blog-ts/)
- **在线预览**: [wswensw.top](https://wswensw.top/)
- **技术栈**: Vue3、Express、MongoDB
- **项目描述**: 
  - 使用 Vite 构建、打包项目客户端，比 Webpack 更加快速
  - 配置 Eslint、Prettier、Husky 用于格式化代码、规范 git 记录
  - 原项目开发至 80% 后重构项目
- **客户端**: 
  - 拥抱 TypeScript，将客户端、服务端用 TypeScript 重构，以规范化各种参数类型，提高代码的质量和可维护性
  - 移除 Naive UI，独立开发组件库，以便于自定义样式、功能，加强对组件化的理解
  - 优化语义化、无障碍访问、响应式布局，充分使用 HTML5、Vue3 原生功能
  - 集成基础的后台管理系统，能够对文章、用户等数据进行增删改查等常用操作
- **服务端**: 
  - 将数据库由 SQLite 改为 MongoDB，更直观、灵活地定义文章相关的字段
  - 使用 bcrypt 加密储存密码 hash，使用 jwt 生成 token 鉴权，保障数据安全
  - 封装函数，将返回至前端的数据、错误格式统一，正确提供 HTTP 响应状态码


## 工作经历

### 花安堂生物科技集团有限公司
#### 细胞研究员   检测评价部

- 负责原料的功效检测，包括实验以及数据分析处理、报告制作，共出具 40 余份检测报告，顺利完成工作


## 教育经历

### 江西中医药大学    2017年09月 ~ 2021年06月
#### 本科   中药学

- 在校期间获得过 3 次校奖学金，成绩平均排名专业前20 (10%)
- 在校期间参加过计算机爱好协会，结合自学经验，对计算机基础知识有一定掌握
`
</script>

<style lang="scss" scoped>
.main{
  margin-top: -$gap-l;
}

aside {
  margin-inline: $gap-s;
  // position: sticky;
  // top: $gap-xl + $gap;
  align-self: start;
  grid-column: 2 / 3;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  gap: $gap;
  height: 100%;
  max-width: 8rem;

  * {
    word-break: break-word;
    word-wrap: break-word;
  }
}

.aside-content {
  top: $gap-xl + $gap;
  position: sticky;
}

@media screen and (max-width: 45rem) {
  .aside-content {
    display: none;
  }
}
</style>

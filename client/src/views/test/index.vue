<template>
  <main>
    <h1>测试页面 <button @click="router.push({ name: 'Home' })">to Home</button></h1>
    <ModeToggleButton style="width: 2.35rem;" />
    <section class="token">
      <h2>cookies</h2>
      <p>token:{{ token }}</p>
      <p v-if="isAuthenticated">User is authenticated</p>
      <p v-else>User is not authenticated</p>
      <button @click="login">Login</button>
      <button @click="logout">Logout</button>
    </section>
    <section class="notice">
      <h2>notice组件</h2>
      <button @click="popupRef?.notice.info(Math.random().toString())">notice.info</button>
      <button @click="popupRef?.notice.success(Math.random().toString())">notice.success</button>
      <button @click="popupRef?.notice.warning(Math.random().toString())">notice.warning</button>
      <button @click="popupRef?.notice.error(Math.random().toString())">notice.error</button>
      <hr>
      old:<button @click="message.open('message')">message.info</button>
      <button @click="show = !show">Toggle</button>
    </section>
    <section class="redirecte">
      <h2>传送</h2>
      <button @click="router.push({ name: 'Home' })">to Home</button>
      <button @click="router.push({ name: 'ArticleList' })">to ArticleList</button>
      <button @click="router.push({ name: 'ArticleDetail', params: { id: 'w2k2o8xd1e' } })">to ArticleDetail</button>
      <hr>
      <button @click="router.push({ name: 'TagList', params: { tagName: 'CSS' } })">to TagList</button>
      <button @click="router.push({ name: 'CategoryList', params: { categoryName: '无' } })">to CategoryList</button>
      <button @click="router.push({ name: 'About' })">to About</button>
      <hr>
      <button @click="router.push({ name: 'Login' })">to Login</button>
      <!-- <button @click="router.push({ name: 'Dashbord' })">to Dashbord</button> -->
      <button @click="router.push({ name: 'Dhome' })">to Dhome</button>
      <button @click="router.push({ name: 'Darticles' })">to Darticles</button>
      <button @click="router.push({ name: 'Dcategories' })">to Dcategories</button>
      <hr>
      <button @click="router.push({ name: 'DWriting' })">to DWriting</button>
      <button @click="router.push({ name: 'DEditing' })">to DEditing</button>
      <button @click="router.push({ name: 'Dtags' })">to Dtags</button>
      <button @click="router.push({ name: 'Daccount' })">to Daccount</button>
      <!-- <button @click="router.push({ name: 'NotFound' })">to NotFound</button> -->
    </section>
    <Transition>
      <div v-if="show">
        <p v-if="show" class="popup">hello</p>
        <p v-for="item in testList" :key="item">{{ item }}</p>
      </div>
    </Transition>
    <Popup ref="popupRef" />
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { IBlogPrew, searchBlogs } from '@/api/index'
import ModeToggleButton from '@/components/ModeToggleButton.vue'

import Popup from '@/components/Notice.vue'
import { CNotice } from '@/utils/type'
let popupRef = ref<CNotice | null>(null)

const token = ref<string | undefined>(undefined)
import message from './message'
import router from '@/router';
console.log("router", router)

const isAuthenticated = computed(() => {
  return token.value !== undefined
})

const show = ref(false)

const testList = ['sadf', 'zxcv', 'qwer']

// let blogs: IBlogPrew[] = reactive([])
let blogs = ref<IBlogPrew[]>([])

searchBlogs({ keyword: '时' }).then((res) => {
  console.log('res', res.data.blogs)
  // blogs = res.data.blogs
  blogs.value = res.data.blogs
})
const login = () => {
  const tokenValue = 'your_token_value'
  const cookieExpirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  document.cookie = `token=${tokenValue};expires=${cookieExpirationDate.toUTCString()};path=/`
  token.value = tokenValue
}

const logout = () => {
  document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;'
  token.value = undefined
}

const readTokenFromCookie = () => {
  token.value = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1]
}

readTokenFromCookie()
</script>

<style lang="scss" scoped>
// https://cn.vuejs.org/guide/built-ins/transition.html#the-transition-component
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // margin-inline: $gap;
  margin: $gap;
  gap: $gap;

  button {
    margin-right: $gap-s;
  }
}
</style>

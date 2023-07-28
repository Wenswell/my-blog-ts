<template>
  <p>token:{{ token }}</p>
  <button @click="login">Login</button>
  <button @click="logout">Logout</button>
  <p v-if="isAuthenticated">User is authenticated</p>
  <p v-else>User is not authenticated</p>
  <hr />
  <button @click="show = !show">Toggle</button>
  <button @click="popupRef?.notice.info('sadg')">notice.info</button>
  <button @click="popupRef?.notice.success('sadg')">notice.success</button>
  <button @click="popupRef?.notice.warning('sadg')">notice.warning</button>
  <button @click="popupRef?.notice.error('sadg')">notice.error</button>
  <button @click="message.open('message')">message.info</button>
  <Transition>
    <div v-if="show">
      <p v-if="show" class="popup">hello</p>
      <p v-for="item in testList" :key="item">{{ item }}</p>
    </div>
  </Transition>
  <hr />
  <hr />
  <Popup ref="popupRef" />
  <hr />
  <ModeToggleButton />
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
</style>

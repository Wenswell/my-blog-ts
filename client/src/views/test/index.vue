<template>
  <div>
    <p>token:{{ token }}</p>
    <button @click="login">Login</button>
    <button @click="logout">Logout</button>
    <p v-if="isAuthenticated">User is authenticated</p>
    <p v-else>User is not authenticated</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import blogSearch from '@/api/index'

const token = ref<string | undefined>(undefined)

const isAuthenticated = computed(() => {
  return token.value !== undefined
})

const login = () => {
  blogSearch({}).then((res) => {
    console.log('res', res.data.blogs)
  })

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

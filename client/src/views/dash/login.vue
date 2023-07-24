<template>
  <transition-group appear name="login-form">
    <form key="1" @submit.prevent="onSubmit">
      <fieldset>
        <legend>登录</legend>

        <label class="input">
          <input
            class="input_field"
            v-model="formValue.account"
            :pattern="info.account.regex"
            :title="info.account.err"
            required
            :type="info.account.type"
            :autocomplete="info.account.autocomplete"
            :aria-invalid="accountError"
            :aria-describedby="info.account.err"
            placeholder=" "
          />
          <span class="input_label">输入账号</span>
        </label>

        <label class="input">
          <input
            class="input_field"
            v-model="formValue.password"
            :pattern="info.password.regex"
            :title="info.password.err"
            required
            :type="info.password.type"
            :autocomplete="info.password.autocomplete"
            :aria-invalid="passwordError"
            :aria-describedby="info.password.err"
            placeholder=" "
          />
          <span class="input_label">输入密码</span>
        </label>

        <button
          class="submit effect"
          :class="{ invalid: accountError || passwordError }"
          :aria-disabled="accountError || passwordError"
        >
          登录
        </button>
        <button class="submit effect" @click="fillAdmin">
          TEST: 管理员登陆
        </button>
      </fieldset>
    </form>
  </transition-group>
  <Popup ref="popupRef" />
</template>

<script setup lang="ts">
// import ModeToggleButton from '@/components/ModeToggleButton.vue'

import { NormalResult, verifyAndGetToken } from '@/api'
import { computed, onMounted, reactive, ref } from 'vue'

import Popup from '@/components/Notice.vue'
import { CNotice } from '@/utils/type'
import router from '@/router'
let popupRef = ref<CNotice | null>(null)

const formValue = reactive({
  account: '',
  password: '',
})

const info = {
  account: {
    type: 'text',
    autocomplete: 'username',
    regex: '^[A-Za-z0-9]{3,12}$',
    err: '账号应由 3 ~ 12 位字母或数字组成',
  },
  password: {
    type: 'password',
    autocomplete: 'current-password',
    regex: '^[A-Za-z0-9@#$%^&*-_]{5,16}$',
    err: '密码应为 5 ~ 18 位字母数字和符号混合',
  },
}

const accountError = computed(() => {
  return !RegExp(info.account.regex).test(formValue.account)
})
const passwordError = computed(() => {
  return !RegExp(info.password.regex).test(formValue.password)
})

const fillAdmin = () => {
  formValue.account = 'admin'
  formValue.password = 'passwd'
}
const onSubmit = async () => {
  // 验证逻辑
  // 提交逻辑

  try {
    const verifyRes = (await verifyAndGetToken(formValue)) as NormalResult

    const cookieExpirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    document.cookie = `token=${
      verifyRes.data.token
    };expires=${cookieExpirationDate.toUTCString()};path=/`

    popupRef.value?.notice.success(`[${verifyRes.data.account}]登陆成功`)
  } catch (error) {
    popupRef.value?.notice.error('登录失败')
  }
}

const readTokenFromCookie = () => {
  const localToken = document.cookie
    .split('; ')
    .find((row) => row.startsWith('token='))
    ?.split('=')[1]
  if (localToken) {
    popupRef.value?.notice.success('欢迎回来，即将自动跳转', 1000)
    setTimeout(() => {
      router.push('/dash')
    }, 1000)
  }
}
onMounted(() => {
  readTokenFromCookie()
})
</script>

<style lang="scss" scoped>
.login-form-enter-from {
  opacity: 0;
  transform: scale(1.1);
  filter: blur(10px);
  // transform: translateY(60px);
}

.login-form-enter-active {
  transition:
    opacity 300ms,
    transform 200ms,
    filter 400ms;
}

.login-form-leave-active {
  transition:
    opacity 300ms,
    transform 200ms,
    filter 400ms;
}

.login-form-leave-to {
  opacity: 0;
  transform: scale(0.9);
  filter: blur(10px);
  // transform: translateX(-100px);
}

form {
  max-width: 30rem;
  margin: auto;
  margin-block: max(5vh, 5vw);
}

fieldset {
  border: $gap-px solid;
  @include prime_border_color;
  display: flex;
  flex-direction: column;
  gap: $gap-l;
  padding-block: $gap-l;

  legend {
    max-width: 4rem;
    word-break: keep-all;
    // 以上样式用于适应Safari
    font-size: $fz-xl;
    padding: $gap-s;
    margin-left: $gap;
    box-shadow: 0 0 0 5px;
    @include prime_bg_white_txt;
  }
}

.input {
  @include input_label_effect;

  &_field {
    outline-offset: 3px;
    border-width: 1px;
    transition: all 300ms;
    // box-shadow: 0px 0px 2px 1px transparent inset;
    // border-width: 2px;
    // border-style: double;

    &:not(:placeholder-shown) {
      // border-style: solid;

      &:invalid {
        @include red_border_clr;
        @include red_inset_shadow;
      }
    }

    &:valid {
      @include prime_border_clr;
      @include prime_inset_shadow;
    }
  }
}

.submit {
  flex: 1;
  transform: translateY(0);

  // &:where(:hover, :focus-visible) {
  //   transform: translateY(-1px);
  //   box-shadow: 0px 1px 3px 1px hsl(0, 0%, 50%);
  // }

  // &:active {
  //   transform: scale(0.99) translateY(0);
  //   box-shadow: 0px 0px 0px 0px hsl(0, 0%, 50%);
  // }

  &.invalid {
    opacity: 0.5;
    box-shadow: none;
    transform: none;
  }
}
</style>

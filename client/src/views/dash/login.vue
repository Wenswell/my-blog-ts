<template>
  <form @submit.prevent="onSubmit">
    <fieldset>
      <!-- <ModeToggleButton class="theme" /> -->
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
    </fieldset>
  </form>
</template>

<script setup lang="ts">
// import ModeToggleButton from '@/components/ModeToggleButton.vue'

import { computed, reactive, ref } from 'vue'

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

const submit = ref({})

const accountError = computed(() => {
  return !RegExp(info.account.regex).test(formValue.account)
})
const passwordError = computed(() => {
  return !RegExp(info.password.regex).test(formValue.password)
})

const onSubmit = () => {
  // 验证逻辑
  // 提交逻辑
  submit.value = formValue
}
</script>

<style lang="scss" scoped>
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
    &:not(:placeholder-shown):invalid {
      @include red_border_clr;
    }

    &:valid {
      @include prime_border_clr;
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

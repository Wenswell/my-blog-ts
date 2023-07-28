import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { Themes } from 'md-editor-v3'

const STORE_NAME = 'information'
// interface UserInfo {
//   id?: number
//   account?: string
//   password?: string
//   accessToken?: string
//   refreshToken?: string
// }
// const DEFAULT_INFO = {
//   id: 0,
//   account: '',
//   password: '',
//   accessToken: '',
//   refreshToken: '',
// }

const CONFIG = {
  theme: 'light',
}

// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
const AdminStore = defineStore('admin', {
  state: () => {
    return {
      // user: useStorage(STORE_NAME, DEFAULT_INFO, localStorage, {
      //   mergeDefaults: true,
      // }),
      config: useStorage(STORE_NAME, CONFIG, localStorage, {
        mergeDefaults: true,
      }),
    }
  },
  actions: {
    updateDarkMode(isDark: Themes) {
      this.config.theme = isDark
    },
    // updateUserInfo(newInfo: Partial<UserInfo>) {
    //   this.user = {
    //     ...this.user,
    //     ...newInfo,
    //   }
    // },
    // updateAccessToken(newToken: string) {
    //   this.user.accessToken = newToken
    // },
    // cleanInfo() {
    //   this.user = DEFAULT_INFO
    // },
  },
  getters: {
    getIsDark(state) {
      return state.config.theme
    },
    // getUserInfo(state) {
    //   return state.user
    // },
    // getToken(state) {
    //   return {
    //     access: state.user.accessToken,
    //     refresh: state.user.refreshToken,
    //   }
    // },
  },
})

export default AdminStore

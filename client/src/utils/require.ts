// require.ts

import axios from 'axios'

export const baseURL = 'http://192.168.1.5:7333'

const AxiosInstance = axios.create({
  baseURL: 'http://192.168.1.5:7333',
  timeout: 5000,
})

export default function request(
  url: string,
  method: 'get' | 'post' | 'put' | 'delete',
  submitData?: object,
  isUpload?: boolean,
) {
  // 请求拦截
  AxiosInstance.interceptors.request.use(
    (config) => {
      console.log('config', config)
      // 获取token
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('token='))
        ?.split('=')[1]

      if (token) {
        // 设置token到请求头
        config.headers.Authorization = `Bearer ${token}`
      }
      if (isUpload) {
        config.headers['Content-Type'] = 'multipart/form-data'
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  // 拦截响应

  AxiosInstance.interceptors.response.use((response) => {
    // if (response?.data?.code == 401) {
    //   // 跳转到登录页面
    //   const fullPath = encodeURIComponent(router?.currentRoute?.value?.fullPath)
    //   router.push('/login?redirectUrl=' + fullPath)
    // }

    return Object.keys(response).includes('success') ? response : response?.data
  })

  /**
   * Request 请求函数
   */

  return AxiosInstance({
    method,
    url,
    [method.toLowerCase() === 'get' || method.toLowerCase() === 'delete'
      ? 'params'
      : 'data']: submitData,
  })
}

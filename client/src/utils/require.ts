// require.ts

import axios, { AxiosResponse } from 'axios'

const AxiosInstance = axios.create({
  baseURL: 'http://192.168.1.5:7333',
  timeout: 5000,
})

// 请求拦截
AxiosInstance.interceptors.request.use(
  (config) => {
    // 获取token
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='))
      ?.split('=')[1]

    if (token) {
      // 设置token到请求头
      config.headers.Authorization = `Bearer ${token}`
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
  return response?.data
})

/**
 * Request 请求函数
 */

export default function request(
  url: string,
  method: 'get' | 'post' | 'put' | 'delete',
  submitData?: object,
): Promise<AxiosResponse> {
  return AxiosInstance({
    method,
    url,
    [method.toLowerCase() === 'get' || method.toLowerCase() === 'delete'
      ? 'params'
      : 'data']: submitData,
  })
}

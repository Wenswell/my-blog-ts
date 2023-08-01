import axios from 'axios'

const serverURL = 'https://wswensw.top/api'
// const serverURL = 'http://124.221.124.116:8081'

axios.defaults.baseURL = serverURL

const AxiosInstance = axios.create({
  timeout: 5 * 1000,
})

export default async (url: string, method: string, submitData: object) => {
  // 拦截请求
  AxiosInstance.interceptors.request.use(
    (config) => {
      console.log('#############config', config)

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
    console.log(`+++++++++${new Date()}`)
    console.log('response?.status', response?.status)
    console.log('response', response)
    console.log('response?.data', response?.data)
    return response?.data
  })

  try {
    const asfasdgasd = await AxiosInstance({
      url,
      method,
      // method参数：get,Get,GET  转换成小写再来判断
      [method.toLowerCase() === 'get' || method.toLowerCase() === 'delete'
        ? 'params'
        : 'data']: submitData,
    })
    console.log('!!!!!!!!!!asfasdgasd', asfasdgasd)
    return asfasdgasd
  } catch (error) {
    console.log('请求错误：', error)
  }
}

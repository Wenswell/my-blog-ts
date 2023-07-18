// import axios from 'axios'

// const serverURL = 'http://192.168.1.5:7333/'
// // const serverURL = 'http://localhost:7333/'

// axios.defaults.baseURL = serverURL

// export default async (url, method, submitData, isUpload) => {

//   const AxiosInstance = axios.create({
//     timeout: 10000,
//   });

//   // 拦截请求
//   AxiosInstance.interceptors.request.use(config => {
//     const { access, refresh } = adminStore.getToken
//     if (refresh) {
//       config.headers.accessToken = access ?? ''
//       config.headers.refreshToken = refresh ?? ''
//     }
//     if(isUpload){
//       config.headers['Content-Type'] = 'multipart/form-data'
//       console.log("isUpload---config.headers", config.headers)
//     }
//     return config
//   })

//   // 拦截响应
//   AxiosInstance.interceptors.response.use(

//     response => {
//       if (response?.data?.code == 204) {
//         adminStore.updateAccessToken(response?.data?.data?.accesstoken)
//         const { access, refresh } = adminStore.getToken
//         const safeURL = response.config.url[0] == '/' ? response.config.url.slice(1) : response.config.url
//         const data =( response.config.method === 'get' || response.config.method === 'delete')?response.config.params:response.config.data
//         return sendRequest(serverURL + safeURL, response.config.method, {
//           'accessToken': access,
//           'refreshToken': refresh,
//           'Content-Type': 'application/json'
//         }, data).then(res => {
//           console.log('xhr:', res)
//           return res
//         })
//       }
//       if (response?.data?.code == 401) {
//         // 跳转到登录页面
//         const fullPath = encodeURIComponent(router?.currentRoute?.value?.fullPath)
//         router.push('/login?redirectUrl=' + fullPath)

//       }
//       return response?.data
//     }
//   )

//   try {
//     return await AxiosInstance({
//       url,
//       method,
//       // method参数：get,Get,GET  转换成小写再来判断
//       [method.toLowerCase() === 'get' || method.toLowerCase() === 'delete' ? 'params' : 'data']: submitData
//     })
//   } catch (error) {
//     console.log('请求错误：', error)
//   }
// }

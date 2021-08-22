import axios from 'axios'

export function request(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 5000
  })

  // 2.axios的拦截器
  // 2.1.请求拦截的作用 在发送请求前可以先进行的操作
  instance.interceptors.request.use(config => {
    //发送请求前拼接一个headers
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // console.log(config);
    return config
  }, err => {
    // console.log(err);
  })

  // 2.2.响应拦截
  instance.interceptors.response.use(res => {
    return res.data
  }, err => {
    console.log(err);
  })

  // 3.发送真正的网络请求
  return instance(config)
}
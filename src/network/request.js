import axios from 'axios'
// 导入进度条加载包
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export function request(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 5000
  })

  // 2.axios的拦截器
  // 2.1.请求拦截的作用 在发送请求前可以先进行的操作
  instance.interceptors.request.use(config => {
    // 进度条开始
    NProgress.start();
    //发送请求前拼接一个headers
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // console.log(config);
    return config
  }, err => {
    // console.log(err);
  })

  // 2.2.响应拦截
  instance.interceptors.response.use(res => {
    //进度条显示
    NProgress.done();
    return res.data
  }, err => {
    console.log(err);
  })

  // 3.发送真正的网络请求
  return instance(config)
}
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/css/base.css';
import './assets/css/normalize.css';

// 导入字体图标
import './assets/fonts/iconfont.css'
Vue.config.productionTip = false

//导入axios
import axios from 'axios';
  // 设置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

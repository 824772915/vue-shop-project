# vue-shop电商后台管理项目笔记

## 预：配置服务器

1. 打开phpstudy开启电脑的mysql服务
2. 打开服务器终端开启 node ./app.js 使得服务运行起来

## 一、基本配置

- 删除新建脚手架的多余内容

- 对.eslintrc.js的 '@vue/standard' 注释掉 关闭eslint检测

- less与scss的安装要注意版本 太高版本会报错

- APP.vue中配置路由占位符展示页面内容

  - keepalive的使用可以使得单页面应用切换时不被销毁 按照具体使用

  ```html
  <!-- 路由占位符 不使用keepalive-->
  <router-view></router-view>

  <!-- 路由占位符 使用keepalive-->
  <keep-alive>
    <router-view/>
  </keep-alive>
  ```


- 配置全局公共css （assets/css/normalize.css 和 base.css）

  ​

## 二、实现登录功能

#### token与 cookie和session的选择

如果服务器和客户端同源，建议可以使用cookie或者session来保持登录状态
如果客户端和服务器跨域了，建议使用token进行维持登录状态。

**登录逻辑：**
在登录页面输入账号和密码进行登录，将数据发送给服务器
服务器返回登录的结果，登录成功则返回数据中带有token
客户端得到token并进行保存，后续的请求都需要将此token发送给服务器，服务器会验证token以保证用户身份。

### 1.登录样式布局

- 登录页面布局 水平垂直居中

```css
position: absolute;
left: 50%;
top: 50%;
transform: translate(-50%,-50%);
```

- box-sizing: border-box的使用 使得布局更加方便


- 登录表单的样式 预验证 均使用elementUI快速构建 

  （验证用正则表达式进行验证）

  ​

### 2.登录功能的实现

先对axios进行全局的注册 防止axios被淘汰，先封装axios实例对象

network中创建request.js封装axios

```js
import axios from 'axios'

export function request(config) {
  // 1.创建axios的实例
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 5000
  })

  // 2.axios的拦截器
  // 2.1.请求拦截的作用
  instance.interceptors.request.use(config => {
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
```

封装登录请求login.js

```js
import {request} from "./request";

export function postLogin(username,password) {
  return request({
    url: '/login',
    params:{
      username,
      password
    }
  })
}
```

登录页面Login.vue中导入login请求  

判断账号密码 且获取token存入sessionStorage

```js
import {postLogin} from '../network/login'

login(){
// 通过表单from的ref获得表单实例 再通过element的原生validate()方法先预验证
this.$refs.loginFormRef.validate(async valid=>{
// console.log(valid);
if(!valid)return; //!valid => valid = false 等于true就执行下一步
     postLogin(this.loginForm.username,this.loginForm.password).then(res=>{
       console.log(res);
       if(res.meta.status !== 200){
         return  this.$message.error("登录失败");
       }else{
         this.$message.success('登录成功');
         window.sessionStorage.setItem('token', res.data.token);
         this.$router.push('/home'); 
       }
     })
})
}
```

设置路由导航守卫 防止没登录直接进入主页（router中 index.js）

对sessionStorage中的token值进行判断 如果为空则强制跳转到登录页面

```js
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转

  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr){
    return next('/login')
  }else{
    next()
  }
})
```



## 三、实现主页功能

- 基于elementui的组件库实现主页页面样式的基本布局


- 写请求获取主页侧边栏消息

  - 封装侧边栏请求network/home.js中的getMenus

    ```js
    import {request} from "./request";

    export function getMenus() {
      return request({
        url: '/menus',
        params:{

        }
      })
    }
    ```


- home组件中使用请求获取数据并且展示在列表栏中 实现一二级菜单

- home组件中使用路由占位符使得用户登录后跳转主页面并在主页面展示welcome组件内容

  ```js
  //router中
  {
      path:'/home',
      component:Home,
      //重定向到welcome
      redirect:'/welcome',
      // 子组件的设置
      children:[
        {path:'/welcome',
         component:Welcome
        }
      ]
    }
  ```


- 对侧边导航栏中的列表开启路由跳转功能（element自带），给侧边栏el-menu设置 :router="true" 属性 使得二级列表可以进行跳转 


- 侧边栏功能完成后，对路由跳转的页面进行数据展示

#### 实现主页功能——用户列表

1. 根据ui图使用elementui快速创建相应的样式

2. 用户列表除了展示用户数据之外 还要有添加用户 搜索用户 修改用户等操作

3. 先创建相应的请求获取用户列表(network/home.js)

   ```js
   // 获取user组件中用户列表数据
   export function getUsers(query,pagenum,pagesize) {
     return request({
       url: '/users',
       params:{
         query,
         pagenum,
         pagesize
       }
     })
   }
    
   ```

- 同理通过请求完成修改用户状态  添加用户 查询用户 功能

  - **注意的是 axios实例方法中 post请求请求参数放在body需要写在data中,除了get请求默认外，需要用method写请求类型，或者需要拼接字符串**

    ```js
    // 添加用户请求
    export function postUser(username,password,email,mobile) {
      return request({
        method:'post',
        url: '/users',
        params:{

        },
        // post请求中放在body的数据
        data:{
          username,
          password,
          email,
          mobile
        }
      })
    }
      
    // 修改用户状态  需要拼接字符串
    export function putState(uId,type) {
      return request({
        method:'put',
        url: '/users/'+uId+'/state/'+type+'',
        params:{
          
        }
      })
    }
    ```


- 添加用户（注册）功能中，先使用预判断在前端进行判断，基本合法后再通过请求发送到后端进行注册验证（是否存在相同用户名等等）

  ```js
  //通过 ref获取是哪个组件 再通过validate的返回值 valid预检测
  addUser(){
  // 先进行预判断 看返回值valid是否为true 所有判断合法
  this.$refs.addFormRef.validate(valid => {
  //  不合法的话直接return
  if (!valid) return
  //  合法的话进行post请求添加成员
  postUser(this.addForm.username,this.addForm.password,this.addForm.email,this.addForm.mobile).then(res =>{
              // console.log(res);
               if(res.meta.status !== 201){
                  return this.$message.error(res.meta.msg)
               }else{
                  this.$message.success(res.meta.msg)
                  // 隐藏添加用户的对话框
                  this.addDialogVisible = false
                  // 重新获取用户列表数据
                  this.getUsers()
              }
            })
         })
      },
  ```



## 可视化富文本框依赖

1. vue-ui中 在依赖中 添加运行依赖 vue-quill-editor

2. 然后进行全局注册

   main.js中

   ```js
   import Vue from 'vue'
   import VueQuillEditor from 'vue-quill-editor'

   import 'quill/dist/quill.core.css' // import styles
   import 'quill/dist/quill.snow.css' // for snow theme
   import 'quill/dist/quill.bubble.css' // for bubble theme

   Vue.use(VueQuillEditor)
   ```



## 项目优化

1.vueui中 从生成打包报告的对警告等代码进行处理

- 删除所有consloe.log   
- 将体积太大的文件分开打包
- 将无用的全局变量在最后定义为空
- 通过vue.config.js修改webpack配置（通过chainWebpack节点修改）

2.第三方库启用cdn

- 将体积太大的文件分开打包  webpack中使用externals加载外部cdn资源 当读取到相应的包时，会直接使用而不是打包在一起

3.elementui等第三方库按需导入

4.路由懒加载

- 安装路由懒加载插件

  npm install --save-dev @babel/plugin-syntax-dynamic-import

- 在babel.config.js文件中声明该插件

  ```js
  {
    "plugins": ["@babel/plugin-syntax-dynamic-import"]
  }
  ```

- 打开router.js，将路由组件从按需加载更改为懒加载

  ```js
  import Login from './components/Login.vue' 
  更改为
  const Login = () => import(/* webpackChunkName:"login_home_welcome" */ './components/Login.vue')

  ```



## 部署上线

通过node和express 配置部署dist文件夹在服务器 实现部署上线 （有云服务器的通过云服务器进行配置）







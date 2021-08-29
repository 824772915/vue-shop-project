import Vue from 'vue'

import VueRouter from 'vue-router'

// import Login from "../components/Login.vue";
// import Home from "../components/Home.vue";
// import Welcome from "../components/Welcome.vue";
const Login = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Welcome.vue')

// import Users from "../components/Users/Users.vue";
// import Rights from "../components/Power/Right.vue";
// import Roles from "../components/Power/Roles.vue";
const Users = () => import(/* webpackChunkName:"Users_Rights_Roles" */ '../components/Users/Users.vue')
const Rights = () => import(/* webpackChunkName:"Users_Rights_Roles" */ '../components/Power/Right.vue')
const Roles = () => import(/* webpackChunkName:"Users_Rights_Roles" */ '../components/Power/Roles.vue')

// import Cate from "../components/Goods/Cate.vue";
// import Params from '../components/Goods/Params.vue';
const Cate = () => import(/* webpackChunkName:"Cate_Params" */ '../components/Goods/Cate.vue')
const Params = () => import(/* webpackChunkName:"Cate_Params" */ '../components/Goods/Params.vue')


// import GoodsList from '../components/Goods/List.vue';
// import Add from '../components/Goods/Add.vue';
const GoodsList = () => import(/* webpackChunkName:"GoodsList_Add" */ '../components/Goods/List.vue')
const Add = () => import(/* webpackChunkName:"GoodsList_Add" */ '../components/Goods/Add.vue')


// import Order from '../components/orders/Order.vue';
// import Report from '../components/report/Report.vue';
const Order = () => import(/* webpackChunkName:"Order_Report" */ '../components/orders/Order.vue')
const Report = () => import(/* webpackChunkName:"Order_Report" */ '../components/report/Report.vue')

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'/home',
    component:Home,
    redirect:'/welcome',
    // 子组件的设置
    children:[
      {path:'/welcome',
       component:Welcome
      },
      {path:'/users',
       component:Users
       },
      {path:'/rights',
        component:Rights
      },
      {path:'/roles',
        component:Roles
      },
      {path:'/categories',
      component:Cate
      },
      {path:'/params',
      component:Params
      },
      {path:'/goods',
      component:GoodsList
      },
      {path:'/goods/add',
      component:Add
      },
      {path:'/orders',
      component:Order
      },
      {path:'/reports',
      component:Report
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

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


export default router

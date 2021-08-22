<template>
 <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img class="head_logo" src="../assets/img/school.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 --> 
      <el-aside :width="isCollapse ? '64px' : '200px'">  <!-- 侧边栏宽度 进行判断 折叠的时候为64px 展开为200px -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->

              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>

          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {getMenus} from '../network/home'
export default {
  data(){
    return{
      menulist: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created(){
    // 获取侧边栏菜单
    getMenus().then(res =>{
      // console.log(res);
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }else{
        this.menulist = res.data
      }
    })
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  updated(){
    
  },
  methods:{
    // 退出登录方法
    logout(){
      // 删除token 跳转到login页面
      window.sessionStorage.removeItem("token");
      this.$router.push('/login');
    },
    // 侧边栏折叠方法
    toggleCollapse(){
      // elementui 导航栏 自带方法
      this.isCollapse = !this.isCollapse
    },
    // 二级菜单单击事件 保存连接的高亮激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath);
      this.activePath = window.sessionStorage.getItem('activePath');
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  .el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    .head_logo{
      height: 40px;

    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  // 鼠标放置变成小手
  cursor: pointer;
}
</style>


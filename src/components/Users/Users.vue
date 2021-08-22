<template>
  <div>
    <!-- 面包屑导航区域 Breadcrumb -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" >添加用户</el-button>
        </el-col>
      </el-row> 
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>  <!-- 索引列 -->
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="{}">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <!-- 分配角色按钮  tooltip文字提示组件-->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

  </div>
</template>

<script>
import {getUsers,putState} from '../../network/home'
export default {
  data(){
    return{
      // 查询参数
      query:'',
      // 当前页码
      pagenum:1,
      // 每页显示条数
      pagesize:2,
      userlist:[],
      total:0
    }
  },
  created(){
    // 请求用户列表
    this.getUsers();
  },
  methods:{
    // 请求用户列表方法
    getUsers(){
      getUsers(this.query,this.pagenum,this.pagesize).then(res =>{
      // console.log(res);
      if(res.meta.status !== 200){
        return this.$message.error(res.meta.msg)
      }else{
        this.userlist = res.data.users
        this.total = res.data.total
      }
    })
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.pagesize = newSize;
      this.getUsers(); 
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.pagenum = newPage
      this.getUsers();
    },
    // 用户状态改变方法
    userStateChanged(userinfo){
      console.log(userinfo);
      // 调用请求 更新用户状态
      putState(userinfo.id,userinfo.mg_state).then(res =>{
        if(res.meta.status !== 200){
          userinfo.mg_state = !userinfo.mg_state
          return this.$message.error(res.meta.msg)
        }else{
          this.$message.success(res.meta.msg)
        }
      })

    },
    
  }
}
</script>

<style lang="less" scoped>

</style>

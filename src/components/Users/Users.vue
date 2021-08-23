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
          <el-input placeholder="请输入内容" v-model="query" clearable @clear="getUsers">
            <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true" >添加用户</el-button>
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
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
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

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
     <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {getUsers,putState,postUser,getUsersID,putUsers,deleteUsers} from '../../network/home'
export default {
  data(){
     // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }

      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }
    return{
      // 查询参数
      query:'',
      // 当前页码
      pagenum:1,
      // 每页显示条数
      pagesize:2,
      userlist:[],
      total:0,
      // 添加用户弹出对话框
      addDialogVisible:false,
      // 添加用户逇表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户信息弹出对话框
      editDialogVisible:false,
      // 查询到的用户信息对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户手机', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
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
    //监听添加用户对话框关闭
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户的时候对表单保存且验证
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
    // 用户修改操作
    showEditDialog(id){
      getUsersID(id).then(res =>{
        if(res.meta.status !== 200){
          return this.$message.error(res.meta.msg)
        }else{
          console.log(res);
          this.editForm = res.data
        }
      })
      this.editDialogVisible = true;
      
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed(){
      this.$refs.editFormRef.resetFields();
    },
    // 修改用户的时候对表单保存且验证
    editUserInfo(){
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息的数据请求
       putUsers(this.editForm.id,this.editForm.email,this.editForm.mobile).then(res =>{
         if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败！')
        }else{
          // 关闭对话框
          this.editDialogVisible = false
          // 刷新数据列表
          this.getUsers()
          // 提示修改成功
          this.$message.success('更新用户信息成功！')
        }
       })
      })
    },
    // 删除用户操作
    async removeUserById(id){
      // console.log(id);
      // 发送删除用户请求
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // console.log(confirmResult);
      if(confirmResult !== 'confirm'){
        return this.$message.info('删除操作')
      }else{
        deleteUsers(id).then(res =>{
            if (res.meta.status !== 200) {
               return this.$message.error('删除用户失败！')
             }else{
               this.$message.success('删除用户成功！')
               this.getUsers()
             }
        })
      }

    // deleteUsers(id).then(res =>{
    //     console.log(res);
    // })

    }
  }
}
</script>

<style lang="less" scoped>

</style>

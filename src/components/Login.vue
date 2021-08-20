<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 表单区域 -->
      <el-form  ref="loginFormRef" label-width="0px" :model="loginForm" :rules="loginFormRules" class="login_from">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
       <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="success">注册</el-button>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      loginForm: {
        username: '',
        password: ''
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    // 重置
    resetLoginForm(){
      // 通过表单from的ref获得表单实例 再通过element的原生resetFields()方法重置验证
      this.$refs.loginFormRef.resetFields();
    },
    // 登录
    login(){
      // 通过表单from的ref获得表单实例 再通过element的原生validate()方法先预验证
      this.$refs.loginFormRef.validate(async valid=>{
        // console.log(valid);
        if(!valid)return; //!valid => valid = false 等于true就执行下一步
        // const{data:res}直接解构data赋值给res
        const {data:res} = await this.$http.post('login',this.loginForm);
        // 通过res的状态码进行判定 是否登录成功
        if(res.meta.status !== 200){
          return  this.$message.error("登录失败");
        }else{
          this.$message.success('登录成功');
          
        // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
        //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
        //   1.2 将服务器返回的 token 保存在 sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token)  
        // 2. 跳转到主页（编程式导航）
        this.$router.push('/home')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

.login_container{
  // 渐变色
  background: linear-gradient(to bottom right, #2b4b6b, #eee);
  height: 100%;
  .login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    
    .avatar_box{
      height: 130px;
      width: 130px;
      border-radius: 50%;
      border: 1px solid #eee; 
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      background-color: #fff;
      img{
        width: 100%;
        height: 100%;
        background-color: #eee;
        border-radius: 50%;

      }
    }
  }
}
.login_from{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  .btns{
    display: flex;
    justify-content: flex-end;
  }
}

</style>
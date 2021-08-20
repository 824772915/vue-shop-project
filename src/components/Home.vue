<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  data(){
    return{

    }
  },
  methods:{
    // 退出登录方法
    logout(){
      // 删除token 跳转到login页面
      window.sessionStorage.removeItem("token");
      this.$router.push('/login');
    }
  }
}
</script>

<style lang="less" scoped>

</style>


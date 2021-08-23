import {request} from "./request";

// 获取侧边导航栏数据
export function getMenus() {
  return request({
    url: '/menus',
    params:{

    }
  })
}

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
// 修改用户状态
export function putState(uId,type) {
  return request({
    method:'put',
    url: '/users/'+uId+'/state/'+type+'',
    params:{
      
    }
  })
}

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

// 查询用户  请求
export function getUsersID(id) {
  return request({
    url: '/users/'+id+'',
    params:{
      
    }
  })
}

// 1.3.5  编辑用户提交  请求
export function putUsers(id,email,mobile) {
  return request({
    method:"put",
    url: '/users/'+id+'',
    params:{
      
    },
    data:{
      email,
      mobile
    }
  })
}
// 删除单个用户
export function deleteUsers(id) {
  return request({
    method:"delete",
    url: '/users/'+id+'',
    params:{
      
    },
    data:{
    }
  })
}
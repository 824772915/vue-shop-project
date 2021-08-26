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

// 权限列表请求~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// 获取权限列表
export function getRightsList() {
  return request({
    url: '/rights/list',
    params:{
      
    },
    data:{
    }
  })
}

// 1.5.1. 角色列表
export function getRolesList() {
  return request({
    url: '/roles',
    params:{
      
    },
    data:{
    }
  })
}

// 编辑提交角色
export function putRoles(id,roleName,roleDesc) {
  return request({
    method:'put',
    url: '/roles/'+id+'',
    params:{
      
    },
    data:{
      roleName,
      roleDesc
    }
  })
}
//添加角色
export function addRoles(roleName,roleDesc) {
  return request({
    method:'post',
    url: '/roles',
    params:{
      
    },
    data:{
      roleName,
      roleDesc
    }
  })
}
// 查询角色
export function getRoles(id) {
  return request({
    url: '/roles/'+id+'',
    params:{
      
    },
    data:{
    }
  })
}
// 删除角色
export function deleteRoles(id) {
  return request({
    method:"delete",
    url: '/roles/'+id+'',
    params:{
      
    },
    data:{
    }
  })
}

// 1.5.7. 删除角色指定权限
export function deleteRolesRights(roleId,rightId) {
  return request({
    method:"delete",
    url: '/roles/'+roleId+'/rights/'+rightId+'',
    params:{
      
    },
    data:{
    }
  })
}

// 1.4.1. 所有权限列表
export function getRightsTree() {
  return request({
    url: '/rights/tree',
    params:{
      
    },
    data:{
    }
  })
}
// 1.5.6. 角色授权
export function allotRights(roleId,rids) {
  return request({
    method:'post',
    url: '/roles/'+roleId+'/rights',
    params:{
      
    },
    data:{
      rids
    }
  })
}

// 1.3.7. 分配用户角色
export function putUsersRole(id,rid) {
  return request({
    method:'put',
    url: '/users/'+id+'/role',
    params:{
      
    },
    data:{
      rid
    }
  })
}
// 权限列表请求~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// 分类列表请求~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//1.6.1. 商品分类数据列表
export function getCateList(type,pagenum,pagesize) {
  return request({
    url: '/categories',
    params:{
      type,
      pagenum,
      pagesize
    },
    data:{
    }
  })
}
// 1.6.2. 添加分类
export function postCategories(cat_pid,cat_name,cat_level) {
  return request({
    method:'post',
    url: '/categories',
    params:{
      
    },
    data:{
      cat_pid,
      cat_name,
      cat_level
    }
  })
}
// 分类列表请求~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
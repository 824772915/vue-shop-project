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
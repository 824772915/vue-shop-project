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
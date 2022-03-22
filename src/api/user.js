import request from '@/utils/request'
import http from '@/utils/http'
export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
//获取用户列表
export const getListApi = async(parm) =>{
  return await http.get("/api/user/list",parm)
}
//新增
export const addUserApi = async(parm) =>{
  return await http.post("/api/user",parm)
}
//编辑
export const editUserApi = async(parm) =>{
  return await http.put("/api/user",parm)
}
//删除
export const deleteUserApi = async(parm) =>{
  return await http.delete("/api/user",parm)
}

//获取角色id
export const getRoleListApi = async(parm) =>{
  return await http.get("/api/user/getRoleList",parm)
}

//根据用户id查询角色
export const getRoleIdApi = async(parm) =>{
  return await http.get("/api/user/getRoleId",parm)
}

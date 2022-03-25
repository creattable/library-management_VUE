import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  // return Cookies.get(TokenKey)
  return sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
  // return Cookies.set(TokenKey, token)
  return sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
  // return Cookies.remove(TokenKey)
  return sessionStorage.clear
}

//存储用户id到cookies里面
export function setUserId(userId) {
  return Cookies.set("userId", userId)
}

//根据用户id来获取存储的用户cookies
export function getUserId() {
  return Cookies.get("userId")
}

export function removeUserId() {
  return Cookies.remove("userId")
}
//sessionStorage清空，token失效后记得清空
export function clearSession(){
  return sessionStorage.clear()
}
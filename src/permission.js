import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist
//全局守卫路由
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  //获取token，从Cookies里面获取token
  // determine whether the user has logged in
  const hasToken = getToken()

  //判断token是否存在
  if (hasToken) {

    //判断是否为登录，如果是登录则直接跳转到首页
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {

      //从vuex里面获取用户的所有权限
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0

      if (hasRoles) {
        //有权限则直接放行
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          //如果没有则从后端服务器获取权限信息,vuex里面的src\store\modules\user.js的getInfo方法
          const { roles } = await store.dispatch('user/getInfo')

          // generate accessible routes map based on roles
          //动态的生成菜单和路由，很关键！！！
          //src\store\modules\permission.js
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    //判断是否在白名单中，如果存在直接放行，不存在则重定向到login登录
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      //直接放行
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

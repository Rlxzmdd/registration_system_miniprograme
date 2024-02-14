const { loginByCode, getMyRole } = require("../../api/user")
const { getStuSimpleInfo } = require("../../api/student")
const Base64 = require("../../utils/base64")
import { getRoleRouter, shareApp } from '../../api/other'

const app = getApp()
let timeout = null
let nextRoute = ''
let routeParams = ''

Page({
  data: {

  },

  onLoad(options) {
    let { targetRoute, ...params } = options
    if (targetRoute) {
      if (params)
        routeParams = params
      app.globalData.targetRoute = {
        'routeName': targetRoute,
        'routeParams': routeParams
      }
      this.data.targetRoute = targetRoute

    }
    else
      this.data.targetRoute = 'index'


    this.checkBindStatus()
  },

  // 检查绑定(登录)状态
  checkBindStatus() {
    // let userInfo = wx.getStorageSync('userInfo')
    // if (!userInfo || !userInfo.token) {
    //   this.wxLogin()
    // } else if (!userInfo.userType || !userInfo.name) {
    //   this.getSimpleInfo(userInfo.token)
    // } else {
    //   app.globalData.userInfo = userInfo
    //   nextRoute = this.data.targetRoute
    // }
    this.wxLogin()
    this.timeoutJump()
  },

  // 定时跳转
  timeoutJump() {
    if (timeout) clearTimeout(timeout)
    timeout = null
    timeout = setTimeout(() => {
      if (nextRoute) {
        if (nextRoute != 'login' && app.globalData.funcRouter) {
          app.$router.redirect(nextRoute, routeParams)
        } else if (nextRoute == 'login') {
          app.$router.redirect(nextRoute, routeParams)
        } else {
          this.timeoutJump()
        }
      }
      else
        this.timeoutJump()
    }, 2000)
  },

  // 登录(获取token,没有则跳转到登录页)
  wxLogin() {
    const that = this
    wx.login({
      timeout: 10000,
      success(res) {
        if (res.code) {
          console.log('code =>', res.code)
          loginByCode(res.code).then(async (res) => {
            console.log('loginByCode success=>', res)

            let userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {}
            userInfo.token = res.authorization
            wx.setStorageSync('userInfo', userInfo)
            app.globalData.userInfo = userInfo

            // 获取用户简略信息
            that.getSimpleInfo(res.authorization)
          }).catch(err => {
            if (err.code == 'V0100') {
              nextRoute = 'login'
            }
          })
        } else {
          clearTimeout(timeout)
          console.log('wx.login登录失败！' + res.errMsg)
        }
      }
    })
  },

  // 获取用户简略信息
  getSimpleInfo(token) {
    let simpleInfo = {}

    // 获取用户类型
    // 解码token的第二段
    let decodeRes = Base64.decode(token.split('.')[1])
    decodeRes = decodeRes.substring(0, decodeRes.length - 2)
    let userIdentiy = JSON.parse(decodeRes)
    const { user_type, user_id, exp } = userIdentiy
    Object.assign(simpleInfo, {
      userType: user_type,
      userId: user_id,
      exp
    })

    // 获取用户角色
    getMyRole().then(async res => {
      let role = []
      let roleId = []
      res.forEach(item => {
        role.push(item.role)
        roleId.push(item.id)
      })
      this.getRouter(roleId)

      // 判断身份
      let identity = ''
      if (role.length == 1 && role[0].indexOf('学生') != -1) {
        // 学生
        identity = '学生'
      } else if (role.includes('助辅')) {
        identity = '助辅'
      } else if (role.includes('管理员')) {
        identity = '管理员'
      }

      Object.assign(simpleInfo, {
        role,
        roleId,
        identity
      })

      if (userIdentiy.user_type == 'student') {
        // 学生用户
        let stuInfo = await getStuSimpleInfo()
        if (stuInfo) Object.assign(simpleInfo, stuInfo)
      }

      // 将用户信息写入缓存
      let userInfo = wx.getStorageSync('userInfo')
      Object.assign(userInfo, simpleInfo)
      wx.setStorageSync('userInfo', userInfo)
      app.globalData.userInfo = userInfo

      nextRoute = this.data.targetRoute
    })
  },

  // 获取首页功能路由
  getRouter(roleId) {
    getRoleRouter(roleId).then(res => {
      app.globalData.funcRouter = res
    })
  },

  // 转发
  onShareAppMessage() {
    return shareApp('HeyNUIT', 'index')
  }
})
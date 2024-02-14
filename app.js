import MiniRouter from './common/route/router'
import {
  getTokenbyId
} from './api/user'
import { getKeyMapper } from './api/other'

App({
  onLaunch() {
    this.$router = new MiniRouter()
    this.checkHasUpdate()
  },
  onShow() {
    // 暂且注释
    return false

    //更新token
    if (wx.getStorageSync('LoginData').number) {
      var oldtime = wx.getStorageSync('UserData').timestamp + wx.getStorageSync('UserData').data.expires
      var nowtime = Date.now()
      console.log('距离Token过期还有：', oldtime - nowtime)
      if (oldtime - nowtime < 10000)
        getTokenbyId().then(res => {
          console.log('Token刷新成功', res)
          res.timestamp = Date.now()
          wx.setStorageSync('UserData', res)
        }).catch().then(() => {

        })
    } else {
      wx.showModal({
        title: '提示',
        content: '您还没有登录，即将跳转到登录界面',
        showCancel: false,
        success(res) {
          wx.redirectTo({
            url: '/pages/my/login/login',
          })
        }
      })
    }
  },

  checkHasUpdate() {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      // console.log(res.hasUpdate)
      if (res.hasUpdate) {
        wx.removeStorageSync('userInfo')
      }
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
  },

  getKeyMap() {
    return new Promise(resolve => {
      if (this.globalData.dict) {
        resolve(this.globalData.dict)
      } else {
        getKeyMapper().then(res => {
          this.globalData.dict = res
          resolve(this.globalData.dict)
        })
      }
    })
  },

  globalData: {
    formList: {},
  }
})

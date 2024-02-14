import { shareApp } from '../../../api/other'
import {
  getInfoCode, queryExamineSelf
} from '../../../api/user'
let intervalArr = []

const app = getApp()

Page({
  data: {
    ShowNoScreen: false,
    ShowJumpSelect: false,
    imgData: '',
    ScreenBrightness: '',
    userData: '',
    Time: '',
    actions: [
      {
        name: '[第一步]点击去填写信息',
        subname: '适用于还没有填写金域服务信息申报',
        color: '#465fA6'
      },
      {
        name: '[第二步]已填写后点击展示二维码',
        subname: '适用于填写完金域信息申报后',
        color: '#f3cc7d'
      },
    ],
    EliminateData: []
  },

  onLoad: function (options) {
    var that = this
    // 获取屏幕亮度
    wx.getScreenBrightness({
      success: function (res) {
        that.setData({
          ScreenBrightness: res.value
        })
      }
    })
    //调整屏幕亮度
    wx.setScreenBrightness({
      value: 1,
    })
    //在当前页面显示导航条加载动画
    wx.showNavigationBarLoading();
    //显示 loading 提示框
    wx.showLoading({
      title: '刷新中...',
    })
    // 如果截屏触发提醒
    wx.onUserCaptureScreen(function (res) {
      that.setData({
        ShowNoScreen: true
      })
    })
  },

  onShow() {
    this.initData()
  },

  onHide: function () {
    this.closeInterval()
  },

  onUnload: function () {
    wx.setScreenBrightness({
      value: this.data.ScreenBrightness,
    })
    this.closeInterval()
  },

  onPullDownRefresh() {
    //显示 loading 提示框
    wx.showLoading({
      title: '刷新中...',
    })
    this.initData();
  },

  initData() {
    this.GetInfoCode()
    this.GetUserInfo()
    this.GetTime()
    this.GetSelfEliminate()
    this.closeInterval()


    let timeInterval = setInterval(() => {
      this.GetTime()
    }, 1000)
    // 每分钟刷新一次信息码与核销记录
    let codeInterval = setInterval(() => {
      this.GetInfoCode()
      this.GetSelfEliminate()
    }, 1 * 60 * 1000)
    intervalArr.push(timeInterval, codeInterval)
  },

  // 清除定时器
  closeInterval() {
    for (let inter of intervalArr) {
      clearInterval(inter)
    }
    intervalArr = []
  },

  // 点击关闭截屏提醒
  onClose(e) {
    this.setData({
      ShowNoScreen: false,
      ShowJumpSelect: false,
      ShowKefu: false
    });
  },

  //获取信息码
  GetInfoCode() {
    var _this = this;
    getInfoCode(600, 600).then(res => {
      _this.setData({
        imgData: res.qrcodeImg
      })
      //隐藏loading 提示框
      wx.hideLoading();
      //隐藏导航条加载动画
      wx.hideNavigationBarLoading();
      //停止下拉刷新
      wx.stopPullDownRefresh();
    })
  },

  // 获取核销记录
  GetSelfEliminate() {
    var that = this
    var oldLength = this.data.EliminateData.length;
    queryExamineSelf(0, 10).then(res => {
      that.setData({
        EliminateData: res.records
      })
    })
    var newLength = this.data.EliminateData.length;
    if (oldLength != newLength) {
      wx.vibrateLong()
    }
  },

  // 获取用户信息
  GetUserInfo() {
    let userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo')
    this.setData({
      userData: userInfo
    })
  },

  showItem() {
    wx.showModal({
      title: '提示',
      content: '如果医疗码生成已超过18个小时,\n请重新申请。 \n申请单位请务必输入：\n人工智能学院学生',
      showCancel: false,
      success(res) {

      }
    })
    // wx.showModal({
    //   title: '提示',
    //   content: '申请单位请务必输入AI+班级 如:AI19计应2',
    //   showCancel: false,
    //   success(res) {

    //   }
    // })
    var that = this
    that.setData({
      ShowJumpSelect: true
    })

  },

  // 动态时间滚动
  GetTime() {
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    var time = Y + '/' + M + '/' + D + ' ' + hour + ':' + minute + ':' + second
    this.setData({
      Time: time
    })
  },

  // 选择健康码跳转选项
  onSelect(event) {
    if (event.detail.color == "#465fA6") {
      wx.showModal({
        title: '提示',
        content: '单位请务必输入：人工智能学院学生',
        showCancel: false,
        success(res) {
          wx.navigateToMiniProgram({
            appId: 'wxab4091994ca61a81',
            path: 'pages/form/form',
            envVersion: 'release',// 打开正式版
            success(res) {
              // 打开成功
            },
            fail: function (err) {
              console.log(err);
            }
          })
        }
      })
    } else {
      wx.navigateToMiniProgram({
        appId: 'wxab4091994ca61a81',
        path: 'pages/formhistory/formhistory',
        envVersion: 'release',// 打开正式版
        success(res) {
          // 打开成功
        },
        fail: function (err) {
          console.log(err);
        }
      })
    }
  },

  // 点击查看我的信息
  viewMyInfo() {
    let userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {}
    app.$router.push('studentDetails', { stuId: userInfo.number })
  },

  onShareAppMessage() {
    return shareApp('信息码', 'codeMisc')
  }

})
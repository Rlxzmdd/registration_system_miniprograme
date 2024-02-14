// index.js
// 获取应用实例
const app = getApp()
Page({
  data: {
    func: [
      {
        icon: 'icon-list1',
        text: '房间列表',
        tapEvent: 'toPage',
        key: '../roomList/roomList'
      },
      {
        icon: 'icon-list2',
        text: '申请列表',
        tapEvent: 'toPage',
        key: '../applyList/applyList'
      },
      {
        icon: 'icon-shenpi',
        text: '申请审批'
      },
      // {
      //   icon: 'icon-shijian',
      //   text: '义工时'
      // }
    ],
    applyList:[
      {
        name:'东区日新书院创客空间',
        date:'2021/1/26 14:33'
      },
      {
        name:'东区日新书院创客空间',
        date:'2021/1/26 14:33'
      },
      {
        name:'东区日新书院创客空间',
        date:'2021/1/26 14:33'
      },
    ]
  },


  onLoad() {
    
  },
  onShow() {
  },

  // 页面跳转
  toPage(e) {
    let url = e.currentTarget.dataset.key

    wx.navigateTo({
      url,
    })
  },

  // 打开/关闭弹出层
  switchPopup(e) {
    let key = e.currentTarget.dataset.key
    this.setData({
      [`popup.${key}`]: !this.data.popup[key]
    })
  },

  getUserInfo(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
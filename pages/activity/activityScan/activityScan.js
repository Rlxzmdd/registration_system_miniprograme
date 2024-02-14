import {
  addExamine,
} from "../../../api/activity"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "暂无信息",
    activityItemId: 0,
    scanFunctionIsUseable: true,
    //当前核销的数据
    nowExamineInfo: [],
    tmpExamineInfo: [],
    nowNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.activityItemId = options.id
    this.data.title = options.title
    this.setData({
      activityItemId: this.data.activityItemId,
      title: this.data.title
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // camera组件 监听方法
  scanQrCode(e){
    if(this.data.scanFunctionIsUseable) {
      this.data.scanFunctionIsUseable = false;
      // 对扫码结果进行处理
      var token = e.detail.result
      console.log('扫码成功=>', token)
      wx.showLoading({
        title: '已成功扫码\n正在处理',
      })
      addExamine(this.data.activityItemId, token).then(res => {
        console.log("二维码核销成功=>", res)
        this.data.nowNum+=1
        if(this.data.nowExamineInfo.length >= 3)
          this.data.nowExamineInfo.shift()
        this.data.nowExamineInfo.push({
          number: res.examinedNumber,
          type: res.examinedType,
          time: res.examineTime,
          num: this.data.nowNum
        })
        this.data.tmpExamineInfo = Object.create(this.data.nowExamineInfo)
        this.setData({
          'tmpExamineInfo': this.data.tmpExamineInfo.reverse()
        })
        wx.hideLoading()
        wx.showToast({
          title: "核销成功",
          duration: 1000,
          icon: "success",
          mask: false
        })
      })
      wx.hideLoading()
      // 扫码间隔 1 秒
      setTimeout(() => {
      this.data.scanFunctionIsUseable = true;
      }, 1000)
    }
  }
})
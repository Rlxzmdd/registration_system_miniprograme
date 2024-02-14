const {
  queryActivity,
  createActivity
} = require("../../../api/activity")

Page({
  data: {
    func: [{
        icon: 'icon-add',
        text: '创建活动',
        tapEvent: 'closePopup',
        key: 'create'
      },
      {
        icon: 'icon-gengduo',
        text: '管理活动',
        tapEvent: 'toPage',
        key: './editActivity/editActivity'
      }
    ],
    popup: {
      create: false,
      startTime: false,
      endTime: false
    },
    dtPicker: {
      currentTime: new Date().getTime(),
      minDate: new Date(2021, 0, 1).getTime(),
      maxDate: new Date(new Date().getFullYear() + 2, 0, 1).getTime(),
    },
    createData: {
      startTime: '',
      endTime: '',
      name: '',
      place: '',
      count: '',
    },
  },

  onLoad(options) {
    this.initDateTime()

    queryActivity({
      type: 'all',
      status: 'all'
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  },

  initDateTime() {
    let time = new Date()
    let month = parseInt(time.getMonth()) + 1 < 10 ? '0' + (parseInt(time.getMonth()) + 1) : parseInt(time.getMonth()) + 1
    let date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
    let hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
    let min = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
    let currTime = time.getFullYear() + '/' + month + '/' + date + ' ' + hours + ':' + min
    this.setData({
      'createData.startTime': currTime,
      'createData.endTime': currTime
    })
  },

  // 页面跳转
  toPage(e) {
    let url = e.currentTarget.dataset.key

    wx.navigateTo({
      url,
    })
  },

  // 扫码核销
  openScan() {
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['qrCode'],
      success: res => {
        console.log('扫码成功=>', res)
      },
      fail: err => {
        console.log('扫码失败=>', err)
      }
    })
  },

  // 打开/关闭弹出层
  closePopup(e) {
    let key = e.currentTarget.dataset.key
    this.setData({
      [`popup.${key}`]: !this.data.popup[key]
    })
  },

  // 创建活动时输入框有输入
  inputChange(e) {
    let key = e.currentTarget.dataset.key
    let val = e.detail

    if (e.type === 'confirm') {
      // 时间选择器
      this.setData({
        [`popup.${key}`]: false,
        'dtPicker.currentTime': val
      })
      let time = new Date(val)
      let month = parseInt(time.getMonth()) + 1 < 10 ? '0' + (parseInt(time.getMonth()) + 1) : parseInt(time.getMonth()) + 1
      let date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
      let hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
      let min = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
      val = time.getFullYear() + '/' + month + '/' + date + ' ' + hours + ':' + min
    }

    this.setData({
      [`createData.${key}`]: val
    })
  },

  // 确认创建活动
  confirmCreate() {
    for (let key in this.data.createData) {
      let val = this.data.createData[key]
      if (val == '') {
        wx.showToast({
          title: '请填写对应的活动信息',
          icon: 'none'
        })
        return
      }
    }
    console.log('确认创建活动,参数=>', this.data.createData)
  }



})
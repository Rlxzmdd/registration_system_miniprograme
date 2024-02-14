import {
  pushActivity,
  deleteActivity,
  queryActivityList
} from '../../../api/activity'
import {
  formatTime
} from '../../../utils/util'
import { shareApp } from '../../../api/other'

let onRefresh = false

Page({
  data: {
    category: [{
      key: 'all',
      text: '全部'
    },
    {
      key: 'report',
      text: '报名中'
    },
    {
      key: 'progress',
      text: '进行中'
    },
    {
      key: 'end',
      text: '已结束'
    }
    ],
    currCateIdx: 0,
    func: [{
      icon: 'icon-add',
      text: '创建活动',
      tapEvent: 'closePopup',
      key: 'create'
    }],
    popup: {
      create: false,
      startTime: false,
      endTime: false
    },
    dtPicker: {
      currentTime: new Date().getTime(),
      minDate: new Date(2021, 0, 1).getTime(),
      maxDate: new Date(new Date().getFullYear() + 2, 0, 1).getTime(),
      currDtKey: '',
    },
    createData: {
      activityTimeStart: '',
      activityTimeEnd: '',
      applyTimeStart: '',
      applyTimeEnd: '',
      title: '',
      location: '',
      maxNum: '',
      isApply: 0,
      isDurative: 0,
      isRepeat: 0,
      isShare: 1,
      limit: false
    },
    actList: {
      'all': {},
      'report': {}, // 报名中
      'progress': {}, // 进行中
      'end': {} // 结束
    }, // 活动列表

  },

  onLoad: function (options) {
    this.initData()
  },

  // 下拉刷新
  onPullDownRefresh() {
    onRefresh = true
    this.initData()
  },

  initDateTime() {
    let currTime = formatTime(new Date()).slice(0, 16)
    this.setData({
      'createData.activityTimeStart': currTime,
      'createData.activityTimeEnd': currTime,
      'createData.applyTimeStart': currTime,
      'createData.applyTimeEnd': currTime
    })
  },

  // 初始化数据
  initData() {
    this.initDateTime()
    this.getActList('all', this.data.category[this.data.currCateIdx].key, 'refresh')
  },

  //切换分类
  switchCate(e) {
    const {
      idx,
      key
    } = e.currentTarget.dataset

    this.setData({
      currCateIdx: idx
    })

    this.getActList('all', key, 'refresh')
  },

  // 点击某个活动进入详情
  clickAct(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../editActivity/editActivity?id=' + id,
    })
  },

  // 点击滑块
  clickSwiperCell(e) {
    console.log('点击滑块位置 =>', e.detail, e)
    const {
      id,
      pagekey,
      index
    } = e.currentTarget.dataset
    if (e.detail === 'right') {
      var activityInfo = this.data.actList[this.data.category[this.data.currCateIdx].key]['list'][pagekey][index]
      if(activityInfo.isOwner==0){
        wx.showModal({
          title:'权限不足',
          content:'只有创建者可以删除活动',
          showCancel:false
        })
        return;
      }
      wx.showModal({
        title:'删除确认',
        content:'请确认删除的活动：'+activityInfo.title,
        showCancel:true
      }).then(res=>{
        if(res.confirm){
          deleteActivity(
            id
          ).then(res => {
            wx.showToast({
              title: '删除成功！',
              icon: 'success',
              duration:1500
            })
            let status = this.data.category[this.data.currCateIdx].key
            let data = this.data.actList[status].list[pagekey]
            data = [...data.slice(0, index), ...data.slice(index + 1)]
            this.setData({
              [`actList.${status}.list.${pagekey}`]: data
            })
          })
        }
      })
    }
  },

  // 打开/关闭弹出层
  closePopup(e) {
    let {
      key,
      popupkey
    } = e.currentTarget.dataset

    this.setData({
      [`popup.${popupkey}`]: !this.data.popup[popupkey]
    })
    if (popupkey == 'datetime') {
      this.setData({
        [`dtPicker.currDtKey`]: key
      })
    }
  },

  // switch开关改变
  switchChange(e) {
    let key = e.currentTarget.dataset.key
    this.setData({
      [`createData.${key}`]: !this.data.createData[key]
    })
  },

  // 创建活动时输入框有输入
  inputChange(e) {
    let {
      key,
      popupkey
    } = e.currentTarget.dataset
    let val = e.detail

    if (e.type === 'confirm') {
      // 时间选择器
      this.setData({
        [`popup.${popupkey}`]: false,
        'dtPicker.currentTime': val
      })
      let time = formatTime(new Date(val))
      val = time.slice(0, 16)
    }

    this.setData({
      [`createData.${key}`]: val
    })
  },

  // 确认创建活动
  confirmCreate() {
    let createData = this.data.createData
    let params = {
      ...createData
    }

    let timeKey = ['applyTimeStart', 'applyTimeEnd', 'activityTimeStart', 'activityTimeEnd']
    timeKey.forEach(item => {
      params[item] += ':00'
    })
    params.isDurative = params.isDurative == 1 ? 1 : 0
    params.isApply = params.isApply == 1 ? 1 : 0
    params.isRepeat = params.isRepeat == 1 ? 1 : 0
    params.isShare = params.isShare == 1 ? 1 : 0

    if (params.isDurative == 1)
      delete params.endTime
    if (params.isApply == 0)
      delete params.startReport && delete params.endReport
    if (params.limit)
      params.maxNum = 0
    delete params.limit

    console.log(params)
    for (let key in params) {
      let val = params[key]
      if (val === '') {
        wx.showToast({
          title: '请填写对应的活动信息',
          icon: 'none'
        })
        return
      }
    }

    const {
      startTime,
      endTime,
      startReport,
      endReport
    } = params
    if ((endTime && startTime >= endTime) || (startReport && startReport >= endReport)) {
      wx.showToast({
        title: '结束时间应晚于开始时间',
        icon: 'none',
        duration: 3000
      })
      return
    }
    let currTime = formatTime(new Date())
    if (startTime <= currTime || (startReport && startReport <= currTime)) {
      wx.showToast({
        title: '开始时间应晚于当前时间',
        icon: 'none',
        duration: 3000
      })
      return
    }

    console.log('确认创建活动,参数=>', params)
    pushActivity(params).then(res => {
      console.log('success=>', res)
      wx.showToast({
        title: '创建成功！',
      })
      this.setData({
        'popup.create': false
      })
      this.getActList('all', 'all', 'refresh')
    }).catch(err => {
      console.log('fail=>', err)
    })
  },

  // 获取活动列表
  getActList(type = 'all', status = 'all', getType = 'getNext', limit = 10) {
    const actList = this.data.actList[status]
    let curPage = actList.curPage

    // if (getType == 'getNext' && !this.data.actList[status].hasNext) {
    //   showToast({
    //     title: '没有更多数据了'
    //   })
    //   return
    // }

    // if (getType == 'refresh' && actList.list && actList.list.p1.length > 0)
    //   return

    // 刷新活动列表
    queryActivityList({
      type,
      status,
      page: getType == 'getNext' ? curPage + 1 : 0,
      limit: limit
    }).then(res => {
      const { current, pages, records } = res
      var curPage = current
      var list = records
      // 权限判断
      let userData = wx.getStorageSync('LoginData')
      let result = []
      list.forEach(item => {
        let data = item
        console.log(data)
        data.startTime = data.startTime ? data.startTime.slice(0, 16) : data.startTime
        result.push(data)
        // for (let admin of data.elLog.counts) {
        //   if (admin.op_number == userData.number) {
        //     result.push(data)
        //     break
        //   }
        // }
        var status_s
        if (data.isApply == 1 && data.applyTimeEnd < formatTime(new Date()).slice(0, 16)) {
          status_s = "report"
        } else if (data.isDurative == 1) {
          status_s = "progress"
        } else if (data.activityTimeEnd < formatTime(new Date()).slice(0, 16)) {
          status_s = "progress"
        } else {
          status_s = "end"
        }
        data['status'] = status_s
      })
      this.data.actList[status].curPage = curPage
      this.data.actList[status].totalPage = pages
      this.setData({
        [`actList.${status}.list.p${curPage}`]: result
      })
      if (onRefresh)
        wx.showToast({
          title: '',
          icon: 'success'
        })
    }).catch().then(() => {
      if (onRefresh) {
        wx.stopPullDownRefresh()
        onRefresh = false
      }
    })

  },

  // 查询活动的管理员信息
  getAdminInfo(data) {
    getAdminInfo(data.id).then(res => {
      console.log("活动id:" + data.id, '管理员=>', res)
      let adminList = data.admin.map(admin => {
        let obj = res.data.filter(item => admin.eliminate_number == item.number)
        return {
          ...obj,
          num: admin.num
        }
      })
      this.setData({
        "activityData.adminInfo": adminList
      })
    })
  },

  // 转发
  onShareAppMessage() {
    return shareApp('近期活动', 'activityList')
  }

})
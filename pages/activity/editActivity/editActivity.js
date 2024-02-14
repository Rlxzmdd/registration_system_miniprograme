import {
  queryManagerList,
  queryExamineList,
  addExamine,
  addManager,
  pushActivity,
  queryActivityDetail,
  exportExamineExcel,
  exportExamineExcelByNode,
  getDownloadUrl,
  queryEliminateForClasses,
  queryEliminateForHour
} from "../../../api/activity"
import {
  searchUser
} from "../../../api/user"
import {
  showToast
} from "../../../common/func"
import {
  formatTime
} from "../../../utils/util"

const FundCharts = require('../../../utils/FundCharts.min');		// 注意拷FundCharts.min.js
const LineChart = FundCharts.line;

Page({
  data: {
    perToFunc: {
      isInvite: {
        icon: 'icon-add',
        text: '添加管理员',
        tapEvent: 'closePopup',
        popupKey: 'addPersonnel',
      },
      isModify: {
        icon: 'icon-edit',
        text: '修改活动',
        tapEvent: 'closePopup',
        popupKey: 'modify'
      },
      isRead: {
        icon: 'icon-people',
        text: '下载表格',
        tapEvent: 'downloadExcel',
      },
      nodeRead: {
        icon: 'icon-people',
        text: '数据对比',
        tapEvent: 'downloadExcelByNode',
      }
    },
    func: [],
    popup: {
      modify: false,
      startTime: false,
      endTime: false,
      addPersonnel: false
    },
    dtPicker: {
      currentTime: new Date().getTime(),
      minDate: new Date(2021, 0, 1).getTime(),
      maxDate: new Date(new Date().getFullYear() + 2, 0, 1).getTime(),
      currDtKey: '',
    },
    modifyData: {
      id: 0,
      activityTimeStart: '',
      activityTimeEnd: '',
      applyTimeStart: '',
      applyTimeEnd: '',
      title: '讲座',
      location: '日新楼',
      maxNum: 0,
      isApply: 0,
      isDurative: 0,
      isRepeat: 0,
      isShare: 1,
      limit: false
    },
    addData: {
      number: ''
    },
    activityData: {}, // 活动数据
    elimData: {
      nowPage: -1,
      data: {}
    }, // 核销记录
  },

  onLoad(options) {
    console.log('活动ID=>', options.id)
    this.data.activityData.id = options.id
    this.getActInfo(options.id)
    this.initDateTime()
  },

  initDateTime() {
    let currTime = formatTime(new Date()).slice(0, 16)
    this.setData({
      'modifyData.startTime': currTime,
      'modifyData.endTime': currTime,
      'modifyData.startReport': currTime,
      'modifyData.endReport': currTime
    })
  },

  // 获取活动信息
  getActInfo(activityId) {
    queryActivityDetail({
      type: 'single',
      activityId
    }).then(res => {
      console.log('查询活动=>', res)
      let {
        activityTimeStart,
        activityTimeEnd,
        isDurative,
        isApply,
        isOwner,
        isManager,
        isSignup,
        isExaminer,
        isRead,
        isModify,
        isExamine,
        isInvite
      } = res

      if (isDurative == 0) {
        res.activityTimeStart = activityTimeStart //.substring(10, 16)
        res.timeEnd = activityTimeEnd ? '~' + activityTimeEnd.substring(11, 16) : ''
      }
      if (isOwner) {
        res["bigTitle"] = "所举办的活动"
      } else if (isManager) {
        res["bigTitle"] = "所管理的活动"
      } else if (isExaminer) {
        res["bigTitle"] = "所参加的活动"
      } else if (isSignup) {
        res["bigTitle"] = "所报名的活动"
      }
      // 根据权限修改功能入口
      this.data.func = []
      if (isInvite) {
        this.data.func.push(this.data.perToFunc.isInvite)
      }
      if (isModify) {
        this.data.func.push(this.data.perToFunc.isModify)
      }
      if (isRead) {
        this.data.func.push(this.data.perToFunc.isRead)
        this.data.func.push(this.data.perToFunc.nodeRead)
      }
      // 更新修改活动数据
      for (let key in this.data.modifyData) {
        if (res[key])
          this.data.modifyData[key] = res[key]
      }
      if (res['maxNum'] == 0) {
        this.data.modifyData['limit'] = true
        this.data.modifyData['maxNum'] = ''
      }

      this.setData({
        activityData: res,
        modifyData: this.data.modifyData,
        func: this.data.func
      })
      if (res.isOwner == 1 || res.isManager == 1) {
        this.getAdminInfo(res)
        this.getEliminateList()
        this.queryElimForHour()

        if(this.data.activityData.id == 18 || this.data.activityData.id == 19)
          this.queryElimForClasses()
      }
    }).catch(err => {
      console.log('查询活动失败=>', err)
    })
  },

  // 查询活动的管理员信息
  getAdminInfo(data) {
    queryManagerList(data.id, 1, 30).then(res => {
      console.log("活动id:" + data.id, '管理员=>', res)
      if (res.records && res.records.length <= 0) return
      // && data.elLog.counts.length <= 0
      let adminList = []
      res.records.forEach(admin => {
        //let obj = res.records.filter(item => admin.managerNumber == item.managerNumber)
        // let obj = res.records
        // console.log(obj)
        // if (obj.length > 0) {
        //   //obj[0].num = admin.num
        //   obj[0].num = 0
        //   adminList.push(obj[0])
        // }
        adminList.push({
          "name": admin.realName,
          "number": admin.managerNumber,
          "type": admin.managerType,
          "num": admin.examineNum
        })
      })
      this.setData({
        "activityData.adminInfo": adminList
      })
    })
  },

  // 获取核销记录
  getEliminateList() {
    console.log(this.data)
    let nowPage = this.data.elimData.nowPage
    queryExamineList(
      this.data.activityData.id,
      nowPage + 1,
      10
    ).then(res => {
      console.log('核销记录=>', res.records)
      this.data.elimData.nowPage += 1
      this.setData({
        'elimData.data': res.records
      })
    })
  },

  // 页面跳转
  toPage(e) {
    let url = e.currentTarget.dataset.key
    let urlArr = url.split('?')
    if (urlArr.length > 0) {
      let params = urlArr[1].split('&')
      params.forEach((item, index) => {
        let key = item.split('=')
        if (key.length == 1) {
          if (typeof this.data.activityData[key[0]] === 'object')
            params[index] += '=' + JSON.stringify(this.data.activityData[key[0]])
          params[index] += '=' + this.data.activityData[key[0]]
        }
      })
      url = urlArr[0] + '?' + params.join('&')
    }
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
        addExamine(this.data.activityData.id, res.result).then(res => {
          console.log("二维码核销成功=>", res)
          wx.showToast({
            title: "核销成功",
            duration: 3000,
            icon: "success",
            mask: false
          })
        })
      },
      fail: err => {
        console.log('扫码失败=>', err)
      }
    })

  },
  // 扫码核销
  WhileopenScan() {
    let url = "/pages/activity/activityScan/activityScan?id=" + this.data.activityData.id + "&title=" + this.data.activityData.title
    wx.navigateTo({
      url,
    })

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

  // 创建活动时输入框有输入
  inputChange(e) {
    let {
      key,
      popupkey,
      source
    } = e.currentTarget.dataset
    let val = e.detail

    // console.log(e)
    if (e.type === 'confirm') {
      // 时间选择器
      this.setData({
        [`popup.${popupkey}`]: false,
        'dtPicker.currentTime': val
      })
      let currTime = formatTime(new Date(val)).slice(0, 16)
      val = currTime
      console.log(currTime)
    }

    this.setData({
      [`${source}.${key}`]: val.trim()
    })
  },

  // 确认修改活动
  confirm() {
    let modifyData = this.data.modifyData
    let params = {
      ...modifyData
    }

    let timeKey = ['applyTimeStart', 'applyTimeEnd', 'activityTimeStart', 'activityTimeEnd']
    timeKey.forEach(item => {
      params[item] += ':00'
    })
    params.isDurative = params.isDurative ? 1 : 0
    params.isApply = params.isApply ? 1 : 0
    params.isRepeat = params.isRepeat ? 1 : 0
    params.isShare = params.isShare ? 1 : 0
    if (params.isDurative == 1)
      delete params.endTime
    if (params.isApply == 0)
      delete params.startReport && delete params.endReport
    if (params.limit)
      params.maxNum = 0
    delete params.limit

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
    console.log('确认创建活动,参数=>', params)
    pushActivity(params).then(res => {
      console.log('success=>', res)
      wx.showToast({
        title: '创建成功！',
      }).then(() => {
        this.setData({
          'popup.modify': false
        })
        this.getActInfo(this.data.activityData.id)
      })
    }).catch(err => {
      console.log('modifyActivity=>', err)
    })
  },

  // 添加管理员时 点击搜索
  clickSearch() {
    let val = this.data.addData.number.trim()
    if (val == '') {
      wx.showToast({
        title: '请输入学/工号',
        icon: 'none'
      })
      return
    }

    searchUser(val).then(res => {
      console.log('搜索=>', val, '结果=>', res)
      //res.data.number = val
      if (res[0] == null)
        wx.showToast({
          title: '查无此人',
          icon: 'error'
        })
      this.setData({
        searchRes: res[0]
      })
    })
  },

  // 添加管理员时 点击添加管理员
  clickAdd() {
    const actData = this.data.activityData || {
      id: 0
    }
    const number = this.data.searchRes.number
    const type = this.data.searchRes.type
    addManager(actData.id, number, type).then(res => {
      console.log('添加管理员成功=>', res)
      showToast({
        title: "成功添加管理员",
        icon: 'success',
        duration: 1000
      }).then(() => {
        this.setData({
          'popup.addPersonnel': false,
          searchRes: null,
          'addData.number': ''
        })
        this.getActInfo(actData.id)
      })
    })
  },

  // switch开关改变
  switchChange(e) {
    let key = e.currentTarget.dataset.key
    this.setData({
      [`modifyData.${key}`]: !this.data.modifyData[key]
    })
  },

  //下载表格
  downloadExcel(e) {
    console.log("下载表格=>id:" + this.data.activityData.id)
    exportExamineExcel(this.data.activityData.id).then(res => {
      var fileUrl = getDownloadUrl(res, true)
      console.log("获取表格链接:" + fileUrl)
      wx.downloadFile({
        // 示例 url，并非真实存在
        url: fileUrl,
        success: function (res) {
          const filePath = res.tempFilePath
          console.log("表格下载成功")
          wx.openDocument({
            filePath: filePath,
            fileType: "xlsx",
            showMenu: true,
            success: function (res) {
              console.log('表格打开成功')
            },
            fail: function (res) {
              showToast({
                title: "表格打开失败",
                icon: "error"
              })
            }
          })
        },
        fail: function (res) {
          showToast({
            title: "表格下载失败",
            icon: "error"
          })
        }
      })
    })

  },
  downloadExcelByNode(e) {
    console.log("下载表格=>id:" + this.data.activityData.id)
    exportExamineExcelByNode(this.data.activityData.id).then(res => {
      var fileUrl = getDownloadUrl(res, true)
      console.log("获取表格链接:" + fileUrl)
      wx.downloadFile({
        // 示例 url，并非真实存在
        url: fileUrl,
        success: function (res) {
          const filePath = res.tempFilePath
          console.log("表格下载成功")
          wx.openDocument({
            filePath: filePath,
            fileType: "xlsx",
            showMenu: true,
            success: function (res) {
              console.log('表格打开成功')
            },
            fail: function (res) {
              showToast({
                title: "表格打开失败",
                icon: "error"
              })
            }
          })
        },
        fail: function (res) {
          showToast({
            title: "表格下载失败",
            icon: "error"
          })
        }
      })
    })

  },

  // 查询班级的核销数据
  queryElimForClasses() {
    let actId = this.data.activityData.id
    if (actId != 18 && actId != 19 && actId != 12) {
      return
    }

    let params = {
      activityId: actId,
      collegeName: '人工智能学院',
      majorName: '*',
      className: '21%'
    }
    queryEliminateForClasses(params).then(res => {
      let elimData = res
      this.setData({
        elimForClasses: elimData
      })
    })
  },

  // 查询某天各个小时里的核销数据
  queryElimForHour() {
    let activityId = this.data.activityData.id
    let dateTime = formatTime(new Date()).slice(0, 10)

    queryEliminateForHour(activityId, dateTime).then(res => {
      console.log(res)
      let elimData = res
      this.setData({
        elimForHour: elimData
      })
      this.setLineChart()
    })
  },

  // 设置折线图
  setLineChart() {
    let elimData = this.data.elimForHour
    let hour = []
    let count = []
    let max = 0;
    for (let i = 0; i < elimData.length; i++) {
      if(elimData[i].hour<8) continue
      hour.push(elimData[i].hour);
      count.push(elimData[i].count);
      if (elimData[i].count > max) max = elimData[i].count;
    }

    let line5 = new LineChart({
      id: 'chartbar1',
      width: 450,
      height: 212,
      chartTop: 1,
      chartLeft: 30,
      xaxis: hour,
      data: count,
      range: {
        min: 0,
        max: max + 10
      },
      grid: {
        showGrid: true,
        color: '#aaa',
        xTickLength: 11
      },
      yaxisfunc(data) { // 处理y轴刻度数值
        return parseInt(data) + '人'
      },
      handleTextX: (ctx, xArr) => { // 处理x轴文字
        // 增加x轴刻度
        let _chartWidth = line5._chart.width - line5.opts.chartLeft - line5.opts.chartRight;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '10px Arial';
        ctx.fillStyle = '#333';

        for (let i in xArr) {
          ctx.fillText(xArr[i], (_chartWidth / (xArr.length - 1) * i) + line5.opts.chartLeft, line5._chart.height - 13);
        }
      },
      onAnimation(process) {
        let ctx = line5.ctx,
          chartLeft = line5.opts.chartLeft,
          datasets = line5.datasets[0];

        ctx.save()
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#fff';
        ctx.fillStyle = '#ffa61b';

        datasets.map(data => {
          ctx.beginPath();
          ctx.arc(data.x, data.y, 4 * process, 0, Math.PI * 2, true);
          ctx.closePath();

          ctx.fill();

          ctx.stroke();
          // ctx.font = 13 * process + 'px Arial';
          ctx.textAlign = 'center';
          let x = data.x - 10 < chartLeft ? chartLeft + 10 : data.x;
          ctx.fillText(data.value.toFixed(0), x, data.y - 10);
        });

        ctx.restore();
      }
    });
    line5.init();
  },


})
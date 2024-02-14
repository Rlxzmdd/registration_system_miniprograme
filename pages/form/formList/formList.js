import { queryFormDetail, queryFormList, getMyWritedData } from "../../../api/form"
import { showModal, showToast } from "../../../common/func"
import { isArray } from "../../../utils/util.js"
import { shareApp, uuidToUrl } from '../../../api/other'

const dict = require("../../../utils/dict")
const app = getApp()

Page({
  data: {
    category: [
      {
        key: 'all',
        text: '全部'
      },
      {
        key: 'undone',
        text: '未完成'
      },
      {
        key: 'finish',
        text: '已完成'
      },
      {
        key: 'other',
        text: '其它'
      }
    ],
    currCateIdx: 0,
    // 列表数据
    listData: {
      all: {},
      undone: {},
      finish: {},
      other: {}
    },
    listInfo: {},
    popup: {},
    dict
  },

  onLoad(options) {
    this.setData({
      listData: app.globalData.formList.listData || this.data.listData,
      listInfo: app.globalData.formList.listInfo || this.data.listInfo
    })

    // 获取键映射
    app.getKeyMap().then(res => {
      this.setData({
        dict: res
      })
    })

    this.initData()
  },

  onPullDownRefresh() {
    this.refresh()
  },

  async refresh() {
    // 清除一些必要数据
    this.data.listData.all = {}

    await this.initData()

    wx.stopPullDownRefresh()
  },

  async initData() {
    this.data.listData = {
      all: {},
      undone: {},
      finish: {},
      other: {}
    }
    await this.queryList()
  },

  // 切换分类
  switchCate(e) {
    const {
      idx,
      key
    } = e.currentTarget.dataset

    this.setData({
      currCateIdx: idx
    })

  },

  // 点击进入表单详情
  clickForm(e) {
    let { index } = e.currentTarget.dataset
    let { listData, category, currCateIdx, listInfo, formContainer } = this.data
    let { formKey, submitStatus, auditStatus, passed, title, formStatus, endTime } = listData[category[currCateIdx].key]['p' + listInfo.current][index]
    // console.log('click key=>', formKey)

    // 如果已经填写/已提交
    if (submitStatus != 'undone') {
      if (passed && formContainer && formContainer.formKey == formKey) {
        this.setData({
          formContainer,
          'popup.table': true
        })
        return
      }
      // 获取填写的数据
      this.getMyWrited(formKey).then(formData => {
        let formContainer = {
          formKey,
          title,
          auditStatus,
          passed,
          allowFix: !passed ? true : false,
          formData
        }
        this.setData({
          formContainer
        })

        if (passed) {
          this.setData({
            'popup.table': true
          })
        } else {
          // 如果已经填写但审核未通过
          this.toFixForm()
        }
      })
      return
    }

    // 如果已经结束填写
    if (formStatus == 'end') {
      showModal({
        title: '拒绝访问',
        content: title + '已于' + endTime + '结束填写',
        showCancel: false
      })
      return
    }
    // 未填写直接进入填写
    queryFormDetail(formKey).then(res => {
      let formObj = {
        ...res.template,
        submitParams: {  // 提交参数
          url: '/api/form_item/push/' + formKey,
          method: 'post'
        }
      }
      app.$router.push('form', { formInfo: [formObj] })
    })

  },

  // 查询列表
  queryList(page = 1, limit = 10) {
    if (this.data.listData.all['p' + page]) {
      this.setData({
        'listInfo.current': page
      })
      return
    }

    return new Promise(resolve => {
      queryFormList(page, limit).then(res => {
        let { records, ...listInfo } = res
        let all = []
        let undone = []
        let finish = []

        const icons = {
          'wait': {
            vanIcon: 'todo-list-o',
            iconText: '即将开放'
          },
          'process': {
            vanIcon: 'records',
            iconText: '开放填写'
          },
          'end': {
            vanIcon: 'failure',
            iconText: '结束填写'
          },
          'pass': {
            icon: 'tongguo',
            iconText: '审核通过'
          },
          'fail': {
            icon: 'jujue',
            iconText: '退回修改'
          },
          'checking': {
            icon: 'shenhezhong',
            iconText: '等待审核'
          }
        }

        records.forEach(item => {
          let obj = {}
          switch (item.submitStatus) {
            // 未完成/未填写
            case 'undone':
              let minTitle = ""
              if (item.formStatus == 'wait') {
                minTitle = "将于" + item.startTime.substring(0, 17) + "开放"
              } else if (item.formStatus == 'process') {
                minTitle = "请在" + item.endTime.substring(0, 17) + "前完成"
              } else if (item.formStatus == 'end') {
                minTitle = "已于" + item.endTime.substring(0, 17) + "结束"
              } else if (item.submitStatus == 'finish') {
                minTitle = "已于" + item.endTime.substring(0, 17) + "结束"
              }

              obj = {
                ...item,
                minTitle,
                vanIcon: icons[item.formStatus].vanIcon,
                iconText: icons[item.formStatus].iconText
              }
              undone.push(obj)

              break
            // 已完成/已填写
            case 'finish':
              let icon = ""
              let iconText = ""
              if (item.auditStatus) {
                icon = item.passed ? icons['pass'].icon : icons['fail'].icon
                iconText = item.passed ? icons['pass'].iconText : icons['fail'].iconText
              } else {
                icon = icons['checking'].icon
                iconText = icons['checking'].iconText
              }

              obj = {
                ...item,
                minTitle: '',
                icon,
                iconText
              }
              finish.push(obj)
              break
          }
          all.push(obj)
        })
        this.setData({
          listInfo,
          [`listData.all.p${listInfo.current}`]: all,
          [`listData.undone.p${listInfo.current}`]: undone,
          [`listData.finish.p${listInfo.current}`]: finish
        })
        app.globalData.formList = { listInfo, listData: this.data.listData }
        resolve()
      })
    })
  },

  // 上一页
  previousPage() {
    let { current } = this.data.listInfo
    if (current <= 1) {
      showToast({
        title: '当前为第一页'
      })
      return
    }

    this.queryList(current - 1)
  },

  // 下一页
  nextPage() {
    let { current, pages } = this.data.listInfo
    if (current >= pages) {
      showToast({
        title: '当前为最后一页'
      })
      return
    }

    this.queryList(current + 1)
  },

  // 打开/关闭弹出层
  switchPopup(e) {
    let key = e.currentTarget.dataset.key
    this.setData({
      [`popup.${key}`]: !this.data.popup[key]
    })
  },

  // 获取已填表单的内容数据
  getMyWrited(formKey) {
    return new Promise((resolve, reject) => {
      getMyWritedData(formKey).then(res => {
        let finalData = {}
        for (let key in res) {
          let val = res[key]
          finalData[key] = isArray(val) && key != 'image' ? val.join(" / ") : val
        }

        resolve(finalData)
      }).catch(err => {
        reject()
      })
    })
  },

  // 前往修改表单
  toFixForm() {
    let { formKey, formData } = this.data.formContainer

    queryFormDetail(formKey).then(res => {
      res.template.formInfo.forEach(item => {
        if (formData[item.id]) {
          if (item.type == 'region' || item.type == 'checkbox') {
            formData[item.id] = formData[item.id].split(" / ")
          }
        }
        item.defaultValue = formData[item.id]
      })

      let formObj = {
        ...res.template,
        submitParams: {  // 提交参数
          url: '/api/form_item/push/' + formKey,
          method: 'post'
        }
      }

      app.$router.push('form', { formInfo: [formObj] })
    })
  },

  // 表单提交成功后的回调
  submitCallback() {
    console.log('submitCallback')
    this.initData()
  },

  // 点击查看图片
  viewImage() {
    let imageArr = this.data.formContainer.formData.imageArr

    if (!imageArr) {
      let uuidArr = this.data.formContainer.formData.image
      uuidToUrl(uuidArr).then(res => {
        this.data.formContainer.formData.imageArr = res
        wx.previewImage({
          urls: res,
        })
      })
    } else {
      wx.previewImage({
        urls: imageArr,
      })
    }
  },

  // 转发
  onShareAppMessage() {
    return shareApp('HeyNUIT', 'formList')
  }

})
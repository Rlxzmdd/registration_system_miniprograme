const { queryUserSubmit, submitAuditRes, querySingleAuditForm } = require('../../api/form')
const { uuidToUrl } = require('../../api/other')
const { showToast } = require('../../common/func')
const dict = require('../../utils/dict')
const { isArray } = require('../../utils/util')

const app = getApp()

Page({
  data: {
    searchParams: {
      id: 'search',
      placeholder: '输入姓名以进行搜索',
      defaultValue: '',
      inputType: 'text',
      rule: {
        type: 'null'
      }
    },
    // 表单信息数据
    formData: "",
    rejectReason: '',
    currAuditIdx: 0,
    // 字段字典
    dict

  },

  onLoad(e) {
    console.log('params =>', app.$router.params)
    let { auditList } = app.$router.params || {}

    this.setData({
      auditList
    })

    // 获取键映射
    app.getKeyMap().then(res => {
      this.setData({
        dict: res
      })
    })

    this.initData()

  },

  initData() {
    this.querySubmitData()
  },

  querySubmitData(auditInfo) {
    if (!auditInfo) {
      let { auditList, currAuditIdx } = this.data

      if (currAuditIdx > auditList.length - 1) {
        // 当前审核列表已审核完毕  请求新的一页
        if (auditList[0].status == 'wait')
          this.querySingleForm(auditList[0].formKey, 1, auditList[0].status)
        return
      }
      auditInfo = auditList[currAuditIdx]
    }
    let formKey = auditInfo.formKey
    let specifiedNumber = auditInfo.submitNumber
    let specifiedType = auditInfo.userType

    if (auditInfo.submitName) {
      this.setData({
        'searchParams.defaultValue': auditInfo.classes + ' ' + auditInfo.submitName
      })
    } else if (auditInfo.submitNumber) {
      this.setData({
        'searchParams.defaultValue': '学号：' + auditInfo.submitNumber
      })
    }

    queryUserSubmit(formKey, specifiedNumber, specifiedType).then(res => {
      let { content, formKey, uuid } = res

      for (let key in content) {
        let val = content[key]
        if (isArray(val) && key != 'image') {
          content[key] = val.join(' / ')
        }
      }

      this.setData({
        formData: content,
        formInfo: { formKey, uuid }
      })
    })
  },

  // 获取审核表单下的记录
  querySingleForm(formKey, page = 1, status, limit = 10) {
    querySingleAuditForm(formKey, status, page, limit).then(res => {
      if (res.records.length == 0) {
        showToast({
          title: '已全部审核完毕, 即将返回上一页',
          duration: 2000
        })
        setTimeout(() => {
          app.$router.back()
        }, 2000)
        return
      }

      this.setData({
        [`auditList`]: res.records,
        'currAuditIdx': 0
      })
      this.querySubmitData()
    })
  },

  passAudit() {
    // 判断是否已审核
    let { auditStatus, passed } = this.data.auditList[this.data.currAuditIdx]
    if (auditStatus) {
      let resText = passed ? '该信息已被审核通过' : '该信息已被审核且驳回'
      showToast({
        title: resText,
        icon: 'none'
      })
      return
    }

    let { formKey, uuid } = this.data.formInfo
    submitAuditRes({
      formKey,
      uuid,
      through: true,
      opinion: "通过"
    }).then(res => {
      showToast({
        title: '审核通过',
        icon: 'success'
      })
      this.setData({
        currAuditIdx: this.data.currAuditIdx + 1
      })
      setTimeout(() => {
        this.querySubmitData()
      }, 2000)
    })

  },

  failAudit() {
    // 判断是否已审核
    let { auditStatus, passed } = this.data.auditList[this.data.currAuditIdx]
    if (auditStatus) {
      let resText = passed ? '该信息已被审核通过' : '该信息已被审核且驳回'
      showToast({
        title: resText,
        icon: 'none'
      })
      return
    }

    if (!this.data.rejectReason) {
      showToast({
        title: '请填写具体驳回原因',
        icon: 'none'
      })
      return
    }

    let { formKey, uuid } = this.data.formInfo
    submitAuditRes({
      formKey,
      uuid,
      through: false,
      opinion: this.data.rejectReason
    }).then(res => {
      this.setData({
        show: false,
        rejectReason: '',
        currAuditIdx: this.data.currAuditIdx + 1
      });
      showToast({
        title: '已驳回',
        icon: 'none'
      })
      setTimeout(() => {
        this.querySubmitData()
      }, 2000)
    })

  },

  rejectReaChange(e) {
    this.setData({
      'rejectReason': typeof (e.detail) == 'string' ? e.detail : e.detail.value
    })
  },

  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },

  // 点击搜索框右侧按钮
  searchClick(e) {
    let searchText = this.selectComponent('#' + this.data.searchParams.id).input_text

    if (this.data.searchParams.defaultValue == searchText) {
      // 如果搜索框内是默认值就下一条信息
      this.setData({
        currAuditIdx: this.data.currAuditIdx + 1
      })
      this.querySubmitData()
    } else {
      // 如果搜索框内不是默认值就视为搜索
      this.searchByStuid(searchText)
    }
  },

  // 通过学号搜索
  searchByStuid(searchText) {
    let searchParams = {
      formKey: this.data.auditList[0].formKey,
      submitNumber: searchText,
      userType: this.data.auditList[0].userType
    }
    this.querySubmitData(searchParams)
  },

  // 点击查看图片
  viewImage() {
    let imageArr = this.data.formData.imageArr

    if (!imageArr) {
      let uuidArr = this.data.formData.image
      uuidToUrl(uuidArr).then(res => {
        this.data.formData.imageArr = res
        console.log(res)
        wx.previewImage({
          urls: res,
        })
      })
    } else {
      console.log(imageArr)
      wx.previewImage({
        urls: imageArr,
      })
    }
  },


})
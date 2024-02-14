import { queryAuditList, querySingleAuditForm } from "../../api/form"
import { showToast } from "../../common/func"

const app = getApp()

Page({
  data: {
    // 分类列表
    category: [{
      key: 'all',
      text: '全部'
    },
    {
      key: 'wait',
      text: '待审核'
    },
    {
      key: 'exception',
      text: '有异常'
    },
    {
      key: 'other',
      text: '其他'
    }
    ],
    statusDict: {
      'wait': '待审核',
      'passed': '审核通过',
      'reject': '审核驳回'
    },
    multiFormInfo: {},
    pageData: {
      // 该数组用于储存分类用的item数据
    },
    currCate: 'all',
  },

  onLoad(options) {
    this.initData()
  },

  initData() {
    return new Promise(async resolve=>{
      await this.queryMultipleForm()
      resolve()
    })
  },

  onPullDownRefresh(){
    this.initData().then(()=>{
      wx.stopPullDownRefresh()
    })
  },

  // 切换分类
  switchCate(e) {
    // console.log(e)
    const {
      idx, // 分类id
      key // 选择的key
    } = e.currentTarget.dataset

    let { multiFormInfo } = this.data
    if (!multiFormInfo[key]) {
      this.queryMultipleForm(key)
    }

    this.setData({
      currCate: key
    })

  },

  // 获取多个审核表单
  async queryMultipleForm(status, page = 1, subLimit = 3, limit = 10) {
    let { currCate } = this.data
    status = status || currCate

    await queryAuditList(
      status,
      page,
      subLimit,
      limit
    ).then(res => {
      let { records, ...multiFormInfo } = res

      let formKeys = []
      let auditInfo = {}
      let auditList = {}
      for (let form of records) {
        let obj = {
          title: form[0].title,
          formKey: form[0].formKey,
          subTitle: '',
          size: subLimit
        }

        auditInfo[obj.formKey] = obj
        auditList[obj.formKey] = {
          records: form
        }
        if (!formKeys.includes(obj.formKey)) {
          formKeys.push(obj.formKey)
          this.querySingleForm(obj.formKey)
        }
      }
      multiFormInfo.formKeys = formKeys

      this.setData({
        [`multiFormInfo.${status}`]: multiFormInfo,
        [`auditInfo.${status}`]: auditInfo,
        [`auditList.${status}`]: auditList
      })
    })
  },

  // 获取单个审核表单
  querySingleForm(formKey, page = 1, status, limit = 10) {
    let { currCate } = this.data
    status = status || currCate

    querySingleAuditForm(formKey, status, page, limit).then(res => {
      this.setData({
        [`auditList.${status}.${formKey}.total`]: 0,
        [`auditInfo.${status}.${formKey}.total`]: res.total
      })

      // 延时setData是为了等待下拉列表收起的动画时间
      setTimeout(() => {
        this.setData({
          [`auditList.${status}.${formKey}`]: res
        })
      }, 300)
    })
  },

  tapDetails(e) {
    const { key, idx } = e.currentTarget.dataset
    let records = this.data.auditList[this.data.currCate][key].records
    let arr = [records[idx], ...records.slice(0, idx), ...records.slice(idx + 1)]

    app.$router.push('examineDetail', {
      auditList: arr
    })

  },

  viewAllList(e) {
    const { key } = e.currentTarget.dataset
    // console.log('formkey=>', key)

    let { auditList, currCate } = this.data
    if (auditList[currCate][key].size == 3) {
      this.querySingleForm(key)
    } else {
      this.setData({
        [`auditInfo.${currCate}.${key}.size`]: 10
      })
    }

  },

  perviousPage(e) {
    const { key } = e.currentTarget.dataset
    // console.log('formkey=>', key)

    let { current } = this.data.auditList[this.data.currCate][key]
    if (current <= 1) {
      showToast({
        title: '当前为第一页'
      })
      return
    }

    this.querySingleForm(key, current - 1)
  },

  nextPage(e) {
    const { key } = e.currentTarget.dataset
    // console.log('formkey=>', key)

    let { current, pages } = this.data.auditList[this.data.currCate][key]
    if (current >= pages) {
      showToast({
        title: '当前为最后一页'
      })
      return
    }

    this.querySingleForm(key, current + 1)
  },

  perviousForm() {
    let currCate = this.data.currCate
    let { current } = this.data.multiFormInfo[currCate]
    if (current <= 1) {
      showToast({
        title: '当前为第一页'
      })
      return
    }

    this.queryMultipleForm(currCate, current - 1)
  },

  nextForm(e) {
    let currCate = this.data.currCate
    let { current, pages } = this.data.multiFormInfo[currCate]
    if (current >= pages) {
      showToast({
        title: '当前为最后一页'
      })
      return
    }

    this.queryMultipleForm(currCate, current + 1)
  },


})
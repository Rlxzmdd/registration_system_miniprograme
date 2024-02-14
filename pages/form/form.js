import { queryFormDetail } from '../../api/form';
import { formSubmit } from '../../api/other';
import { showToast } from '../../common/func';
import { shareApp } from '../../api/other'

const app = getApp()

Page({
  data: {
    formList: [], // 务必是数组形式 [obj]
    statusArr: {} // 0非必填,1必填,2验证通过,3验证不通过
  },

  onLoad(options) {
    const params = app.$router.params || {}
    console.log(params)
    let { formInfo, title = '表单填写', formKey } = params
    this.setData({
      title
    })
    if (formInfo) {
      this.setData({
        formList: formInfo
      })
    } else if (formKey) {
      this.queryFormDetail(formKey)
    }
  },

  submitForm() {
    let result = {}
    let formList = this.data.formList

    for (let form of formList) {
      for (let item of form.formInfo) {
        let obj = this.selectComponent('#' + item.id)
        // console.log(obj)
        if (obj.valiRes.status != 2 && obj.valiRes.status != 0) {
          wx.showToast({
            title: obj.valiRes.msg || item.label + '有误，请重新输入',
            icon: 'none'
          })
          return
        }
        // 验证通过
        // 判断有无指定输出
        switch (item.output) {
          case 'id':
            result[item.id] = obj.input_id
            break
          case 'uuid':
            result[item.id] = obj.uuid
            break
          case 'fileList':
            result[item.id] = obj.fileList
            break
          default:
            result[item.id] = obj.input_text
        }
      }
    }

    // console.log('validate success =>', result)

    if (!formList[0].submitParams) {
      showToast({
        title: '未找到提交路径'
      })
      return
    }

    let params = {
      ...formList[0].submitParams,
      data: { ...formList[0].submitParams.data, ...result }
    }
    if (params.url.includes("/api/form_item/push/")) {
      params.data = {
        override: true,
        data: params.data
      }
    }
    formSubmit(params).then(res => {
      // 判断上一页面有无定义提交成功回调
      const pages = getCurrentPages()
      if (pages.length >= 2) {
        let prevPage = pages[pages.length - 2]; //上一个页面
        if (prevPage.submitCallback) {
          prevPage.submitCallback()
        }
      }

      app.$router.redirect('submitSuccess')
    })
  },

  // 查询表单详情
  queryFormDetail(formKey) {
    queryFormDetail(formKey).then(res => {
      let formObj = {
        ...res.template,
        submitParams: {  // 提交参数
          url: '/api/form_item/push/' + formKey,
          method: 'post'
        }
      }
      this.setData({
        formList: [formObj]
      })
    })
  },

  // 转发
  onShareAppMessage() {
    let formList = this.data.formList
    let urlSplit = formList[0].submitParams.url.split("/")
    let formKey = urlSplit[urlSplit.length - 1]

    return shareApp(formList[0].formName || 'HeyNUIT', 'form', { formKey })
  },

  // 点击右上角分享
  clickShare() {
    let formList = this.data.formList
    let urlSplit = formList[0].submitParams.url.split("/")
    let formKey = urlSplit[urlSplit.length - 1]

    return shareApp(formList[0].formName || 'HeyNUIT', 'form', { formKey })
  },

})
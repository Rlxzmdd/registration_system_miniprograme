const app = getApp()
const { getMySubmitForm } = require('../../api/form.js')
const { getNoticeList } = require('../../api/notice.js')
import { student, universal, teacher } from '../../common/funcRoute.js'
import { shareApp, getRoleRouter } from '../../api/other'
import { showToast } from '../../common/func'

Page({
  data: {
    func: universal,
    dataStatistics: [
      {
        data: '9个',
        text: '所带班级数量'
      },
      {
        data: '279人',
        text: '总人数'
      },
      {
        data: '120人',
        text: '已绑定人数'
      },
      {
        data: '50人',
        text: '已填报人数'
      }
    ],
    latestNotice: "",
    todoList: [
      {
        title: 'xxx的信息待审核',
        releaseTime: '2021/07/31 18:00',
        tip: '点击审核',
        type: 'toExamine'
      },
      {
        title: '新生信息填报待完成',
        releaseTime: '2021/07/31 18:00',
        tip: '点击填报',
        type: 'toWrite'
      },
      {
        title: '2021级新生入学流程',
        releaseTime: '2021/07/31 18:00',
        tip: '点击查看',
        type: 'toView'
      }
    ],
    popup: {},
  },

  onLoad() {
    this.initData()
  },

  onShow() {

  },

  onPullDownRefresh() {
    this.initData()
  },

  // 初始化数据
  async initData() {
    // 最新公告
    await this.getLatestNotice()
    // 本人提交过的表单
    await this.getMyForm()
    // 获取角色路由
    this.getRouter()

    wx.stopPullDownRefresh()
    showToast({
      title: '刷新成功',
      icon: 'none'
    })
  },

  // 页面跳转
  toPage(e) {
    let urlName = e.currentTarget.dataset.url
    app.$router.push(urlName)
  },

  // 打开/关闭弹出层
  switchPopup(e) {
    let key = e.currentTarget.dataset.key
    this.setData({
      [`popup.${key}`]: !this.data.popup[key]
    })
  },

  // 点击待办事项
  handleTodo(e) {
    let { index } = e.currentTarget.dataset
    let { type } = this.data.todoList[index]

    switch (type) {
      case 'toExamine':
        app.$router.push('examineList')
        break
      case 'toWrite':
        app.$router.push('formList')
        break
      case 'toView':
        // app.$router.push('')
        console.log('路径待确认')
        break
    }
  },

  // 查询最新一条公告
  getLatestNotice() {
    return new Promise(resolve => {
      getNoticeList(1).then(res => {
        // 时间去除秒数
        res.records.forEach(item => {
          item.releaseTime = item.releaseTime.substring(0, 17)
        })

        this.setData({
          latestNotice: res.records[0]
        })
        app.globalData.noticeRawData = res
        app.globalData.noticeRawData['cacheTime'] = Math.round(new Date().getTime() / 1000)

        resolve()
      })
    })
  },

  // 点击公告的图片 => 放大预览
  imgClick(e) {
    const { index } = e.currentTarget.dataset

    let images = []
    this.data.latestNotice.images.forEach(item => {
      images.push(item.url)
    })
    wx.previewImage({
      urls: images,
      current: images[index]
    })
  },

  // 获取我提交过的表单状态
  getMyForm(status = 'all', page = 1, limit = 5) {
    return new Promise(resolve => {
      getMySubmitForm(status, page, limit).then(res => {
        const icons = {
          'pass': {
            icon: 'tongguo',
            iconText: '审核通过'
          },
          'fail': {
            icon: 'jujue',
            iconText: '拒绝通过'
          },
          'checking': {
            icon: 'shenhezhong',
            iconText: '等待审核'
          }
        }

        let list = []
        let passedArr = []
        let { records, ...info } = res
        records.forEach(item => {
          let icon = ""
          let iconText = ""
          if (item.auditFinish) {
            if (item.passed) {
              icon = icons['pass'].icon
              iconText = icons['pass'].iconText
            } else {
              icon = icons['fail'].icon
              iconText = icons['fail'].iconText
            }
          } else {
            icon = icons['checking'].icon
            iconText = icons['checking'].iconText
          }
          let obj = {
            ...item,
            icon,
            iconText
          }
          // 暂不显示已审核通过的
          if (item.passed) {
            passedArr.push(obj)
          } else {
            list.push(obj)
          }
        })
        // 如果全都是审核通过,则显示最新通过的一条
        if (list.length == 0 && passedArr.length > 0) {
          list.push(passedArr[0])
        }

        this.setData({
          mySubmitForm: {
            ...info,
            list
          }
        })
        resolve()
      })
    })
  },

  // 点击某个已填表单
  clickForm(e) {
    // let { index } = e.currentTarget.dataset
    // let { formKey, formName, auditFinish, passed } = this.data.mySubmitForm.list[index]
    app.$router.push('formList')
  },

  // 获取首页功能路由
  getRouter() {
    // 如果app.globalData已经有获取到了
    let funcRouter = app.globalData.funcRouter
    if (funcRouter) {
      this.setData({
        func: funcRouter
      })
      return
    }
    // 如果没有则重新获取
    let userInfo = wx.getStorageSync('userInfo') || {}

    getRoleRouter(userInfo.roleId).then(res => {
      app.globalData.funcRouter = res
      this.setData({
        func: res
      })
    })
  },

  // 转发
  onShareAppMessage() {
    return shareApp('HeyNUIT', 'index')
  }

})
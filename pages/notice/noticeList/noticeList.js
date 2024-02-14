import {
  deleteNotice,
  getMyReleaseNotice,
  getNoticeList
} from "../../../api/notice"
import {
  getPermissionNode
} from "../../../api/user"
import {
  showModal,
  showToast
} from "../../../common/func"

const app = getApp()

Page({
  data: {
    category: [{
        key: 'all',
        text: '公告'
      },
      {
        key: 'myRelease',
        text: '我发布的'
      }
    ],
    currCate: 'all',
    noticeList: [],
    canReleaseRole: ['管理员', '助辅', '辅导员', '教师','信息发布员'], // 可以发布公告的角色
    canRelease: false, // 该用户能否发布公告
  },

  onLoad(options) {
    this.initData()
  },

  onPullDownRefresh() {
    console.log('pulldown')
    this.refresh()
  },

  async initData() {
    this.judgeCanRelease()
    await this.getNoticeList()
  },

  // 刷新
  async refresh() {
    // 删除全局缓存中的数据
    app.globalData.noticeRawData = {}
    this.data.noticeRawData = {}
    this.data.noticeList = []

    await this.initData()

    wx.stopPullDownRefresh()
    showToast({
      title: '刷新成功'
    })
  },

  // 切换分类
  switchCate(e) {
    // console.log(e)
    const {
      idx, // 分类id
      key // 选择的key
    } = e.currentTarget.dataset

    this.setData({
      currCate: key,
      noticeList: []
    })
    this.getNoticeList()
  },

  // 点击图片
  imgClick(e) {
    const {
      index,
      noticeIndex
    } = e.currentTarget.dataset
    // console.log('imgClick index=>', index, noticeIndex)

    let images = []
    this.data.noticeList[noticeIndex].images.forEach(item => {
      images.push(item.url)
    })
    wx.previewImage({
      urls: images,
      current: images[index]
    })
  },

  // 点击跳转到发布公告页
  async releaseNotice() {
    if (!this.data.canRelease) {
      showToast({
        title: '您当前未获得公告发布权限'
      })
      return
    }

    let formInfo = [{
      formId: '0',
      submitParams: {
        url: '/api/todo_notice/push',
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      },
      formInfo: [{
          label: '标题',
          type: 'input',
          id: 'title',
          placeholder: '点击输入',
          inputType: 'text',
          rule: {
            type: 'notnull',
            msg: '需输入公告标题'
          },
        },
        {
          label: '公告内容',
          type: 'textarea',
          id: 'content',
          placeholder: '点击输入',
          maxlength: -1,
          rule: {
            type: 'notnull',
            msg: '需输入公告内容'
          },
        },
        {
          label: '面向人群',
          type: 'checkbox',
          id: 'permissionId',
          placeholder: '仅选中的人群可见',
          // defaultValue: [0],
          output: 'id',
          data: await this.getPermissionNode(),
          rule: {
            type: 'notnull',
            msg: '请选择该公告所面向的人群'
          },
        },
        {
          label: '附加图片',
          type: 'upload',
          id: 'images',
          output: 'uuid',
          acceptType: 'image',
          rule: {
            type: 'null'
          },
        }
      ]
    }]

    app.$router.push('form', {
      formInfo,
      title: '发布公告'
    })
  },

  // 提交成功的回调(函数名必须为:submitCallback)
  submitCallback() {
    app.globalData.noticeRawData = undefined
  },

  // 获取权限节点(发布公告用)
  async getPermissionNode() {
    let result = []
    let permNode = await getPermissionNode()
    let orderArr = ['single', 'classes', 'major', 'college']

    for (let node of permNode) {
      let obj = {
        id: node['permissionId']
      }
      for (let item of orderArr) {
        if (node[item] != '*') {
          obj['text'] = node[item]
          break
        }
      }
      result.push(obj)
    }

    return result
  },

  // 获取公告列表
  getNoticeList(page = 1, limit = 10) {
    return new Promise(async (resolve) => {
      let rawData = app.globalData.noticeRawData[this.data.currCate]
      if (rawData && page == 1) {
        // 判断缓存时间是否已超过10分钟,超过重新获取
        let currTimestamp = Math.round(new Date().getTime() / 1000)
        let effecttiveTime = 10 * 60 // 10分钟
        if (currTimestamp - rawData.cacheTime < effecttiveTime) {
          this.setData({
            [`noticeRawData.${this.data.currCate}`]: rawData,
            noticeList: rawData.records
          })
          resolve()
          return
        }
      }

      let res = {}
      switch (this.data.currCate) {
        case 'all':
          res = await getNoticeList(page, limit)
          break
        case 'myRelease':
          res = await getMyReleaseNotice(page, limit)
          break
      }

      // 时间去除秒数
      res.records.forEach(item => {
        item.releaseTime = item.releaseTime.substring(0, 17)
        if (this.data.currCate == 'myRelease') {
          item['myRelease'] = true
        } else {
          item['myRelease'] = false
        }
      })

      let noticeList = this.data.noticeList || []
      noticeList.push(...res.records)

      this.setData({
        [`noticeRawData.${this.data.currCate}`]: res,
        noticeList
      })
      if (page == 1) {
        app.globalData.noticeRawData = this.data.noticeRawData
        app.globalData.noticeRawData[this.data.currCate]['cacheTime'] = Math.round(new Date().getTime() / 1000)
      }

      resolve()

    })
  },

  // 判断该用户能否发布公告
  judgeCanRelease() {
    let userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo')
    userInfo.role.forEach(item => {
      if (this.data.canReleaseRole.indexOf(item) != -1) {
        this.setData({
          canRelease: true
        })
        return
      }
    })
  },

  // 上一页
  previousPage() {
    let {
      current
    } = this.data.noticeRawData[this.data.currCate]
    if (current <= 1) {
      showToast({
        title: '当前为第一页'
      })
      return
    }

    this.getNoticeList(current - 1)
  },

  // 下一页
  nextPage() {
    let {
      current,
      pages
    } = this.data.noticeRawData[this.data.currCate]
    if (current >= pages) {
      showToast({
        title: '当前为最后一页'
      })
      return
    }

    this.getNoticeList(current + 1)
  },

  // 删除公告
  delNotice(e) {
    let {
      id
    } = e.currentTarget.dataset

    showModal({
      title: '确认',
      content: '是否要删除这则公告?',
      showCancel: true
    }).then(res => {
      if (res.confirm) {
        deleteNotice(id).then(res => {
          showToast({
            title: '该公告已删除',
            icon: 'success'
          })
          this.refresh()
        })
      }
    })
  },

  // 页面上拉触底
  onReachBottom() {
    this.nextPage()
  }


})
import { queryClassesSimpleInfo, queryContactInfo } from '../../../api/classes'
import { queryStuList } from '../../../api/student'
import { showToast } from '../../../common/func'

let dict = require('../../../utils/dict')

const app = getApp()

Page({
  data: {
    category: [
      {
        key: 'home',
        text: '首页'
      },
      {
        key: 'contact',
        text: '联系方式'
      },
      {
        key: 'classMember',
        text: '班级成员'
      }
    ],
    currCateIdx: 0,
    pageData: [],
    dataStatistics: [
      {
        data: '34人',
        text: '班级人数'
      },
      {
        data: '20人',
        text: '已注册人数'
      },
      {
        data: '10人',
        text: '已报到人数'
      },
      {
        data: '30人',
        text: '已填报人数'
      }
    ],
    classesParams: {
      isMyClasses: false
    },
    dict: dict,
  },

  onLoad(options) {
    let { classes } = app.$router.params || {}

    // 初始化班级查询相关参数
    let classesParams = {}
    let userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo')
    let role = userInfo.role || []
    // 学生用户,只能查询自己班级
    if ((role.length == 1 && role[0] == '学生') || !classes) {
      classesParams = {
        classesId: userInfo.classesId,
        classes: userInfo.classes,
        college: userInfo.college,
        major: userInfo.major,
        isMyClasses: true
      }
      // 学生只能看班级的联系方式
      this.setData({
        currCateIdx: 1
      })
    } else {
      classesParams = {
        classesId: classes.id,
        classes: classes.classes,
        college: classes.college,
        major: classes.major,
        isMyClasses: false
      }
    }
    this.setData({
      classesParams
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
    if (this.data.classesParams.isMyClasses) {
      this.queryContactInfo()
    } else {
      this.queryClassesSimpleInfo()
      this.queryContactInfo()
      this.queryStuList()
    }
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
  },

  // 获取班级成员(学生)列表
  queryStuList(page = 1, limit = 10) {
    if (this.data.classesParams.isMyClasses) {
      let classMembers = app.globalData.classMembers || {}
      if (classMembers.page == page && classMembers.limit == limit) {
        this.setData({
          pageData: app.globalData.classMembers.records,
          classMembers: app.globalData.classMembers
        })
        return
      }
    }

    let params = {
      classes: this.data.classesParams.classes,
      major: this.data.classesParams.major,
      college: this.data.classesParams.college,
      page,
      limit
    }
    queryStuList(params).then(res => {
      // console.log('班级成员=>', res)

      this.setData({
        pageData: res.records,
        classMembers: res
      })
      if (this.data.classesParams.isMyClasses) {
        app.globalData.classMembers = this.data.classMembers
        wx.setStorage({
          key: 'classMembers',
          data: this.data.classMembers
        })
      }
    })

  },

  // 上一页(班级成员)
  previousPage() {
    let { current } = this.data.classMembers
    if (current <= 1) {
      showToast({
        title: '当前为第一页'
      })
      return
    }

    this.queryStuList(current - 1)
  },

  // 下一页(班级成员)
  nextPage() {
    let { current, pages } = this.data.classMembers
    if (current >= pages) {
      showToast({
        title: '当前为最后一页'
      })
      return
    }

    this.queryStuList(current + 1)
  },

  // 点击查看学生详细信息(班级成员)
  viewStuDetail(e) {
    // 如果只是学生,不允许查看其它学生的详细信息
    let userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo')
    let role = userInfo.role || []
    if (role.length == 1 && role[0].indexOf('学生') != -1) {
      return
    }

    const { idx } = e.currentTarget.dataset

    let stuId = this.data.pageData[idx].number
    app.$router.push('studentDetails', { stuId })
  },

  // 查询班级简略信息
  queryClassesSimpleInfo() {
    if (this.data.classesParams.isMyClasses && app.globalData.classesSimpleInfo) {
      this.setData({
        simpleInfo: app.globalData.classesSimpleInfo
      })
      return
    }

    queryClassesSimpleInfo(this.data.classesParams.classesId).then(res => {
      this.setData({
        simpleInfo: res
      })

      // 仅缓存自己的班级信息
      if (this.data.classesParams.isMyClasses) {
        app.globalData.classesSimpleInfo = this.data.classesSimpleInfo
        wx.setStorage({
          key: 'classesSimpleInfo',
          data: this.data.classesSimpleInfo
        })
      }
    })
  },

  // 查询班级联系方式
  queryContactInfo() {
    if (this.data.classesParams.isMyClasses && app.globalData.classesContact) {
      this.setData({
        contactInfo: app.globalData.classesContact
      })
      return
    }

    queryContactInfo(this.data.classesParams.classesId).then(res => {
      this.setData({
        contactInfo: res
      })

      // 仅缓存自己的班级信息
      if (this.data.classesParams.isMyClasses) {
        app.globalData.classesContact = this.data.contactInfo
        wx.setStorage({
          key: 'classesContact',
          data: this.data.contactInfo
        })
      }
    })

  },

})
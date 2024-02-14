const {
  queryUserSubmit
} = require('../../../api/form')
const {
  getStuDetailInfo,
  queryStuDetail
} = require('../../../api/student')
const dict = require('../../../utils/dict')

const app = getApp()

Page({

  data: {
    category: [{
        key: 'baseInfo',
        text: '基本信息',
        formKey: '3z9xhb1qHZ2'
      },
      {
        key: 'familyInfo',
        text: '家庭信息',
        formKey: '8beREQIxN2r'
      },
      {
        key: 'familyMember',
        text: '家庭成员',
        formKey: 'zo2I8y5H1lq'
      },
      {
        key: 'other',
        text: '个人偏好',
        formKey: 'wOO1J9lsy4g'
      }
    ],
    currCateIdx: 0,
    stuInfo: "",
    dict,
    tmp:{}
  },

  onLoad(options) {
    let {
      stuId
    } = app.$router.params || {}
    console.log('stuId =>', stuId)

    // 初始化一些查询用的参数
    let userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {}
    let queryParams = {
      number: stuId,
      isMe: userInfo.number == stuId,
      identity: userInfo.identity
    }
    this.setData({
      queryParams
    })

    // 获取键映射
    app.getKeyMap().then(res => {
      this.setData({
        dict: res
      })
    })

    // 初始化数据
    this.initData()
  },

  initData() {
    this.getBaseInfo()
    this.queryFamilyInfo()
    this.queryFamilyMembers()
    this.queryStuOtherInfo()
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

  // 获取基本信息
  getBaseInfo() {
    if (this.data.queryParams.isMe) {
      this.getMyBaseInfo()
    } else {
      this.queryStuInfo()
    }
  },

  // 获取自己的基本信息
  getMyBaseInfo() {
    if (this.data.queryParams.isMe) {
      let info = app.globalData.studentInfo || {}
      if (info.baseInfo) {
        this.setData({
          'stuInfo.baseInfo': info.baseInfo
        })
        return
      }
    }
    // 没有缓存 请求数据
    getStuDetailInfo().then(res => {
      this.setData({
        'stuInfo.baseInfo': res
      })

      if (this.data.queryParams.isMe) {
        // 如果是本人的信息则缓存
        if (!app.globalData.studentInfo) {
          app.globalData.studentInfo = {}
        }
        app.globalData.studentInfo['baseInfo'] = this.data.stuInfo.baseInfo
        let studentInfo = wx.getStorageSync('studentInfo') || {}
        studentInfo['baseInfo'] = this.data.stuInfo.baseInfo
        wx.setStorage({
          key: 'studentInfo',
          data: studentInfo
        })
      }
    })
  },

  // 查询某个学生的基本信息
  queryStuInfo() {
    queryStuDetail(this.data.queryParams.number).then(res => {
      this.data.tmp = res
      // console.log(this.data.tmp)
      //如果当前用户有提交基本信息表单
      const category = 'baseInfo'
      const formKey = this.data.category.filter(item => item.key == category)[0].formKey
      queryUserSubmit(formKey, this.data.queryParams.number).then(res1 => {
        if (res1.content != null) {
          let content = res1.content
          for (let key in content) {
            this.data.tmp[key] = content[key]
          }
         }
      this.setData({
        'stuInfo.baseInfo': this.data.tmp
      })
      })
    })
  },

  // 查询学生填写的家庭信息
  queryFamilyInfo() {
    // 如果只是学生
    if (this.data.queryParams.identity == '学生')
      return
``
    const category = 'familyInfo'
    const formKey = this.data.category.filter(item => item.key == category)[0].formKey
    queryUserSubmit(formKey, this.data.queryParams.number).then(res => {
      // 如果有数据
      if (res.content != null) {
        let content = res.content
        let result = {
          passed: res.passed?"审核通过":"未审核",
        }
        for (let key in res.content) {
            result[key] = content[key]
        }
        this.setData({
          [`stuInfo.${category}`]: result
        })
      }
    })
  },

  // 查询学生填写的家庭成员信息
  queryFamilyMembers() {
    // 如果只是学生
    if (this.data.queryParams.identity == '学生')
      return

    const category = 'familyMember'
    const formKey = this.data.category.filter(item => item.key == category)[0].formKey
    queryUserSubmit(formKey, this.data.queryParams.number).then(res => {
      // 如果有数据
     if (res.content != null) {
        let content = res.content
        let keys = ['kinsfolkName', 'relationship', 'kinsfolkAge', 'kinsfolkEduBgd', 'kinsfolkPhone', 'workUnit', 'workDuty', 'kinsfolkEco', 'kinsfolkHealth']
        let result = {
          passed: res.passed?"审核通过":"未审核",
          // stuName: content.stuName
        }
        for (let idx = 1; idx <= 10; idx++) {
          if (idx > 3 && !content['kinsfolkName' + idx]) continue
          for (let key of keys) {
            if (idx == 1)
              result[key] = content[key]
            else
              result[key + idx] = content[key + idx]
          }
        }
        // console.log(result)
        this.setData({
          [`stuInfo.${category}`]: result
        })
      }
    })
  },

  // 查询学生填写的个人偏好
  queryStuOtherInfo() {
    // 如果只是学生
    if (this.data.queryParams.identity == '学生')
      return

    const category = 'other'
    const formKey = this.data.category.filter(item => item.key == category)[0].formKey
    queryUserSubmit(formKey, this.data.queryParams.number).then(res => {
      // 如果有数据
      if (res.content != null) {
        let content = res.content
        let result = {
          passed: res.passed?"审核通过":"未审核",
        }
        for (let key in res.content) {
            result[key] = content[key]
        }
        this.setData({
          [`stuInfo.${category}`]: result
        })
       }
    })
  },

})
import {
  queryActivityDetail,
  addManager,
  queryManagerList,
  deleteManager
} from "../../../api/activity"
import {
  searchUser
} from "../../../api/user"
import {
  showModal,
  showToast
} from "../../../common/func"
const app = getApp()
Page({
  data: {
    addData: {
      number: ''
    },
    activityData: {}, // 活动数据
  },

  onLoad(options) {
    console.log("options=>", options)
    this.setData({
      actId: options.id
    })
    this.getActInfo(options.id)
  },

  // 添加管理员时 点击搜索
  clickSearch() {
    let val = this.data.addData.number.trim()
    if (val == '') {
      wx.showToast({
        title: '请输入学号/工号',
        icon: 'none'
      })
      return
    }

    searchUser(val).then(res => {
      console.log('搜索=>', val, '结果=>', res)
      //res.data.number = val
      if(res[0] == null)
        wx.showToast({
          title: '查无此人',
          icon: 'fail'
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
    addManager(actData.id, number,type).then(res => {
      console.log('添加管理员成功=>', res)
      showToast({
        title: "成功添加管理员",
        icon: 'success',
        duration: 1000
      }).then(() => {
        this.setData({
          searchRes: null,
          'addData.number': ''
        })
        this.getActInfo(actData.id)
      })
    })
  },

  // 创建活动时输入框有输入
  inputChange(e) {
    let {
      source,
      key
    } = e.currentTarget.dataset
    let val = e.detail

    this.setData({
      [`${source}.${key}`]: val.trim()
    })
  },

  getActInfo(id) {
    queryActivityDetail({
      activityId: id
    }).then(res => {
      console.log('查询活动=>', res)
      this.queryManagerList(res)
      this.setData({
        activityData: res,
      })
    }).catch(err => {
      console.log('查询活动失败=>', err)
    })
  },
  // 查询活动的管理员信息
  queryManagerList(data) {
    queryManagerList(data.id,1,100).then(res => {
      console.log("活动id:" + data.id, '管理员=>', res.records)
      let adminList = []
      console.log(data)
      res.records.forEach(admin => {
        //let obj = res.records.filter(item => admin.managerNumber == item.number)
        let obj = {}
        obj["name"] = admin.realName
        obj["number"] = admin.managerNumber
        obj["type"] = admin.managerType
        obj["inviteTime"] = admin.inviteTime
        obj["num"] = admin.examineNum
        adminList.push(obj)
      })
      this.setData({
        "activityData.adminInfo": adminList
      })
    })
  },

  // 删除
  clickSwiperCell(e) {
    console.log('点击滑块位置 =>', e.detail, e)
    const {
      index
    } = e.currentTarget.dataset
    const admin=this.data.activityData.adminInfo[index]
    if (e.detail === 'right') {
      let userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo')
      if(userInfo.userId == admin.number &&
        userInfo.userType == admin.type){
       showToast({
         mask: true,
         title: "不能删除自己",
         icon: 'error'
       })
       return
     }else if(admin.number == this.data.activityData.creatorNumber &&
         admin.type == this.data.activityData.creatorType ){
        showToast({
          mask: true,
          title: "不能删除创建者",
          icon: 'error'
        })
        return
      }else{
        showModal({
          title:'删除确认',
          content:'请确认删除的管理员：'+admin.name,
          showCancel:true
        }).then(res=>{
          if(res.confirm){
            deleteManager(this.data.activityData.id,admin.number,admin.type).then(res=>{
              showToast({
                title: "操作成功",
                duration:1500
              }).then(()=>{
                this.getActInfo(this.data.activityData.id)
              })
            })
          }
        })
      }
    }
  },

})
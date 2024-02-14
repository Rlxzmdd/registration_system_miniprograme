import {
  getMaskName, getUserBindPhone, getBind, loginByStuId, bindOpenId, loginByAdmissionNum, loginByTeacherId, loginByExamineNum, validateBySZPT
} from '../../../api/user'
import { showModal } from '../../../common/func'

const app = getApp()

Page({
  data: {
    inputForm: {
      stuId: {
        placeholder: '请输入学号',
        inputType: 'number',
        rule: {
          type: 'reg',
          reg: '^[1-9]([0-9]{7})$',
          msg: '输入的学号有误'
        }
      },
      stuName: {
        placeholder: '请输入姓名',
        inputType: 'text',
        rule: {
          type: 'notnull',
          msg: '请输入你的姓名'
        }
      },
      admissionNum: {
        placeholder: '请输入录取通知书编号',
        inputType: 'number',
        rule: {
          type: 'reg',
          reg: '^[0-9]{1,14}$',
          msg: '录取通知书编号不合规'
        }
      },
      teacherId: {
        placeholder: '请输入您的工号',
        inputType: 'number',
        rule: {
          type: 'reg',
          reg: '^[0-9]{8}$',
          msg: '输入的工号不合规'
        }
      },
      username: {
        placeholder: '请输入账号',
        inputType: 'text',
        rule: {
          type: 'notnull',
          msg: '请输入你的账号'
        }
      },
      password: {
        placeholder: '请输入密码',
        inputType: 'text',
        rule: {
          type: 'notnull',
          msg: '请输入你的账号密码'
        }
      },
      examineNumber: {
        placeholder: '请输入考生号',
        inputType: 'number',
        rule: {
          type: 'notnull',
          msg: '请输入你的考生号'
        }
      },
      idCard_6: {
        placeholder: '请输入身份证号码后6位',
        inputType: 'text',
        rule: {
          type: 'notnull',
          msg: '请输入你的身份证号码后六位'
        }
      }
    },
    formVali: {},
    bindType: 0, // 0学号登录,1录取编号,2工号登录,3考生号
    bindName: ['学号登录', '编号登录', '工号登录', '考生号登录'],
    duration: { enter: 800, leave: 1000 },

    loading: false,
    show: false,
    ShowFollow: true,
    ShowBind: false,
    ShowKefu: false,
    LoginCheck: true,
    veCode: new Array(),
    step: 1,
    name: "",
    stuName: '',
    stuId: '',
    Username: '',
    Password: '',

  },

  onLoad: function (options) {
    var that = this
    console.log('login options=>', options)

  },

  onShow: function () {
    var _this = this
    // 如果截屏触发客服
    wx.onUserCaptureScreen(function (res) {
      _this.setData({
        ShowKefu: true
      })
    })
  },

  // 用户点击右上角分享
  onShareAppMessage: function () {
    return {
      title: 'Hey东软',
      path: '/pages/my/login/login',
    }
  },

  // 确认绑定
  confirmBind() {
    let result = ""
    switch (this.data.bindType) {
      // 通过学号姓名绑定
      case 0:
        let stuIdInput = this.selectComponent('#stuId')
        let stuNameInput = this.selectComponent('#stuName')
        result = this.validate({
          stuId: stuIdInput,
          stuName: stuNameInput
        })
        if (result) {
          this.loginByStuId(result.stuId, result.stuName)
        }
        break
      // 通过录取通知书编号
      case 1:
        let admissionNumInput = this.selectComponent('#admissionNum')
        let nameInput = this.selectComponent('#stuName')
        result = this.validate({
          admissionNum: admissionNumInput,
          stuName: nameInput
        })
        if (result) {
          this.loginByAdmissionNum(result.admissionNum, result.stuName)
        }
        break
      // 通过教师工号
      case 2:
        let teacherIdInput = this.selectComponent('#teacherId')
        let passwordInput = this.selectComponent('#password')
        result = this.validate({
          teacherId: teacherIdInput,
          password: passwordInput
        })
        if (result) {
          this.loginByTeacherId(result.teacherId, result.password)
        }
        break
      // 通过考生号登录
      case 3:
        let examineNumberInput = this.selectComponent('#examineNumber')
        let stuName = this.selectComponent('#stuName')
        let idCard_6Input = this.selectComponent('#idCard_6')
        result = this.validate({
          examineNumber: examineNumberInput,
          stuName: stuName,
          idCard_6: idCard_6Input,
        })
        if (result) {
          // console.log(result)
          this.valiStuInfo(result).then(() => {
            this.loginByExamineNum(result.stuName, result.examineNumber, result.idCard_6)
          }).catch(err => {
            console.log(err)
            showModal({
              title: '登录失败',
              content: err.msg,
              showCancel: false
            })
          })
        }
        break
    }
  },

  // 规则验证,通过则返回数据对象
  validate(objGroup) {
    let result = {}
    for (let key in objGroup) {
      let obj = objGroup[key]
      if (obj.valiRes.status != 2 && obj.valiRes.status != 0) {
        wx.showToast({
          title: obj.valiRes.msg || '输入有误，请重新输入',
          icon: 'none'
        })
        return
      }
      // 验证通过
      result[key] = obj.input_text || obj.fileList
    }
    return result
  },

  // 切换绑定方式
  switchBindType(e) {
    // console.log(e)
    let { type } = e.currentTarget.dataset

    this.setData({
      bindType: parseInt(type)
    })
  },

  // 学号登录
  loginByStuId(stuId, stuName) {
    loginByStuId(stuId, stuName).then(res => {
      console.log('res=>', res)
      wx.clearStorage({
        success: () => {
          let userInfo = wx.getStorageSync('userInfo') || {}
          userInfo.token = res.authorization
          app.globalData.userInfo = userInfo
          wx.setStorageSync('userInfo', userInfo)
          this.bindOpenId()
        },
      })

    })
  },

  // 录取通知书登录
  loginByAdmissionNum(admissionNum, stuName) {
    loginByAdmissionNum(admissionNum, stuName).then(res => {
      console.log('res=>', res)
      wx.clearStorage({
        success: () => {
          let userInfo = wx.getStorageSync('userInfo') || {}
          userInfo.token = res.authorization
          app.globalData.userInfo = userInfo
          wx.setStorageSync('userInfo', userInfo)
          this.bindOpenId()
        },
      })
    })
  },

  // 教师工号登录
  loginByTeacherId(teacherId, password) {
    loginByTeacherId(teacherId, password).then(res => {
      console.log('res=>', res)
      wx.clearStorage({
        success: () => {
          let userInfo = wx.getStorageSync('userInfo') || {}
          userInfo.token = res.authorization
          app.globalData.userInfo = userInfo
          wx.setStorageSync('userInfo', userInfo)
          this.bindOpenId()
        },
      })
    })
  },

  // 考生号登录
  loginByExamineNum(name, examineNumber, idCard_6) {
    loginByExamineNum(name, examineNumber, idCard_6).then(res => {
      console.log('res=>', res)
      wx.clearStorage({
        success: () => {
          let userInfo = wx.getStorageSync('userInfo') || {}
          userInfo.token = res.authorization
          app.globalData.userInfo = userInfo
          wx.setStorageSync('userInfo', userInfo)
          this.bindOpenId()
        },
      })
    })
  },

  // 验证考生信息
  valiStuInfo(params) {
    return new Promise((resolve, reject) => {
      let { examineNumber, stuName, idCard_6 } = params
      validateBySZPT(stuName, examineNumber, idCard_6).catch(err => {
        if (err.includes("无该考生录取信息")) {
          reject({
            msg: '无该考生录取信息，请核查考生号、姓名、身份证后六位。'
          })
        } else {
          resolve()
        }
      })
    })
  },

  // 绑定openid
  bindOpenId() {
    wx.login({
      timeout: 10000,
      success(res) {
        if (res.code) {
          bindOpenId(res.code).then(() => {
            let targetRoute = app.globalData.targetRoute
            if (targetRoute) {
              app.$router.redirect(targetRoute.routeName, targetRoute.routeParams)
            } else {
              app.$router.redirect('welcome')
            }
          })
        } else {
          console.log('wx.login登录失败！' + res.errMsg)
        }
      }
    })
  },



  // 跳转
  JumpAgreement(e) {
    wx.navigateTo({
      url: '/pages/my/law/agreement',
    })
  },
  JumpFAQ() {
    this.setData({
      ShowKefu: true
    })
    // wx.navigateTo({
    //   url: '/pages/my/faq/index',
    // })
  },
  JumpIndex() {
    return
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  // 获取绑定状态
  GetBind() {
    var _this = this
    wx.login({
      success: res => {
        if (res.code) {
          console.log(res.code)
          //发起网络请求
          getBind({
            code: res.code
          }).then(res => {
            console.log(res.data)
            if (res.data.isBind) {
              wx.showToast({
                title: '该账号已被绑定',
                icon: 'error'
              })
              setTimeout(() => {
                _this.JumpIndex()
              }, 2000)
            } else {
              _this.JumpIndex();
            }
          })
        } else {
          return false
        }
      }
    })

  },
  //更改登陆方式窗口
  ChangeType() {
    return
    var _this = this;
    this.setData({
      bindType: !_this.data.bindType,
      step: 1
    })
  },
  //拉取身份证验证
  CheckID() {
    var _this = this;
    //学号状态
    if (_this.data.StuID.length == 8) {
      this.setData({
        loading: true
      })
      getMaskName(_this.data.StuID).then(res => {
        _this.setData({
          loading: false,
          step: 2,
          name: res.data.name
        })
      })
    }
    this.setData({
      loading: false
    })


  },

  //获取手机号是否绑定
  getBindStatus() {
    var _this = this
    getUserBindPhone().then(res => {
      console.log(res)
      _this.setData({

      })
    })
  },
  //关注组件（特定场景值会出现）
  ShowFollow(e) {
    console.log(e)
    this.setData({
      ShowFollow: false
    })
  },
  //绑定手机号组件（等待接口配合）
  ShowBind(e) {
    console.log(e)
    this.setData({
      ShowBind: true
    })
  },
  onClose(e) {
    this.setData({
      show: false,
      ShowBind: false,
      ShowKefu: false
    });
  },
  //验证码赋值
  inputValue(e) {
    console.log(e);
    let value = e.detail.value;
    let arr = [...value];
    this.setData({
      veCode: arr,
      Password: value
    })
  },
  getInputValue(e) {
    var _this = this;
    //学号
    if (e.target.id == "StuID") {
      _this.setData({
        StuID: e.detail.value
      })
    }
    //用户名
    if (e.target.id == "Username") {
      _this.setData({
        StuID: e.detail.value //复用
      })
    }
    //密码
    if (e.target.id == "Password") {
      _this.setData({
        Password: e.detail.value
      })
    }
  },
  //遮罩
  onClickShow() {
    this.setData({ show: true });
  },

  onClickHide() {
    this.setData({ show: false });
  },
  // 获取手机号
  getPhoneNumber(e) {    //授权手机号登录（获得授权后加密的串）
    console.log(e.detail)
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    var _that = this;
    wx.checkSession({
      success(res) {
        if (e.detail.errMsg == 'getPhoneNumber:fail user deny') { //拒绝授权登录

        } else {  //同意授权登录
          _that.setData({
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            errMsg: e.detail.errMsg,
          });

        }
      },
      fail() {
        app.wxLogin();
      }
    })
  },



})

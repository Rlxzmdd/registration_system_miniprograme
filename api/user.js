import request from '../utils/request'

/**
 * 绑定openId
 * @param {String} code wx.login换取到的code
 */
export function bindOpenId(code) {
  return request({
    url: '/api/wechat/bind',
    method: 'post',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      code
    }
  })
}

/**
 * code 换取 token
 * @param {String} code wx.login换取到的code
 */
export function loginByCode(code) {
  return request({
    url: '/api/wechat/get_bind/' + code,
    method: 'get'
  })
}

/**
 * 学号姓名登录
 * @param {String} stuNumber 学号
 * @param {String} realName  姓名
 */
export function loginByStuId(stuNumber, realName) {
  return request({
    url: '/api/wechat/login/student',
    method: 'post',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      stuNumber,
      realName
    }
  })
}

/**
 * 录取通知书编号登录
 * @param {String} admissionNum 录取通知书编号
 * @param {String} realName  姓名
 */
export function loginByAdmissionNum(admissionNum, realName) {
  return request({
    url: '/api/wechat/login/studentAL',
    method: 'post',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      serialNumber: admissionNum,
      realName
    }
  })
}

/**
 * 教师工号登录
 * @param {String} teacherId 学号
 * @param {String} password  姓名
 */
export function loginByTeacherId(teacherId, password) {
  return request({
    url: '/api/wechat/login/teacher',
    method: 'post',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      tchNumber: teacherId,
      password
    }
  })
}

/**
 * 考生号登录
 * @param {String} realName 考生姓名
 * @param {String} examNumber 考生号
 * @param {String} lastIdNumber 身份证后6位
 */
export function loginByExamineNum(realName, examNumber, lastIdNumber) {
  return request({
    url: '/api/wechat/login/studentEXAM',
    method: 'post',
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    data: {
      realName,
      examNumber,
      lastIdNumber
    }
  })
}

/**
 * 获取权限节点
 * @returns 返回当前用户可访问对象的权限节点
 */
export function getPermissionNode() {
  return request({
    url: '/api/permission_node/query/list',
    method: 'get'
  })
}

/**
 * 获取我的用户角色
 */
export function getMyRole() {
  return request({
    url: '/api/wechat_role/query/role',
    method: 'get'
  })
}

/**
 * 获取用户核销码（认证码）
 * @param {Number}  width 宽度
 * @param {Number}  height 高度
 */
export function getInfoCode(width, height) {
  return request({
    url: "/api/wechat/query/qrcode",
    method: 'get',
    data: {
      width,
      height
    }
  })
}

/**
 * 从官网验证学生信息
 * @param {String} xm 考生姓名
 * @param {String} ksh 考生号
 * @param {String} sfzhh6w 身份证后6位
 */
export function validateBySZPT(xm, ksh, sfzhh6w) {
  // TODO: 修改
  return request({
    url: 'https://zhaosheng.szpt.edu.cn/chaxun_lqjg.jsp?wbtreeid=1006',
    method: 'post',
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    data: {
      xm,
      ksh,
      sfzhh6w
    }
  })
}




/**
 * 用户名密码换取token
 * @param {json} data.number 学号/用户名 
 * @param {json} data.cardID 密码/后六位 
 */
export function getTokenbyId(data) {
  if (data == undefined) data = wx.getStorageSync('LoginData')
  var res = request({
    url: "/form/authority",
    header: {
      'content-type': 'multipart/form-data;boundary=XXX'
    },
    method: 'post',
    data
  })
  return res
}

/**
 * 用户名密码换取token
 * @param {json} data.type 类型
 * @param {json} data.code 小程序用户code
 */
export function getBind(data) {
  if (data.type == undefined) data.type = 'bind'
  var res = request({
    url: "/user/info",
    header: {
      'content-type': 'multipart/form-data;boundary=XXX'
    },
    method: 'post',
    data
  })
  return res
}

/**
 * 获取用户信息
 * @param {json} data.type 类型
 * @param {json} data.number 学号
 */
export function getUserInfo(data) {
  console.log('用户信息=>', data)
  var res = request({
    url: "/user/info?type=" + data.type + "&number=" + data.number,
    method: 'get',
  })
  return res
}

/**
 * 获取用户打码姓名
 * @param {Number} id 学号
 */
export function getMaskName(id) {
  var res = request({
    url: "/identity/name?number=" + id,
    method: 'get',
  })
  return res
}

/**
 * 获取手机号绑定情况
 */
export function getUserBindPhone() {
  var res = request({
    url: "/form/authority",
    method: 'get',
  })
  return res
}

/**
 * 获取自身核销情况
 */
export function queryExamineSelf(page, limit) {
  var res = request({
    url: "/api/activity/examine/query/self?page=" + page + "&limit=" + limit,
    method: 'get'
  })
  return res
}


/**
 * 根据学号搜索用户
 * @param {Number} number 学号
 */
export function searchUser(number) {
  return request({
    url: "/api/wechat/find/pure/" + number,
    method: 'get',
  })
}



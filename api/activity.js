import request from '../utils/request'
import config from '../config'

/**
 * 查询活动
 * @param {Object} data
 * @param {Object} data.page 
 * @param {Object} data.limit 
 * @param {string} data.type 查询类型 
 * @param {string} data.status 活动状态 
 */
export function queryActivity(data) {
  return request({
    url: '/api/activity/query/list',
    method: 'get',
    data
  })
}

/**
 * 创建活动
 * @param {Object} data
 * @param {string} data.title 标题
 * @param {string} data.location 地点
 * @param {string} data.isDurative 是否长期开放，默认0
 * @param {string} data.isApply 是否需要报名，默认0
 * @param {string} data.isRepeat 是否需要允许重新核销，默认0
 * @param {string} data.isShare 是否允许分享，默认1
 * @param {number} data.maxNum 最大人数，默认0
 * @param {string} data.applyTimeStart 报名开始时间
 * @param {string} data.applyTimeEnd 报名结束时间
 * @param {string} data.activityTimeStart 活动开始时间
 * @param {string} data.activityTimeEnd 活动结束时间
 */
export function createActivity(data) {
  return request({
    url: '/api/activity/push',
    method: 'post',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data
  })
}


// /**
//  * 修改活动
//  * @param {Object} data 
//  * @param {string} data.activity_id 活动ID
//  */
// export function modifyActivity(data) {
//   return request({
//     url: '/activity/form?_method=put',
//     method: 'post',
//     data
//   })
// }

/**
 * 查询活动管理员信息
 * @param {number} activity_id  活动ID
 */
export function getAdminInfo(activity_id) {
  return request({
    url: "/activity/admin",
    method: "get",
    data: {
      activity_id
    }
  })
}

/**
 * 添加活动管理员
 * @param {Number} activity_id 活动id
 * @param {Number} number 学号
 */
export function addActAdmin(activity_id, number) {
  return request({
    url: '/activity/admin',
    method: 'post',
    header: {
      'content-type': 'multipart/form-data'
    },
    data: {
      activity_id,
      number
    }
  })
}

/**
 * 删除活动管理员
 * @param {number} activity_id 活动id
 * @param {number} admin_number 管理员学号/工号
 */
export function delAdmin(activity_id, admin_number) {
  return request({
    url: '/activity/del_admin?_method=delete&activity_id=' + activity_id + '&admin_number=' + admin_number,
    method: 'post'
  })
}

/**
 * 扫码核销
 * @param {number} activity_id 活动ID
 * @param {number} number 二维码中的number
 * @param {string} code 二维码中的code
 */
export function scanCode(activity_id, number, code) {
  return request({
    url: "/activity/scanner",
    method: "post",
    header: {
      "content-type": "multipart/form-data"
    },
    data: {
      activity_id,
      number,
      code
    }
  })
}

/**
 * 管理员获取核销记录
 */
export function getEliminateList(data) {
  return request({
    url: '/activity/eliminate',
    method: 'get',
    data: {
      type: 'admin',
      ...data
    }
  })
}

/**
 * 获取核销记录筛选项
 */
export function getElimOptions(id) {
  return request({
    url: '/activity/eliminate/filter',
    method: 'get',
    data: {
      activity_id: id
      // reg_id: id
    }
  })
}



/**
 * 分页 | 查询活动列表
 * @param {Object} data
 * @param {Object} data.page 
 * @param {Object} data.limit 
//  * @param {string} data.type 查询类型 
//  * @param {string} data.status 活动状态 
 */
export function queryActivityList(data) {
  return request({
    url: '/api/activity/query/list',
    method: 'get',
    data
  })
}

/**
 * 查询活动详情
 * @param {Object} data
 * @param {Integer} data.activityId 
 */
export function queryActivityDetail(data) {
  return request({
    url: '/api/activity/query/detail/' + data.activityId,
    method: 'get',
    data
  })
}

/**
 * 删除活动详情
 * @param {Object} data
 * @param {Integer} data.activityId 
 */
export function delActivity(data) {
  return request({
    url: '/api/activity/del/' + data.activityId,
    method: 'delete',
    data
  })
}

/**
 * 创建活动
 * @param {Object} data
 * @param {string} data.title 标题
 * @param {string} data.location 地点
 * @param {string} data.isDurative 是否长期开放，默认0
 * @param {string} data.isApply 是否需要报名，默认0
 * @param {string} data.isRepeat 是否需要允许重新核销，默认0
 * @param {string} data.isShare 是否允许分享，默认1
 * @param {number} data.maxNum 最大人数，默认0
 * @param {string} data.applyTimeStart 报名开始时间
 * @param {string} data.applyTimeEnd 报名结束时间
 * @param {string} data.activityTimeStart 活动开始时间
 * @param {string} data.activityTimeEnd 活动结束时间
 */
export function pushActivity(data) {
  return request({
    url: '/api/activity/push',
    method: 'post',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

/**
 * 创建活动
 * @param {Object} data
 * @param {string} data.id 活动id
 * @param {string} data.title 标题
 * @param {string} data.location 地点
 * @param {string} data.isDurative 是否长期开放，默认0
 * @param {string} data.isApply 是否需要报名，默认0
 * @param {string} data.isRepeat 是否需要允许重新核销，默认0
 * @param {string} data.isShare 是否允许分享，默认1
 * @param {string} data.maxNum 最大人数，默认0
 * @param {string} data.applyTimeStart 报名开始时间
 * @param {string} data.applyTimeEnd 报名结束时间
 * @param {string} data.activityTimeStart 活动开始时间
 * @param {string} data.activityTimeEnd 活动结束时间
 */
export function editActivity(data) {
  return request({
    url: '/api/activity/push',
    method: 'post',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data
  })
}


/**
 * 删除活动
 * @param {Object} data 
 * @param {string} data.activity_id 活动ID
 */
export function deleteActivity(activityId) {
  return request({
    url: '/api/activity/del/' + activityId,
    header: {
      'content-type': 'multipart/form-data'
    },
    method: 'delete'
  })
}

/**
 * 查询活动管理员信息
 * @param {int} activity_item_id  活动ID
 * @param {int} page  活动ID
 * @param {int} limit  活动ID
 */
export function queryManagerList(activityId, page, limit) {
  return request({
    url: "/api/activity/manage/query/list",
    method: "get",
    data: {
      activityId,
      page,
      limit
    }
  })
}
/**
 * 删除活动
 * @param {string} activityId 活动ID
 * @param {string} userNumber 
 * @param {string} userType 
 */
export function deleteManager(activityId, userNumber, userType) {
  return request({
    url: '/api/activity/manage/del?activityId=' + activityId + '&userNumber=' + userNumber + '&userType=' + userType,
    method: 'delete'
  })
}


/**
 * 添加活动管理员
 * @param {Number} activity_id 活动id
 * @param {Number} number 学号
 */
export function addManager(activityId, number, type) {
  return request({
    url: '/api/activity/manage/add/',
    method: 'post',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      activityId: activityId,
      userNumber: number,
      userType: type,
      isRead: 1,
      isModify: 0,
      isExamine: 1,
      isInvite: 0
    }
  })
}


/**
 * 查询核销列表
 * @param {number} activity_item_id  活动ID
 */
export function queryExamineList(activityId, page, limit) {
  return request({
    url: "/api/activity/examine/query/list",
    method: "get",
    data: {
      activityId,
      page,
      limit
    }
  })
}

/**
 * 扫码核销
 * @param {number} activity_id 活动ID
 * @param {number} qrcodeToken 二维码中的token
 */
export function addExamine(activityId, qrcodeToken) {
  return request({
    url: "/api/activity/examine/add?activityId=" + activityId + "&qrcodeToken=" + qrcodeToken,
    method: "post",
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    // data: {
    //   activityId,
    //   qrcodeToken,
    // }
  })
}
/**
 * 导出表格，并获取文件名
 * @param {int} activityId 
 */
export function exportExamineExcel(activityId) {
  return request({
    url: "/api/activity/examine/export/excel/" + activityId,
    method: "get"
  })
}

export function exportExamineExcelByNode(activityId) {
  return request({
    url: "/api/activity/data/examine/excel/" + activityId,
    method: "get"
  })
}

/**
 * 获取文件下载链接
 * @param {string} fileName 
 * @param {boolean} isDelete 
 */
export function getDownloadUrl(fileName, isDelete) {
  return config.baseUrl + "/api/common/download?fileName=" + fileName + "&isDelete=" + isDelete
}


/**
 * 
 * @param {Object}  params 携带参数
 * @param {Number}  activityId  活动ID
 * @param {String}  collegeName  学院
 * @param {String}  majorName  专业名称,默认为 *
 * @param {String}  className  班级,格式:21%(表示 21级)
 */
export function queryEliminateForClasses(params) {
  let {
    activityId,
    collegeName,
    majorName = "*",
    className
  } = params
  return request({
    url: '/api/activity/data/examine/class/num/' + activityId,
    method: 'post',
    header: {
      'content-type': "application/x-www-form-urlencoded"
    },
    data: {
      collegeName,
      majorName,
      className
    }
  })
}

/**
 * 查询某天里各个小时的核销数据
 * @param {Number} activityId 活动ID
 * @param {String} dateTime 日期(如: 2021-08-31)
 */
export function queryEliminateForHour(activityId, dateTime) {
  return request({
    url: '/api/activity/data/examine/hour/num/' + activityId,
    method: 'get',
    data: {
      dateTime
    }
  })
}
import request from '../utils/request'

/**
 * 获取学生简略信息
 */
export function getStuSimpleInfo() {
  return request({
    url: '/api/student/query/simple',
    method: 'get'
  })
}

/**
 * 获取学生详细信息
 */
export function getStuDetailInfo() {
  return request({
    url: '/api/student/query/detail',
    method: 'get'
  })
}

/**
 * 获取权限内学生列表
 * @param {String} page 页码
 * @param {String} limit 每页条数
 */
export function getStuList(page = 1, limit = 10) {
  return request({
    url: '/api/student/query/list',
    method: 'get',
    data: {
      page,
      limit
    }
  })
}

/**
 * 查询学生列表
 * @param {Object} dataObj 携带参数的对象
 * @param {Number}  dataObj.page    页码
 * @param {Number}  dataObj.limit   每页条数
 * @param {String}  dataObj.college 学院
 * @param {String}  dataObj.major   专业
 * @param {String}  dataObj.classes 班级
 */
export function queryStuList(dataObj) {
  return request({
    url: '/api/student/find/list',
    method: 'get',
    data: dataObj
  })
}

/**
 * 搜索学生
 * @param {Object}  params 
 * @param {Number}  params.number 学号
 * @param {String}  params.name 姓名(字符串类型)
 * @param {Number}  params.page 页码
 * @param {Number}  params.limit 每页条数
 */
export function searchStu(params) {
  return request({
    url: '/api/student/find/simple',
    method: 'get',
    data: params
  })
}

/**
 * 搜索学生详细信息
 * @param {Number} number 学号
 */
export function queryStuDetail(number) {
  return request({
    url: '/api/student/find/detail/' + number,
    method: 'get'
  })
}
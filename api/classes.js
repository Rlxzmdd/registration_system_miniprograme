import request from '../utils/request'

/**
 * 查询班级列表
 * @param {Number} page 页码
 * @param {Number} limit 每页条数
 */
export function queryClassesList(page = 1, limit = 10) {
  return request({
    url: '/api/classes/query/list',
    method: 'get',
    data: {
      page,
      limit
    }
  })
}

/**
 * 查询班级简略信息
 * @param {Number} id 班级ID
 */
export function queryClassesSimpleInfo(id) {
  return request({
    url: '/api/classes/query/simple/' + id,
    method: 'get'
  })
}

/**
 * 查询班级的联系信息
 * @param {Number} id 班级ID
 */
export function queryContactInfo(id) {
  return request({
    url: '/api/classes/query/contact/' + id,
    method: 'get'
  })
}
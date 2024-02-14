import request from '../utils/request'

/**
 * 查询所有填报的表单
 * @param {Number} page 页码
 * @param {Number} limit 每页条数
 */
export function queryFormList(page = 1, limit = 10) {
  return request({
    url: '/api/form/query/list',
    method: 'get',
    data: {
      page,
      limit
    }
  })
}

/**
 * 查询表单详情
 * @param {String} formKey 表单唯一key
 */
export function queryFormDetail(formKey) {
  return request({
    url: '/api/form/query/detail/' + formKey,
    method: 'get'
  })
}

/**
 * 查询多个表单的审核列表
 * @param {String} status 审核状态(wait\exception\all\other)
 * @param {Number} page 页码
 * @param {Number} subLimit 每个表单下的审核条数
 * @param {Number} limit 每页的表单数
 */
export function queryAuditList(status = 'wait', page = 1, subLimit = 3, limit = 10) {
  return request({
    url: '/api/form_audit_notice/query/list',
    method: 'get',
    data: {
      status,
      page,
      subLimit,
      limit
    }
  })
}

/**
 * 查询单个表单下的审核列表
 * @param {String} formKey 表单唯一key
 * @param {String} status 审核状态
 * @param {Number} page 页码
 * @param {Number} limit 每页条数
 */
export function querySingleAuditForm(formKey, status = 'wait', page = 1, limit = 10) {
  return request({
    url: '/api/form_audit_notice/query/subList/' + formKey,
    method: 'get',
    data: {
      status,
      page,
      limit
    }
  })
}

/**
 * 查询指定用户提交的表单数据
 * @param {String} formKey 表单key
 * @param {String} specifiedNumber 要查询的用户的学号/工号
 * @param {String} specifiedType 用户类型(student/teacher)
 */
export function queryUserSubmit(formKey, specifiedNumber, specifiedType = 'student') {
  return request({
    url: '/api/form_item/query/specified/' + formKey,
    method: 'get',
    data: {
      specifiedNumber,
      specifiedType
    }
  })
}

/**
 * 提交表单审核结果
 * @param {Object}    data          携带参数
 * @param {String}    data.formKey  表单Key
 * @param {String}    data.uuid     表单数据UUID
 * @param {Boolean}   data.through  是否审核通过
 * @param {String}    data.opinion  审核意见
 */
export function submitAuditRes(data) {
  return request({
    url: '/api/form_audit/push',
    method: 'post',
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    data
  })
}

/**
 * 获取本人提交过的表单的状态
 * @param {String} status 表单审核状态
 * @param {Number} page 页码
 * @param {Number} limit 每页条数
 */
export function getMySubmitForm(status, page, limit) {
  return request({
    url: '/api/form_item/query/status',
    method: 'get',
    data: {
      status,
      page,
      limit
    }
  })
}

/**
 * 获取我已填写的表单的内容
 * @param {String} formKey 表单Key
 */
export function getMyWritedData(formKey) {
  return request({
    url: '/api/form_item/query/data/' + formKey,
    method: 'get'
  })
}
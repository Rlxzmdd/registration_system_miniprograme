import { showModal } from '../common/func';
import request from '../utils/request'


/**
 * 用于表单提交,需传递详细参数
 * @param {Object}  params  提交参数
 * @param {String}  params.url      url路径
 * @param {String}  params.method   请求方式
 * @param {Object}  params.data     携带数据
 * @param {Object}  params.header   请求头
 */
export function formSubmit(params) {
  const { url, method, data, header } = params
  return request({
    url,
    method,
    data,
    header
  })
}

/**
 * 删除已上传图片
 * @param {Number} uuid
 */
export function delImage(uuid) {
  return request({
    url: '/api/resource_img/del/' + uuid,
    method: 'delete'
  })
}

/**
 * 统一转发分享
 * @param {String} title 转发标题
 * @param {String} targetRoute 目标路由名
 * @param {Object} params 携带参数{key:value},value仅支持Number或String
 */
export function shareApp(title, targetRoute, params) {
  let path = '/pages/welcome?targetRoute=' + targetRoute
  if (params) {
    for (let key in params) {
      path += '&' + key + '=' + params[key]
    }
  }

  return {
    title: title,
    path
  }
}

/**
 * 获取键映射
 */
export function getKeyMapper() {
  return request({
    url: '/api/mapper/query/mapper',
    method: 'get'
  })
}

/**
 * 获取首页角色路由
 * @param {Array} role  角色数组
 */
export function getRoleRouter(role = []) {
  let roleText = ''
  role.forEach(item => {
    if (roleText)
      roleText += '&'
    roleText += 'role=' + item
  })

  return request({
    url: '/api/route/query/role?' + roleText,
    method: 'get',
  })
}

/**
 * 一组uuid换取一组对应的url
 * @param {Array} uuid 图片uuid,数组形式
 */
export function uuidToUrl(uuid) {
  let uuidText = ''
  uuid.forEach(item => {
    if (uuidText)
      uuidText += '&'
    uuidText += 'uuid=' + item
  })

  return request({
    url: '/api/resource_img/gets?' + uuidText,
    method: 'get'
  })
}
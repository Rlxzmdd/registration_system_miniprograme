import request from '../utils/request'

/**
 * 获取公告列表
 * @param {Number}  page  页码
 * @param {Number}  limit 每页条数
 */
export function getNoticeList(page = 1, limit = 10) {
  return request({
    url: '/api/todo_notice/query/list',
    method: 'get',
    data: {
      page,
      limit
    }
  })
}

/**
 * 获取最新一条公告
 */
export function getLatestNotice() {
  return getNoticeList(1, 1)
}

/**
 * 发布公告
 * @param {Object}  data
 * @param {String}  data.title         标题
 * @param {String}  data.content       正文内容
 * @param {Array}   data.permissionId   面向人群的权限节点ID
 * @param {Array}   data.images         图片的uuid
 */
export function releaseNotice(data) {
  return request({
    url: '/api/notice/push',
    method: 'post',
    data
  })
}

/**
 * 获取我发布的公告
 * @param {Number}  page  页码
 * @param {Number}  limit 每页条数
 */
export function getMyReleaseNotice(page = 1, limit = 10) {
  return request({
    url: '/api/todo_notice/query/myself',
    method: 'get',
    data: {
      page,
      limit
    }
  })
}

/**
 * 删除已发布的公告
 * @param {Number} id 公告ID
 */
export function deleteNotice(id) {
  return request({
    url: '/api/todo_notice/del/' + id,
    method: 'delete'
  })
}
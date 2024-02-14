import {
  loginByCode
} from '../api/user'
import { showModal, showToast } from '../common/func'
import config from '../config'

var log = require('./log.js')

let requestOptions = {}

// 发生错误时返回
// {
//   "code": "V0000",
//   "msg": "...",
//   "data": { ... }
// }
// 请求成功直接返回data中数据
// { ... }

const request = options => {
  requestOptions = options
  const baseUrl = config.baseUrl
  const userInfo = wx.getStorageSync('userInfo')
  const Authorization = userInfo ? userInfo['token'] : ''
  var _this = this

  return new Promise((resolve, reject) => {
    const {
      url,
      data,
      header
    } = options
    if (data && header && header['content-type'].includes('multipart/form-data')) {
      //2021.2.14
      //由于原生小程序不支持Form-Data所以需要手动处理格式
      // 拼接boundary
      const boundary = `----FooBar${new Date().getTime()}`
      header['content-type'] += '; boundary=' + boundary

      let result = ''
      for (let name of Object.keys(data)) {
        let value = data[name];
        result +=
          `\r\n--${boundary}` +
          '\r\nContent-Disposition: form-data; name=\"' + name + '\"' +
          '\r\n' +
          '\r\n' + value
      }
      options.data = result + `\r\n--${boundary}--`
    }
    if (!options.url.includes('http'))
      options.url = baseUrl + url
    if (url == '/form/authority') {
      options.header = {
        ...options.header,
      }
    } else {
      options.header = {
        ...options.header,
        'Authorization': Authorization,
        'wechat-mini-program': 'true'
      }
    }

    wx.showLoading({
      title: '加载中...',
    })

    wx.request({
      ...options,
      timeout: 10000,
      success(res) {
        wx.hideLoading()

        const { data, header } = res
        if (data.code === '00000') {
          resolve(data.data)
        } else {
          console.log('Fail =>', data)

          handleError(data).catch((err) => {
            reject(err)
          })
        }
      },
      fail(res) {
        wx.hideLoading()
        console.log('request fail=>', res)
        showModal({
          title: '请求失败',
          content: res.errMsg,
          showCancel: false
        })
        log.error(res)
        reject(res)
      }
    })
  })
}



function refreshToken() {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 10000,
      success(res) {
        if (res.code) {
          console.log('code =>', res.code)

          loginByCode(res.code).then(res => {
            console.log('loginByCode success=>', res)

            let userInfo = wx.getStorageSync('userInfo') || {}
            userInfo.token = authorization
            wx.setStorageSync('userInfo', userInfo)

            resolve(res)
          }).catch(err => {
            // app.$router.redirect('login')
            reject(err)
          })
        } else {
          console.log('wx.login登录失败！' + res.errMsg)
        }
      }
    })
  })
}

function handleError(errorData) {
  return new Promise((resolve, reject) => {
    // 后端返回错误
    if (errorData.code) {
      switch (errorData.code) {
        // token过期
        case 'A0304':
          refreshToken().then(() => {
            _this.request(requestOptions)
          })
          break
        // 用户未绑定
        // 返回数据,不弹窗,单独处理
        case 'V0100':
          showToast({
            title: errorData.msg
          })
          reject(errorData)
          break
        default:
          log.error(errorData)
          showModal({
            title: '错误代码: ' + errorData.code,
            content: errorData.msg,
            showCancel: false
          })
          // 返回错误信息
          reject(errorData)
      }
    } else if (errorData.status) {
      // 请求失败(500类错误)
      log.error(errorData)
      showModal({
        title: '错误代码: ' + errorData.status,
        content: errorData.message || errorData.error,
        showCancel: false
      })
      // 返回错误信息
      reject(errorData)
    } else {
      // 返回错误信息 
      reject(errorData)
    }
  })
}


export default request
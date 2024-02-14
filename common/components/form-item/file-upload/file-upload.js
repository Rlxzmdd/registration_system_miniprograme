import { delImage } from '../../../../api/other'
import { ruleValidate } from '../../../../utils/formValidate'
import { showModal } from '../../../func'

const app = getApp()

Component({

  options: {
    addGlobalClass: true,
    styleIsolation: 'shared',
  },
  properties: {
    forminfo: {
      type: Object,
      value: {}
    }
  },

  data: {
    fileList: [],
    uuid: [],
    valiRes: {
      msg: '',
      status: 0 // 0非必填,1必填(初始化时状态),2验证通过,3验证不通过
    }
  },
  behaviors: ['wx://component-export'],
  export() {
    return {
      fileList: this.data.fileList,
      uuid: this.data.uuid,
      valiRes: this.data.valiRes
    }
  },
  observers: {
    fileList(newData) {
      this.validate(newData)
    }
  },
  ready() {
    const { rule: { type, msg }, label } = this.properties.forminfo

    if (type != 'null') {
      let valiRes = {
        msg: msg ? msg : label + '未达到要求',
        status: 1
      }
      this.setData({
        valiRes
      })
    } else {
      this.validate()
    }
  },
  methods: {
    // 删除
    delFile(e) {
      // console.log('delFile=>', e)
      let { fileList, uuid } = this.data

      delImage(uuid[e.detail.index]).then(res => {
        fileList.splice(e.detail.index, 1)
        uuid.splice(e.detail.index, 1)
        this.setData({
          fileList,
          uuid
        })
      })
    },

    // 文件选择完毕
    afterRead(e) {
      console.log("文件选择完毕 =>", e)
      const { file } = e.detail;

      this.fileUpload(file.url).then(res => {
        this.data.fileList.push({ ...file })
        this.data.uuid.push(res.uuid)
        this.setData({
          fileList: this.data.fileList
        })
      })
    },

    // 上传的图片超出大小
    oversize() {
      wx.showModal({
        title: '上传失败',
        content: '该文件过大，请选择其它文件或压缩该文件后重新上传。',
        showCancel: false
      })
    },

    // 验证函数
    validate(value = this.data.fileList) {
      const { label, rule } = this.properties.forminfo
      let res = ruleValidate(value, label, rule)
      this.setData({
        valiRes: res
      })
    },

    // 文件上传接口
    fileUpload(tempUrl) {
      const that = this
      return new Promise((resolve, reject) => {
        const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {}
        // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
        const uploadTask = wx.uploadFile({
          url: 'https://test.api.withmore.cn/api/resource_img/upload', // 文件上传接口
          filePath: tempUrl,
          name: 'file',
          header: {
            'authorization': userInfo.token,
            'wechat-mini-program': true
          },
          success(res) {
            console.log('上传完成 =>', res)
            let result = JSON.parse(res.data)
            if (result.code != '00000') {
              showModal({
                title: '错误代码：' + result.code,
                content: result.msg
              })
              reject(result)
            } else {
              resolve(result.data)
            }
          },
          fail(err) {
            console.log('文件上传失败=>', err)
            that.setData({
              uploadProgress: 100
            })
            // 上传失败
            wx.showModal({
              title: '文件上传失败',
              content: '网络连接超时，可尝试切换网络或上传压缩后的文件',
              showCancel: false,
            })
          },
        });

        // 上传进度
        uploadTask.onProgressUpdate((res) => {
          if (res.progress == 100) {
            setTimeout(() => {
              this.setData({
                uploadProgress: res.progress
              })
            }, 500)
          } else {
            this.setData({
              uploadProgress: res.progress
            })
          }
        })

      })
    },
  }
})

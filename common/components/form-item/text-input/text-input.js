import { ruleValidate } from '../../../../utils/formValidate'

Component({

  options: {
    multipleSlots: true,
    addGlobalClass: true,
  },
  properties: {
    forminfo: {
      type: Object,
      value: {}
    },
    placeholder: String,
    type: {
      type: String,
      value: 'text'
    }
  },
  data: {
    input_text: '',
    formInfo: {},
    valiRes: {
      msg: '',
      status: 0 // 0非必填,1必填(初始化时状态),2验证通过,3验证不通过
    }
  },
  observers: {
    'forminfo': function () {
      this.initData()
    }
  },
  behaviors: ['wx://component-export'],
  //组件最终对外导出的数据
  export() {
    return {
      input_text: this.data.input_text,
      valiRes: this.data.valiRes
    }
  },

  ready: function () {
    // console.log('text-input Ready=>', this.properties);
    this.initData()
  },
  methods: {
    initData() {
      const { rule: { type, msg }, defaultValue, label } = this.properties.forminfo
      let text = defaultValue ? defaultValue : ''

      this.setData({
        input_text: text
      })

      if (type != 'null' && !defaultValue) {
        let valiRes = {
          msg: msg ? msg : label + '未填写',
          status: 1
        }
        this.setData({
          valiRes
        })
      } else {
        this.validate()
      }
    },

    enterValue(e) {
      let { value } = e.detail
      this.setData({
        input_text: value
      });

      this.validate()
      this.triggerEvent('inputBlur')

      if (!this.data.valiRes) return
      const { status, msg } = this.data.valiRes
      if (status != 2 && status != 0) {
        wx.showToast({
          title: msg,
          icon: 'none'
        })
      }
    },

    inputChange(e) {
      let { value } = e.detail
      this.setData({
        input_text: value
      });

      this.validate()
      this.triggerEvent('inputChange')
    },

    validate() {
      const { label, rule } = this.properties.forminfo
      let value = this.data.input_text
      let res = ruleValidate(value, label, rule)
      this.setData({
        valiRes: res
      })
    },
  }
})

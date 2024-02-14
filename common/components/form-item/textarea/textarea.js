import { ruleValidate } from '../../../../utils/formValidate'

Component({

  options: {
    addGlobalClass: true,
  },
  properties: {
    forminfo: {
      type: Object,
      value: {}
    }
  },
  data: {
    input_text: '',
    valiRes: {
      msg: '',
      status: 0 // 0非必填,1必填(初始化时状态),2验证通过,3验证不通过
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
    // console.log('textarea Ready=>', this.properties);

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
  methods: {
    enterValue(e) {
      let { value } = e.detail
      this.setData({
        input_text: value
      });

      this.validate()

      if(!this.properties.valiRes) return
      const { status, msg } = this.properties.valiRes
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

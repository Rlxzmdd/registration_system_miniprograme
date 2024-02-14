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
  behaviors: ['wx://component-export'],

  data: {
    input_text: '',
    currentValue: [],
    valiRes: {
      msg: '',
      status: 0 // 0非必填,1必填(初始化时状态),2验证通过,3验证不通过
    }
  },
  //组件最终对外导出的数据
  export() {
    return {
      input_text: this.data.currentValue,
      valiRes: this.data.valiRes
    }
  },

  ready() {
    // console.log('region-picker Ready=>', this.properties);
    const { rule: { type, msg }, defaultValue, label } = this.properties.forminfo
    let text = defaultValue && defaultValue.length > 0 ? defaultValue.join(' - ') : ''
    this.setData({
      input_text: text,
      currentValue: defaultValue || []
    })

    if (type != 'null' && !(defaultValue && defaultValue.length > 0)) {
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
    confirm: function (e) {
      // console.log('selected=>', e);
      let value = e.detail.value

      this.setData({
        input_text: value.join(' - '),
        currentValue: value
      })

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

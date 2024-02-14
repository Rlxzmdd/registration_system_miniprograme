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
    input_text: '', // 输入文本
    input_id: '',
    pickerShow: false, // 底部弹窗状态
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
      input_id: this.data.input_id,
      valiRes: this.data.valiRes
    }
  },
  ready() {
    // console.log('text-picker Ready=>', this.properties)

    let { rule: { type, msg }, data, defaultValue, output, label } = this.properties.forminfo
    let defaultId = 0
    if (defaultValue) {
      let defaultIndex = data.indexOf(defaultValue)
      if (defaultIndex != -1) {
        defaultId = data[defaultIndex].id
      }
    }

    this.setData({
      input_text: defaultValue || '',
      input_id: defaultId
    });

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
    confirm(e) {
      // console.log('selected=>', e)
      let selectedValue = e.detail.value
      this.setData({
        input_text: selectedValue.text,
        input_id: selectedValue.id
      })
      this.popupSwitch()
      this.validate()
    },
    popupSwitch() {
      this.setData({
        pickerShow: !this.data.pickerShow
      })
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

import {
  formatTime
} from '../../../../utils/util'
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
      valiRes: this.data.valiRes
    }
  },

  ready() {
    // console.log('time-picker Ready=>', this.properties);
    let { rule: { type, msg }, defaultValue="", label } = this.properties.forminfo

    // 给defaultValue补0,使其成为标准时间格式
    switch (defaultValue.length) {
      // 2021-08-06 15:54
      case 16:
        defaultValue += ':00'
        break
      // 15:54
      case 5:
        break
    }

    let text = ""
    if (defaultValue) {
      text = defaultValue.length != 5 ? formatTime(new Date(defaultValue)) : defaultValue
      this.setData({
        'forminfo.currentDate': defaultValue.length != 5 ? new Date(defaultValue).getTime() : defaultValue
      })
    }

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
    confirm(e) {
      // console.log('selected=>', e)
      let selectedVal = e.detail

      if (typeof (selectedVal) != 'string')
        var date = formatTime(new Date(selectedVal))

      let input_text = ''
      switch (this.properties.forminfo.timeType) {
        case 'datetime':
          input_text = date.substring(0, 16)
          break
        case 'date':
          input_text = date.substring(0, 10)
          break
        case 'year-month':
          input_text = date.substring(0, 7)
          break
        case 'time':
          input_text = selectedVal
          break
      }

      this.setData({
        input_text
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

import { ruleValidate } from '../../../../utils/formValidate'

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
    input_text: '',
    currentValue: "",
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
    // console.log('radio-group Ready=>',this.properties);

    const { rule: { type, msg }, defaultValue = "" } = this.properties.forminfo
    this.setData({
      currentValue: defaultValue
    })

    if (defaultValue) {
      this.radioChange({ detail: defaultValue })
    } else {
      if (type != 'null') {
        let valiRes = {
          msg: msg || label + '未选',
          status: 1
        }
        this.setData({
          valiRes
        })
      }
    }
  },
  methods: {
    radioChange(e) {
      // console.log('clicked=>', e);
      let clickedName = e.detail
      this.setData({
        currentValue: clickedName,
        input_text: clickedName
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

import { ruleValidate } from '../../../../utils/formValidate'

Component({

  options: {
    addGlobalClass: true,
    // styleIsolation: 'shared',
  },
  properties: {
    forminfo: {
      type: Object,
      value: {}
    }
  },
  data: {
    input_text: [],
    input_id: [],
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

  ready: function () {
    // console.log('checkbox Ready=>',this.properties);

    const { rule: { type, msg }, defaultValue } = this.properties.forminfo

    if (defaultValue != undefined) {
      let optionsData = this.properties.forminfo.data

      for (let val of defaultValue) {
        optionsData.forEach(item => {
          if (item.text == val)
            item.checked = true
        })
      }
      this.setData({
        'forminfo.data': optionsData
      })

      this.checkboxChange({ detail: { value: defaultValue } })
    } else {
      if (type != 'null') {
        let valiRes = {
          msg: msg || label + '未填写',
          status: 1
        }
        this.setData({
          valiRes
        })
      }
    }

  },
  methods: {
    checkboxChange(e) {
      let selectedValue = e.detail.value
      let selectedId = []

      for (let val of selectedValue) {
        let selectedObj = this.properties.forminfo.data.filter((item) => item.text == val)
        if(selectedObj.length > 0 ){
          selectedId.push(selectedObj[0].id)
        }
      }

      this.setData({
        input_id: selectedId,
        input_text: selectedValue
      })

      this.validate()
    },

    validate() {
      const { label, rule } = this.properties.forminfo
      let value = this.data.input_id
      let res = ruleValidate(value, label, rule)
      this.setData({
        valiRes: res
      })
    },
  }
})

import {
  getAdminInfo,
  delAdmin,
  queryExamineList,
  getElimOptions
} from "../../../api/activity"
import {
  showModal,
  showToast
} from "../../../common/func"

Page({
  data: {
    addData: {
      number: ''
    },
    activityData: {}, // 活动数据
    elimData: {
      nowPage: -1,
      data: {}
    }, // 核销记录
    currPage: 1, // 核销记录当前页
    classes: {
      '人工智能学院': {
        '全部': ['18软件1', '19软件1', '20软件1'],
        '18级': ['18软件1', '18软件2'],
        '19级': ['19软件1', '19软件2'],
        '20级': ['20软件1', '20软件2'],
      }
    },
    popup: {
      picker: false
    },
    pickerOptions: [],

  },

  onLoad(options) {
    console.log("options=>", options)
    this.data.activityData.id = options.id
    this.getAdminInfo()
    this.queryExamineList({},0)
    //this.getOptions()
  },

  // 查询活动的管理员信息
  getAdminInfo() {
    return
    getAdminInfo(this.data.activityData.id).then(res => {
      console.log("活动id:" + this.data.activityData.id, '管理员=>', res)
      this.setData({
        "activityData.adminInfo": res.data
      })
    })
  },

  // 删除
  clickSwiperCell(e) {
    console.log('点击滑块位置 =>', e.detail, e)
    const {
      index
    } = e.currentTarget.dataset
    const admin = this.data.activityData.adminInfo[index]
    if (e.detail === 'right') {
      showModal({
        title: '再次确认',
        content: '确认要删除管理员：' + admin.name + ' 吗?',
        showCancel: true
      }).then(res => {
        console.log(res)
        if (res.confirm) {
          delAdmin(this.data.activityData.id, admin.number).then(res => {
            showToast({
              title: res.msg,
              duration: 2000
            }).then(() => {
              this.getActInfo()
            })
          })
        }
      })
    }
  },

  // 获取筛选项
  getOptions() {
    getElimOptions(this.data.activityData.id).then(res => {
      this.data.optionsList = res.data

      if (Object.keys(res.data).length != 0) {
        let college = {
          values: Object.keys(res.data)
        }
        let grade = {
          values: Object.keys(res.data[college.values[0]])
        }
        let classes = {
          values: res.data[college.values[0]][grade.values[0]]
        }

        this.setData({
          pickerOptions: [college, grade, classes]
        })
      }

      // for (let key in res.data) {
      //   college.values.push(key)
      //   for (let key2 in res.data[key]) {
      //     grade.values.push(key2)
      //     classes.values.push(...res.data[key][key2])
      //   }
      // }

      // let options = []
      // options.push({
      //   values: Object.keys(res.data)
      // })

      // function fn(obj) {
      //   for (let key in obj) {
      //     if (obj[key] instanceof Array) {
      //       options.push({
      //         values: obj[key]
      //       })
      //     } else if (typeof (obj[key]) == 'object') {
      //       let arr = Object.keys(obj[key])
      //       options.push({
      //         values: arr
      //       })
      //       fn(obj[key])
      //     }
      //   }
      // }
      // fn(res.data)
      // console.log('options', options)
    })
  },

  // 获取核销记录
  async queryExamineList(params = {}, page = null) {
    let nowPage = this.data.elimData.nowPage
    queryExamineList(
      this.data.activityData.id,
      page ? page : nowPage + 1,
      10
      ).then(res => {
      console.log('核销记录=>', res.records)
      nowPage = page ? page : nowPage + 1
      // let idx = 0
      // let result = []
      // while (idx < res.data.length) {
      //   result.push(res.data.slice(idx, idx += 10))
      // }

      this.data.elimData.nowPage = nowPage
      this.setData({
        [`elimData.data.p${nowPage}`]: res.records,
      })
    })
  },

  // 改变页数
  async stepperChange(e) {
    if(e.detail < 1) return
    if (!this.data.elimData.data['p'+(e.detail-1)]) {
      await this.queryExamineList({},e.detail-1)
    }
    this.setData({
      currPage: e.detail
    })
  },

  // 确认筛选
  filterConfirm(e) {
    console.log(e)
    let val = e.detail.value

    this.queryExamineList({
      college: val[0] == '全部' ? 'all' : val[0],
      year: val[0] == '全部' ? '-1' : val[1],
      class: val[0] == '全部' ? 'all' : val[2],
    },0)

    this.setData({
      'popup.picker': false,
      'filterRes': val.join('，')
    })
  },

  // 筛选项变化
  filterChange(e) {
    const {
      picker,
      value,
      index
    } = e.detail;
    let options = this.data.optionsList

    if (index == 0) {
      let grade = {
        values: Object.keys(options[value[0]])
      }
      picker.setColumnValues(1, Object.keys(options[value[0]]));
      picker.setColumnValues(2, options[value[0]][grade.values[0]]);
    } else if (index == 1) {
      picker.setColumnValues(2, options[value[0]][value[1]]);
    }

  },

  switchPopup(e) {
    let key = e.currentTarget.dataset.popupkey
    this.setData({
      [`popup.${key}`]: !this.data.popup[key]
    })
  },
})
/**
 *  页面导航栏
 * @param title 标题
 * @param isBack 默认开启返回上一页
 * @param openSlot 使用slot时开启,开启后导航栏底部无圆角
 */

const app = getApp()
Component({
  options: {
    multipleSlots: true
  },
  properties: {
    title: String,
    openSlot: Boolean,
    isBack: {
      type: Boolean,
      value: true
    }
  },
  data: {
    navHeight: 90,
    capsuleTop: 0,
    slotHeight: 0
  },
  observers: {
    openSlot(newData) {
      if (newData)
        this.calcSlotHeight()
      else
        this.setData({
          slotHeight: 0
        })
    },
  },
  methods: {
    back() {
      let pages = getCurrentPages()
      if (pages.length == 1) {
        app.$router.redirect('index')
      }else{
        app.$router.back()
      }
    },

    // 计算slot高度
    calcSlotHeight() {
      const query = this.createSelectorQuery()
      query.select('#navSlot').boundingClientRect()
      query.exec(res => {
        // 插槽高度(*2转为rpx)
        this.setData({
          slotHeight: res[0].height
        })
      })
    }
  },
  // 组件生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {
    const navQuery = this.createSelectorQuery()
    navQuery.select('#navBar').boundingClientRect()
    navQuery.exec(res => {
      // console.log(res)
      this.setData({
        navHeight: res[0].height
      })
    })

    if (this.properties.openSlot) {
      this.calcSlotHeight()
    }
  },
  moved: function () { },
  detached: function () { },
})

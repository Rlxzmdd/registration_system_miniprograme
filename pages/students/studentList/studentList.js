import {
  getStuList,
  searchStu
} from '../../../api/student'
import {
  showToast
} from '../../../common/func'

const app = getApp()

Page({
  data: {
    searchParams: {
      placeholder: '输入学号以进行搜索',
      inputType: 'number',
      rule: {
        type: 'null'
      }
    },
    pageData: [],
  },

  onLoad(options) {
    let {} = app.$router.params || {}

    this.initData()
  },

  initData() {
    this.getStuList()
  },

  // 获取我的学生列表
  getStuList(page = 1, limit = 10) {
    let myStudent = app.globalData.myStudent || {}
    if (myStudent.current == page && myStudent.limit == limit) {
      this.setData({
        pageData: app.globalData.myStudent.records,
        myStudent: app.globalData.myStudent
      })
    } else {
      getStuList(page, limit).then(res => {
        console.log('我的学生=>', res)

        this.setData({
          pageData: res.records,
          myStudent: res
        })
        app.globalData.myStudent = this.data.myStudent
      })
    }
  },

  // 上一页
  previousPage() {
    let {
      current
    } = this.data.isSearch ? this.data.searchRes : this.data.myStudent
    if (current <= 1) {
      showToast({
        title: '当前为第一页'
      })
      return
    }

    this.data.isSearch ? this.searchClick('',current - 1) : this.getStuList(current - 1)
  },

  // 下一页
  nextPage() {
    let {
      current,
      pages
    } = this.data.isSearch ? this.data.searchRes : this.data.myStudent
    if (current >= pages) {
      showToast({
        title: '当前为最后一页'
      })
      return
    }

    this.data.isSearch ? this.searchClick('',current + 1) : this.getStuList(current + 1)
  },

  // 点击查看学生详细信息
  viewStuDetail(e) {
    const {
      idx
    } = e.currentTarget.dataset

    let stuId = this.data.pageData[idx].number
    app.$router.push('studentDetails', {
      stuId
    })
  },

  // 搜索
  searchClick(e,page = 1, limit = 10) {
    const searchObj = this.selectAllComponents('#search')
    let keyword = searchObj[0].input_text

    if (!keyword) {
      this.setData({
        pageData: this.data.myStudent.records,
        isSearch: false
      })
      return
    }

    let params = {
      page,
      limit
    }
    if (parseInt(keyword)) {
      params.number = keyword
    } else {
      params.name = keyword
    }

    searchStu(params).then(res => {
      console.log(keyword, ' => search result=>', res)

      let {
        records,
        ...info
      } = res
      this.setData({
        pageData: records,
        searchRes: info,
        isSearch: true
      })
    })
  },


})
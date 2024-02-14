import { queryClassesList } from "../../../api/classes"

const app = getApp()

Page({
  data: {
    searchParams: {
      placeholder: '输入班级以进行搜索',
      inputType: 'text',
      rule: {
        type: 'null'
      }
    },
    pageData: [],
    classesList: [
      {
        id: 1,
        name: '18计应1班',
        college: '人工智能学院',
        classNum: '32人'
      },
      {
        id: 1,
        name: '18计应2班',
        college: '人工智能学院',
        classNum: '32人'
      },
      {
        id: 1,
        name: '18计应3班',
        college: '人工智能学院',
        classNum: '32人'
      },
      {
        id: 1,
        name: '18计应4班',
        college: '人工智能学院',
        classNum: '32人'
      },
    ]
  },

  onLoad(options) {
    this.queryClassesList()
  },

  searchClick() {
    const searchObj = this.selectAllComponents('#search')
    let keyword = searchObj[0].input_text

    const classesList = this.data.classesList
    let result = classesList.filter(item => {
      if (item.name.indexOf(keyword) != -1) {
        return item
      }
    })
    console.log(keyword, ' => search result=>', result)
    this.setData({
      pageData: result
    })
  },

  // 获取班级列表
  queryClassesList(page = 1, limit = 10) {
    let classesList = app.globalData.classesList || {}
    if (classesList.page == page && classesList.limit == limit) {
      this.setData({
        pageData: app.globalData.classesList.records,
        classesList: app.globalData.classesList
      })
    } else {
      queryClassesList(page, limit).then(res => {
        console.log('班级列表=>', res)

        this.setData({
          pageData: res.records,
          classesList: res
        })
        app.globalData.classesList = this.data.classesList
      })
    }
  },

  // 上一页
  previousPage() {
    let { current } = this.data.classesList
    if (current <= 1) {
      showToast({
        title: '当前为第一页',
        mask: true
      })
      return
    }

    this.queryClassesList(current - 1)
  },

  // 下一页
  nextPage() {
    let { current, pages } = this.data.classesList
    if (current >= pages) {
      showToast({
        title: '当前为最后一页',
        mask: true
      })
      return
    }

    this.queryClassesList(current + 1)
  },

  // 点击查看班级详细信息
  viewClassesDetail(e) {
    const { idx } = e.currentTarget.dataset

    let classes = this.data.pageData[idx]
    app.$router.push('classesInfo', { classes })
  },

})
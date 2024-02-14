/**
 * 首页功能路由
 * @param routeName      功能名称
 * @param icon      图标名
 * @param type      页面类型(page/tabPage/webview)
 * @param urlName   路由跳转name(见编译模式列表 或 /common/route/page.js)
 */

let universal = [
  {
    routeName: '活动',
    icon: 'icon-huodong',
    type: 'page',
    urlName: 'activityList'
  },
  {
    routeName: '我的公告',
    icon: 'icon-gonggao',
    type: 'page',
    urlName: 'noticeList'
  },
]

let student = [
  {
    routeName: '我的班级',
    icon: 'icon-xuesheng',
    type: 'page',
    urlName: 'classesInfo'
  },
  {
    routeName: '信息填报',
    icon: 'icon-tianbao',
    type: 'page',
    urlName: 'formList'
  },
]

let teacher = [
  {
    routeName: '班级管理',
    icon: 'icon-banji',
    type: 'page',
    urlName: 'classesList'
  },
  {
    routeName: '我的学生',
    icon: 'icon-xuesheng',
    type: 'page',
    urlName: 'studentList'
  },
  {
    routeName: '我的审核',
    icon: 'icon-shenpi',
    type: 'page',
    urlName: 'examineList'
  },
]

let offline = [
  {
    routeName: '功能房',
    icon: 'icon-jiaoshi',
    type: 'page',
    urlName: 'room'
  }
]

module.exports = {
  universal,
  student,
  teacher
}
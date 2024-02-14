// pages/room/roomDetail/rommDetail.js
Page({

  data: {
    func: [
      {
        icon: 'icon-list2',
        text: '立刻申请'
      },
      {
        icon: 'icon-shenpi',
        text: '房间管理'
      }
    ],
    roomInfo:{
      id: 0,
      content: 'xxxxxxxx',
      imagePath:'/static/empty.png',
      title: '创客空间',
      address: '西丽湖校区日新书院三楼',
      time: '8:00-18:00',
      tags:['投影','大电视','空调']
    }
  }
})
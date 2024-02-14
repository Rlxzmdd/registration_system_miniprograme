// pages/room/roomList/roomList.js
Page({
  data: {
    roomList:[
      {
        id: 0,
        imagePath:'/static/empty.png',
        title: '创客空间',
        address: '西丽湖校区日新书院三楼',
        time: '8:00-18:00',
        tags:['投影','大电视','空调'],
      },
      {
        id: 1,
        imagePath:'/static/empty.png',
        title: '创客空间',
        address: '西丽湖校区日新书院三楼',
        time: '8:00-18:00',
        tags:['投影','大电视','空调']
      },
      {
        id: 2,
        imagePath:'/static/empty.png',
        title: '创客空间',
        address: '西丽湖校区日新书院三楼',
        time: '8:00-18:00',
        tags:['投影','大电视','空调']
      }
    ]
  },

  onLoad: function (options) {

  },

  topage(e){
    const {id} = e.currentTarget.dataset
    wx.navigateTo({
      url: '../roomDetail/roomDetail?id='+id,
    })
  },

})

Page({
  data: ({
    category: [{
      key: 'all',
      text: '全部'
    },
    {
      key: 'report',
      text: '审核中'
    },
    {
      key: 'progress',
      text: '已通过'
    },
    {
      key: 'end',
      text: '其他'
    }],
    applyList:[
      {
        name:'东区日新书院创客空间',
        date:'2021/1/26 14:33'
      },
      {
        name:'东区日新书院创客空间',
        date:'2021/1/26 14:33'
      },
      {
        name:'东区日新书院创客空间',
        date:'2021/1/26 14:33'
      },
      {
        name:'东区日新书院创客空间',
        date:'2021/1/26 14:33'
      },
      {
        name:'东区日新书院创客空间',
        date:'2021/1/26 14:33'
      },
      {
        name:'东区日新书院创客空间',
        date:'2021/1/26 14:33'
      },
      {
        name:'东区日新书院创客空间',
        date:'2021/1/26 14:33'
      },
      {
        name:'东区日新书院创客空间',
        date:'2021/1/26 14:33'
      },
      {
        name:'东区日新书院创客空间',
        date:'2021/1/26 14:33'
      },
      {
        name:'东区日新书院创客空间',
        date:'2021/1/26 14:33'
      },
      {
        name:'东区日新书院创客空间',
        date:'2021/1/26 14:33'
      },
      {
        name:'东区日新书院创客空间',
        date:'2021/1/26 14:33'
      },
      {
        name:'东区日新书院创客空间',
        date:'2021/1/26 14:33'
      },
      {
        name:'东区日新书院创客空间',
        date:'2021/1/26 14:33'
      },
      {
        name:'东区日新书院创客空间',
        date:'2021/1/26 14:33'
      }
    ],
    currCateIdx: 0
  }),

  //切换分类
  switchCate(e) {
    const {
      idx,
      key
    } = e.currentTarget.dataset

    this.setData({
      currCateIdx: idx
    })

    
  },
    
})


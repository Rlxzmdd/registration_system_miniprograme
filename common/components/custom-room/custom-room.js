/*
 * @Prop  imagePath    左边列表图片路径
 * @Prop  title_6      6个字标题
 * @Prop  title_4      4个字标题
 * @Prop  content      top-card时中间的内容
 * @Prop  address      中间的地点
 * @Prop  time         中间的时间
 * @prop  isTag        标签显示开关
 * @prop  isIcon       向右图标显示开关       
 * @prop  isFunc       top-card时顶部功能按钮
 * @prop  bottom       top-card时中间底部文字
 * @slot  content      中间插槽(此时应仅有标题)
 * @slot  tags         底部标签插槽
 * @slot  func         右边功能按钮插槽
 * @slot  icon         右边Icon插槽
 */
Component({
  options:{
    multipleSlots: true
  },
  properties: {
    imagePath:String,
    title_6:String,
    title_4:String,
    content:Object,
    address:String,
    time:String,
    isTag:Boolean,
    isIcon:Boolean,
    isFunc:Boolean,
    bottom:String,
  },
  data: {

  },
  methods: {  
    
  }
})
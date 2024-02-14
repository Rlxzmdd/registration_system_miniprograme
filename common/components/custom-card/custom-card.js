/*
 * @Prop  title        6个字标题
 * @Prop  title_4      4个字标题
 * @Prop  icon         深圳职业技术学院图标
 * @Prop  content      top-card时中间的内容
 * @Prop  leftBottom   top-card时左下角文字
 * @Prop  rightBottom  top-card时右下角文字
 * @prop  halfredius   仅下半部分圆角（配合渐变头部）
 * @slot  right        top-card时右边插槽
 * @slot  content      非top-card时中间插槽(此时应仅有标题)
 */
Component({
  options:{
    multipleSlots: true,
    addGlobalClass: true
  },
  properties: {
    title:String,
    title_4:String,
    icon:Boolean,
    halfredius:Boolean,
    content:String,
    leftBottom:String,
    rightBottom:String
  },
  data: {

  },
  methods: {

  }
})

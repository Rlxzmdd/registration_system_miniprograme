const formConfig = [
  {
    formId: '0',
    formName: '新生入学个人信息表', // 不填formName则不显示表单顶部介绍
    createDate: '2021/7/10 23:57:00',
    formIntro: '扒拉扒拉扒拉扒拉扒拉扒拉扒拉扒拉扒拉扒拉扒拉扒拉扒拉扒拉扒拉扒拉扒拉扒拉扒拉扒拉',
    submitParams:{  // 提交参数
      url:'',
      method:'post'
    },
    // 具体表单元素
    formInfo: [
      {
        label: '姓名',// 标题
        type: 'input', // 表单类型(input/radio/picker/time/region/upload)
        id: 'name',   // 表单id,作为组件id、字段名,用于获取组件数据
        placeholder: '请输入你的姓名',// 提示文字
        // defaultValue: '阿巴阿巴', // 默认值
        data: [], 
        inputType:'text', // 输入类型/键盘类型
        maxlength: 10, // 最大输入长度,默认为 140,-1则不限制
        tip:'Tip: 阿巴阿巴阿巴阿巴阿巴阿巴阿巴阿巴阿巴阿巴阿巴', //提醒类文本,位于表单控件下方
        rule: {
          //验证规则正则表单式 
          //1.reg正则表达式 
          //2.notnull 非空验证 
          //3.null 不验证
          type: 'notnull',
          // reg: '',// 正则表达式
          msg: '名字不为空', //验证不通过时提示消息
        },
      },
      {
        label: '身份证',
        type: 'input', 
        inputType:'idcard',
        id: 'idcard', 
        placeholder: '请输入您的身份证',
        // defaultValue: '44000020000000000x',
        data: [],
        rule: {
          type: 'reg',
          msg: '身份证不合法',
          reg: '^((\d{18})|([0-9x]{18})|([0-9X]{18}))$',
        },
      },
      {
        label: '性别',
        type: 'radio',
        id: 'gender',
        defaultValue: 0, // 默认选中项,值对应data对象中的id值
        data: [
          { id: 0, text: '男' },
          { id: 1, text: '女' },
        ], 
        rule: {
          type: 'notnull',
          reg: '',
          msg: '请选择性别',
        },
      },
      {
        label: '专业',
        type: 'picker',
        id: 'major',
        placeholder: '选择你的录取专业',
        defaultValue: 0, // 默认选中值,对应data数组中的下标index
        output:'text', // 输出id / text 的值
        data: [
          { id: 1, text: '人工智能技术应用' },
          { id: 2, text: '大数据应用' },
          { id: 3, text: '软件技术' },
          { id: 4, text: '计算机技术应用' },
        ],
        rule: {
          type: 'notnull',
          reg: '',
        },
      },
      {
        label: '报到时间',
        type: 'time',
        id: 'reportTime',
        placeholder: '选择你的报到时间',
        // defaultValue: new Date().getTime(), // 默认时间,应与选择器中默认选中时间(currentDate)一致
        data: [], 
        rule: {
          type: 'notnull',
          reg: '',
        },
        timeType: 'datetime',//当type为time的时候 指定具体的时间控件类型(date/year-month/time/datetime)
        // 日期只能为时间戳,当timeType为'time'时,currentDate是时间点.例: '12:00'
        minDate: new Date().getTime(),// 可选的最小时间，精确到分钟
        maxDate: new Date(2022, 10, 1).getTime(),// 可选的最大时间，精确到分钟
        currentDate: new Date().getTime(), // 选择器中默认选中时间
      },
      {
        label: '出发地',
        type: 'region', // 省市区选择器
        id: 'place',
        placeholder: '请选择你的出发地',
        // defaultValue: ['广东省','深圳市','南山区'], // 默认值
        data: [], 
        rule: {
          type: 'notnull',
          reg: '',
        },
      },
      {
        label: '录取通知书',
        type: 'upload',
        id: 'image',
        placeholder: '点击上传',
        maxCount: 3, // 最大上传数量
        // maxSize: 2097152, // 文件大小限制,默认10485760字节(10MB)
        acceptType: 'image', // 接受的文件类型, 可选值为(all/media/image/file/video)
        sizeType:['original','compressed'], //当accept为image类型时设置所选图片的尺寸可选值为original compressed
        capture:['album', 'camera'], // 当accept为image类型时设置capture可选值为camera可以直接调起摄像头
        data: [], 
        rule: {
          // upload的验证类型只能为count
          type: 'count', // 计数, 需要amount字段表示数量
          amount: 1, // 小于amount则未达到要求
        },
      },
      {
        label: '面向人群',
        type: 'checkbox',
        id: 'permissionId',
        placeholder: '仅选中的人群可见',
        // defaultValue: [0],
        output: 'id', // 默认输出text(即下方data中对象的text字段)
        data: [
          { id: 1, text: '人工智能技术应用' },
          { id: 2, text: '大数据应用' },
          { id: 3, text: '软件技术' },
          { id: 4, text: '计算机技术应用' },
        ],
        rule: {
          type: 'notnull',
          msg: '请选择该公告所面向的人群'
        },
      },
      {
        label: '其它信息',
        type: 'textarea',
        id: 'remark',
        placeholder: '在此输入其它信息',
        maxlength: -1, // 最大输入长度,默认为140, -1则不限制长度
        rule: {
          type: 'null'
        },
      }
    ]
  }
]
export default formConfig;
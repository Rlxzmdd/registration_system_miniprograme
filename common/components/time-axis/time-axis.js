
Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true,
  },

  properties: {
    isCurent:{
      type: Boolean,
      value: false
    },
    showLeftLine: {
      type: Boolean,
      value: true
    },
    axisTitle: {
      type: String,
      value: ''
    }

  },

  data: {
   
  },
  ready() {
    // console.log('time-axis Ready=>',this.properties)
  },

  methods: {

  }
})

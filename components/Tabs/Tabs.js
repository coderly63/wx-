// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: []
    },
    currentIndex: {
      type: Number,
      value: 0
    }
  },
  methods: {
    handleItemTap(e) {
      let index = e.currentTarget.dataset.index;
      this.setData({
        currentIndex: index
      });
      this.triggerEvent("tabItemChange", { index })
    },
  }
})

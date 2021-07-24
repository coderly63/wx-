// pages/collect/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    collect: [],
    tabs: ["商品收藏", "品牌收藏", "店铺收藏", "浏览器足迹"]
  },
  onShow() {
    const collect = wx.getStorageSync("collect") || [];
    console.log(collect);
    this.setData({
      collect
    });

  },
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;

  }
})
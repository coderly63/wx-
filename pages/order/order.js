
import { request } from "../../request/index.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    tabs: ["全部", "待付款", "待发货", "退货"],
    currentIndex: 0,
  },

  onShow(options) {
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/auth'
      });
      return;
    }

    // 1 获取当前的小程序的页面栈-数组 长度最大是10页面 
    let pages = getCurrentPages();
    console.log(pages);
    // 2 数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    // 3 获取url上的type参数
    const { type } = currentPage.options;
    this.setData({ currentIndex: type - 1 })
    this.getOrders(type);
  },
  // 获取订单列表的方法
  async getOrders(type) {
    const res = await request({ url: "https://api-hmugo-web.itheima.net/api/public/v1/my/orders/all", data: { type } });
    this.setData({
      orders: res.orders.map(v => ({ ...v, create_time_cn: (new Date(v.create_time * 1000).toLocaleString()) }))
    })
  },
  handleTabItemChange(e) {
    const activeIndex = e.detail.index;
    this.getOrders(activeIndex + 1);
    this.setData({
      activeIndex
    })
  },
})
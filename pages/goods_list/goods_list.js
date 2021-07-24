// pages/goods_list/goods_list.js
import { request } from "../../request/index.js";

Page({

  data: {
    tabs: ["综合", "销量", "价格"],
    activeIndex: 0,
    goodsList: []
  },
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  totalPages: 1,
  handleTabItemChange(e) {
    this.setData({
      activeIndex: e.detail.index
    })
  },
  async getGoodsList() {
    const res = await request({ url: "https://api-hmugo-web.itheima.net/api/public/v1/goods/search", data: this.QueryParams });
    // 获取 总条数
    console.log(res);
    const total = res.total;
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    // console.log(this.totalPages);
    this.setData({
      // 拼接了数组
      goodsList: [...this.data.goodsList, ...res.goods]
    })

    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错  
    wx.stopPullDownRefresh();

  },
  onLoad: function (options) {
    this.QueryParams.cid = options.cid || "";
    this.QueryParams.query = options.query || "";
    this.getGoodsList()
  },
  onReachBottom() {
    //  1 判断还有没有下一页数据
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页数据
      //  console.log('%c'+"没有下一页数据","color:red;font-size:100px;background-image:linear-gradient(to right,#0094ff,pink)");
      wx.showToast({ title: '已经到底了' });

    } else {
      // 还有下一页数据
      //  console.log('%c'+"有下一页数据","color:red;font-size:100px;background-image:linear-gradient(to right,#0094ff,pink)");
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  // 下拉刷新事件 
  onPullDownRefresh() {
    // 1 重置数组
    this.setData({
      goodsList: []
    })
    // 2 重置页码
    this.QueryParams.pagenum = 1;
    // 3 发送请求
    this.getGoodsList();
  }
})
// index.js
// 获取应用实例
import { request } from '../../request/index.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [],
    cateList: [],
    floorList: []
  },
  //获取轮播图数据
  async getSwiperList() {
    const res = await request({
      url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata'
    });
    this.setData({
      swiperList: res
    })
  },
  async getCateList() {
    const res = await request({
      url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/catitems'
    });
    this.setData({
      cateList: res
    })
  },
  async getFloorList() {
    let res = await request({
      url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/floordata'
    });
    for (let i = 0; i < res.length; i++) {
      for (let j = 0; j < res[i].product_list.length; j++) {
        res[i].product_list[j].navigator_url = res[i].product_list[j].navigator_url.replace('?', '/goods_list?')
      }
    }
    this.setData({
      floorList: res
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
})
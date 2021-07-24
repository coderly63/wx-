import { request } from "../../request/index.js";

Page({
  data: {
    goodsObj: {},
    isCollect: false
  },
  GoodsInfo: {},
  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({ url: "https://api-hmugo-web.itheima.net/api/public/v1/goods/detail", data: { goods_id } });
    // 1 获取缓存中的商品收藏的数组
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_id: goodsObj.goods_id,
        goods_price: goodsObj.goods_price,
        // iphone部分手机 不识别 webp图片格式 
        // 最好找到后台 让他进行修改 
        // 临时自己改 确保后台存在 1.webp => 1.jpg 
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics,
        goods_small_logo: goodsObj.goods_small_logo,
      },
    })
    this.GoodsInfo = this.data.goodsObj;

    let collect = wx.getStorageSync("collect") || [];
    // 2 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({ isCollect })
  },
  handlePrevewImage(e) {
    const current = e.currentTarget.dataset.url;
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    wx.previewImage({
      current,
      urls,
    })
  },
  handleCartAdd() {
    let cart = wx.getStorageSync('cart') || [];
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      cart[index].num++;
    }
    wx.setStorageSync('cart', cart);
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      maskL: true
    });

    console.log(cart);
  },
  handleCollect() {
    let collect = wx.getStorageSync("collect") || [];
    const index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index !== -1) {
      collect.splice(index, 1);
      wx.showToast({
        title: '取消收藏',
        icon: 'success',
        mask: true,
      });
    } else {
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });
      collect.push(this.GoodsInfo);
    }
    this.setData({ isCollect: !this.data.isCollect });
    wx.setStorageSync("collect", collect);
  },
  onLoad: function (options) {
    const { goods_id } = options;
    this.getGoodsDetail(goods_id);
  },
})
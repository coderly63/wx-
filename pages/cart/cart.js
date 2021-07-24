import { showToast } from "../../utils/util.js";
Page({

  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  handleChooseAddress() {
    wx.chooseAddress({
      success: (result) => {
        let address = result;
        address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
        this.setData({ address });
        wx.setStorageSync('address', result);
      },
    });
  },
  handeItemChange(e) {
    // 1 获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    // 2 获取购物车数组 
    let { cart } = this.data;
    // 3 找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 4 选中状态取反
    cart[index].checked = !cart[index].checked;
    this.calculate();
    this.setData({ cart });
  },
  handleItemNumEdit(e) {
    const { operation, id } = e.currentTarget.dataset;
    let { cart } = this.data;
    const index = cart.findIndex(v => v.goods_id === id);
    cart[index].num += operation;
    if (cart[index].num === 0) {
      wx.showModal({
        title: '提示',
        content: '确定要删除么',
        success: (result) => {
          if (result.confirm) {
            cart.splice(index, 1);
            this.setData({ cart })
          } else {
            cart[index].num++;
            this.setData({ cart })
          }
        },
      });
    }
    this.calculate();
    this.setData({ cart })
    wx.setStorageSync("cart", cart);
  },
  calculate() {
    let { cart } = this.data
    let allChecked = cart.length ? cart.every(v => v.checked) : false
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    })
    this.setData({ allChecked, totalPrice, totalNum });
  },
  handleItemAllCheck() {
    let { cart, allChecked } = this.data;
    allChecked = !allChecked;
    cart.forEach(v => v.checked = allChecked)
    this.setData({ cart })
    this.calculate()
  },
  async handlePay() {
    // 1 判断收货地址
    const { address, totalNum } = this.data;
    if (!address.userName) {
      await showToast({ title: "您还没有选择收货地址" });
      return;
    }
    // 2 判断用户有没有选购商品
    if (totalNum === 0) {
      await showToast({ title: "您还没有选购商品" });
      return;
    }
    // 3 跳转到 支付页面
    wx.navigateTo({
      url: '/pages/pay/pay'
    });
  },
  onShow() {
    // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 1 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    this.setData({ cart, address });
    this.calculate();
  },
})
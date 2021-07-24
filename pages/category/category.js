import { request } from '../../request/index.js'
// pages/category/category.js
Page({

  data: {
    leftMenuList: [],
    rightContent: [],
    currentIndex: 0,
    scrollTop: 0
  },
  cates: [],


  async getCates() {
    const res = await request({ url: 'https://api-hmugo-web.itheima.net/api/public/v1/categories' });
    this.cates = res;
    this.setData({
      leftMenuList: this.cates.map(v => v.cat_name),
      rightContent: this.cates[0].children,
    })

  },
  handleItemTap(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      currentIndex: index,
      rightContent: this.cates[index].children,
      scrollTop: 0
    });
  },
  onLoad: function (options) {
    this.getCates()
  },
})
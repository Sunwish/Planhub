// miniprogram/pages/user/setting/setting.js
Page({
  data: {
    checked1: false
  },
  onChange1({
    detail
  }) {
    this.setData({
      checked1: detail
    });
  },
})

Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    contact: '',
    contant: ''
  },
 
  formSubmit: function (e) {
    let _that = this;
    let content = e.detail.value.opinion;
    let contact = e.detail.value.contact;
    if (content == "" && contact == "") {
      wx.showModal({
        title: '提示',
        content: '什么都没写哦！',
      })
      return false
    }
    if (content == "" && contact != "") {
      wx.showModal({
        title: '提示',
        content: '写一点什么吧！',
      })
      return false
    }
    if (content != "" && contact == "") {
      wx.showModal({
        title: '提示',
        content: '还没留下联系方式呢!',
      })
      return false
    }else {
      wx.showToast({
        title: '提交成功',
      })
      setTimeout(function () {
        wx.navigateBack({})
      }, 1000)
    }
  },
})
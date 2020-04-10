
const app = getApp()

Page({
  data:{
       userimg :{},
       user:{},
       hasuserInfo: false,
  },
  onLoad: function(){
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                hasuserInfo:true,
                userimg: res.userInfo.avatarUrl,
                user: res.userInfo
              })
            }
          })
        }
      }
    })
  }
})
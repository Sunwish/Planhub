
const app = getApp()

Component({
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 2
        })
      }
    }
  },
  data:{
       userimg :{},
       user:{},
       hasuserInfo: false,
  },
  methods: {
  onLoad: function(){
    wx.hideTabBar();
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
 }
})
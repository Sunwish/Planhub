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
  data: {
    userimg: {},
    user: {},
    hasuserInfo: false,
    hour: {}
  },
  methods: {
    onLoad: function () {
      wx.hideTabBar();
      this.setData({
        hasuserInfo: app.globalData.Authorize
      })
      if (app.globalData.Authorize) {
        wx.getSetting({
          success: res => {
            wx.getUserInfo({
              success: res => {
                this.setData({
                  userimg: res.userInfo.avatarUrl,
                  user: res.userInfo
                })
              }
            })
          }
        })
      }
    },
    setting: function () {
      wx.navigateTo({
        url: 'setting/setting',
      })
    }
  }
})
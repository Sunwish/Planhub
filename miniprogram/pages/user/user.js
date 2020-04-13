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
    hasuserInfo: {}
  },
  methods: {
    onLoad: function () {
      wx.hideTabBar();
      //判断用户是否授权

      if (app.globalData.Authorize) {
        wx.getUserInfo({
          success: res => {
            this.setData({
              userimg: res.userInfo.avatarUrl,
              user: res.userInfo
            })
          }
        })
      }
    },
    //设置按钮的跳转
    setting: function () {
      wx.navigateTo({
        url: 'setting/setting',
      })
    },
  }
})
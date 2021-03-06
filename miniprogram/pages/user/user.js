const app = getApp()

Component({
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        })
      }
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
      var Openid = app.globalData.openid;
      const db = wx.cloud.database();
      db.collection('users').where({
      _openid: Openid
    }).get({
      success: res => {
        this.setData({
          checked1: res.data[0].Mespush
        })
      }
    })
      }
    }
  },
  data: {
    userimg: {},
    user: {},
    hasuserInfo: false,
    checked1: {},
  },
  methods: {
    onLoad: function () {
      wx.hideTabBar();
    },
    onChange1({
      detail
    }) {
      wx.vibrateShort();
      this.setData({
        checked1: detail
      })
      //修改数据库记入的值
      const db = wx.cloud.database();
      db.collection('users').where({
        _openid: app.globalData.openid
      }).get({
        success: res => {
          db.collection('users').doc(res.data[0]._id).update({
            data: {
              Mespush: detail
            }
          })
        },
        fail: f => {
          console.log('update UserInfo failed')
        }
      })
    },
    feedback:function(){
      wx.navigateTo({
        url: '../feedback/feedback',
      })
    },
    contact:function(){
      wx.navigateTo({
        url: '../contact/contact',
      })
    },
    guide:function(){
      wx.navigateTo({
        url: '../guide/guide',
      })
    },
    onShareAppMessage: function () {
      return {
        title: '和我一起用微任务吧！',
        imageUrl: '../../images/try.png',
        path: '/pages/planWall/planWall',
        success: function (res) {
          console.log('成功', res);
        }
      }
    },
    getUserInfo:function(){
      wx.navigateTo({
        url: '../authorize/authorize',
      })
    },
    signin:function(){
      wx.navigateTo({
        url: '../authorize/authorize',
      })
    },
  }
})
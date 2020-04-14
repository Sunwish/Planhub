// miniprogram/pages/user/setting/setting.js
const app = getApp();

Page({
  data: {
    checked1: {},
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
  onLoad: function (options) {
    //数据库寻找变量
    //全局变量取openid
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
  },
  feedback:function(){
    wx.navigateTo({
      url: '../../feedback/feedback',
    })
  },
  contact:function(){
    wx.navigateTo({
      url: '../../contact/contact',
    })
  },
  guide:function(){
    wx.navigateTo({
      url: '../../guide/guide',
    })
  },
})
const app = getApp();
// pages/authorize/authorize.js
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  toRules: function () {
    wx.navigateTo({
      url: '../rules/rules',
    })
  },
  cancel:function(){
    wx.navigateBack({})
  },
  getUserInfo: function (e) {
    if (e.detail.userInfo) {
      this.updateDBUserInfo();
      wx.showToast({
        title: '授权成功',
      })
      setTimeout(function () {
        wx.switchTab({
          url: '../planWall/planWall',
          success: function (e) {
            let page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onLoad();
        }
        },1000)
      })
    } else {

      //用户按了拒绝按钮

    }
  },
  updateDBUserInfo: function (e){
     // 获取用户信息
     wx.getUserInfo({
      success: res =>{
        // 取用户信息
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        app.globalData.Authorize = true;
        // 查找用户是否已登记
        const db = wx.cloud.database();
        db.collection('users').where({
          _openid: app.globalData.openid
        }).get({
          success: res => {
            // 已登记，更新资料
            // console.log('users 表中 _openid: ' + this.data.openid + ' 找到' + res.data.length + '条记录')
            if (res.data.length >= 1) {
              db.collection('users').doc(res.data[0]._id).update({
                data: {
                  nickName: nickName,
                  avatarUrl: avatarUrl,
                  gender: gender,
                  province: province,
                  city: city,
                  country: country
                },
                success: s =>{
                  console.log('update UserInfo successed')
                },
                fail: f => {
                  console.log('update UserInfo failed')
                }
              })
            } else {
              // 未登记，添加users表新条目
              db.collection('users').add({
                data:{
                  nickName: nickName,
                  avatarUrl: avatarUrl,
                  gender: gender,
                  province: province,
                  city: city,
                  country: country,
                  Mespush:true
                },
                success: s => {
                  console.log('create UserInfo successed')
                },
                fail: f => {
                  console.log('create UserInfo failed')
                }
              })
            }
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '查询用户记录失败'
            })
            console.error('[数据库] [查询记录] 失败：', err)
          }
        })

      },
      fail: err =>{
        console.log('updateDBUserInfo failed')
      }
    })
  },
})

// pages/invite/invite.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onLoad: function (options) {
    if (!app.globalData.openid) {
      // 调用云函数
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.globalData.openid = res.result.openid;
          this.data.openid = app.globalData.openid;
          // 检查登录状态
          this.checkLogin();
          // 检查授权
          this.authorUserInfo();
          console.log(app.globalData.openid);
        },
        fail: err => {
          /*console.error('[云函数] [login] 调用失败', err)*/
        }
      })
    }
  },

  comfirm: function(){
    var tid = app.globalData.taskid2share;
    console.log(tid);
    const db = wx.cloud.database();
    console.log('joinSharedTask');
    wx.cloud.callFunction({
      name: 'joinTask',
      data: {
        taskId: tid
      },
      success: res => {
        wx.showToast({
          title: '加入任务成功',
        });
        setTimeout(function () {
          wx.switchTab({
            url: '../planWall/planWall',
          })
        }, 1000);
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '加入任务失败'
        });
        console.error('[云函数] [joinTask] 调用失败', err)
      }
    }) 
  },
  /**
   * 生命周期函数--监听页面加载
   */


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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
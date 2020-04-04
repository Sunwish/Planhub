// miniprogram/pages/task/join/join.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

/**
 * 要改写成云函数！
 */
  onJoinTask: function(data){
    var id = data.detail.value.taskId;
    
    const db = wx.cloud.database();
    const _ = db.command;
    db.collection('tasks').doc(id).update({
      data: {
        _participantsId: _.push(app.globalData.openid)
      },
      success: res => {
        wx.showToast({
          title: '加入任务成功',
        })

        setTimeout(function () {
          wx.navigateBack({})
        }, 1000)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '加入任务失败'
        })
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
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
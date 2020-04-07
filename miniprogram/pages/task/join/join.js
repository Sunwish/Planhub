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

  onJoinTask: function(data){
    const db = wx.cloud.database();
    db.collection('tasks').where({
      _id: data.detail.value.taskId
    }).get({
      success: res => {
        // 检查任务是否存在
        if (res.data.length == 1){
          // 检查是否已经加入任务
          if(res.data[0]._participantsId.includes(app.globalData.openid) == true){
            wx.showToast({
              icon: 'none',
              title: '你已加入该任务'
            });
            setTimeout(function () {
              wx.navigateBack({})
            }, 1000);
            return;
          }
          this.joinTask({ taskId: data.detail.value.taskId })
        } else {
          wx.showToast({
            icon: 'none',
            title: '任务不存在'
          });
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询失败'
        });
      }
    })
  },

  joinTask: function(data){
    wx.cloud.callFunction({
      name: 'joinTask',
      data: {
        taskId: data.taskId
      },
      success: res => {
        wx.showToast({
          title: '加入任务成功',
        });
        setTimeout(function () {
          wx.navigateBack({})
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
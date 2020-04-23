// pages/invite/invite.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      tid: ''
  },

  onLoad: function (options) {
    this.data.tid = options.tid;
    console.log(options);
    //var tid = JSON.parse(decodeURIComponent(options.tid));
    //console.log(this.data.tid);
    //console.log(r);
    if (!app.globalData.openid) {
      // 调用云函数
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.globalData.openid = res.result.openid;
          //this.data.openid = app.globalData.openid;
          // 检查登录状态
          //this.checkLogin();
          // 检查授权
          //this.authorUserInfo();
          console.log(app.globalData.openid);
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })
    }
  },
  onJoinTask: function(){
    //console.log('hahahahahahahahha');
    console.log(this.data.tid);
    //console.log('hahahahahahahahha');
    const db = wx.cloud.database();
    var tid = this.data.tid;
    db.collection('tasks').where({
      _id: tid
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
              wx.switchTab({
                url: '../planWall/planWall',
              })
            }, 1000);
            return;
          }
          this.joinTask(tid);
        } 
        else {
          wx.showToast({
            icon: 'none',
            title: '任务不存在'
          });
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '任务查找失败'
        });
      }
    })
  },
  joinTask: function(tid){
    //console.log("openid:");
    //console.log(app.globalData.openid);
    //var tid = app.globalData.taskid2share;
    //console.log(tid);
    const db = wx.cloud.database();
    console.log('joinSharedTask');
    wx.cloud.callFunction({
      name: 'joinTask',
      data: {
        taskId: this.data.tid
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
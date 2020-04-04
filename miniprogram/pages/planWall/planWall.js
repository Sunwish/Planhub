// miniprogram/pages/planWall/planWall.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tasksData: {},
    openid: ''
  },

/**
 * 请求计划数据
 */
 queryTasks: function() {
   if (this.data.openid == '') return;
   const db = wx.cloud.database()
   const _ = db.command
   db.collection('tasks').where({
     _participantsId: /*"odtr25T7IGDlWObdJ9jqz2JUc1g4"*/this.data.openid
   }).get({
     success: res => {
       /*console.log(res.data)*/
       this.setData({
         tasksData: res.data
       })
     },
     fail: err => {
       wx.showToast({
         icon: 'none',
         title: '查询记录失败'
       })
       console.error('[数据库] [查询记录] 失败：', err)
     }
   })
 },

/**
 * 请求数据
 */
  onQuery: function () {
    this.queryTasks();
  },


/**
 * 分区被选择
 
  onForumSelected: function(e) {
    console.log(e.currentTarget.id);
    var tappedId = e.currentTarget.id;
    var oldSelectedId = this.data.forumSelectedId;
    if (tappedId == oldSelectedId)  return;
    this.setData({
      forumSelectedId: tappedId
    });
    this.onQuery();
  },
*/

/**
 * 任务被选择
 */
  onPlanSelected: function(e) {
   var taskId = e.currentTarget.id;
   wx.navigateTo({
     url: '/pages/task/detail/detail?taskId=' + taskId,
   });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取openid
    if (!app.globalData.openid) {
      // 调用云函数
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.globalData.openid = res.result.openid;
          this.data.openid = app.globalData.openid;
          this.onQuery();
        },
        fail: err => {
          /*console.error('[云函数] [login] 调用失败', err)*/
        }
      })
    }
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
    this.onQuery();
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
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onQuery();
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

  },


})
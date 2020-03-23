// miniprogram/pages/planWall/planWall.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataPlans: [],
    dataForums: [],
    forumSelectedId: ''
  },

/**
 * 请求计划数据
 */
 queryPlans: function() {
   const db = wx.cloud.database()
   db.collection('plans').where({
     forumId: this.data.forumSelectedId
   }).get({
     success: res => {
       /*console.log(res.data)*/
       this.setData({
         dataPlans: res.data
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
 * 请求分区(板块)数据
 */
  queryForums: function() {
    const db = wx.cloud.database()
    db.collection('forums').get({
      success: res => {
        /*console.log(res.data)*/
        this.setData({
          dataForums: res.data
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询板块失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

/**
 * 请求数据
 */
  onQuery: function () {
    this.queryForums();
    this.queryPlans();
  },

/**
 * 分区被选择
 */
  onForumSelected: function(e) {
    /*console.log(e.currentTarget.id);*/
    var tappedId = e.currentTarget.id;
    var oldSelectedId = this.data.forumSelectedId;
    if (tappedId == oldSelectedId)  return;
    this.setData({
      forumSelectedId: tappedId
    });
    this.onQuery();
  },

/**
 * 计划被选择
 */
  onPlanSelected: function(e) {
   var planId = e.currentTarget.id;
   wx.navigateTo({
     url: '/pages/plan/detail/detail?planId=' + planId,
   });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      forumSelectedId: '9a393e025e784012001d5e41715661f5' /* 广场ID */
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
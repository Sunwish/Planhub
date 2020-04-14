// miniprogram/pages/plan/detail/detail.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskId: '',
    taskData: {},
    activeNames: [],
    loading: true,
    steps: [
      {
        text: '未开始',
        //desc: '描述信息'
      },
      {
        text: '已接受'
      },
      {
        text: '处理中'
      },
      {
        text: '已完成'
      }
    ],
    active:[1, 2]
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var taskId = options.taskId;
    /*console.log(planId);*/
    this.onGetTask(taskId);
    
  },

  onGetTask: function (taskId) {
    wx.cloud.callFunction({
      name: 'getTasks',
      data: {
        key: 'tid',
        tid: taskId
      },
      success: res => {
        // console.log(res.result.list[0]]
        this.setData({
          taskData: res.result.list[0]
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

  addSubTask: function (){
    console.log('addSubTask: function ()');
    wx.showToast({
      icon: "none",
      title: 'addSubTask: function ()'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      loading: false
    });
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
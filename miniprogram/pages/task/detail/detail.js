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
    tid: '',
    checked: false,
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

  onChange_checkbox(event){
    this.setData({
      checked: event.detail
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var taskId = options.taskId;
    /*console.log(planId);*/
    this.data.tid = taskId;
    //console.log(taskId);
    //console.log(pages[1].options.taskId);

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
        console.log(res.result.list[0])
        this.setData({
          taskData: res.result.list[0],
          loading: false
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
    wx.navigateTo({
      url: '/pages/task/createSub/createSub?taskId=' + this.data.tid,
    })
  },

  //returnTid: function (){
    //var pages = getCurrentPages();
    //console.log("get taskId from this page");
    //this.data.taskId = pages[1].options.taskId;
    //var tid = pages[1].options.taskId;
    //app.globalData.taskid2share = tid;
    //console.log(pages[1].options.taskId);    
    //console.log(tid);
    //console.log(app.globalData.taskid2share);
    //var tid = this.data.tid;
    //this.onShareAppMessage(tid);
  //},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onGetTask(this.data.tid);
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
    //var tid = res;
    //console.log(res);
    //var t = JSON.stringify(tid);
    //var res = encodeURIComponent(res);
    //var t = tid;
    //var tid =  encodeURI(t);
    //var p = '/pages/invite/invite?tid='+ this.data.tid;
    //var p1 = '/pages/invite/invite?tid=0d9cdb685e9bc2be005f20d80bea6204';
    //console.log(JSON.stringify(p));
    //console.log(JSON.stringify(p1));
    return {
      title: '加入我的任务',
      //path: 'pages/planWall/planWall',
      path: '/pages/invite/invite?tid='+this.data.tid,
      imageUrl: '../../../images/invite.jpg',
      success: function (res) {
        console.log('成功', res);
      }
    }
  }
})
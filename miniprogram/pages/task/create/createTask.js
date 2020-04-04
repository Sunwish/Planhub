// miniprogram/pages/plan/create/createPlan.js

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

  },

  onGetForumIdByName: function (forumName) {
    
    
  },

  onCreateTask: function (data) {
    var taskName = data.detail.value.name;
    var taskDescription = data.detail.value.description;
    
    if (taskName == ""){
      wx.showToast({
        icon: "none",
        title: '任务名不能为空'
      })
      return;
    }
    
    if (taskDescription == "") {
      taskDescription = "任务描述还是要有的.";
    }

    var _parentId = "";
    var _participantsId = [app.globalData.openid];
    var _handlersId = [];
    var status = 0;
    var creationTime = Date.now();
    var deadline = "";
    var priority = 0;
    var subTasksId = [];

    var taskAttr = {
      "taskName": taskName,
      "taskDescription": taskDescription,
      "_parentId": _parentId,
      "_participantsId": _participantsId,
      "_handlersId": _handlersId,
      "status": status,
      "creationTime": creationTime,
      "deadline": deadline,
      "priority": priority,
      "subTasksId": subTasksId
    };

    this._onCreateTask(taskAttr);
  },


  _onCreateTask: function (taskAttr) {
    console.log(taskAttr);
    const db = wx.cloud.database();
    db.collection('tasks').add({
      data: {
        taskName: taskAttr["taskName"],
        taskDescription: taskAttr["taskDescription"],
        _parentId: taskAttr["_parentId"],
        _participantsId: taskAttr["_participantsId"],
        _handlersId: taskAttr["_handlersId"],
        status: taskAttr["status"],
        creationTime: taskAttr["creationTime"],
        deadline: taskAttr["deadline"],
        priority: taskAttr["priority"],
        subTasksId: taskAttr["subTasksId"]
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          //counterId: res._id,
        })
        wx.showToast({
          title: '创建任务成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)

        setTimeout(function () {
          wx.navigateBack({})
        }, 1000)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '创建任务失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  }

})
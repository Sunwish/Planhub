// miniprogram/pages/task/createSub/createSub.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "activeTab": 0,
    "date": '',
    taskId: '',
    "show": false,
    "radio": '1',
    name: '',
    description: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.taskId)
    this.setData({
      taskId: options.taskId
    })
  },

  onCreateSubTask: function(event){
    var taskName = this.data.name;
    var deadline = this.data.date;
    var taskDescription = this.data.description;
    var _parentId = this.data.taskId;
    var _participantsId = [];
    var _handlersId = [];
    var status = 0;
    var creationTime = Date.now();
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
    this._onCreateSubTask(taskAttr);
  },

  _onCreateSubTask: function(taskAttr){
    const db = wx.cloud.database();
    const _ = db.command;
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
      success: res => { /* 子任务创建成功，下面将子任务ID添加到父任务的子任务ID数组中 */
        db.collection('tasks').doc(taskAttr._parentId).update({
          data: {
            subTasksId: _.push(res._id)
          },
          success: res2 => {
            wx.showToast({
              title: '添加子任务成功',
            })
            setTimeout(function() {
              wx.navigateBack({})
            }, 1000)
          },
          fail: err2 => {
            /* 子任务创建成功但是绑定失败，删除子任务 */
            db.collection('todos').doc('res._id').remove({})
            wx.showToast({
              title: '子任务添加失败，请尝重新添加',
            })
          }
        });
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '创建任务失败'
        })
      }
    })
  },

  nameChange(event) {
    this.setData({
      name: event.detail
    })
  },

  descriptionChange(event) {
    this.setData({
      description: event.detail
    })
  },

  /**
   * 日历展示 */
  onDisplay() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  onConfirm(event) {
    const [start, end] = event.detail;
    this.setData({
      show: false,
      date: `${this.formatDate(start)} - ${this.formatDate(end)}`
    });
  },

  /**
   * 返回时间 */
  formatDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  },
  onConfirm(event) {
    const [start, end] = event.detail;
    this.setData({
      show: false,
      date: `${this.formatDate(start)} - ${this.formatDate(end)}`
    });
  },

  /**
   * 选择框的提醒 */
  onChange(event) {
    this.setData({
      radio: event.detail
    });
  },

  onClick(event) {
    const {
      name
    } = event.currentTarget.dataset;
    this.setData({
      radio: name
    });
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
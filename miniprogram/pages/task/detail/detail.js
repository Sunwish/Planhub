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
    showSubTaskHandlerDetialMenu: false,
    subTaskHandlerDetialTitle: '',
    showAddSubTaskPop: false,
    "activeTab": 0,
    "date": '',
    "show": false,
    "radio": '1',
    "description": '',
    "name": '',
    subTaskHandlerDetialMenuActions: [
      {
        name: '添加处理人'
      },
      {
        name: '邀请好友加入处理',
        openType: 'share'
      }
    ],
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
    this.setData({
      showAddSubTaskPop: true
    })
    return
    wx.navigateTo({
      url: '/pages/task/createSub/createSub?taskId=' + this.data.tid,
    })
  },

  subTaskHandlerDetial: function(e){
    // console.log(e)
    this.setData({
      showSubTaskHandlerDetialMenu: true,
      subTaskHandlerDetialTitle: e.currentTarget.dataset.subtaskname
    })
    // console.log(e.currentTarget.id)
  },

  onSubTaskHandlerDetialMenuSelect(event) {
    wx.showToast({
      icon: 'none',
      title: event.detail.name
    })
  },

  onSubTaskHandlerDetialMenuClose() {
    this.setData({ showSubTaskHandlerDetialMenu: false });
  },

  onAddSubTaskPopClose: function(){
    this.setData({
      showAddSubTaskPop: false
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

  descriptionChange(event) {
    this.setData({
      description: event.detail
    })
  },

  nameChange(event) {
    this.setData({
      name: event.detail
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
  /**
   * 选择框的提醒 */
  onRadioChange(event) {
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

  onCreateSubTask: function (event) {
    var taskName = this.data.name;
    var deadline = this.data.date;
    var taskDescription = this.data.description;
    var _parentId = this.data.tid;
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

  _onCreateSubTask: function (taskAttr) {
    console.log(taskAttr)
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
            this.onAddSubTaskPopClose();
            this.onShow();
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
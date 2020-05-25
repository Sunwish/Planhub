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
    operTaskId: '',
    checked: false,
    showTaskHandlerDetialMenu: false,
    taskHandlerDetialTitle: '',
    taskHandlerDetialMenuActions: [
      {
        name: '删除任务',
        color: 'red',
      }
    ],

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
      },
      {
        name: '删除任务',
        color: 'red',
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
    active:[1, 2],
    subTaskParticipantImg:[],
    showAddTaskPointPop: false,
    taskPointTargetIndex: 0,
    taskPointAddName: ''
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },

  onChange_checkbox(event){
    var subTaskIndex = event.currentTarget.dataset.subtaskindex
    var pointIndex = event.currentTarget.dataset.taskpointindex
    var subTaskId = this.data.taskData.subTaskInfo[subTaskIndex]._id
    var field_cloud = 'taskPoints.' + pointIndex
    var filed_local = "taskData.subTaskInfo[" + subTaskIndex + "].taskPoints[" + pointIndex + "].checked"
    var before = !event.detail
    this.setData({
      [filed_local]: event.detail
    });
    var newTaskPoint = {
      taskPoint: this.data.taskData.subTaskInfo[subTaskIndex].taskPoints[pointIndex].taskPoint,
      checked: event.detail
    }
    // checked变动同步到数据库
    const db = wx.cloud.database()
    const _ = db.command
    //console.log(this.data.taskData.subTaskInfo[subTaskIndex].taskPoints[pointIndex].taskPoint)
    //console.log(subTaskId)
    //console.log(field_cloud)
    //console.log(event.detail)
    db.collection('tasks').doc(subTaskId).update({
      data: {
        [field_cloud]: newTaskPoint
      },
      success: res => {
        //console.log(res)
      },
      fail: error => {
        // 同步失败，复位本地状态
        console.log(before)
        this.setData({
          [filed_local]: before
        });
        wx.showToast({
          icon: 'none',
          title: '任务点状态同步失败'
        })
        console.log(error)
      }
    })
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

  addTaskPoint: function(event){
    this.setData({
      taskPointTargetIndex: event.currentTarget.dataset.subtaskindex,
      showAddTaskPointPop: true
    })
  },

  onAddTaskPointPopClose: function(){
    this.setData({
      showAddTaskPointPop: false
    })
  },

  onCreateTaskPoint: function(){
    // 获取被添加任务点的子任务ID
    var subTaskIndex = this.data.taskPointTargetIndex
    var subTaskId = this.data.taskData.subTaskInfo[subTaskIndex]._id
    // 构建任务点实例
    var taskPoint = {
      taskPoint: this.data.taskPointAddName,
      checked: false
    }
    // 开始添加
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('tasks').doc(subTaskId).update({
      data: {
        taskPoints: _.push(taskPoint)
      },
      success: res => {
        console.log(res.data)
        wx.showToast({
          icon: 'none',
          title: '任务点添加成功'
        })
        this.onAddTaskPointPopClose()
        this.onShow()
      },
      fail: error =>{
        wx.showToast({
          icon: 'none',
          title: '任务点添加失败'
        })
        console.log("任务点添加失败")
      }
    })
  },

  taskPointNameChanged: function(e){
    this.setData({
      taskPointAddName: e.detail
      })
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
        this.getSubTaskParticipantsImg()
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
 * 获取子任务参与者头像
 */
  getSubTaskParticipantsImg: function(){
    // 初始化存储结构
    this.data.subTaskParticipantImg = new Array(this.data.taskData.subTaskInfo.length)
    for (var i = 0; i < this.data.taskData.subTaskInfo.length; i++){
      this.data.subTaskParticipantImg[i] = new Array(this.data.taskData.subTaskInfo[i]._participantsId.length)
      for(var j = 0; j < this.data.subTaskParticipantImg[i].length; j++){
        wx.cloud.callFunction({
          name: 'getUserInfo',
          data: {
            _openid: this.data.taskData.subTaskInfo[i]._participantsId[j],
            subTaskIndex: i,
            pointIndex: j
          },
          success: res => {
            var field = "subTaskParticipantImg[" + res.result.list[0].subTaskIndex + "][" + res.result.list[0].pointIndex + "]"
            this.setData({
              [field]: res.result.list[0].avatarUrl
            })
          },
          fail: err => {
            console.error('参与者头像获取失败：', err)
          }
        })
      }
    }
    console.log(this.data.subTaskParticipantImg)
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

  taskHandlerDetial: function (e) {
    // console.log(e)
    this.setData({
      showTaskHandlerDetialMenu: true,
      taskHandlerDetialTitle: e.currentTarget.dataset.subtaskname,
      operTaskId: e.currentTarget.id
    })
    console.log(e.currentTarget.id)
  },

  onTaskHandlerDetialMenuSelect(event) {
    switch (event.detail.name) {
      case '删除任务':
        this.deleteTask(this.data.operTaskId);
        break;
      default:
        console.log('default');
    }
  },

  onTaskHandlerDetialMenuClose() {
    this.setData({ showTaskHandlerDetialMenu: false })
  },

  subTaskHandlerDetial: function(e){
    // console.log(e)
    this.setData({
      showSubTaskHandlerDetialMenu: true,
      subTaskHandlerDetialTitle: e.currentTarget.dataset.subtaskname,
      operTaskId: e.currentTarget.id
    })
    // console.log(e.currentTarget.id)
  },

  onSubTaskHandlerDetialMenuSelect(event) {
    switch (event.detail.name){
      case '删除任务':
        this.deleteSubTask(this.data.operTaskId);
        break;
      case "添加处理人":
        console.log('添加处理人');
        break;
      default:
        console.log('default');
    }
  },

  deleteTask: function(taskId){
    for (var i = 0; i < this.data.taskData.subTasksId.length; i++){
      this.deleteSubTask(this.data.taskData.subTasksId[i], true)
    }
    const db = wx.cloud.database();
    db.collection('tasks').doc(taskId).remove({
      success: res => {
        wx.showToast({
          title: '删除任务成功',
        })
        setTimeout(function () {
          wx.navigateBack({})
        }, 1000)
      },
      fail: err => {
        wx.showToast({
          title: '删除任务失败，请重试',
        })
      }
    })
  },

  deleteSubTask: function (subTaskId, silent=false) {
    const db = wx.cloud.database();
    db.collection('tasks').doc(subTaskId).remove({
      success: res=>{
        if(!silent){
          wx.showToast({
            title: '删除子任务成功'
          })
          this.onShow();
        }
      },
      fail: err => {
        if (!silent) {
          wx.showToast({
            title: '删除子任务成功'
          })
        }
      }
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
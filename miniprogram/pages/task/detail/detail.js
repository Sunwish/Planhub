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
        name: '',
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
        name: '复制子任务id'
      },
      {
        name: '处理人'
      },
      {
        name: '邀请好友加入处理',
        openType: 'share'
      },
      {
        name: '删除子任务',
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
    taskPointAddName: '',
    showRenameTaskPointPop: false,
    subTaskIndex: 0,
    pointIndex: 0,
    showHandlerDetailPop: false,
    showHandlerAvatarUrl: '',
    showHandlerNickName: '',
    handlerOpenId: '',
    showAddHandlerPop: false,
    addHandlerOpenidList: [],
    isTaskCreator: true
  },

  nextStep: function(event){
    var subTaskIndex = event.currentTarget.dataset.subtaskindex
    var subTaskId = this.data.taskData.subTaskInfo[subTaskIndex]._id
    var oriStatus = this.data.taskData.subTaskInfo[subTaskIndex].status
    var newStatus = (oriStatus + 1) % 4
    var field_local = "taskData.subTaskInfo[" + subTaskIndex + "].status"
    this.setData({
      [field_local]: newStatus
    })

    // checked变动同步到数据库
    const db = wx.cloud.database()
    db.collection('tasks').doc(subTaskId).update({
      data: {
        status: newStatus
      },
      success: res => {
        //console.log(res)
      },
      fail: error => {
        // 同步失败，复位本地状态
        console.log(before)
        this.setData({
          [field_local]: oriStatus
        });
        wx.showToast({
          icon: 'none',
          title: '任务状态同步失败'
        })
        console.log(error)
      }
    })
  },

  addHandler: function(event){
    this.setData({
      subTaskIndex: event.currentTarget.dataset.subtaskindex,
      showAddHandlerPop: true
    })
  },

  onRemoveHandler: function () {
    // subTaskIndex 和 handlerOpenId 在头像点击事件 handlerAvatarTap() 中已经获取过了，直接拿来用
    var subTaskIndex = this.data.subTaskIndex
    var handlerOpenId = this.data.handlerOpenId
    var subTaskId = this.data.taskData.subTaskInfo[subTaskIndex]._id
    var oriParticipantList = this.data.taskData.subTaskInfo[subTaskIndex]._participantsId
    var targetIndexInList = oriParticipantList.indexOf(handlerOpenId)
    if (-1 == targetIndexInList) return

    // 移除处理人
    // 这里删除有个坑，js里的删除元素返回的并不是完成操作后的新数组，而是返回被删除的元素，操作是直接在被操作对象上执行的
    var newParticipantList = oriParticipantList
    newParticipantList.splice(targetIndexInList, 1)
    
    var field_local = "taskData.subTaskInfo[" + subTaskIndex + "]._participantsId"
    this.setData({
      [field_local]: newParticipantList
    })

    const db = wx.cloud.database()
    db.collection('tasks').doc(subTaskId).update({
      data: {
        _participantsId: newParticipantList
      },
      success: res => {
        wx.showToast({
          title: '删除处理人成功'
        })
        this.onHandlerDetailPopClose()
        // 再一个坑：已经存在的头像元素用onShow刷新并不会删除，onShow会把新元素渲染加上，但不会把少的元素删掉，太坑了，于是重载之。
        wx.reLaunch({
          url: '/pages/task/detail/detail?taskId=' + this.data.tid,
        });
      },
      fail: error => {
        this.setData({
          [field_local]: oriParticipantList
        })
        wx.showToast({
          icon: 'none',
          title: '操作失败，请重试'
        })
        console.log(error)
      }
    })
  },

  onAddHandlerPopClose: function(){
    this.setData({
      showAddHandlerPop: false
    })
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

  deleteTaskPoint: function(event){
    var subTaskIndex = event.currentTarget.dataset.subtaskindex
    var pointIndex = event.currentTarget.dataset.taskpointindex
    var subTaskId = this.data.taskData.subTaskInfo[subTaskIndex]._id
    var newTaskPoints = this.data.taskData.subTaskInfo[subTaskIndex].taskPoints
    var taskPointName = this.data.taskData.subTaskInfo[subTaskIndex].taskPoints[pointIndex].taskPoint

    wx.showModal({
      title: '删除任务点',
      content: '确定删除任务点' + taskPointName + '吗',
      success: sm => {
        if (sm.confirm) {
          newTaskPoints.splice(pointIndex, 1)
          const db = wx.cloud.database()
          const _ = db.command
          db.collection('tasks').doc(subTaskId).update({
            data: {
              taskPoints: newTaskPoints
            },
            success: res => {
              wx.showToast({
                title: '删除成功'
              })
              this.onShow()
            },
            fail: error => {
              wx.showToast({
                icon: 'none',
                title: '删除失败'
              })
              console.log(error)
            }
          })
        } else if (sm.cancel) {
          console.log('cancle')
        }
      }
    })
  },

  editTaskPoint: function(event){
    var subTaskIndex = event.currentTarget.dataset.subtaskindex
    var pointIndex = event.currentTarget.dataset.taskpointindex
    var oriName = this.data.taskData.subTaskInfo[subTaskIndex].taskPoints[pointIndex].taskPoint
    this.setData({
      subTaskIndex: event.currentTarget.dataset.subtaskindex,
      pointIndex: event.currentTarget.dataset.taskpointindex,
      taskPointAddName: oriName,
      showRenameTaskPointPop: true
    })
  },

  onRenameTaskPointPopClose: function(){
    this.setData({
      showRenameTaskPointPop: false
    })
  },

  onHandlerSelectChange: function(event){
    // console.log(event.currentTarget.dataset)
    this.setData({
      result: event.detail
    });
  },

  toggle(event) {
    var targetOpenid = event.currentTarget.dataset.openid
    var inListIndex = this.data.addHandlerOpenidList.indexOf(targetOpenid)
    // 判断点击的复选框项是否在勾选列表中
    if (-1 == inListIndex){
      // 既未勾选，将其添加到列表中
      this.data.addHandlerOpenidList.push(targetOpenid)
    }else{
      // 已勾选，将其移除
      this.data.addHandlerOpenidList.splice(inListIndex, 1)
    }
    const { index } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },

  onAddHandler: function(event){
    var subTaskIndex = event.currentTarget.dataset.subtaskindex
    var subTaskId = this.data.taskData.subTaskInfo[subTaskIndex]._id
    var addList = this.data.addHandlerOpenidList
    var oriList = this.data.taskData.subTaskInfo[subTaskIndex]._participantsId
    var mergedList = Array.from(new Set(oriList.concat(addList))) // 利用集合实例一步去重
    if(0 == addList.length) return
    const db = wx.cloud.database()
    //console.log(oriList)
    //console.log(addList)
    console.log(mergedList)
    db.collection('tasks').doc(subTaskId).update({
      data: {
        _participantsId: mergedList
      },
      success: res => {
        wx.showToast({
          title: '添加成功'
        })
        this.onAddHandlerPopClose()
        this.setData({
          addHandlerOpenidList: []
        })
        this.onShow()
      },
      fail: error => {
        wx.showToast({
          icon: 'none',
          title: '修改失败，请重试'
        })
        console.log(error)
      }
    })
  },

  onRenameTaskPoint: function(){
    var subTaskIndex = this.data.subTaskIndex
    var pointIndex = this.data.pointIndex
    var subTaskId = this.data.taskData.subTaskInfo[subTaskIndex]._id
    var field_cloud = 'taskPoints.' + pointIndex
    var newTaskPoint = {
      taskPoint: this.data.taskPointAddName,
      checked: this.data.taskData.subTaskInfo[subTaskIndex].taskPoints[pointIndex].checked
    }
    
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('tasks').doc(subTaskId).update({
      data: {
        [field_cloud]: newTaskPoint
      },
      success: res => {
        wx.showToast({
          title: '修改成功'
        })
        this.onRenameTaskPointPopClose()
        this.setData({
          taskPointAddName: ''
        })
        this.onShow()
      },
      fail: error => {
        this.setData({
          taskPointAddName: ''
        })
        wx.showToast({
          icon: 'none',
          title: '修改失败'
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
      taskPointAddName: '',
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
        if (res.result.list[0].creatorInfo[0]._openid == app.globalData.openid) {
          // 是任务的创建者
          this.setData({
            isTaskCreator: true,
            taskHandlerDetialMenuActions: [
              {
                name: '复制任务id',
              },
              {
                name: '删除整个任务',
                color: 'red',
              }]
          })
        } else {
          this.setData({
            isTaskCreator: false,
            taskHandlerDetialMenuActions: [
              {
                name: '复制任务id',
              },
              {
                name: '退出该任务',
                color: 'red',
              }]
          })
        }
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
              [field + ".avatarUrl"]: res.result.list[0].avatarUrl,
              [field + "._openid"]: res.result.list[0]._openid,
              [field + ".nickName"]: res.result.list[0].nickName
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
      case '删除整个任务':
        wx.showModal({
          title: '提示',
          content: '确定要删除整个任务吗？确认后任务将被解散且不可恢复。',
          success: sm => {
            if (sm.confirm) {
              this.deleteTask(this.data.operTaskId);
            } else if (sm.cancel) { }
          }
        })
        break;
        case '复制任务id':
          wx.setClipboardData({
            data: this.data.tid,
            success: function(res){
              wx.getClipboardData({
                success: function(res){
                  wx.showToast({
                    title: '复制成功'
                  })
                }
              })
            }
          })
          break;
      case '退出该任务':
        wx.showModal({
          title: '提示',
          content: '确定要退出任务吗？',
          success: sm => {
            if (sm.confirm) {
              this.leaveTask();
            } else if (sm.cancel) {}
          }
        })
        break;
      default:
        console.log('default');
    }
  },

  leaveTask: function(){
    var oriParticipantIdList = this.data.taskData._participantsId
    var targetIndexInList = oriParticipantIdList.indexOf(app.globalData.openid)
    if (-1 == targetIndexInList) return

    var newParticipantList = oriParticipantIdList
    newParticipantList.splice(targetIndexInList, 1)

    const db = wx.cloud.database()
    db.collection('tasks').doc(this.data.tid).update({
      data: {
        _participantsId: newParticipantList
      },
      success: res => {
        wx.showToast({
          title: '退出任务成功'
        })
        this.onHandlerDetailPopClose();
        wx.navigateBack({})
      },
      fail: error => {
        wx.showToast({
          icon: 'none',
          title: '操作失败，请重试'
        })
        console.log(error)
      }
    })
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
      case '删除子任务':
        this.deleteSubTask(this.data.operTaskId);
        break;
      case "添加处理人":
        console.log('添加处理人');
        break;
      case '复制子任务id':
        wx.setClipboardData({
          data: this.data.operTaskId,
          success: function(res){
             wx.getClipboardData({
                success: function(res){
                  wx.showToast({
                    title: '复制成功'
                  })
                }
              })
          }
        })
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
        if(this.data.taskData.fileID){
          wx.cloud.deleteFile({
            fileList: this.data.taskData.fileID,
            success: res => {
              // handle success
              console.log(res.fileList)
            },
            fail: console.error
          })
        }
        setTimeout(function () {
          wx.navigateBack({})
        }, 1000)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
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

  handlerAvatarTap: function(event){
    var subTaskIndex = event.currentTarget.dataset.subtaskindex
    var handlerOpenId = event.currentTarget.dataset.openid
    var nickName = event.currentTarget.dataset.nickname
    var avatarUrl = event.currentTarget.dataset.avatarurl
    this.setData({
      subTaskIndex: subTaskIndex,
      handlerOpenId: handlerOpenId,
      showHandlerAvatarUrl: avatarUrl,
      showHandlerNickName: nickName,
      showHandlerDetailPop: true
    })
  },

  onHandlerDetailPopClose: function(){
    this.setData({
      showHandlerDetailPop: false
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
              icon: 'none',
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
      imageUrl: '../../../images/invite.png',
      success: function (res) {
        console.log('成功', res);
      }
    }
  },
  clickImg: function(e){
  var src = e.currentTarget.dataset.src;//获取data-src
  var imgList = e.currentTarget.dataset.list;//获取data-list
  //图片预览
  wx.previewImage({
  current: src, // 当前显示图片的http链接
  urls: imgList // 需要预览的图片http链接列表
  })
  },
})
// miniprogram/pages/plan/create/createPlan.js

const app = getApp();
import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    "activeTab": 0,
    "date": '',
    "show": false,
    "radio": '1',
    "name": "",
    "description": "",
    "taskId": "",
    fileList6: [],
    checked1: {},
    show2: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var Openid = app.globalData.openid;
    const db = wx.cloud.database();
    db.collection('users').where({
      _openid: Openid
    }).get({
      success: res => {
        this.setData({
          checked1: res.data[0].Mespush
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

  onCreateTask: function () {
    var taskName = this.data.name;
    var taskDescription = this.data.description;

    if (taskName == "") {
      Notify({
        type: 'danger',
        message: '任务名不能为空！'
      });
      return;
    }
    if (taskDescription == "") {
      taskDescription = "任务描述还是要有的.";
    }
    //消息推送授权
    if (this.data.radio != '1' && this.data.checked1) {
      wx.requestSubscribeMessage({
        tmplIds: ['TsivXeTD3idsr9TPRiajkXNV4Ws9npmREZeFi2oSGKM'],
        success(res) {}
      })
    }
    var _parentId = "";
    var _participantsId = [app.globalData.openid];
    var _handlersId = [];
    var status = 0;
    var _radio = this.data.radio;
    var creationTime = Date.now();
    var deadline = this.data.date;
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
      "subTasksId": subTasksId,
      "radio": _radio
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
        subTasksId: taskAttr["subTasksId"],
        radio: taskAttr["radio"]
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
  IDChange(event) {
    this.setData({
      taskId: event.detail
    })
  },
  //日历展示
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
  //返回时间
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
  //选择框的提醒
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

  onJoinTask: function (data) {
    const that = this
    const db = wx.cloud.database();
    db.collection('tasks').where({
      _id: this.data.taskId
    }).get({
      success: res => {
        // 检查任务是否存在
        if (res.data.length == 1) {
          // 检查是否已经加入任务
          if (res.data[0]._participantsId.includes(app.globalData.openid) == true) {
            wx.showToast({
              icon: 'none',
              title: '你已加入该任务'
            });
            setTimeout(function () {
              wx.navigateBack({})
            }, 1000);
            return;
          }
          //发现可以消息推送
          if (that.data.checked1 && res.data[0].radio!='1') {
            that.setData({
              show2:true
            })
          }
          else{
          this.joinTask({
            taskId: this.data.taskId
          })
          }
          } else {
          wx.showToast({
            icon: 'none',
            title: '任务不存在'
          });
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询失败'
        });
      }
    })
  },
  //用户点击消息授权的按钮
  Messet:function(){
    wx.requestSubscribeMessage({
      tmplIds: ['TsivXeTD3idsr9TPRiajkXNV4Ws9npmREZeFi2oSGKM'],
      success(res) {}
    })
    this.joinTask({
      taskId: this.data.taskId
    })
  },
  cancel:function(){
    this.joinTask({
      taskId: this.data.taskId
    })
  },
  joinTask: function (data) {
    wx.cloud.callFunction({
      name: 'joinTask',
      data: {
        taskId: data.taskId
      },
      success: res => {
        wx.showToast({
          title: '加入任务成功',
        });
        setTimeout(function () {
          wx.navigateBack({})
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
  uploadFilePromise(fileName, chooseResult) {
    return wx.cloud.uploadFile({
      cloudPath: fileName,
      filePath: chooseResult.path
    });
  },
  uploadToCloud() {
    wx.cloud.init();
    const { fileList6: fileList = [] } = this.data;
    if (!fileList.length) {
      wx.showToast({ title: '请选择图片', icon: 'none' });
    } else {
      const uploadTasks = fileList.map((file, index) =>
        this.uploadFilePromise(`my-photo${index}.png`, file)
      );
      Promise.all(uploadTasks)
        .then(data => {
          wx.showToast({ title: '上传成功', icon: 'none' });
          const fileList = data.map(item => ({ url: item.fileID }));
          this.setData({ cloudPath: data, fileList6: fileList });
        })
        .catch(e => {
          wx.showToast({ title: '上传失败', icon: 'none' });
          console.log(e);
        });
    }
  },
  //自己写永远出错还不如抄！！！
  beforeRead(event) {
    const { file, callback = () => {} } = event.detail;
    callback(true);
  },

  afterRead(event) {
    const { file, name } = event.detail;
    const fileList = this.data[`fileList${name}`];

    this.setData({ [`fileList${name}`]: fileList.concat(file) });
  },
  delete(event) {
    const { index, name } = event.detail;
    const fileList = this.data[`fileList${name}`];
    fileList.splice(index, 1);
    this.setData({ [`fileList${name}`]: fileList });
  },
})
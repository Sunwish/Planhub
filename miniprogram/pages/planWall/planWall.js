// miniprogram/pages/planWall/planWall.js

const app = getApp();
//自定义导航栏需求

Component({

  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
    }
  },
  data: {
    tasksData: {},
    openid: '',
    needAuthor: true
  },

/**
 * 请求计划数据
 */
 methods: {
  queryTasks: function() {
   if (this.data.openid == '') return;
   const db = wx.cloud.database()
   const _ = db.command

   wx.cloud.callFunction({
     name: 'getTasks',
     data:{
       key: 'uid'
     },
     success: res =>{
       console.log(res.result.list)
       this.setData({
         tasksData: res.result.list
       })
       wx.stopPullDownRefresh();
       wx.hideNavigationBarLoading(); // 完成加载
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
    // 获取openid和授权
    wx.hideTabBar();
    //if (!app.globalData.openid) {
      // 调用云函数
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.globalData.openid = res.result.openid;
          this.data.openid = app.globalData.openid;
          // 检查登录状态
          this.checkLogin();
          // 检查授权
          this.authorUserInfo();
          // 更新资料
          this.updateDBUserInfo();
          // 显示页面
          this.onQuery();
        },
        fail: err => {
          /*console.error('[云函数] [login] 调用失败', err)*/
        }
      })   
    //}
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

  checkLogin: function (){
    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
        //console.log('checkLogin success')
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        wx.login() //重新登录
      }
    })
  },

  authorUserInfo: function(e){
    // 程序自动检查
    if(typeof(e) == 'undefined'){
      // 检查授权情况，未授权不能获取用户信息
      wx.getSetting({
        success: res => {
          if (!res.authSetting['scope.userInfo']) {
            // 未授权
            //wx.hideTabBar({})
            this.setData({
              // 显示登录授权按钮
              needAuthor: true
            })
            app.globalData.Authorize = false;
          } else {
            //wx.showTabBar({})
            this.setData({
              // 显示创建/加入任务按钮
              needAuthor: false
            })
            app.globalData.Authorize = true;
          }
        },
        fail: err =>{
          console.log(err);
          //wx.hideTabBar({})
          this.setData({
            // 显示登录授权按钮
            needAuthor: true
          })
        }
      })
      return;
    }
    // 用户点击登录授权按钮触发事件
    if(typeof (e.detail.userInfo) != 'undefined'){
      //wx.showTabBar({})
      this.setData({
        // 显示创建/加入任务按钮
        needAuthor: false
      });
      app.globalData.Authorize = true;
      this.updateDBUserInfo();
    }
  },

/**
 * 更新用户信息到数据库
 */
  updateDBUserInfo: function (e){
    // 获取用户信息
    wx.getUserInfo({
      success: res =>{
        // 取用户信息
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        app.globalData.Authorize = true;
        // 查找用户是否已登记
        const db = wx.cloud.database();
        db.collection('users').where({
          _openid: this.data.openid
        }).get({
          success: res => {
            // 已登记，更新资料
            console.log('users 表中 _openid: ' + this.data.openid + ' 找到' + res.data.length + '条记录')
            if (res.data.length >= 1) {
              db.collection('users').doc(res.data[0]._id).update({
                data: {
                  nickName: nickName,
                  avatarUrl: avatarUrl,
                  gender: gender,
                  province: province,
                  city: city,
                  country: country
                },
                success: s =>{
                  console.log('update UserInfo successed')
                },
                fail: f => {
                  console.log('update UserInfo failed')
                }
              })
            } else {
              // 未登记，添加users表新条目
              db.collection('users').add({
                data:{
                  nickName: nickName,
                  avatarUrl: avatarUrl,
                  gender: gender,
                  province: province,
                  city: city,
                  country: country,
                  Mespush:false
                },
                success: s => {
                  console.log('create UserInfo successed')
                },
                fail: f => {
                  console.log('create UserInfo failed')
                }
              })
            }
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '查询用户记录失败'
            })
            console.error('[数据库] [查询记录] 失败：', err)
          }
        })

      },
      fail: err =>{
        console.log('updateDBUserInfo failed')
      }
    })
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
  addTask:function(){
    wx.navigateTo({
      url: '../task/create/createTask',
    })
  },

 }
})
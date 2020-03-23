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

  onCreatePlan: function (data) {
    var planName = data.detail.value.name;
    var planIntrodution = data.detail.value.introdution;
    var forumName = data.detail.value.forum;
    
    if (planName == ""){
      wx.showToast({
        icon: "none",
        title: '计划名不能为空'
      })
      return;
    }
    
    if (planIntrodution == "") {
      planIntrodution = "计划还是要有的.";
    }

    if (forumName == ""){
      wx.showToast({
        icon: "none",
        title: '请设定一个分区哦'
      })
      return;
    }

    // 板块验证
    const db = wx.cloud.database();
    var res = db.collection('forums').where({
      name: forumName
    }).get({
      success: res => {
        var forumId = '';
        if (res.data.length == 1){
          // 板块存在
          forumId = res.data[0]._id;
          // 创建计划
          this._onCreatePlan(planName, planIntrodution, forumId);
        }else{
          // 板块不存在
          // 创建板块
          db.collection('forums').add({
            data: {
              name: forumName
            },
            success: res => {
              // 板块创建成功
              forumId = res._id;
              // 创建计划
              this._onCreatePlan(planName, planIntrodution, forumId);
            },
            fail: err => {
              // 板块创建失败
              wx.showToast({
                icon: 'none',
                title: '无法发布计划,因为板块创建失败'
              })
              console.error('[数据库] [新增记录] 失败：', err)
            }
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '创建计划失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    });
  },

  _onCreatePlan: function (planName, planIntrodution, forumId) {
    console.log(planName, planIntrodution, forumId);
    const db = wx.cloud.database();
    db.collection('plans').add({
      data: {
        planName: planName,
        planIntroduction: planIntrodution,
        forumId: forumId
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          planName: res.planName,
          planIntroduction: res.planIntroduction
        })
        wx.showToast({
          title: '创建计划成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)

        setTimeout(function () {
          wx.navigateBack({})
        }, 1000)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '创建计划失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  }

})
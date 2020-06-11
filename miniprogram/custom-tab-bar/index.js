Component({
  data: {
    "selected":{},
    "color": "#353535",
    "selectedColor": "#3388ff",
    "backgroundColor": "#353535",
    "borderStyle": "#FFFFFF",
    list: [ {
      "pagePath": "/pages/planWall/planWall",
      "text": "任务",
      "position": "top",
      "icon": "todo-list-o",
      "selectedIcon":"todo-list"
    },
   /* {
      "pagePath": "/pages/message/message",
      "text": "消息",
      "position": "top",
      "icon": "chat-o",
      "selectedIcon":"chat"
    },*/
    {
      "pagePath": "/pages/user/user",
      "text": "我的",
      "position": "top",
      "icon": "manager-o",
      "selectedIcon":"manager"
    }]
  },  
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({
        url,
        //跳转刷新
        success: function (e) {
          var page = getCurrentPages().pop();
          if (page == undefined || page == null) return;
          page.onLoad();
          }
      })
     // this.setData({ 
     //   selected: data.index 
     // }) 
    }
  }
})
Component({
  data: {
    "color": "#A9A9A9",
    "selectedColor": "#3388ff",
    "backgroundColor": "#F6F6F6",
    "borderStyle": "#FFFFFF",
    list: [ {
      "pagePath": "/pages/planWall/planWall",
      "text": "任务",
      "position": "top",
      "icon": "todo-list-o",
      "selectedIcon":"todo-list"
    },
    {
      "pagePath": "/pages/message/message",
      "text": "消息",
      "position": "top",
      "icon": "chat-o",
      "selectedIcon":"chat"
    },
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
      wx.switchTab({url})
     // this.setData({ 
     //   selected: data.index 
     // }) 
    }
  }
})
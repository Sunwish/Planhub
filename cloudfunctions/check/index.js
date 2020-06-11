// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event,context) => {
  const { content } = event;
  try {
    var res=''
      for (var i = 0; i < event.content.length; i++) {
      res =  await cloud.openapi.security.msgSecCheck({
        content: event.content[i]
      });
      if (res.errCode == 87014) {
        return res;
      }
    }
    return res;
  } catch (error) {
    return {
      error
    }
  }
}
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event) => {
  try {
    let result = '';
    if(event.content){
     result =  await cloud.openapi.security.msgSecCheck({
        content: event.content
      });
    }else if(event.base64){
      result = await cloud.openapi.security.imgSecCheck({
        media: {
          contentType: 'image/jpeg',
          value: Buffer.from(event.base64, 'base64')
        }
      })
    }
    return {
      result
    }
  } catch (error) {
    return {
      error
    }
  }
}
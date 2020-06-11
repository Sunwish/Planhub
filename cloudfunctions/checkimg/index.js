// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const { value } = event;
  try {
    var res = await cloud.openapi.security.imgSecCheck({
      media: {
        contentType: 'image/jpeg',
        value: Buffer.from(event.base64, 'base64')
      }
    })
    return res;
  } catch (err) {
    return err;
  }
}
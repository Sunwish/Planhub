// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()

  let res = await db.collection('users').aggregate()
    .match({
      _openid: event._openid,
    })
    .addFields({
      subTaskIndex: event.subTaskIndex,
      pointIndex: event.pointIndex
    })
    .end()
  return res;
}
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  /*
  联表查询(https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.lookup.html)
  */
  // localField 可否为 _participantsId？取出所有参与者的信息，数组中的第一项即是创建者信息？未尝试。
  const db = cloud.database()
  let res = await db.collection('tasks').aggregate()
    .lookup({
      from: 'users',
      localField: '_openid',
      foreignField: '_openid',
      as: 'creatorInfo',
    })
    .match({
      _participantsId: wxContext.OPENID
    })
    .end()
    console.log(res)
    return res

/*
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
  */
}
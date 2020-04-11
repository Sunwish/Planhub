// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  /*
  联表查询(https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.lookup.html)
  */
  const db = cloud.database()
  console.log(event.key)
  if (event.key == 'uid'){ // get by creatorId
    let res = await db.collection('tasks').aggregate()
      .match({
        _participantsId: wxContext.OPENID,
        _parentId: ''
      })
      .lookup({
        from: 'users',
        localField: '_openid',
        foreignField: '_openid',
        as: 'creatorInfo',
      })
      .lookup({
        from: 'users',
        localField: '_participantsId',
        foreignField: '_openid',
        as: 'participantsrInfo',
      })
      .end()
    console.log(res)
    return res
  } else if (event.key == 'tid') // getByTaskId
  {
    let res = await db.collection('tasks').aggregate()
      .match({
        _id: event.tid,
      })
      .lookup({
        from: 'users',
        localField: '_openid',
        foreignField: '_openid',
        as: 'creatorInfo',
      })
      .lookup({
        from: 'users',
        localField: '_participantsId',
        foreignField: '_openid',
        as: 'participantsrInfo',
      })
      .lookup({
        from: 'tasks',
        localField: 'subTasksId',
        foreignField: '_id',
        as: 'subTaskInfo',
      })
      .end()
    console.log(res)
    return res
  }
  

/*
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
  */
}
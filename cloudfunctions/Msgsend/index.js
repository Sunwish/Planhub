// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try{
     await cloud.openapi.subscribeMessage.send({
      touser:'odtr25T7IGDlWObdJ9jqz2JUc1g4',
      templateId:['TsivXeTD3idsr9TPRiajkdpatIH6TGEUXJWGLW6K8kg'],
      data:{
        thing1: {
          value: '123'
        },
        thing2: {
          value: '123'
        },
        time3: {
          value: '15:01'
        },
        time4: {
          value: '15:02'
        },
      }
    })

  }
  finally{}
}
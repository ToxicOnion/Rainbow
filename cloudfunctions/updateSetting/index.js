// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const configCollection = db.collection('config')
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await configCollection.where({
        setName: event.setName
      })
      .update({
        data: {
          value: event.value
        },
      })

  } catch (e) {
    return e
  }
}
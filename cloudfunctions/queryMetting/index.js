// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const mettingCollection = db.collection('metting')
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await  mettingCollection.where({
      orderDate: _.gte(event.searchTime)
    }).limit(100).orderBy("orderStartTime", "asc").get()
  } catch (e) {
    return e
  }
}
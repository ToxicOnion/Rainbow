// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const orderCollection = db.collection('orderList')
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await orderCollection.where({
      department: event.department,
      orderTime: _.gt(new Date(event.timeSearch)),
      orderMenu:event.orderMenu
    }).limit(100).orderBy("orderTime", "desc").get()
  } catch (e) {
    return e
  }
}
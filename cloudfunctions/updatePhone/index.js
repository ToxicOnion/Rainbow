// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const phoneCollection = db.collection('phone')

exports.main = async(event, context) => {
  try {
    const phone = event.phone
    return await phoneCollection.doc(phone._id)
      .update({
        data: {
          suoxie:phone.suoxie
        },
      })

  } catch (e) {
    return e
  }

}
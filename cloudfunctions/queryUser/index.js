// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
const userInfoCollection = db.collection('userInfo')
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    const userInfo  = event.userInfo
    let user = await userInfoCollection.where({
      openid: userInfo.openid
    });
    if (!user) {
      let oneUser = {...userInfo,time:new Date()}
      return await userInfoCollection.add({
        data:oneUser
      })
    }else{
      return await userInfoCollection.doc(user.id)
        .update({
          data: {
            time: new Date
          },
        })
    }
  } catch (e) {

  }

}
import regeneratorRuntime from '../lib/runtime/runtime.js';
import {
  getPhonesByKeys
} from '../utils/promiseFunc.js';
var pinyinUtil = require('../utils/pinyinUtil.js')
var pinyinFirst = require('../utils/pinyinFirst.js')
const db = wx.cloud.database();
const _ = db.command;
const $ = db.command.aggregate;
const userInfoCollection = db.collection('userInfo');
const phoneCollection = db.collection('phone')
const orderCollection = db.collection('orderList')
const mettingCollection = db.collection('metting')
var util = require('util.js');

const app = getApp();
//更新用户详细信息
export const updateUserDetailInfo = (param) => {
  return new Promise((resolve, reject) => {
    const userInfo = app.globalData.userInfo
    userInfoCollection.where({
      openid: userInfo.openid
    }).get().then(res => {
      if (res.data.length == 0) {
        let oneUser = {
          ...userInfo,
          time: new Date()
        }
        userInfoCollection.add({
          data: oneUser
        })
      } else {
        userInfoCollection.doc(res.data[0]._id)
          .update({
            data: {
              ...param
            },
          })
      }
    });
  })
}
export const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    const userInfo = app.globalData.userInfo
    userInfoCollection.where({
      openid: userInfo.openid
    }).get().then(res => {
      if (res.data.length > 0) {
        resolve(res.data[0])
      } else {
        reject(res)
      }
    });
  })
}
//更新所有人的拼音缩写
export const updatePinyin = async () => {
  const phoneList = await getPhonesByKeys({
    keyword: ''
  })
  for (var i = 0; i < phoneList.length; i++) {
    var tag = phoneList[i]
    tag.suoxie = pinyinFirst.makePy(tag.xingming)
    let param = {
      phone: tag
    }
    wx.cloud.callFunction({
      name: 'updatePhone',
      data: {
        ...param
      }
    })
  }

}
//添加联系人
export const dbAddPhone = async (phoneInfo) => {
  phoneCollection.add({
    data: phoneInfo
  })
}

export const getOwerPhone = () => {
  return new Promise((resolve, reject) => {
    const userInfo = app.globalData.userInfo
    phoneCollection.where({
      _openid: userInfo.openid
    }).get().then(res => {
      resolve(res.data)
    });
  })
}

//添加订餐
export const addOrder = async (orderInfo) => {
  orderCollection.add({
    data: orderInfo
  })
}
//获取本用户10条订单
export const getUserOrder = () => {
  return new Promise((resolve, reject) => {
    const userInfo = app.globalData.userInfo
    orderCollection.where({
      _openid: userInfo.openid
    }).limit(10).orderBy("orderTime", "desc").get().then(res => {
      resolve(res.data)
    });
  })
}

//根据部门获取订单
export const getOrderDetail = (department, searchTime) => {
  return new Promise((resolve, reject) => {
    orderCollection.where({
      department: department,
      orderTime: _.gt(searchTime)
    }).limit(20).orderBy("orderTime", "desc").get().then(res => {
      resolve(res.data)
    });
  })
}

//添加会议
export const dbAddMetting = async (metting) => {
  mettingCollection.add({
    data: metting
  })
}


//获取本用户10条会议订单
export const getUserMettingOrder = () => {
  return new Promise((resolve, reject) => {
    const userInfo = app.globalData.userInfo
    mettingCollection.where({
      _openid: userInfo.openid
    }).limit(6).orderBy("orderDate", "desc").get().then(res => {
      resolve(res.data)
    });
  })
}
//删除会议订单
export const delUserMettingOrder = (id) => {
   mettingCollection.doc(id).remove()
      .then(console.log)
      .catch(console.error)
}





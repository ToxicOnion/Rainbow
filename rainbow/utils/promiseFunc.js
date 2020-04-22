import regeneratorRuntime from '../lib/runtime/runtime.js';
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();
const MAX_LIMIT = 100;
export const getSetting = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    })
  })
}
export const getUserInfo = () => {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}
//查询电话云函数
export const getPhonesByKeys = (param) => {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
        name: 'getPhonesByKeys',
        data: {
          ...param
        }
      })
      .then(res => {
        resolve(res.result.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export const getOwerPhone = async() => {
  // 先取出集合记录总数
  const countResult = await db.collection('phone').where({
    _openid: app.globalData.userInfo.openid
  }).count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('phone').where({
      _openid: app.globalData.userInfo.openid
    }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  console.log(total)
  if (total > 0) {
    // 等待所有
    return (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
      }
    })
  } else {
    return []
  }
}
export const downfile = async(src,one) => { //下载网络图片的promise对象
  return new Promise(function(resolve, reject) {
    wx.getImageInfo({
      src: src,
      success: async function (resInfo) {
        wx.downloadFile({
          url: resInfo.path,
          success: function (res) {
            resolve({
              temUrl: res.tempFilePath,
              key: one
            })
          }
        })
      }
    })

   
  })
}
export const getimageinfo = async (flyimages) => { //下载网络图片的promise对象
  return new Promise(function(resolve, reject) {
    const tasks = []
    for(var one in flyimages){
      const promise = downfile(flyimages[one].src, one)
      tasks.push(promise)
    }
    Promise.all(tasks).then(res=>{
        resolve(res)
    })
   
  })
}

//查询室里订单详情
export const getOrderDetail = (param) => {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
        name: 'getOrderDetail',
        data: {
          ...param
        }
      })
      .then(res => {
        resolve(res.result.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}


//获取会议
export const queryMetting = (searchTime) => {  
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
        name: 'queryMetting',
        data: {
          searchTime:searchTime
        }
      })
      .then(res => {
        resolve(res.result.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}


//查询配置信息
export const getConfig = (param) => {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
        name: 'querySetting',
        data: {
          ...param
        }
      })
      .then(res => {
        resolve(res.result.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
//更新配置信息
export const updateConfig = (param) => {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
        name: 'updateSetting',
        data: {
          ...param
        }
      })
      .then(res => {
        resolve(res.result.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
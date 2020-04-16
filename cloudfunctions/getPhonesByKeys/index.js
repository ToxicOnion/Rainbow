// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
const MAX_LIMIT = 100

exports.main = async(event, context) => {
  let keyword = event.keyword

  if (keyword == '') {
    // 先取出集合记录总数
    const countResult = await db.collection('phone').count()
    const total = countResult.total
    // 计算需分几次取
    const batchTimes = Math.ceil(total / 100)
    // 承载所有读操作的 promise 的数组
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection('phone').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      tasks.push(promise)
    }
    // 等待所有
    return (await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data),
        errMsg: acc.errMsg,
      }
    })
  } else {
    return await db.collection('phone').where(_.or([{
        suoxie: db.RegExp({
          regexp: keyword,
          options: 'i',
        })
      },
      {
        pinyin: db.RegExp({
          regexp: keyword,
          options: 'i',
        })
      },
      {
        shoujitxt: db.RegExp({
          regexp: keyword,
          options: 'i',
        })
      },
      {
        xingming: db.RegExp({
          regexp: keyword,
          options: 'i',
        })
      },
      {
        zuoji: db.RegExp({
          regexp: keyword,
          options: 'i',
        })
      },
      {
        company: db.RegExp({
          regexp: keyword,
          options: 'i',
        })
      }
    ])).limit(100).get()
  }
}
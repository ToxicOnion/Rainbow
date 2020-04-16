import regeneratorRuntime from '../../../lib/runtime/runtime.js';
import {
  getPhonesByKeys
} from '../../../utils/promiseFunc.js'
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const phoneCollection = db.collection('phone')
Page({
  properties: {
    groupKey: 'pinyin',
    textKey: 'xingming',
    textStyle: String,
    tagStyle: String
  },
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    hidden: true,
    dataSource: [],
    inputKeyword: ''
  },
  onLoad() {
    wx.showLoading({
      title: '加载中',
    })
    let list = [];
    for (let i = 0; i < 26; i++) {
      list[i] = String.fromCharCode(65 + i)
    }
    this.setData({
      list: list,
      listCur: list[0]
    })
    this.getPhones()
    wx.hideLoading()
  },
  reset() {
    this.setData({
        inputKeyword: ''
      }),
      this.getPhones()
  },
  async getPhones() {
    const phones = wx.getStorageSync("phones")
    if (!phones | (Date.now() - phones.time > 5 * 60 * 1000)) {
      const phoneList = await getPhonesByKeys({
        keyword: ''
      })
      wx.setStorageSync("phonesOrigin", phoneList)
      let groupPhone = this._groupby(phoneList)
      this.setData({
        groupPhone: groupPhone
      })
      wx.setStorageSync("phones", {
        time: Date.now(),
        data: groupPhone
      })
    } else if (this.data.inputKeyword !== '') {
      const phoneList = await getPhonesByKeys({
        keyword: this.data.inputKeyword
      })
      let groupPhone = this._groupby(phoneList)
      this.setData({
        groupPhone: groupPhone
      })
    } else {
      this.setData({
        groupPhone: phones.data
      })
    }
  },
  onReady() {
    let that = this;
    wx.createSelectorQuery().select('.indexBar-box').boundingClientRect(function(res) {
      that.setData({
        boxTop: res.top
      })
    }).exec();
    wx.createSelectorQuery().select('.indexes').boundingClientRect(function(res) {
      that.setData({
        barTop: res.top
      })
    }).exec()

  },
  //获取文字信息
  getCur(e) {
    this.setData({
      hidden: false,
      listCur: this.data.list[e.target.id],
    })
  },

  setCur(e) {
    this.setData({
      hidden: true,
      listCur: this.data.listCur
    })
  },
  //滑动选择Item
  tMove(e) {
    let y = e.touches[0].clientY,
      offsettop = (this.data.boxTop),
      that = this;
    //判断选择区域,只有在选择区才会生效
    if (y > offsettop) {
      let num = parseInt((y - offsettop) / 20);
      if (num > 25) {
        num = 25
      }
      this.setData({
        listCur: that.data.list[num]
      })
    };
  },

  //触发全部开始选择
  tStart() {
    this.setData({
      hidden: false
    })
  },

  //触发结束选择
  tEnd() {
    this.setData({
      hidden: true,
      listCurID: this.data.listCur
    })
  },
  search: function() {
    this.setData({
      vv: this._groupby(this.data.phoneAll)
    })

  },
  _compare: function(key) {
    return function(o, p) {
      if (typeof o === "object" && typeof p === "object" && o && p) {
        var a = o[key]
        var b = p[key]
        if (a == '' || a == null || a == undefined) {
          a = String.fromCharCode(91)
        } else if (a[0] >= 'a' && a[0] <= 'z') {
          a = a.replace(a[0], String.fromCharCode(a[0].charCodeAt() - 32))
        } else if (a[0] < 'A' || a[0] > 'Z') {
          a = a.replace(a[0], String.fromCharCode(a[0].charCodeAt() + 91))
        }
        if (b == '' || b == null || b == undefined) {
          b = String.fromCharCode(91)
        } else if (b >= 'a' && b <= 'z') {
          b = b.replace(b[0], String.fromCharCode(b[0].charCodeAt() - 32))
        } else if (b[0] < 'A' || b[0] > 'Z') {
          b = b.replace(b[0], String.fromCharCode(b[0].charCodeAt() + 91))
        }
        if (a === b) {
          return 0
        }
        if (typeof a === typeof b) {
          return a < b ? -1 : 1
        }
        return typeof a < typeof b ? -1 : 1
      }
      throw ("Error type.")
    }
  },

  _sort: function(array, key) {
    return array.sort(this._compare(key))
  },

  _groupby: function(array) {
    if (!array || array.length == 0) {
      return
    }
    var key = this.properties.groupKey
    array = this._sort(array, key)
    var tag = array[0][key][0]
    if (tag >= 'a' && tag <= 'z') {
      tag = String.fromCharCode(tag.charCodeAt() - 32)
    }
    var results = [{
      'tag': tag >= 'A' && tag <= 'Z' ? tag : 'PoundSign',
      'data': [array[0]]
    }]
    for (var i = 1, j = 0; i < array.length; i++) {
      var tag = array[i][key][0]
      if (tag >= 'a' && tag <= 'z') {
        tag = String.fromCharCode(tag.charCodeAt() - 32)
      }
      if (tag >= 'A' && tag <= 'Z') {
        if (tag == results[j]['tag']) {
          results[j]['data'].push(array[i])
        } else {
          j++
          results.push({
            'tag': tag,
            'data': [array[i]]
          })
        }
      } else {
        if (results[j]['tag'] != 'PoundSign') {
          j++
          results.push({
            'tag': 'PoundSign',
            'data': [array[i]]
          })
        } else {
          results[j]['data'].push(array[i])
        }
      }
    }
    return results
  },
  call: function(e) {
    wx.makePhoneCall({
      phoneNumber: (!e.currentTarget.dataset.item.shouji ? e.currentTarget.dataset.item.zuoji : e.currentTarget.dataset.item.shouji) + '',
    })
  },
  // inputKeyword(event) {
  //   let newVal = event.detail.value
  //   let that = this
  //   // 添加延时判断500毫秒内input框内容会不会变化，不会变化时发送请求
  //   setTimeout(function() {
  //     if (that.data.inputKeyword == newVal) {
  //       that.getPhones()
  //     } else {
  //       // console.log('变化')
  //     }
  //   }, 1000);
  //   this.setData({
  //     inputKeyword: event.detail.value
  //   })
  // },
  //升级版本查询
  inputKeyword(e) {
    let key = e.detail.value.toLowerCase();
    const phones = wx.getStorageSync("phonesOrigin")
    let phoneList = []
    if (key !== '') {
      for (let i = 0; i < phones.length; i++) {
        if (phones[i].pinyin.toLowerCase().search(key) != -1 || phones[i].xingming.toLowerCase().search(key) != -1 || phones[i].shouji.toString().toLowerCase().search(key) != -1 || phones[i].zuoji.toString().toLowerCase().search(key) != -1 || phones[i].suoxie.toString().toLowerCase().search(key) != -1 || (phones[i].company+'').toLowerCase().search(key) != -1) {
          phoneList.push(phones[i])
        }
      }
      let groupPhone = this._groupby(phoneList)
      this.setData({
        groupPhone: groupPhone
      })
    } else {
      this.setData({
        groupPhone: wx.getStorageSync("phones").data
      })
    }
  }
})
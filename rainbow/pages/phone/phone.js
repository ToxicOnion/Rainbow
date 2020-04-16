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
  getPhones() {
    const phones = wx.getStorageSync("phones")
    if (!phones | (Date.now() - phones.time > 5 * 60 * 1000)) {
      wx.cloud.callFunction({
          // 云函数名称
          name: 'getPhonesByKeys',
          data: {
            keyword: ''
          }
        })
        .then(res => {
          let groupPhone = this._groupby(res.result.data)
          this.setData({
            groupPhone: groupPhone
          })
          wx.setStorageSync("phones", {
            time: Date.now(),
            data: groupPhone
          })
        })
        .catch(console.error)
    } else if (this.data.inputKeyword !== '') {
      wx.cloud.callFunction({
          // 云函数名称
          name: 'getPhonesByKeys',
          data: {
            keyword: this.data.inputKeyword
          }
        })
        .then(res => {
          let groupPhone = this._groupby(res.result.data)
          this.setData({
            groupPhone: groupPhone
          })
        })
        .catch(console.error)
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
      phoneNumber: (e.currentTarget.dataset.item.shouji) + '',
    })
  },
  inputKeyword(event) {
    let newVal = event.detail.value
    let that = this
    // 添加延时判断500毫秒内input框内容会不会变化，不会变化时发送请求
    setTimeout(function() {
      if (that.data.inputKeyword == newVal) {
        // console.log('不变化')			// 按要求基本只要if就行了else有用到就加没用到就删除
        // console.log(that.data.inputKeyword);
        that.getPhones()
      } else {
        // console.log('变化')
      }
    }, 1000);
    this.setData({
      inputKeyword: event.detail.value
    })
  },
  // upateList() {
  //   wx.cloud.callFunction({
  //       // 云函数名称
  //       name: 'getPhonesByKeys',
  //       data: {
  //         keyword: this.data.inputKeyword
  //       }
  //     })
  //     .then(res => {
  //       let groupPhone = this._groupby(res.result.data)
  //       this.setData({
  //         groupPhone: groupPhone
  //       })
  //     })
  //     .catch(console.error)

  // },
})
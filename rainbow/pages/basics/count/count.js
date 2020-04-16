import regeneratorRuntime from '../../../lib/runtime/runtime.js';
import {
  addOrder,
  getUserInfo
} from '../../../utils/dboperate.js';
const db = wx.cloud.database();
const _ = db.command;
const $ = db.command.aggregate;
const app = getApp()
var util = require('../../../utils/util.js');
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    list: [],
    load: true,
    iceOrder: false,
    groupType: true,
    userInfo: app.globalData.userInfo,

  },
  onLoad: async function (options) {
    let timeSearch = util.timeSearch(new Date)
    let userInfo = await getUserInfo()
    this.setData({
      userInfo: userInfo
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    });

    //获取订单状态
    db.collection('config').doc('f3db088f5e85a74e004601155879194b').get().then(res => {
      this.setData({
        iceOrder: res.data.iceOrder
      })
    })
    this.setData({
      groupType: true
    })

    var d = new Date(timeSearch),
      a = $.dateFromString({
        dateString: d.toJSON()
      })
    db.collection('orderList').aggregate()
      .addFields({
        matched: $.gt(['$orderTime', a]),
      })
      .match({
        matched: !0
      })
      .group({
        _id: {
          department: '$department',
          orderMenu: '$orderMenu'
        },
        totalOrder: $.sum('$orderCount')
      })
      .sort({
        '_id.department': -1
      })
      .end().then(res => {
        for (var i = 0; i < res.list.length; i++) {
          this.data.list.push({
            ...res.list[i],
            id: i,
            name: res.list[i]._id.department
          })
        }
        this.setData({
          list: this._groupby(this.data.list)
        })
        if (res.list.length > 0) {
          this.setData({
            listCur: this.data.list[0]
          })
        }
        wx.hideLoading()
      })
  },
  onReady() {

  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  VerticalMain(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  },
  _groupby: function (array) {
    if (!array || array.length == 0) {
      return
    }
    var tag = array[0].name
    var results = [{
      'tag': tag != '' ? tag : '其他',
      'data': [array[0]],
      'total': array[0].tot
    }]
    for (var i = 1, j = 0; i < array.length; i++) {
      var tag = array[i].name
      if (tag == results[j]['tag']) {
        results[j]['data'].push(array[i])
      } else {
        j++
        results.push({
          'tag': tag,
          'data': [array[i]]
        })
      }
    }
    return results
  },
  navToDetail(event) {
    console.log(event)
    wx.navigateTo({
      url: '/pages/basics/orderDetail/orderDetail?department=' + event.currentTarget.dataset.department + '&orderMenu=' + event.currentTarget.dataset.ordermenu,
    })
  },
  iceOrderChange(e) {
    console.log(e.detail.value)
    db.collection('config').doc('f3db088f5e85a74e004601155879194b').update({
      data: {
        iceOrder: e.detail.value
      }
    })
  },
  groupTypeChange(e) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    this.setData({
      list: []
    })
    let timeSearch = util.timeSearch(new Date)
    var d = new Date(timeSearch),
      a = $.dateFromString({
        dateString: d.toJSON()
      })

    if (e.detail.value) {
      db.collection('orderList').aggregate()
        .addFields({
          matched: $.gt(['$orderTime', a]),
        })
        .match({
          matched: !0
        })
        .group({
          _id: {
            department: '$department',
            orderMenu: '$orderMenu'
          },
          totalOrder: $.sum('$orderCount')
        })
        .sort({
          '_id.department': -1
        })
        .end().then(res => {
          for (var i = 0; i < res.list.length; i++) {
            this.data.list.push({
              ...res.list[i],
              id: i,
              name: res.list[i]._id.department
            })
          }
          this.setData({
            list: this._groupby(this.data.list)
          })
          if (res.list.length > 0) {
            this.setData({
              listCur: this.data.list[0]
            })
          }
          wx.hideLoading()
        })
    }else{
      db.collection('orderList').aggregate()
        .addFields({
          matched: $.gt(['$orderTime', a]),
        })
        .match({
          matched: !0
        })
        .group({
          _id: {
            orderMenu: '$orderMenu'
          },
          totalOrder: $.sum('$orderCount')
        })
        .sort({
          '_id.department': -1
        })
        .end().then(res => {
          for (var i = 0; i < res.list.length; i++) {
            this.data.list.push({
              ...res.list[i],
              id: i,
              name: res.list[i]._id.orderMenu
            })
          }
          this.setData({
            list: this._groupby(this.data.list)
          })
          if (res.list.length > 0) {
            this.setData({
              listCur: this.data.list[0]
            })
          }
          wx.hideLoading()
        })
    }
  }
})
import regeneratorRuntime from '../../../lib/runtime/runtime.js';
import {
  getConfig,
  queryMetting
} from '../../../utils/promiseFunc.js'
import {
  dbAddMetting,
  getUserInfo,
  getUserMettingOrder,
  delUserMettingOrder
} from '../../../utils/dboperate.js'
const app = getApp();
var util = require('../../../utils/util.js');
Page({
  data: {
    orderTopic: '',
    orderDate: util.formatDate(new Date),
    orderStartTime: '10:00',
    orderEndTime: '12:00',
    mettingRooms: [],
    index: null,
    userInfo: null,
    confirmBtnEnable: false,
    mettings: [],
    myOrders: [],
    delID: null,
    delIndex: null
  },
  _compare: function (key) {
    return function (o, p) {
      if (typeof o === "object" && typeof p === "object" && o && p) {
        var a = o[key]
        var b = p[key]

        if (a === b) {
          return 0
        }
        if (typeof a === typeof b) {
          return new Date(a) < new Date(b) ? -1 : 1
        }
        return typeof a < typeof b ? -1 : 1
      }
      throw ("Error type.")
    }
  },

  _sort: function (array, key) {
    return array.sort(this._compare(key))
  },

  _groupby: function (array) {
    if (!array || array.length == 0) {
      return
    }
    var key = 'orderDate'
    array = this._sort(array, key)
    array = this._sort(array, 'orderStartTime')
    var tag = array[0][key]

    var results = [{
      'tag': tag,
      'data': [array[0]]
    }]
    for (var i = 1, j = 0; i < array.length; i++) {
      var tag = array[i][key]
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
  async onLoad() {
    let userInfo = await getUserInfo()


    this.setData({
      userInfo: userInfo,
    })
    getConfig({
      setName: '会议室'
    }).then(res => {
      if (res.length > 0) {
        this.setData({
          mettingRooms: res[0].value
        })
      }
    })
  },
  onShow() {
    this.loadData()
  },
  loadData() {
    let searchTime = util.formatTime(new Date)
    queryMetting(searchTime).then(res => {
      // console.log(this._groupby(res))
      this.setData({
        mettings: this._groupby(res)
      })
    })

  },
  PickMettingRoom(e) {
    this.setData({
      index: e.detail.value
    })
  },
  order() {
    this.setData({
      modalName: 'orderDialog'
    })
  },
  async cancel() {
    this.setData({
      modalName: 'cancelDialog'
    })
    //获取订单
    let myOrders = await getUserMettingOrder();
    this.setData({
      myOrders: myOrders
    })

  },
  onOrderCancel() {
    this.setData({
      modalName: ''
    })
  },
  async onOrderConfirm() {
    this.setData({
      confirmBtnEnable: true
    })

    let metting = {
      orderTopic: this.data.orderTopic,
      orderDate: this.data.orderDate,
      orderStartTime: this.data.orderStartTime,
      orderEndTime: this.data.orderEndTime,
      mettingRoom: this.data.mettingRooms[this.data.index],
      userInfo: this.data.userInfo
    }

    await dbAddMetting(metting)

    wx.showToast({
      title: '预定完成',
    })
    this.setData({
      confirmBtnEnable: false,
      modalName: ''
    })
    this.loadData()

  },
  async onCancelConfirm() {
    delUserMettingOrder(this.data.delID)
    this.data.myOrders.splice(this.data.delIndex, 1)
    this.setData({
      myOrders: this.data.myOrders
    })

    wx.showToast({
      title: '删除成功',
    })
    this.setData({
      modalName: ''
    })
    this.loadData()

  },

  startTimeChange(e) {
    this.setData({
      orderStartTime: e.detail.value
    })
  },
  endTimeChange(e) {
    this.setData({
      orderEndTime: e.detail.value
    })
  },
  DateChange(e) {
    this.setData({
      orderDate: e.detail.value
    })
  },
  chooseRadio(e) {
    this.setData({
      delID: e.currentTarget.dataset.id,
      delIndex: e.currentTarget.dataset.index
    })
  }
})
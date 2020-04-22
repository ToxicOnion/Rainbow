import regeneratorRuntime from '../../../lib/runtime/runtime.js';
import {
  addOrder,
  getUserInfo
} from '../../../utils/dboperate.js';

import {
  getConfig
} from '../../../utils/promiseFunc.js'
var util = require('../../../utils/util.js');
const app = getApp();
const db = wx.cloud.database()
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    picker: [],
    basicsList: [{
      icon: 'radioboxfill',
      name: '授权登陆'
    }, {
      icon: 'radioboxfill',
      name: '完善信息'
    }, {
      icon: 'radioboxfill',
      name: '订餐'
    }, {
      icon: 'roundcheckfill',
      name: '送饭'
    }, ],
    //个人信息
    realname: '',
    department: '',
    departindex: 0,
    isContact: true,
    contactPhone: '',

    //订餐
    isLunch: true,
    orderMenuArr: [],
    orderIndex: 0,
    orderMenu: '',
    orderCount: 1,

    //按钮可用
    btnIsDisable: false,

  },
  onLoad() {
    if (new Date().getHours() > 13) {
      this.setData({
        isLunch: false
      })
    }
    getConfig({
      setName: '订餐菜单'
    }).then(res => {
      if (res.length > 0) {
        this.setData({
          orderMenuArr: res[0].value
        })
      }
    })

    getConfig({
      setName: '部门配置'
    }).then(res => {
      if (res.length > 0) {
        console.log(res)
        this.setData({
          picker: res[0].value
        })
      }
    })


  },
  async onShow() {
    let userInfo = await getUserInfo()
    if (userInfo.department == '') {
      this.setData({
        modalName: 'dialog'
      })
    }
    console.log(userInfo)
    if (userInfo) {
      this.setData({
        ...userInfo,
        contactPhone: userInfo.phone
      })
    }

  },

  formSubmit: async function (e) {
    let that = this
    //判断订单是否被锁定
    //获取订单状态
    let iceOrder = await db.collection('config').doc('f3db088f5e85a74e004601155879194b').get()
    console.log(iceOrder)
    if (!iceOrder.data.iceOrder) {
      wx.showModal({
        title: '订餐结束',
        content: '请联系办公室解除订单冻结',
        showCancel: false
      })
      return
    }


    this.setData({
      btnIsDisable: true
    })

    wx.showLoading({
      title: '处理中',
    })
    let timeNow = util.formatTime(new Date)
    let detailInfo = {
      ...e.detail.value,
      orderMenu: this.data.orderMenuArr[this.data.orderIndex],
      orderTime: new Date(),
      orderTimetxt: timeNow,
      orderCount: parseInt(e.detail.value.orderCount),
      phone: this.data.phone,
      department: this.data.department,
      userInfo: app.globalData.userInfo
    }
    console.log(detailInfo)
    addOrder(detailInfo)
    setTimeout(function () {
      wx.hideLoading()
      that.setData({
        btnIsDisable: false
      })
      wx.showToast({
        title: '订餐完成',
      })
    }, 1500)
  },
  switchType(e) {
    this.setData({
      isLunch: e.detail.value
    })

  },
  orderMenuChange(e) {
    this.setData({
      orderIndex: e.detail.value,
      orderMenu: this.data.orderMenuArr[e.detail.value]
    })
  },
  onMyOrder() {
    wx.navigateTo({
      url: '../myOrder/myOrder',
    })
  },
  switchContact(e) {
    this.setData({
      isContact: e.detail.value
    })
  },
  PickerChange(e) {
    this.setData({
      departindex: e.detail.value,
      department: this.data.picker[e.detail.value]
    })
  },
})
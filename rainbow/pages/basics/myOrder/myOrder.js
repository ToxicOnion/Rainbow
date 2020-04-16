const app = getApp();
import {getUserOrder} from '../../../utils/dboperate.js'
const db = wx.cloud.database()
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    userInfo: {},
    myOrders:[]
  },

  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  async onLoad(){
    this.setData({
      userInfo: app.globalData.userInfo
    })
    //获取订单
    let myOrders = await getUserOrder();
    console.log(myOrders)
    this.setData({
      myOrders:myOrders
    })
  },
  delOrder(e){
    db.collection('orderList').doc(e.currentTarget.dataset.itemid).remove()
      .then(console.log)
      .catch(console.error)
    this.data.myOrders.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      myOrders: this.data.myOrders
    })
   
    wx.showToast({
      title: '删除成功',
    })
  }
})
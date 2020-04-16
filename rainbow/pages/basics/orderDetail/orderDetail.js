var util = require('../../../utils/util.js');
// import {getOrderDetail} from '../../../utils/dboperate.js' //切换为云函数
import {
  getOrderDetail
} from '../../../utils/promiseFunc.js'
const app = getApp()
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    department: '',
    orderMenu: '',
    orderDetail: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      department: options.department,
      orderMenu: options.orderMenu
    })
    //获取数据
    let timeSearch = util.timeSearch(new Date)
    var timetmp = new Date(timeSearch)

    let param
    if (options.department) {
      param = {
        department: options.department,
        timeSearch: timetmp.toJSON(),
        orderMenu: options.orderMenu
      }
    } else {
      param = {
        timeSearch: timetmp.toJSON(),
        orderMenu: options.orderMenu
      }
    }
    console.log(param.timeSearch)
    getOrderDetail(param).then(res => {
      this.setData({
        orderDetail: res
      })
      console.log(res)
    })
    // getOrderDetail(this.data.department,new Date(timeSearch)).then(res=>{
    //   this.setData({
    //     orderDetail:res
    //   })
    // })
  },



})
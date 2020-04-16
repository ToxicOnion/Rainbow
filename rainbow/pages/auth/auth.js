import regeneratorRuntime from '../../lib/runtime/runtime.js';
import {
  getSetting,
  getUserInfo
} from '../../utils/promiseFunc.js';
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
const userInfoCollection = db.collection('userInfo')
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    checkKey: false,
    inputKeyword: ''
  },
  onLoad: async function() {
    var that = this;
    let setting = await getSetting();
    this.setData({
      version:app.globalData.version
    })
    if (setting.authSetting['scope.userInfo']) {
      let res = await getUserInfo();
      if (res) {
        app.globalData.userInfo = res.userInfo;
        //用户已经授权
        that.getOpenID()
        wx.navigateTo({
          url: '/pages/index/index',
        })
      }
    }

  },
  onGetUserInfo: async function(e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      this.getOpenID()
      wx.navigateTo({
        url: '/pages/index/index',
      })
    }
  },
  inputKeyword(event) {
    let newVal = event.detail.value
    let that = this
    // 添加延时判断500毫秒内input框内容会不会变化，不会变化时发送请求
    setTimeout(function() {
      if (that.data.inputKeyword == newVal) {
        if (newVal === '54htb' | newVal === '安阳') {
          that.setData({
            checkKey: true
          })
        } else {
          that.setData({
            checkKey: false
          })
        }
      }
    }, 1000);
    this.setData({
      inputKeyword: event.detail.value
    })
  },
  async getOpenID() {
    let that = this
    wx.cloud.callFunction({
      name: 'getOpenID',
      complete: res => {
        app.globalData.userInfo = { ...app.globalData.userInfo,
          openid: res.result.openid
        }
        that.queryUser()
      }
    })
  },
  async queryUser() {
    try {
      const userInfo = app.globalData.userInfo
      userInfoCollection.where({
        openid: userInfo.openid
      }).get().then(res => {
        if (res.data.length == 0) {
          let oneUser = { ...userInfo,
            time: new Date()
          }
          userInfoCollection.add({
            data: oneUser
          })
        } else {
          userInfoCollection.doc(res.data[0]._id)
            .update({
              data: {
                avatarUrl: userInfo.avatarUrl,
                city: userInfo.city,
                country: userInfo.country,
                gender: userInfo.gender,
                nickName: userInfo.nickName,
                province: userInfo.province,
                time: new Date
              },
            })
        }
      });
    } catch (e) {

    }
  },
})
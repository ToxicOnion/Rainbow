import regeneratorRuntime from '../../lib/runtime/runtime.js';
const app = getApp();
const db = wx.cloud.database();
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    userInfo: {},
    visitTotal:0,
    userCount:0,
    infoCount:0
  },
  attached() {
    this.setData({
      userInfo:app.globalData.userInfo,
      version:app.globalData.version
    }),
    db.collection('viewInfo').count().then(res=>{
      this.setData({
        visitTotal:res.total
      })
    })
    db.collection('userInfo').count().then(res => {
      this.setData({
        userCount: res.total
      })
    }) 
  },
  
  methods:{
    copyLink(e) {
      wx.setClipboardData({
        data: e.currentTarget.dataset.link,
        success: res => {
          wx.showToast({
            title: '已复制',
            duration: 1000,
          })
        }
      })
    },
    showQrcode() {
      wx.previewImage({
        urls: ['cloud://onion.6f6e-onion-1259460489/ZanShang.jpeg'],
        current: 'cloud://onion.6f6e-onion-1259460489/ZanShang.jpeg' // 当前显示图片的http链接      
      })
    },
  }
})
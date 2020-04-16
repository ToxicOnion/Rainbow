const app = getApp()
const db = wx.cloud.database()
const viewInfoCollection = db.collection('viewInfo')
Page({
  data: {
    PageCur: 'about'
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
    if (this.data.PageCur == 'basics') {
      wx.navigateTo({
        url: '../phone/phone/phone',
      })
    }
  },
  onLoad: function() {
    if (!app.globalData.userInfo){
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
    }
    //增加浏览记录
    let info = { ...app.globalData.userInfo,
      time: new Date()
    }
    viewInfoCollection.add({
      data:info
    }).then(res=>{
      
    })

  },
  onShow: function() {
    if (this.data.PageCur == 'basics') {
      this.setData({
        PageCur: 'about'
      })
    }
  }
})
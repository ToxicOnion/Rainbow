const WxFly = require('../../lib/wxplain.js');
var posterHeight = 0
var posterWidth = 0
var avatarPadding = 0 //距离边界
var avatarRadiu = 0 //头像半径
var textScale = 0 //文字比例

Page({
  data: {
    modalHidden: "modal_hide",
    score: '0',
    posterHeight: 0,
    posterWidth: 0
  },
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          posterHeight: res.screenHeight,
          posterWidth: res.screenWidth
        })
      },
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  startGame: function () {
    const fly = this.fly;
    this.setData({
      score: 0,
      modalHidden: "modal_hide"
    });
    fly.startGame();
  },
  move: function (event) {
    const fly = this.fly;
    var x = event.touches[0].x;
    var y = event.touches[0].y;
    fly.touchmove(x, y);
  },
  click: function () {
    const fly = this.fly;
    fly.touchclick();
  },
  onShow: function () {
    const fly = this.fly = new WxFly({
      ctx: wx.createContext(),
      id: 'plainId',
      height: this.data.posterHeight,
      width: this.data.posterWidth,
    });
    fly.on('over', packet => {
      this.setData({
        score: packet.score,
        modalHidden: ""
      });
    });
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})
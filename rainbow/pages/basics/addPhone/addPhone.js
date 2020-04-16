import regeneratorRuntime from '../../../lib/runtime/runtime.js';
import {
  updatePinyin,
  dbAddPhone
} from '../../../utils/dboperate.js'
var pinyinUtil = require('../../../utils/pinyinUtil.js')
var pinyinFirst = require('../../../utils/pinyinFirst.js')

const app = getApp();
Page({
  data: {
    name: '',
    tel: '', //固话
    phone: '', //手机
    company:'职工' //单位
  },
  async onLoad() {
    //更新所有通讯录的缩写
    // updatePinyin()
  },

  formSubmit: function(e) {
    let detailInfo = {
      ...e.detail.value,
      pinyin: pinyinUtil.convertPinyin(e.detail.value.xingming),
      suoxie: pinyinFirst.makePy(e.detail.value.xingming),
      shoujitxt: this.data.phone + 'txt'
    }
    dbAddPhone(detailInfo);
    wx.showToast({
      title: '添加成功',
    })
    wx.clearStorageSync("phones")
  },
  formReset(phoneInfo) {

  },

})
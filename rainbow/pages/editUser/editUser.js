import regeneratorRuntime from '../../lib/runtime/runtime.js';
import {
  updateUserDetailInfo,
  getUserInfo
} from '../../utils/dboperate.js';
const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    picker: ['领导', '办公室', '论证室', '工程室', '信号室', '测控室', '管控室', '应用室', '其他'],
    multiArray: [
      ['楼号9527'],
      ['二楼', '三楼', '一楼', '四楼'],
      ['北侧', '南侧']
    ],
    basicsList: [{
      icon: 'usefullfill',
      name: '编辑'
    }, {
      icon: 'radioboxfill',
      name: '提交'
    }, {
      icon: 'roundclosefill',
      name: '订餐'
    }, {
      icon: 'roundcheckfill',
      name: '送饭'
    }, ],
    departindex: 6,
    multiIndex: [0, 0, 0],
    textareaAValue: '',
    basics: 0,
    realname: '',
    phone: '',
    department: '管控室',
    addr: '',
    isContact: true,
    others: ''

  },
  async onLoad() {
    let userInfo = await getUserInfo()
    if (userInfo) {
      this.setData({
        ...userInfo
      })
    } else {
      this.setData({
        department: this.data.picker[this.data.departindex],
        addr: this.data.multiArray[0][0] + ',' + this.data.multiArray[1][0] + ',' + this.data.multiArray[2][0],
      })
    }
  },
  PickerChange(e) {
    this.setData({
      departindex: e.detail.value,
      department: this.data.picker[e.detail.value]
    })
  },
  MultiChange(e) {
    this.setData({
      multiIndex: e.detail.value,
      addr: this.data.multiArray[0][e.detail.value[0]] + ',' + this.data.multiArray[1][e.detail.value[1]] + ',' + this.data.multiArray[2][e.detail.value[2]]
    })
    console.log(this.data.addr)
  },
  MultiColumnChange(e) {
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = [];
            break;

        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        data.multiArray[2] = ['北侧', '南侧'];
        data.multiIndex[2] = 0;
        break;
    }
    this.setData(data);
  },

  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  formSubmit: function(e) {
    let detailInfo = { ...e.detail.value,
      textareaAValue: this.data.textareaAValue,
      department: this.data.department,
      addr: this.data.addr,
      departindex:this.data.departindex,
      multiIndex:this.data.multiIndex
    }
    console.log(detailInfo)
    updateUserDetailInfo(detailInfo)
    wx.showToast({
      title: '添加成功',
    })
  },
  formReset: function() {
    this.setData({
      departindex: 6,
      multiIndex: [0, 0, 0],
      textareaAValue: '',
      basics: 0,
      realname: '',
      phone: '',
      department: this.data.picker[this.data.departindex],
      addr: this.data.multiArray[0][0] + ',' + this.data.multiArray[1][0] + ',' + this.data.multiArray[2][0],
      isContact: true,
      others: ''
    })
  }
})
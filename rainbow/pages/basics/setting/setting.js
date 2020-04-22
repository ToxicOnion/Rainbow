import {
  getConfig,
  updateConfig
} from '../../../utils/promiseFunc.js'
Page({

  data: {
    array: [0], //默认显示一个
    inputVal: [], //所有input的内容
    selectSet: '菜单',
    settingList: [{
        title: '菜单',
        name: 'red',
        color: '#e54d42',
        setName: '订餐菜单'
      },
      {
        title: '部门',
        name: 'orange',
        color: '#f37b1d',
        setName: '部门配置'
      },
      {
        title: '会议',
        name: 'olive',
        color: '#8dc63f',
        setName: '会议室'
      },
      // {
      //   title: '森绿',
      //   name: 'green',
      //   color: '#39b54a'
      // },
      // {
      //   title: '天青',
      //   name: 'cyan',
      //   color: '#1cbbb4'
      // },
      // {
      //   title: '海蓝',
      //   name: 'blue',
      //   color: '#0081ff'
      // },
      // {
      //   title: '姹紫',
      //   name: 'purple',
      //   color: '#6739b6'
      // },
      // {
      //   title: '木槿',
      //   name: 'mauve',
      //   color: '#9c26b0'
      // },
      // {
      //   title: '桃粉',
      //   name: 'pink',
      //   color: '#e03997'
      // },
      // {
      //   title: '墨黑',
      //   name: 'black',
      //   color: '#333333'
      // },
    ],
  },
  //获取input的值
  getInputVal: function (e) {
    var nowIdx = e.currentTarget.dataset.idx; //获取当前索引
    var val = e.detail.value; //获取输入的值
    var oldVal = this.data.inputVal;
    oldVal[nowIdx] = val; //修改对应索引值的内容
    this.setData({
      inputVal: oldVal
    })
  },
  //添加input
  addInput: function () {
    var old = this.data.array;
    old.push(1); //这里不管push什么，只要数组长度增加1就行
    this.setData({
      array: old
    })
  },
  //删除input
  delInput: function (e) {
    var nowidx = e.currentTarget.dataset.idx; //当前索引

    var oldInputVal = this.data.inputVal; //所有的input值
    var oldarr = this.data.array; //循环内容

    oldarr.splice(nowidx, 1); //删除当前索引的内容，这样就能删除view了
    // oldInputVal.splice(nowidx, 1); //view删除了对应的input值也要删掉

    if (oldarr.length < 1) {
      oldarr = [0] //如果循环内容长度为0即删完了，必须要留一个默认的。这里oldarr只要是数组并且长度为1，里面的值随便是什么
    }
    this.setData({
      array: oldarr,
      inputVal: oldInputVal
    })
  },
  selectSetting(e) {
    console.log(e.currentTarget.dataset.setname)
    this.setData({
      selectSet: e.currentTarget.dataset.setname
    })
    getConfig({
      setName: e.currentTarget.dataset.setname
    }).then(res => {
      if (res.length > 0) {
        this.setData({
          array: res[0].value,
          inputVal: res[0].value
        })
      }
    })
  },
  saveSetting() {
    updateConfig({
      setName: this.data.selectSet,
      value: this.data.array
    })
    wx.showToast({
      title: '修改成功',
    })
  }
})
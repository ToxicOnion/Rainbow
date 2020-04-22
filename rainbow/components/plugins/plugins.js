Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    elements: [{
        title: '添加',
        name: 'addPhone',
        color: 'cyan',
        icon: 'myfill',
        fatherPack:'pages'
        
      }, {
        title: '删除',
        name: 'delPhone',
        color: 'orange',
        icon: 'newsfill',
        fatherPack: 'pages'
      },
      {
        title: '订餐',
        name: 'order',
        color: 'red',
        icon: 'icon',
        fatherPack: 'pages'
      },
      {
        title: '统计',
        name: 'count',
        color: 'olive',
        icon: 'btn',
        fatherPack: 'pages'
      },
      {
        title: '娱乐',
        name: 'games',
        color: 'green',
        icon: 'colorlens',
        fatherPack: 'pages/plainGame'
      },
      {
        title: '配置',
        name: 'setting',
        color: 'pink',
        icon: 'font',
        fatherPack: 'pages'
      },
      {
        title: '畅所欲言',
        name: 'chat',
        color: 'blue',
        icon: 'tagfill',
        fatherPack: 'pages'
      },
      {
        title: '订会议室',
        name: 'metting',
        color: 'mauve',
        icon: 'copy',
        fatherPack: 'pages'
      },
      {
        title: '闲物',
        name: 'shop',
        color: 'purple',
        icon: 'icloading',
        fatherPack: 'pages'
      },
      {
        title: '空间',
        name: 'space',
        color: 'brown',
        icon: 'loading2',
        fatherPack: 'pages'
      },
    ],
  }
})
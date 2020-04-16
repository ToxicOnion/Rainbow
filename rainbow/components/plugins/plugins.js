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
        title: '设计',
        name: 'axure',
        color: 'pink',
        icon: 'font',
        fatherPack: 'pages'
      },
      {
        title: '聊天',
        name: 'chat',
        color: 'blue',
        icon: 'tagfill',
        fatherPack: 'pages'
      },

      {
        title: '相册',
        name: 'photo',
        color: 'mauve',
        icon: 'icloading',
        fatherPack: 'pages'
      },
      {
        title: '电影',
        name: 'movie',
        color: 'purple',
        icon: 'copy',
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
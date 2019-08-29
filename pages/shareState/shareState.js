// pages/shareState/shareState.js
Page({
  data: {
    src: '',
    msg: '',
    id : '',
    url : '',
    name : ''
  },
  onLoad: function (options) {
    this.setData({
      src: options.src,
      msg: options.msg,
      url: options.url,
      name: options.name
    })
   
  },
})
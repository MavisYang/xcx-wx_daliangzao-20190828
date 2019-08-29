// pages/dragonBoatFestival/dragonBoatFestival.js
var app = getApp();
Page({
  data: {
    urlHttp: ''
  },
  onLoad: function (options) {
    var that = this;
    var host = getApp().globalData.servsers;
    that.setData({
      urlHttp: 'https://www.daliangzao.net/'
    })
    var time = Util.formatTime(new Date());  //获赠时间

    console.log(time);
  },
  linkIndex:function(){
    wx.switchTab({
      url:'/pages/index/index'
    })
  }
})
var Util = require('../../utils/util.js'); 
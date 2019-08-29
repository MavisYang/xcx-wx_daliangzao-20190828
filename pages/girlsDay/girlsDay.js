// pages/girlsDay/girlsDay.js
//获取应用实例
var app = getApp();
Page({
  data: {
    urlHttp: ''
  },
  onLoad: function (options) {
    var that = this;
    var host = getApp().globalData.servsers;
    that.setData({
      urlHttp: host
    })
  },

  goToIndex:function(e){
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

})
var that;
var Util = require('../../utils/util.js'); 
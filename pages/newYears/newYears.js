// pages/newYears/newYears.js
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
    });
  }
})
var Util = require('../../utils/util.js'); 
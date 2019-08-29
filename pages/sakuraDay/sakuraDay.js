// pages/sakuraDay/sakuraDay.js
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
  }
})
var that;
var Util = require('../../utils/util.js'); 
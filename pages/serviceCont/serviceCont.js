// pages/serviceCont/serviceCont.js
var app = getApp();
Page({

  data: {
    phone: ''
  },

  onLoad: function (options) {
    var that = this
    var open_id = getApp().globalData.open_id;
    var host = getApp().globalData.servsers;
    wx.showNavigationBarLoading()
    wx.request({
      url: host + "phoneapi/phoneall",
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          phone: res.data.rows[0].phone,
        });
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
        wx: wx.hideNavigationBarLoading(
          that.setData({
            hidden: ''
          })
        )
      }
    })
  }
})
var that;
var Util = require('../../utils/util.js'); 
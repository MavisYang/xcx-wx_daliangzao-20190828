// pages/dragonBoatFestivalInfor/dragonBoatFestivalInfor.js
Page({
  data: {
    urlHttp : '',
    shareFlag : 0
  },

  onLoad: function (options) {
    var that = this;
    var host = getApp().globalData.servsers;
    var shareFlag = options.shareFlag;
    if (shareFlag != '' && shareFlag != null && shareFlag != undefined) {
      that.setData({
        shareFlag: options.shareFlag
      })
    }
    that.setData({
      urlHttp: host,
      shareFlag: options.shareFlag
    })
  },

  onShareAppMessage: function (res) {//页面分享
    var that = this;
    var host = getApp().globalData.servsers;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '大良造-精良之选,用心造物！',
      path: '/pages/dragonBoatFestivalInfor/dragonBoatFestivalInfor?shareFlag=1',
      success: function (res) {

      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //返回首页
  backIndex: function (e) {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }

})
var Util = require('../../utils/util.js'); 
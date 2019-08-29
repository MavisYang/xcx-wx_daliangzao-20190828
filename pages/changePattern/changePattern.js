// pages/changePattern/changePattern.js
//获取应用实例
var app = getApp();
Page({

  data: {
    urlHttp: '',
    //模式选中状态
    pattern0: false,
    pattern1: false,
    showPattern: true,  //显示选个模式蒙层
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
      pattern0: false,
      pattern1: false,
    })
  },

  onShow:function(e){
    var that = this;
    that.setData({
      pattern0: false,
      pattern1: false
    })
  },

  //选择模式
  patternXL: function (e) {
    var that = this;
    that.setData({
      pattern0: true,
      pattern1: false
    })
    setTimeout(function () {
      wx.navigateTo({
          url: '/pages/patternMenu/patternMenu'
      })
    }, 200)

  },

  patternLL: function (e) {
    var that = this;
    that.setData({
      pattern0: false,
      pattern1: true
    })
    setTimeout(function () {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }, 500)
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
      path: '/pages/changePattern/changePattern?shareFlag=1',
      success: function (res) {

      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})
var that;
var Util = require('../../utils/util.js'); 
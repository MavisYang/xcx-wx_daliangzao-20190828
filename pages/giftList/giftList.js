// pages/giftList/giftList.js
var app = getApp()  
var giftList = [];
Page({
  data: {
    giftList: giftList
  },

  onLoad: function (options) {
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var openid = getApp().globalData.openid;
    if ((un_id == undefined || un_id == '' || un_id == null) || (openid == undefined || openid == '' || openid == null)) {
      wx.navigateTo({
        url: '/pages/authorize/authorize?link=giftList',
      })
    } else {
      wx.request({
        url: host + "giftapi/findUserGiftList",
        data: {
          userId: un_id,
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Accept': 'application/json'
        },
        success: function (res) {
          that.setData({
            giftList: res.data.userGiftList
          })
          console.log(res.data.userGiftList);
          if (res == null || res.data == null) {
            console.error('网络请求失败');
            return;
          }
        }
      });
    }  
  },
  giftInfor:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var newCarts = JSON.stringify(that.data.giftList[id]);
    newCarts = newCarts.replace(/&/g, "zss");
    wx:wx.navigateTo({
      url: '/pages/awaitStateFromList/awaitStateFromList?list=' + newCarts,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})
var that;
var Util = require('../../utils/util.js'); 
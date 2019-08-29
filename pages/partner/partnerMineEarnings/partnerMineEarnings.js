// pages/partner/mineEarnings/mineEarnings.js
var that;
var Util = require('../../utils/util.js'); 
var app = getApp();
Page({
  data: {
    userPhoto : '', //用户头像
    userName  : '', //用户昵称

  },

  onLoad: function (options) {
    var that = this;
    var host = getApp().globalData.servsers;
    var un_id = getApp().globalData.un_id;
    var open_id = getApp().globalData.open_id;
    var userPhoto = getApp().globalData.userInfo.avatarUrl;
    var userName = getApp().globalData.userInfo.nickName;
    that.setData({
      userPhoto: userPhoto,
      userName: userName
    })
    
  },

  
  onShow: function () {
    
  },

})